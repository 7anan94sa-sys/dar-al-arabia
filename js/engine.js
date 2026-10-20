/* ============================================================
   محرّك الإعراب الآلي — يحلّل أي جملة عربية
   يعتمد على: معجم الأفعال + التصريف + قواعد الإعراب
   ============================================================ */

/* ---------------- معجم الأفعال الشائعة ---------------- */
/* [الماضي، المؤنث، جمع المذكر، المضارع مذكر، المضارع مؤنث، المضارع جمع] */
const VERB_TABLE = [
  ["كتب","كتبت","كتبوا","يكتب","تكتب","يكتبون"],
  ["قرأ","قرأت","قرأوا","يقرأ","تقرأ","يقرأون"],
  ["نظر","نظرت","نظروا","ينظر","تنظر","ينظرون"],
  ["سمع","سمعت","سمعوا","يسمع","تسمع","يسمعون"],
  ["قال","قالت","قالوا","يقول","تقول","يقولون"],
  ["أخذ","أخذت","أخذوا","يأخذ","تأخذ","يأخذون"],
  ["أعطى","أعطت","أعطوا","يعطي","تعطي","يعطون"],
  ["فعل","فعلت","فعلوا","يفعل","تفعل","يفعلون"],
  ["ضرب","ضربت","ضربوا","يضرب","تضرب","يضربون"],
  ["كسر","كسرت","كسروا","يكسر","تكسر","يكسرون"],
  ["فتح","فتحت","فتحوا","يفتح","تفتح","يفتحون"],
  ["أغلق","أغلقت","أغلقوا","يغلق","تغلق","يغلقون"],
  ["شرب","شربت","شربوا","يشرب","تشرب","يشربون"],
  ["أكل","أكلت","أكلوا","يأكل","تأكل","يأكلون"],
  ["لبس","لبست","لبسوا","يلبس","تلبس","يلبسون"],
  ["اشترى","اشتريت","اشتروا","يشتري","تشتري","يشترون"],
  ["باع","باعت","باعوا","يبيع","تبيع","يبيعون"],
  ["أرسل","أرسلت","أرسلوا","يرسل","ترسل","يرسلون"],
  ["استقبل","استقبلت","استقبلوا","يستقبل","تستقبل","يستقبلون"],
  ["علّم","علمت","علّموا","يعلم","تعلم","يعلمون"],
  ["درّس","درّست","درّسوا","يدرّس","تدرّس","يدرّسون"],
  ["نشر","نشرت","نشروا","ينشر","تنشر","ينشرون"],
  ["طبخ","طبخت","طبخوا","يطبخ","تطبخ","يطبخون"],
  ["ذهب","ذهبت","ذهبوا","يذهب","تذهب","يذهبون"],
  ["جاء","جاءت","جاءوا","يأتي","تأتي","يأتون"],
  ["رجع","رجعت","رجعوا","يرجع","ترجع","يرجعون"],
  ["خرج","خرجت","خرجوا","يخرج","تخرج","يخرجون"],
  ["دخل","دخلت","دخلوا","يدخل","تدخل","يدخلون"],
  ["سافر","سافر","سافروا","يسافر","تسافر","يسافرون"],
  ["ركب","ركبت","ركبوا","يركب","تركب","يركبون"],
  ["نزل","نزلت","نزلوا","ينزل","تنزل","ينزلون"],
  ["مشى","مشت","مشوا","يمشي","تمشي","يمشون"],
  ["نام","نامت","ناموا","ينام","تنام","ينامون"],
  ["جلس","جلست","جلسوا","يجلس","تجلس","يجلسون"],
  ["قام","قامت","قاموا","يقوم","تقوم","يقومون"],
  ["تكلم","تكلمت","تكلموا","يتكلم","تتكلم","يتكلمون"],
  ["نطق","نطق","نطقوا","ينطق","تنطق","ينطقون"],
  ["سكت","سكت","سكتوا","يسكت","تسكت","يسكتون"],
  ["عاش","عاشت","عاشوا","يعيش","تعيش","يعيشون"],
  ["مات","ماتت","ماتوا","يموت","تموت","يموتون"],
  ["ضحك","ضحكت","ضحكوا","يضحك","تضحك","يضحكون"],
  ["ابتسم","ابتسمت","ابتسموا","يبتسم","تبتسم","يبتسمون"],
  ["سكن","سكن","سكنوا","يسكن","تسكن","يسكنون"],
  ["عاد","عادت","عادوا","يعود","تعود","يعودون"],
  ["رافق","رافقت","رافقوا","يرافق","ترافق","يرافقون"],
  ["ساعد","ساعدت","ساعدوا","يساعد","تساعد","يساعدون"],
  ["ناقش","ناقش","ناقشوا","يناقش","تناقش","يناقشون"],
  ["راجع","راجع","راجعوا","يراجع","تراجع","يراجعون"],
  ["أخطأ","أخطأت","أخطأوا","يخطئ","تخطئ","يخطئون"],
  ["وافق","وافق","وافقوا","يوافق","توافق","يوافقون"],
  ["بادر","بادر","بادروا","يبادر","تبادر","يبادرون"],
  ["امتلأ","امتلأ","امتلأوا","يمتلئ","تمتلئ","يمتلئون"],
  ["أبرم","أبرم","أبرموا","يبرم","تبرم","يبرمون"],
  ["حكم","حكم","حكموا","يحكم","تحكم","يحكمون"],
  ["اختار","اخترت","اختاروا","يختار","تختار","يختارون"],
  ["وجد","وجد","وجدوا","يجد","تجد","يجدون"],
  ["دعا","دعا","دعوا","يدعو","تدعو","يدعون"],
  ["زل","زل","زلوا","يزل","تزل","يزلون"],
];

/* ---------------- أدوات ومفردات مساعدة ---------------- */
const NASIKH_ACT = ["كان","كانت","كانوا","يكون","تكون","أصبح","أصبحت","أضحى","أضحت","بات","باتت","أمسى","ظل","ظلّت","صار","صارت","ليس","ليست","ما زال","ما برح","ما فتئ","ما انفك","بقي"];
const NASIKH_LETTER = ["إن","إنّ","أن","أنّ","كأن","كأنّ","لعل","لعلّ","لكن","لكنّ","ليت"];

const JARR_CHARS = ["من","إلى","عن","على","في","ب","ك","ل","حتى","منذ","مذ","خلا","عدا","حاشا"];
const TANWEEN_CHARS = ["أن","إن","أنّ","إنّ"];
const AMMA_CHARS = ["لن","كي","ل","ما"];
const CONJ_CHARS = ["و","ف","ثم","أو","أم","بل","لا","لكن","إنما"];
const WAW_WORDS = ["يا","أيا","أيها","يا أيها"];

/* الأفعال التي لا تحتاج مفعولًا (لازمة) */
const VERBS_LAZIM = ["نام","نامت","ناموا","جلس","جلست","جلسوا","قام","قامت","قاموا","ذهب","ذهبت","ذهبوا","جاء","جاءت","جاءوا",
  "رجع","رجعت","رجعوا","خرج","خرجت","خرجوا","دخل","دخلت","دخلوا","سافر","سافر","سافروا","ركب","ركبت","ركبوا",
  "نزل","نزلت","نزلوا","مشى","مشت","مشوا","تكلم","تكلمت","تكلموا","نطق","سكت","عاش","عاشت","عاشوا","مات","ماتت","ماتوا",
  "ضحك","ضحكت","ضحكوا","ابتسم","ابتسمت","ابتسموا","سكن","عاد","عادت","عادوا","رافق","رافقت","ساعد","ساعدت","امتلأ",
  "ناقش","ناقشت","بادر","بادرت","راجع","راجعت","موافق","وافق","أخطأ","أخطأت"];

/* أسماء أعلام شائعة */
const PROPER_NAMES = ["محمد","أحمد","علي","عبدالله","عبد","الله","عمر","خالد","سعد","سعيد","محمود","يوسف","إبراهيم","إسماعيل",
  "صفار","فاطمة","عائشة","مريم","خديجة","سارة","ليلى","زينب","نور","هدى","أمل","سلمى","بشارة","زياد","سامي","لؤي","أيمن",
  "حسن","حسين","مصطفى","طارق","وليد","بشير","أسامة","رامي","كرم","إياد","جمال","كمال","نضال","فوزي"];

/* أسماء شائعة تدلّ على معنى */
const COMMON_NOUNS = ["بيت","باب","كتاب","قلم","طاولة","كرسي","مدرسة","مسجد","شارع","سيارة","شجرة","زهرة","شمس","قمر",
  "نهر","بحر","جبل","سماء","أرض","ماء","هواء","نار","رجل","امرأة","طفل","طالب","معلم","طبيب","مهندس","دار",
  "مفتاح","نافذة","جمل","حصان","قطة","كلب","عصفور","سمكة","نحلة","نخلة","خبز","حليب","عسل","فاكهة","خضار","لحم",
  "مائدة","مقعد","نظارة","حقيبة","قميص","حذاء","قبعة","ورقة","دفتر","مطرقة","مفك","ساعة","خريطة","صورة","مرآة","فكرة","كلمة","جملة","كتاب"];

/* ---------------- أدوات morphology ---------------- */
const AR_DIACRITICS = /[ً-ْٰـ]/g;
function stripDiac(s) { return String(s || "").replace(AR_DIACRITICS, ""); }

/* إزالة أدوات التعريف والضمائر المضافة */
function stripPrefixes(w) {
  let s = w, prefix = "";
  const order = ["وبال","فبال","بال","كال","فال","وال","لل","ال","و","ف","ب","ك","ل"];
  let changed = true;
  while (changed) {
    changed = false;
    for (const p of order) {
      if (s.length > p.length + 1 && s.startsWith(p) && /[ء-ي]/.test(s[p])) {
        prefix = p + prefix; s = s.slice(p.length); changed = true; break;
      }
    }
  }
  return { stem: s, prefix };
}

function stripSuffixes(w) {
  let s = w, suffix = "";
  const order = ["اتهما","اتهم","ونها","هما","كما","هم","هن","كن","كم","ها","نا","ات","ان","ون","ين","ية","ه","ك","ي","ن"];
  let changed = true;
  while (changed) {
    changed = false;
    for (const p of order) {
      if (s.length > p.length + 1 && s.endsWith(p)) {
        suffix = p + suffix; s = s.slice(0, s.length - p.length); changed = true; break;
      }
    }
  }
  return { stem: s, suffix };
}

/* تحديد شكل الاسم وعلامة إعرابه */
function shapeOf(word) {
  const raw = stripDiac(word);
  const { stem } = stripSuffixes(raw);
  const base = stripDiac(stem);
  const isDef = /^(ال|وال|بال|كال|فال|لل)/.test(raw) && base.length > 2;

  let number = "مفرد", gender = "مذكر", kind = "مفرد";

  if (/(ات)$/.test(base) && base.length > 3) { number = "جمع"; gender = "مؤنث"; kind = "جمع مؤنث سالم"; }
  else if (/(ون|ين)$/.test(base) && base.length > 3) { number = "جمع"; gender = "مذكر"; kind = "جمع مذكر سالم"; }
  else if (/(ان)$/.test(base) && base.length > 3) { number = "مثنى"; kind = "مثنى"; }
  else if (/(ة|ه)$/.test(base) && base.length > 2) { gender = "مؤنث"; }
  else if (/(ها)$/.test(raw)) { gender = "مؤنث"; }

  // ممنوع من الصرف: اسم علم مؤنث، أو جمع مذكر سالم مختوم
  let mamnu = false;
  if (PROPER_NAMES.some(n => stripDiac(n) === stripDiac(word))) {
    if (gender === "مؤنث") mamnu = true;
  }
  if (/(ان)$/.test(base) && base.length > 4 && !isDef && /م$/.test(base)) mamnu = true;
  if (mamnu) kind = "ممنوع من الصرف";

  const sign = {
    "مفرد":          { ر:"الضمة",  ن:"الفتحة", ج:"الكسرة" },
    "مثنى":          { ر:"الألف",  ن:"الياء",  ج:"الياء" },
    "جمع مذكر سالم": { ر:"الواو",  ن:"الياء",  ج:"الياء" },
    "جمع مؤنث سالم": { ر:"الضمة",  ن:"الكسرة", ج:"الكسرة" },
    "ممنوع من الصرف": { ر:"الكسرة", ن:"الفتحة", ج:"الفتحة" },
  }[kind];

  return { kind, number, gender, isDef, sign, stem: base };
}

/* تحديد نوع الكلمة — مع مراعاة صيغة «كَتَبَ» و«كتب» */
function isVerbForm(w) {
  const s = stripDiac(w);
  if (s.length < 3) return null;
  // صيغ بديلة: بحرف الألف في آخر الفعل وبدونه
  const variants = [s];
  if (s.endsWith("ا")) variants.push(s.slice(0, -1));
  else variants.push(s + "ا");
  for (const row of VERB_TABLE) {
    if (!row[0] || row[0].length < 2) continue;
    for (let i = 0; i < 6; i++) {
      if (!row[i]) continue;
      if (variants.indexOf(row[i]) >= 0) return { t: i <= 2 ? "ماضٍ" : "مضارع", row };
    }
  }
  return null;
}

function isParticle(w) {
  const s = stripDiac(w);
  return JARR_CHARS.includes(s) || CONJ_CHARS.includes(s) || TANWEEN_CHARS.includes(s)
    || AMMA_CHARS.includes(s) || ["قد","لقد","لم","لن","ما","ها","يا","أنى","آي","أيّ"].includes(s);
}

function hasTanween(w) { return /[ً-ٰ]/.test(String(w || "")); }

/* هل الفعل متضمّن ضميره (المتكلم أو المخاطب)؟ فلا فاعلَ منفصلًا بعده */
function isPronounVerb(original, stripped, tense) {
  if (tense === "ماضٍ") {
    if (/تُ/.test(original)) return true;   // كتبتُ — المتكلم
    if (/تَ/.test(original)) return true;   // كتبتَ — المخاطب
    return false;
  }
  if (tense === "مضارع") {
    if (/^أ/.test(stripped) && stripped.length >= 3) return true; // أكتب — المتكلم
    return false;
  }
  return false;
}

function isNounish(w) {
  const s = stripDiac(w);
  if (!s) return false;
  if (PROPER_NAMES.some(n => stripDiac(n) === s)) return true;
  if (COMMON_NOUNS.some(n => stripDiac(n) === s)) return true;
  if (/^(ال|وال|بال|كال|فال|لل)/.test(s) && s.length > 3) return true;
  if (/(ة|ه)$/.test(s) && s.length > 3) return true;
  if (/(ات|ان|ون|ين)$/.test(s) && s.length > 4) return true;
  return false;
}

function looksLikePastVerb(w) {
  const s = stripDiac(w);
  if (s.length < 3) return false;
  // الماضي الرباعي أو الخماسي ينتهي غالبًا بـ«ا»
  // والماضي الثلاثي ينتهي بـ«ا» أو «ع» أو «د» (سمع، زرع، ورد)
  if (!/[ايعد]$/.test(s)) return false;
  if (/^(ال|وال|بال|كال|فال|لل)/.test(s)) return false;
  if (isParticle(s)) return false;
  if (PROPER_NAMES.some(n => stripDiac(n) === s)) return false;
  if (COMMON_NOUNS.some(n => stripDiac(n) === s)) return false;
  // الفعل الثلاثي المجزوم بحرف «ع» أو «د» في آخره
  if (s.length === 3 && /[عضد]$/.test(s)) {
    const first = s[0];
    if (!"اأبتثجحخدذرزسشصضطظعغفقكلمنهوي".includes(first)) return false;
  }
  return true;
}

function looksLikePresentVerb(w) {
  const s = stripDiac(w);
  if (s.length < 4) return false;
  if (!/^[ياأتنت]/.test(s)) return false;
  if (/^(ال|وال|بال|كال|فال|لل)/.test(s)) return false;
  if (PROPER_NAMES.some(n => stripDiac(n) === s)) return false;
  if (COMMON_NOUNS.some(n => stripDiac(n) === s)) return false;
  if (isParticle(s)) return false;
  return true;
}

/* ---------------- التحليل الرئيسي ---------------- */
function analyzeArabic(sentence) {
  const text = String(sentence || "").trim();
  if (!text) return null;
  const tokens = text.split(/\s+/).filter(Boolean)
    .map(t => t.replace(/[.,،؛؟!:]/g, "")).filter(Boolean);
  if (!tokens.length) return null;

  const words = tokens.map((w, i) => ({
    w, s: stripDiac(w), i,
    v: isVerbForm(w),
    particle: isParticle(stripDiac(w)),
    nounish: isNounish(w),
    shape: shapeOf(w),
    role: null, irab: "", kindLabel: ""
  }));

  const first = words[0];
  const isNasikhAct = NASIKH_ACT.includes(first.s);
  const isNasikhLet = NASIKH_LETTER.includes(first.s);

  const out = { sentence:text, type:"", kind:"", words:[], notes:[], rules:[] };
  const mark = (idx, role, irab, kindLabel) => {
    const wd = words[idx];
    if (!wd) return;
    wd.role = role; wd.irab = irab;
    if (kindLabel) wd.kindLabel = kindLabel;
  };

  if (isNasikhAct || isNasikhLet) {
    out.type = "جملة اسمية";
    out.kind = isNasikhAct ? "مع ناسخ فعلي" : "مع ناسخ حرفّي";
    out.rules.push("naasikh", "jumla-ismiya");
    const nasikhName = isNasikhAct ? "كان" : first.w;
    mark(0, "ناسخ", isNasikhAct
      ? "فعل ماضٍ ناقص ناسخ مبني على الفتح، ما بعده اسمٌ وخبرٌ له."
      : `حرف ناسخ (${first.w}) لا محلّ له من الإعراب، وما بعده اسمُه وخبرُه.`, "ناسخ");

    let ai = 1;
    if (words[ai]) {
      const sh = words[ai].shape;
      mark(ai, `اسم ${nasikhName}`,
        `اسم ${nasikhName} منصوب وعلامة نصبه ${sh.sign.ن} ${sh.kind === "ممنوع من الصرف" ? "الظاهرة" : "الظاهرة"} على آخره.`, "اسم");
      ai++;
    }
    if (words[ai]) {
      const rest = words.slice(ai);
      if (rest.length === 1) {
        const sh = rest[0].shape;
        mark(ai, `خبر ${nasikhName}`,
          `خبر ${nasikhName} مرفوع وعلامة رفعه ${sh.sign.ر} الظاهرة على آخره.`, "اسم");
      } else {
        rest.forEach((x, i) => {
          if (i === 0) {
            x.role = `خبر ${nasikhName}`;
            x.kindLabel = "فعل";
            x.irab = `خبر ${nasikhName}: جملة فعلية، وفعلها ${x.v ? x.v.t : "ماضٍ"} مع فاعله.`;
          } else if (!x.role) {
            x.role = "فاعل";
            x.kindLabel = "اسم";
            x.irab = "فاعل مرفوع وعلامة رفعه الضمة الظاهرة على آخره.";
          }
        });
        out.notes.push("الخبر جملة فعلية: فعلها مرفوع وفاعلها مرفوع.");
      }
    }
  }
  else if (first.v || looksLikePastVerb(first.w) || looksLikePresentVerb(first.w)) {
    out.type = "جملة فعلية";
    out.kind = "فعل + فاعل + مفعول به";
    out.rules.push("jumla-fiiliya");

    let tense = first.v ? first.v.t : (looksLikePresentVerb(first.w) ? "مضارع" : "ماضٍ");
    let action = false;
    if (tense === "ماضٍ" && !first.v) {
      // فعل أمر محتمل
      if (/^(ا|ف)/.test(first.s) && first.s.length <= 5) { tense = "أمر"; action = true; }
    }

    if (tense === "ماضٍ") {
      mark(0, "فعل", "فعل ماضٍ مبني على الفتح، والفاعل ضمير مستتر وجوبًا تقديره «هو».", "فعل");
    } else if (tense === "مضارع") {
      const majzoom = /^[يتن]/.test(first.s) && !/^(يا|يا)/.test(first.s);
      mark(0, "فعل",
        `فعل مضارع ${majzoom ? "مجزوم" : "مرفوع"} وعلامة ${majzoom ? "جزمه" : "رفعه"} ${majzoom ? "السكون" : "الضمة"} ${majzoom ? "الظاهرة" : "الظاهرة"} على آخره.`,
        "فعل");
    } else {
      mark(0, "فعل", "فعل أمر مبني على السكون، والفاعل ضمير مستتر وجوبًا تقديره «أنتَ».", "فعل");
    }

    let fi = 1;
    const pronounVerb = isPronounVerb(first.w, first.s, tense);
    if (pronounVerb) {
      first.irab = first.irab.replace(/والفاعل ضمير مستتر وجوبًا تقديره «هو»/,
        "والفاعل ضميرُه المتصل، المقدَّر «أنا» في المتكلم و«أنتَ» في المخاطب.");
      out.notes.push("الفعل متضمّن ضميره، فلا فاعلَ منفصلًا بعده.");
    }
    if (!pronounVerb && words[fi] && !words[fi].particle && !words[fi].v) {
      const sh = words[fi].shape;
      mark(fi, "فاعل", `فاعل مرفوع وعلامة رفعه ${sh.sign.ر} الظاهرة على آخره.`, "اسم");
      out.rules.push("fail");
      fi++;
    }
    const lazim = VERBS_LAZIM.some(v => stripDiac(v) === first.s);
    if (!lazim && words[fi] && !words[fi].particle && !words[fi].v) {
      const sh = words[fi].shape;
      mark(fi, "مفعول به", `مفعول به منصوب وعلامة نصبه ${sh.sign.ن} الظاهرة على آخره.`, "اسم");
      out.rules.push("maf'ool");
      fi++;
    }
    for (; fi < words.length; fi++) {
      const x = words[fi];
      if (x.particle) {
        x.role = "جار ومجرور";
        x.kindLabel = "حرف";
        x.irab = `حرف جرّ (${x.w})، والاسم بعده مجرور.`;
        if (words[fi + 1] && !words[fi + 1].role) {
          const sh = words[fi + 1].shape;
          mark(fi + 1, "مجرور", `اسم مجرور بـ«${x.w}» وعلامة جرّه ${sh.sign.ج} الظاهرة على آخره.`, "اسم");
          out.rules.push("harf-jarr");
          fi++;
        }
      } else if (hasTanween(x.w)) {
        const prev = words[fi - 1];
        const isNa = prev && prev.role === "مفعول به";
        mark(fi, isNa ? "نعت" : "حال",
          isNa
            ? "نعت منصوب وعلامة نصبه الفتحة الظاهرة على آخره."
            : "حال منصوبة وعلامة نصبها الفتحة الظاهرة على آخرها.", "اسم");
        out.rules.push(isNa ? "na't" : "hal");
      } else if (x.nounish) {
        const sh = x.shape;
        const prev = words[fi - 1];
        const role = (prev && prev.role && /فاعل|مبتدأ/.test(prev.role)) ? "نعت" : "نعت";
        mark(fi, role,
          `نعت ${sh.kind === "ممنوع من الصرف" ? "منصوب وعلامة نصبه الفتحة" : "مرفوع وعلامة رفعه " + sh.sign.ر} الظاهرة على آخره.`, "اسم");
        out.rules.push("na't");
      }
    }
  }
  else {
    out.type = "جملة اسمية";
    out.kind = "مبتدأ + خبر";
    out.rules.push("jumla-ismiya", "mubtada-khabar");
    const sh = first.shape;
    mark(0, "مبتدأ", `مبتدأ مرفوع وعلامة رفعه ${sh.sign.ر} الظاهرة على آخره.`, "اسم");

    let ki = 1;
    if (words[ki]) {
      const rest = words.slice(ki);
      const restIsVerb = rest.some(x => x.v || looksLikePastVerb(x.w));
      if (rest.length === 1) {
        const s2 = rest[0].shape;
        mark(ki, "خبر", `خبر المبتدأ مرفوع وعلامة رفعه ${s2.sign.ر} الظاهرة على آخره.`, "اسم");
      } else if (restIsVerb) {
        rest.forEach((x, i) => {
          if (i === 0) { x.role = "خبر"; x.kindLabel = "فعل"; x.irab = "خبر المبتدأ: جملة فعلية، وفعلها مع فاعله."; }
          else if (!x.role) { x.role = "فاعل"; x.kindLabel = "اسم"; x.irab = "فاعل مرفوع وعلامة رفعه الضمة الظاهرة على آخره."; }
        });
        out.notes.push("الخبر جملة فعلية: فعلها مرفوع وفاعلها مرفوع.");
      } else {
        rest.forEach(x => {
          if (x.particle) {
            x.role = "جار ومجرور"; x.kindLabel = "حرف";
            x.irab = `حرف جرّ (${x.w})، والاسم بعده مجرور.`;
            const nxt = words[x.i + 1];
            if (nxt && !nxt.role) {
              const s3 = nxt.shape;
              mark(x.i + 1, "مجرور", `اسم مجرور وعلامة جرّه ${s3.sign.ج} الظاهرة على آخره.`, "اسم");
            }
          } else if (!x.role) {
            const s3 = x.shape;
            x.role = "خبر";
            x.irab = `خبر المبتدأ مرفوع وعلامة رفعه ${s3.sign.ر} الظاهرة على آخره.`;
          }
        });
        out.notes.push("الخبر شبه جملة (جار ومجرور أو ظرف).");
      }
    }
  }

  // الكلمات التي لم يُحدَّد حكمها
  words.forEach(x => {
    if (!x.role) {
      if (x.particle) { x.role = "حرف"; x.kindLabel = "حرف"; x.irab = "حرف، لا محلّ له من الإعراب."; }
      else {
        const s = x.shape;
        x.role = "اسم"; x.kindLabel = "اسم";
        x.irab = `اسم ${s.isDef ? "معرَّف" : "نكرة"}، لم يُحدَّد حكمه بدقة في التحليل الآلي.`;
      }
    }
  });

  out.words = words;
  out.rules = Array.from(new Set(out.rules));
  return out;
}
