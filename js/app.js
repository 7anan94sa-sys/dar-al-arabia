/* ============================================================
   دار العربية — منطق التطبيق
   التوجيه، العرض، البحث، مشغّل الفيديو، شجرة الإعراب
   ============================================================ */

(function () {
"use strict";

/* ---------------- أدوات مساعدة ---------------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const stripTags = (html) => {
  const d = document.createElement("div");
  d.innerHTML = html || "";
  return (d.textContent || d.innerText || "").replace(/\s+/g, " ").trim();
};

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const norm = (s) => String(s || "")
  .toLowerCase()
  .replace(/[\u064B-\u0652\u0670\u0640]/g, "")   // تشكيل + تطويل
  .replace(/[أإآٱ]/g, "ا")
  .replace(/ى/g, "ي")
  .replace(/ة/g, "ه")
  .replace(/ؤ/g, "و")
  .replace(/ئ/g, "ي")
  .replace(/[«»"'،.!؟:؛]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const AR_DIGITS = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
const toArabicNum = (n) => String(n).replace(/\d/g, d => AR_DIGITS[+d]);

const debounce = (fn, ms = 180) => {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
};

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), 2400);
}

/* ---------------- أيقونات SVG ---------------- */
const ICO = {
  play: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>`,
  sound:`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>`,
  search:`<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>`,
  ext:`<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>`,
};

/* ---------------- النطق والنسخ ---------------- */
const SPEED_KEY = "dar_arabia_speed";
let SPEED = 0.65;
try { const s = localStorage.getItem(SPEED_KEY); if (s) SPEED = parseFloat(s) || 0.65; } catch (e) {}

function setSpeed(v) {
  SPEED = parseFloat(v) || 0.65;
  try { localStorage.setItem(SPEED_KEY, String(SPEED)); } catch (e) {}
  const sel = $("#speedSel");
  if (sel) sel.value = String(SPEED);
  toast("سرعة النطق: " + (SPEED <= 0.35 ? "بطيء جدًا" : SPEED <= 0.5 ? "بطيء" : SPEED <= 0.7 ? "واضح" : SPEED < 0.95 ? "عادي" : "سريع"));
}

/* نطق نص — مع إمكانية التكرار وفاصل صمت بين النطقين */
function speak(text, opts) {
  if (!("speechSynthesis" in window)) { toast("النطق غير مدعوم في هذا المتصفح"); return; }
  const o = opts || {};
  const rate = o.rate != null ? o.rate : SPEED;
  const times = o.times || 1;
  try {
    window.speechSynthesis.cancel();
    const ar = window.speechSynthesis.getVoices().find(v => /ar/i.test(v.lang));
    for (let i = 0; i < times; i++) {
      if (i > 0) {
        const gap = new SpeechSynthesisUtterance(" ");
        gap.lang = "ar-SA"; gap.rate = rate; gap.volume = 0;
        window.speechSynthesis.speak(gap);
      }
      const u = new SpeechSynthesisUtterance(text);
      if (ar) u.voice = ar;
      u.lang = "ar-SA";
      u.rate = rate;
      u.pitch = o.pitch != null ? o.pitch : 1;
      u.volume = 1;
      window.speechSynthesis.speak(u);
    }
  } catch (e) { toast("تعذّر تشغيل الصوت"); }
}

/* نطق الحرف: بطيء جدًا وواضح + تكرار مرتين + مثال بعده */
function speakLetter(L) {
  const slow = Math.min(SPEED, 0.45);
  speak(L.name, { rate: slow, times: 2 });
  const ex = (L.words && L.words[0]) || "";
  if (ex) setTimeout(() => speak(ex, { rate: slow }), 1600);
  toast("نطق الحرف: " + L.name + " — ببطء ووضوح");
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast("تم نسخ النص ✓"); }
  catch (e) {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast("تم نسخ النص ✓"); }
    catch (_) { toast("تعذّر النسخ"); }
    ta.remove();
  }
}

/* ============================================================
   مشغّل الفيديو
   ============================================================ */
const YT = {
  idFromUrl(url) {
    if (!url) return null;
    const s = String(url).trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
    const pats = [
      /(?:youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of pats) { const m = s.match(p); if (m) return m[1]; }
    return null;
  },
  searchUrl(q) { return "https://www.youtube.com/results?search_query=" + encodeURIComponent(q); },
  embedUrl(id)  { return "https://www.youtube.com/embed/" + id + "?autoplay=1&rel=0&hl=ar"; },
};

function openVideo(opts) {
  const { title = "مشغّل الفيديو", sub = "", videoId = null, query = "", suggest = [] } = opts || {};
  $("#videoTitle").textContent = title;
  $("#videoSub").textContent = sub || "يمكنك لصق رابط فيديو يوتيوب لمشاهدته مباشرة هنا";

  const wrap = $("#playerWrap");
  const hasId = !!videoId;
  const items = (suggest.length ? suggest : (query ? [query] : []));

  if (hasId) {
    wrap.innerHTML = `<iframe src="${YT.embedUrl(videoId)}" title="${esc(title)}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`;
  } else {
    const q = query || title;
    wrap.innerHTML = `
      <div class="player-placeholder">
        <div class="ph-icon">▶</div>
        <p>هذا المقطع يُفتح من يوتيوب مباشرة</p>
        <a class="btn btn-gold" style="margin-top:6px" target="_blank" rel="noopener" href="${YT.searchUrl(q)}">
          ${ICO.play} ابحث في يوتيوب عن: «${esc(q)}»
        </a>
      </div>`;
  }

  const sug = $("#videoSuggest");
  if (items.length) {
    sug.innerHTML = `<h5>مقاطع مقترحة بنفس الموضوع</h5><div class="suggest-list">` +
      items.map(t => `<button data-q="${esc(t)}">${ICO.ext} ${esc(t)}</button>`).join("") + `</div>`;
    $$("#videoSuggest button").forEach(b => b.addEventListener("click", () => {
      window.open(YT.searchUrl(b.dataset.q), "_blank", "noopener");
    }));
  } else { sug.innerHTML = ""; }

  $("#videoUrl").value = "";
  const m = $("#videoModal");
  m.classList.add("show"); m.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeVideo() {
  const m = $("#videoModal");
  m.classList.remove("show"); m.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  $("#playerWrap").innerHTML = `<div class="player-placeholder" id="playerPlaceholder">
      <div class="ph-icon">▶</div><p>اختر فيديو من المكتبة أو الصق رابطًا أدناه</p></div>`;
}

/* ============================================================
   البحث الشامل
   ============================================================ */
const INDEX = [];
function buildIndex() {
  GRAMMAR.forEach(g => INDEX.push({
    type:"grammar", id:g.id, title:g.title, cat:(GRAMMAR_CATS.find(c=>c.id===g.cat)||{}).name||"قاعدة",
    text:`${g.title} ${g.summary} ${stripTags(g.html)} ${(g.examples||[]).map(e=>e.text+" "+(e.note||"")).join(" ")}`,
    body:`${g.summary}. ${stripTags(g.html)} ${(g.examples||[]).map(e=>e.text+" — "+e.note).join(" | ")}`,
    snip:g.summary, icon:g.icon, lessId:g.id,
    route:`#/grammar/${g.id}`, link:() => go(`#/grammar/${g.id}`),
    youtube:`${g.title} شرح`,
  }));

  VOCAB.forEach(v => INDEX.push({
    type:"vocab", id:v.word, title:v.word, cat:(VOCAB_CATS.find(c=>c.id===v.cat)||{}).name||"مفردة",
    text:`${v.word} ${v.meaning} ${v.root||""} ${v.sentence} ${(v.syn||[]).join(" ")} ${(v.ant||[]).join(" ")}`,
    body:`${v.word}: ${v.meaning}. ${v.root ? "الجذر: "+v.root+". " : ""}مثال: ${v.sentence}. ${(v.syn||[]).length ? "مترادفاتها: "+(v.syn||[]).join("، ")+". " : ""}${(v.ant||[]).length ? "ومضادها: "+(v.ant||[]).join("، ")+"." : ""}`,
    snip:`${v.meaning} — «${v.sentence}»`, icon:"🗂️", word:v.word,
    route:`#/vocab`, link:() => { go("#/vocab"); setTimeout(()=>{ const el=$("#vocabSearch"); if(el){ el.value=v.word; el.dispatchEvent(new Event("input")); window.scrollTo({top:el.offsetTop-140,behavior:"smooth"});} },80); },
    youtube:`${v.word} معنى`,
  }));

  SYN_PAIRS.forEach((p,i) => INDEX.push({
    type:"syn", id:"syn"+i, title:`${p.a} = ${p.b}`, cat:"مترادفات",
    text:`${p.a} ${p.b} ${p.sentence} مترادف متقارب`,
    body:`الكلمتان «${p.a}» و«${p.b}» مترادفتان، أي تدلّان على معنًى واحد. ${p.sentence}`,
    snip:p.sentence, icon:"🤝", word:p.a, kind:"syn",
    route:`#/synonyms`, link:() => go("#/synonyms"), youtube:`${p.a} ${p.b} ترادف`,
  }));
  ANT_PAIRS.forEach((p,i) => INDEX.push({
    type:"syn", id:"ant"+i, title:`${p.a} ✕ ${p.b}`, cat:"مضادات",
    text:`${p.a} ${p.b} ${p.sentence} ضد عكس مضاد`,
    body:`الكلمتان «${p.a}» و«${p.b}» متضادتان (ضدّان). ${p.sentence}`,
    snip:p.sentence, icon:"⚖️", word:p.a, kind:"ant",
    route:`#/synonyms`, link:() => { go("#/synonyms"); setTimeout(()=>{ const el=$("#synSearch"); if(el){ el.value=p.a; el.dispatchEvent(new Event("input")); } },80); },
    youtube:`${p.a} ضد`,
  }));

  IRAB.forEach(x => INDEX.push({
    type:"irab", id:x.id, title:`إعراب: ${x.sentence}`, cat:x.type,
    text:`${x.sentence} ${x.type} ${x.note} ${x.words.map(w=>w.w+" "+w.i).join(" ")}`,
    body:`${x.sentence} — ${x.type}. ${x.note} ${x.words.map(w=>w.w+": "+w.i).join(" ")}`,
    snip:x.note, icon:"🧩", irabId:x.id, word:x.sentence, route:`#/irab`, link:() => go("#/irab"), youtube:`إعراب ${x.sentence}`,
  }));

  VIDEOS.forEach((v, i) => {
    const yt = ytInfo("v" + i);
    INDEX.push({
      type:"video", id:v.title, title:(yt && yt.title) || v.title,
      cat:(VIDEO_CATS.find(c=>c.id===v.cat)||{}).name||"فيديو",
      text:`${v.title} ${v.desc} ${v.q} ${v.dur} ${(yt&&yt.rawTitle)||""}`,
      body:`${v.desc}. مدة المقطع: ${(yt&&yt.durLabel)||v.dur}.`,
      snip:v.desc, icon:"🎬", videoIndex:i,
      route:`#/videos`,
      link:() => { go("#/videos"); setTimeout(()=>{ const el=$("#videoSearch"); if(el){ el.value=(yt&&yt.title)||v.title; el.dispatchEvent(new Event("input")); } },80); },
      youtube:v.q, videoQuery:v.q, videoId: yt ? yt.id : null, videoDur: yt ? yt.dur : "",
    });
  });

  /* الحروف الـ ٢٨ */
  LETTERS.forEach((L, i) => {
    const yt = ytInfo("L" + i);
    INDEX.push({
      type:"letter", id:L.id, title:`${L.name} (${L.glyph})`, cat:"حرف عربي",
      text:`${L.name} ${L.glyph} ${L.makhraj} ${L.sifat.join(" ")} ${L.harakat} ${L.words.join(" ")} ${L.join} ${L.mushkil} ${L.tip}`,
      body:`حرف ${L.name} «${L.glyph}»: مخرجه ${L.makhraj} صفاته ${L.sifat.join("، ")}. حركاته: ${L.harakat}. ${L.join} أمثلة: ${L.words.join("، ")}. ${L.mushkil}. ${L.tip}`,
      snip:L.makhraj, icon:"🔤", letterId:L.id, word:L.name,
      route:`#/letters`,
      link:() => { go("#/letters"); setTimeout(()=>{ const el=$("#letterSearch"); if(el){ el.value=L.name; el.dispatchEvent(new Event("input")); } },80); },
      youtube:L.videoQ, videoId: yt ? yt.id : null, videoDur: yt ? yt.dur : "",
    });
  });

  /* مجموعات الأصوات */
  SOUND_GROUPS.forEach((g, i) => {
    const yt = ytInfo("S" + i);
    INDEX.push({
      type:"letter", id:g.id, title:g.title, cat:"أصوات الحروف",
      text:`${g.title} ${g.desc} ${g.detail} ${g.letters.join(" ")}`,
      body:`${g.title}: ${g.desc} ${g.detail}`,
      snip:g.desc, icon:g.icon, groupId:g.id, word:g.title,
      route:`#/letters`,
      link:() => go("#/letters"),
      youtube:g.videoQ, videoId: yt ? yt.id : null, videoDur: yt ? yt.dur : "",
    });
  });
}

/* ---------- استخراج أفضل فقرة كإجابة مباشرة ---------- */
function bestPassage(body, q) {
  const terms = norm(q).split(" ").filter(w => w.length > 2);
  const sents = String(body || "").split(/[.؟!؛\n|]+/).map(s => s.trim()).filter(s => s.length > 10);
  if (!sents.length) return String(body || "").slice(0, 240);
  if (!terms.length) return sents.slice(0, 3).join(". ") + ".";
  let best = sents[0], bs = -1;
  for (const s of sents) {
    const n = norm(s);
    let sc = 0;
    for (const w of terms) { if (n.includes(w)) sc += 10; }
    if (sc > bs) { bs = sc; best = s; }
  }
  if (bs <= 0) {
    const joined = sents.slice(0, 3).join(". ");
    return joined + (joined.length > 240 ? "…" : ".");
  }
  return best + (best.length > 280 ? "…" : ".");
}

/* ---------- اختيار مقاطع يوتيوب المرتبطة بنتيجة ---------- */
function pickVideos(it, q, limit) {
  const lim = limit || 3;
  const out = [], seen = {};
  const push = (key, fbTitle, fbQ) => {
    const y = ytInfo(key);
    if (!y || !y.id || seen[y.id]) return;
    seen[y.id] = 1;
    out.push({ id:y.id, title:y.title || fbTitle, dur:y.dur, q:fbQ || y.title });
  };
  const pushRaw = (id, title, qq, dur) => {
    if (!id || seen[id]) return;
    seen[id] = 1;
    out.push({ id, title, dur: dur || "", q: qq || title });
  };

  // المقطع المرتبط مباشرة بالنتيجة (مخزَّن في الفهرس)
  if (it.videoId) {
    const L = it.letterId ? LETTERS.find(x => x.id === it.letterId) : null;
    const G = it.groupId ? SOUND_GROUPS.find(x => x.id === it.groupId) : null;
    pushRaw(it.videoId,
      L ? ("نطق حرف " + L.name) : (G ? G.title : it.title),
      L ? L.videoQ : (G ? G.videoQ : it.youtube),
      it.videoDur);
  }
  if (it.type === "video" && typeof it.videoIndex === "number") {
    push("v" + it.videoIndex, it.title, it.videoQuery);
  }
  if (it.lessId) {
    const g = GRAMMAR.find(x => x.id === it.lessId);
    ((g && g.videos) || []).forEach((v, j) => push(`g_${it.lessId}_${j}`, v.title, v.q));
  }

  // مواضيع خاصة بالمعنى (قبل المطابقة العامة)
  if (it.kind === "ant") push("v36", "الأضداد", "الأضداد في اللغة العربية");
  if (it.kind === "syn") push("v35", "المترادفات", "المترادفات في اللغة العربية");
  if (it.type === "vocab") push("v34", "مفردات عملية", "مفردات اللغة العربية");
  if (it.type === "irab") push("v20", "تعلم الإعراب", "تعلم الإعراب من الصفر");

  // مطابقة من مكتبة الفيديو حسب كلمات البحث
  const terms = norm(q).split(" ").filter(w => w.length > 3);
  const extra = norm((it.title || "") + " " + (it.cat || ""));
  VIDEOS.map((v, i) => {
    const hay = norm(v.title + " " + v.desc + " " + v.q);
    let sc = 0;
    terms.forEach(w => { if (hay.includes(w)) sc += 12; });
    if (!sc) return { v, i, sc: 0 };
    terms.forEach(w => { if (extra.includes(w)) sc += 6; });
    return { v, i, sc };
  }).filter(x => x.sc > 0).sort((a, b) => b.sc - a.sc).forEach(({ v, i }) => push("v" + i, v.title, v.q));

  return out.slice(0, lim);
}

const thumbUrl = (id) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

function searchAll(q, filter = "all") {  const t = norm(q);
  if (!t) return [];
  const terms = t.split(" ").filter(Boolean);
  const out = [];
  // المحتوى أعلى أولوية من الفيديوهات (الفيديوهات ملحقة بالمحتوى)
  const TYPE_W = { grammar: 35, irab: 35, vocab: 25, syn: 25, video: -12 };
  for (const it of INDEX) {
    if (filter !== "all" && it.type !== filter) continue;
    const hay = norm(it.text);
    let score = 0, hitAll = true;
    for (const w of terms) {
      if (!hay.includes(w)) { hitAll = false; break; }
      score += 10;
      if (norm(it.title).includes(w)) score += 40;
      if (norm(it.snip).includes(w))   score += 8;
      if (norm(it.cat).includes(w))    score += 12;
    }
    if (!hitAll) continue;
    score += TYPE_W[it.type] || 0;
    out.push({ it, score });
  }
  out.sort((a, b) => b.score - a.score);
  return out.map(o => o.it);
}

function highlight(text, q) {
  const terms = norm(q).split(" ").filter(Boolean);
  if (!terms.length) return esc(text);
  let out = esc(text);
  const map = [["أ","ا"],["إ","ا"],["آ","ا"],["ى","ي"],["ة","ه"]];
  terms.forEach(term => {
    const variants = [term];
    map.forEach(([a,b]) => { if (term.includes(b)) variants.push(term.split(b).join(a)); });
    variants.forEach(v => {
      if (!v) return;
      const idx = norm(out).indexOf(v);
      if (idx < 0) return;
      out = out.slice(0, idx) + "\u0001" + out.slice(idx, idx + v.length) + "\u0002" + out.slice(idx + v.length);
    });
  });
  return out.replace(/\u0001/g, "<mark>").replace(/\u0002/g, "</mark>");
}

function snippetOf(text, q) {
  const terms = norm(q).split(" ").filter(Boolean);
  const flat = stripTags(text);
  const n = norm(flat);
  let pos = -1;
  for (const w of terms) { const p = n.indexOf(w); if (p >= 0) { pos = p; break; } }
  if (pos < 0) return flat.slice(0, 150) + (flat.length > 150 ? "…" : "");
  const start = Math.max(0, pos - 60);
  const cut = flat.slice(start, start + 190);
  return (start > 0 ? "…" : "") + cut + (start + 190 < flat.length ? "…" : "");
}

const TYPE_LABEL = { grammar:"قاعدة", vocab:"مفردة", syn:"ضد وعكس", irab:"إعراب", video:"فيديو", letter:"حرف" };
const TYPE_ICON  = { grammar:"📐", vocab:"🗂️", syn:"⚖️", irab:"🧩", video:"🎬", letter:"🔤" };

/* بطاقة فيديو مصغّرة قابلة للنقر */
function miniVideoHTML(v) {
  return `<button class="mini-vid" data-vid="${esc(v.id)}" data-vtitle="${esc(v.title)}"
      data-vdur="${esc(v.dur || "")}" data-vq="${esc(v.q || v.title)}" title="${esc(v.title)}">
      <span class="mv-thumb">
        <img src="${thumbUrl(v.id)}" alt="" loading="lazy" onerror="this.parentNode.classList.add('noimg')">
        <span class="mv-play">▶</span>
      </span>
      <span class="mv-info"><b>${esc(v.title)}</b><small>يوتيوب${v.dur ? " · " + esc(v.dur) : ""}</small></span>
    </button>`;
}

/* بطاقة فيديو كاملة داخل لوحة الإجابة */
function stripVideoHTML(v) {
  const isSearch = !v.id;
  return `<div class="strip-vid js-vid" ${isSearch ? `data-search="1"` : `data-vid="${esc(v.id)}"`}
      data-vtitle="${esc(v.title)}" data-vdur="${esc(v.dur || "")}" data-vq="${esc(v.q || v.title)}">
      <span class="sv-thumb">${isSearch
        ? `<span class="sv-ph">🔎</span><span class="mv-play">▶</span>`
        : `<img src="${thumbUrl(v.id)}" alt="" loading="lazy" onerror="this.parentNode.classList.add('noimg')"><span class="mv-play">▶</span>`}</span>
      <span class="sv-body"><b>${esc(v.title)}</b><small>${esc(v.dur || "يوتيوب")}</small></span>
    </div>`;
}

function resultHTML(it, q, opts) {
  const compact = opts && opts.compact;
  const vids = pickVideos(it, q, compact ? 1 : 2);
  return `<div class="res" data-i="${esc(it.type)}" data-id="${esc(it.id)}" tabindex="0" role="button">
    <div class="r-ico ${it.type}">${it.icon || TYPE_ICON[it.type]}</div>
    <div class="r-body">
      <h4 class="r-title">${highlight(it.title, q)} <span class="r-badge ${it.type}">${TYPE_LABEL[it.type]}</span></h4>
      <p class="r-answer"><b>الإجابة: </b>${highlight(bestPassage(it.body || it.snip, q), q)}</p>
      ${vids.length ? `<div class="r-vids">${vids.map(miniVideoHTML).join("")}</div>` : ""}
    </div>
  </div>`;
}

/* لوحة الإجابة المباشرة أعلى نتائج البحث */
function answerPanelHTML(q, list) {
  if (!list.length) return "";
  const best = list[0];
  const vids = pickVideos(best, q, 3);
  const searchCard = { id:null, title:"ابحث في يوتيوب عن: " + q, dur:"فتح نتائج يوتيوب", q };
  return `<div class="answer-card">
    <div class="ac-head">
      <span class="ac-badge">💡 الإجابة المباشرة</span>
      <span class="ac-type">${TYPE_LABEL[best.type]} · ${esc(best.title)}</span>
    </div>
    <p class="ac-text">${highlight(bestPassage(best.body || best.snip, q), q)}</p>
    <div class="ac-actions">
      <button class="btn btn-solid" id="acOpen">📖 افتح الموضوع كاملًا</button>
      <button class="btn btn-outline" id="acCopy">📋 نسخ الإجابة</button>
    </div>
    <div class="ac-vids">
      <h5>🎬 مقاطع يوتيوب مرتبطة بالبحث</h5>
      <div class="vid-strip">${vids.map(stripVideoHTML).join("")}${stripVideoHTML(searchCard)}</div>
    </div>
  </div>`;
}

/* تشغيل فيديو من أي بطاقة فيديو في نتائج البحث */
function wireVideoButtons(container) {
  $$(".mini-vid, .strip-vid", container).forEach(el => {
    if (el._b) return; el._b = 1;
    el.addEventListener("click", e => {
      e.stopPropagation();
      const id = el.dataset.vid, title = el.dataset.vtitle;
      const q = el.dataset.vq || title;
      if (el.dataset.search) { window.open(YT.searchUrl(q), "_blank", "noopener"); return; }
      openVideo({
        title, sub: "مقطع تعليمي من يوتيوب" + (el.dataset.vdur ? " · المدة: " + el.dataset.vdur : ""),
        videoId: id, query: q, suggest: [q, "شرح مبسّط", "مثال محلول"],
      });
    });
  });
}

function wireResults(container, q) {
  $$(".res", container).forEach(el => {
    const act = () => {
      const type = el.dataset.i, id = el.dataset.id;
      const hit = INDEX.find(x => x.type === type && String(x.id) === id);
      if (!hit) return;
      if (hit.videoId) {
        closeSearchOverlay();
        openVideo({
          title: hit.title,
          sub: (hit.snip || "") + (hit.videoDur ? " · المدة: " + hit.videoDur : ""),
          videoId: hit.videoId,
          query: hit.videoQuery || hit.youtube,
          suggest: [hit.youtube],
        });
        return;
      }
      closeSearchOverlay();
      hit.link();
    };
    el.addEventListener("click", act);
    el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } });
  });
}

/* ---------------- لوحة البحث المنبثقة ---------------- */
let spFilter = "all", spSel = -1;
function openSearchOverlay(prefill = "") {
  const o = $("#searchOverlay");
  o.classList.add("show"); o.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  const inp = $("#overlaySearch");
  inp.value = prefill;
  inp.focus(); inp.select();
  runOverlaySearch();
}
function closeSearchOverlay() {
  const o = $("#searchOverlay");
  o.classList.remove("show"); o.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function runOverlaySearch() {
  const q = $("#overlaySearch").value.trim();
  const box = $("#spResults");
  spSel = -1;
  if (!q) {
    box.innerHTML = `<div class="sp-hint">
      اكتب للبحث في <b>${toArabicNum(GRAMMAR.length)}</b> قاعدة، و<b>${toArabicNum(VOCAB.length)}</b> مفردة،
      و<b>${toArabicNum(ANT_PAIRS.length + SYN_PAIRS.length)}</b> زوجًا من الضد والعكس،
      و<b>${toArabicNum(IRAB.length)}</b> مثال إعراب، و<b>${toArabicNum(VIDEOS.length)}</b> مقطع فيديو.<br><br>
      اضغط <span class="kbd">↑</span><span class="kbd">↓</span> للتصفّح و<span class="kbd">Enter</span> للفتح
      و<span class="kbd">Esc</span> للإغلاق</div>`;
    return;
  }
  const res = searchAll(q, spFilter);
  if (!res.length) {
    box.innerHTML = `<div class="sp-hint">لا توجد نتائج لـ «<b>${esc(q)}</b>».
      جرّب كلمة أعم مثل: <b>النصب</b>، <b>مجتهد</b>، <b>الفرح</b>.</div>`;
    return;
  }
  box.innerHTML = answerPanelHTML(q, res) + res.slice(0, 40).map(r => resultHTML(r, q, {compact:true})).join("");
  wireResults(box, q);
  wireVideoButtons(box);
}
function moveSel(d) {
  const items = $$("#spResults .res");
  if (!items.length) return;
  spSel = (spSel + d + items.length) % items.length;
  items.forEach((el, i) => el.classList.toggle("sel", i === spSel));
  items[spSel].scrollIntoView({ block: "nearest" });
}

/* ============================================================
   شجرة الإعراب (SVG)
   ============================================================ */
function renderTree(tree) {
  if (!tree) return "";
  const NODE_H = 40, LEVEL_H = 80, GAP = 18, PAD = 18;
  const nodes = [], edges = [];
  let cursor = PAD;
  const textOf = (n) => n.role ? `${n.role}: ${n.label}` : String(n.label);
  const measure = (t) => Math.max(72, String(t).length * 12.5 + 28);

  function place(node, depth) {
    const w = measure(textOf(node));
    let x;
    if (node.children && node.children.length) {
      const xs = node.children.map(c => place(c, depth + 1));
      x = (xs[0] + xs[xs.length - 1]) / 2;
      node.children.forEach((c, i) => edges.push([x, depth, xs[i], depth + 1]));
    } else {
      x = cursor + w / 2;
      cursor += w + GAP;
    }
    nodes.push({ label: textOf(node), x, y: depth, w, root: depth === 0 });
    return x;
  }
  place(tree, 0);

  const maxX = Math.max(...nodes.map(n => n.x + n.w / 2));
  const minX = Math.min(...nodes.map(n => n.x - n.w / 2));
  const W = Math.max(maxX - minX + PAD * 2, 460);
  const maxD = Math.max(...nodes.map(n => n.y));
  const H = maxD * LEVEL_H + NODE_H + PAD * 2;
  const offX = PAD - minX;

  let s = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="شجرة الإعراب">`;
  edges.forEach(([px, pd, cx, cd]) => {
    const x1 = px + offX, y1 = pd * LEVEL_H + PAD + NODE_H;
    const x2 = cx + offX, y2 = cd * LEVEL_H + PAD;
    const my = (y1 + y2) / 2;
    s += `<path d="M${x1} ${y1} C ${x1} ${my}, ${x2} ${my}, ${x2} ${y2}"
      fill="none" stroke="#b8862f" stroke-width="1.8" stroke-opacity=".75"/>`;
  });
  nodes.forEach(n => {
    const w = n.w, h = NODE_H;
    const x = n.x + offX - w / 2;
    const y = n.y * LEVEL_H + PAD;
    const fill   = n.root ? "#0b3d33" : "#14614f";
    const stroke = n.root ? "#e6c15f" : "#d4a537";
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10"
        fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`;
    s += `<text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle"
        fill="#fffdf8" font-size="14" font-family="Cairo, Arial, sans-serif">${esc(n.label)}</text>`;
  });
  s += `</svg>`;
  return `<div class="tree-box">${s}</div>`;
}

/* ============================================================
   العروض (Views)
   ============================================================ */
const app = $("#app");

/* ---------------- الحروف العربية ---------------- */
function letterCard(L, i) {
  const yt = ytInfo("L" + (L.order - 1));
  return `
  <div class="letter-card" data-id="${L.id}">
    <div class="lc-glyph">
      <span class="lg-letter">${L.glyph}</span>
      <span class="lg-order">${toArabicNum(L.order)}</span>
    </div>
    <div class="lc-info">
      <h3>${L.name} <span class="lc-dots">${L.points ? "⬛".repeat(L.points) : "—"}</span></h3>
      <p class="lc-sound"><b>النطق:</b> ${L.makhraj}</p>
      <p class="lc-attr"><b>الصفات:</b> ${L.sifat.join("، ")}</p>
      <p class="lc-haraka"><b>الحركات:</b> <span class="ser">${L.harakat}</span></p>
      <p class="lc-words">${L.words.map(w => `<span class="w-chip">${w}</span>`).join("")}</p>
      <p class="lc-tip">💡 ${L.tip}</p>
      <div class="lc-actions">
        <button class="btn btn-outline btn-xs js-letter-speak" data-lid="${L.id}" title="استمع للحرف ببطء ووضوح">🔊 نطق الحرف (بطيء)</button>
        ${yt ? `<button class="btn btn-gold btn-xs js-vq" data-q="${esc(L.videoQ)}" data-title="${esc("نطق حرف " + L.name)}"
            data-desc="مقطع لتعليم نطق حرف ${L.name}" data-id="${esc(yt.id)}" data-dur="${esc(yt.dur)}">${ICO.play} ${esc(yt.dur)}</button>` : ""}
      </div>
    </div>
  </div>`;
}

let letterQuery = "";
function viewLetters() {
  app.innerHTML = `
  <div class="page-head">
    <div class="container">
      <nav class="breadcrumb"><a href="#/home">الرئيسية</a><span class="sep">/</span><span>الحروف العربية وأصواتها</span></nav>
      <h1>🔤 الحروف العربية وأصواتها</h1>
      <p class="sub">الحروف الـ ٢٨ بأسمائها ومخارجها وصفاتها وأشكالها وحركاتها، مع مقطع يوتيوب لتعليم نطق كل حرف، ثم مجموعات الأصوات (المدّ، الهمز، الجهر والهمس، الاستعلاء…) وكيفية تمييز الحروف المتشابهة.</p>
    </div>
  </div>

  <section class="section" style="padding:38px 0 10px">
    <div class="container">
      <div class="sec-head" style="margin-bottom:26px">
        <span class="sec-kicker">ابدأ من هنا</span>
        <h2>الحروف الـ ٢٨</h2>
        <p>اضغط زر التشغيل في أي حرف لتسمع نطقه أو تشاهد المقطع المعرَّض لنطقِه.</p>
      </div>
      <div class="toolbar" style="position:static;border-radius:var(--r-md);border:1px solid var(--line)">
        <input type="search" id="letterSearch" placeholder="ابحث عن حرف… مثال: الباء، مخرج، غنّة" aria-label="بحث في الحروف">
      </div>
      <div class="letters-grid" id="lettersGrid"></div>
    </div>
  </section>

  <section class="section alt" style="padding-top:48px">
    <div class="container">
      <div class="sec-head">
        <span class="sec-kicker">أصوات الحروف</span>
        <h2>مجموعات الأصوات</h2>
        <p>الحروف تتشارك في صفاتٍ ومخارجَ، وهذه أشهر المجموعات التي يجب أن تعرفها.</p>
      </div>
      <div class="grid g-2" id="soundGroups"></div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="sec-head">
        <span class="sec-kicker">احذر الخلط</span>
        <h2>الحروف المتشابهة في المخرج</h2>
        <p>أشهر ما يخطئ فيه المتعلم: حروفٌ متقاربة المخرج يظنّها متشابهةً في النطق. إليك كيف تميّزها.</p>
      </div>
      <div class="grid g-2" id="similarGroups"></div>
    </div>
  </section>

  <section class="section alt" style="padding-top:48px">
    <div class="container">
      <div class="sec-head">
        <span class="sec-kicker">فيديوهات</span>
        <h2>مقاطع الحروف والأصوات</h2>
        <p>مقاطع مخارج الحروف وصفاتها والحركات والمتشابهات.</p>
      </div>
      <div class="vid-grid" id="letterVids"></div>
    </div>
  </section>`;

  const inp = $("#letterSearch");
  inp.value = letterQuery;
  const draw = () => {
    letterQuery = inp.value.trim();
    const t = norm(letterQuery);
    const list = LETTERS.filter(L => {
      if (!t) return true;
      return norm([L.name, L.glyph, L.makhraj, L.sifat.join(" "), L.harakat, L.words.join(" "), L.join, L.mushkil, L.tip].join(" ")).includes(t);
    });
    const grid = $("#lettersGrid");
    if (!list.length) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="e-ico">🔤</div>
        <h3>لا توجد نتائج</h3><p>لم نجد حرفًا يطابق «${esc(letterQuery)}».</p></div>`;
      return;
    }
    grid.innerHTML = list.map(letterCard).join("");
    bindExamples(grid);
    bindVideoCards(grid);
  };
  inp.addEventListener("input", debounce(draw, 150));
  draw();

  // مجموعات الأصوات
  $("#soundGroups").innerHTML = SOUND_GROUPS.map((g, gi) => {
    const yt = ytInfo("S" + gi);
    return `<div class="card sound-card reveal">
      <div class="sc-head"><span class="sc-ico">${g.icon}</span><h3>${g.title}</h3></div>
      <p class="sc-desc">${g.desc}</p>
      <div class="sc-letters">${g.letters.map(l => `<span class="sc-letter">${l}</span>`).join("")}</div>
      <p class="sc-detail">${g.detail}</p>
      <button class="btn btn-outline btn-xs js-vq" data-q="${esc(g.videoQ)}" data-title="${esc(g.title)}"
        data-desc="مقطع عن ${g.title}" data-id="${yt ? yt.id : ""}" data-dur="${esc(yt ? yt.dur : "")}">${ICO.play} شاهد المقطع</button>
    </div>`;
  }).join("");

  // المتشابهات
  $("#similarGroups").innerHTML = SIMILAR_GROUPS.map(g => {
    const names = g.ids.map(id => (LETTERS.find(L => L.id === id) || {}).name).filter(Boolean);
    return `<div class="card sim-card reveal">
      <h3 class="sim-title">🔍 ${g.group}</h3>
      <div class="sim-names">${names.map(n => `<span class="sc-letter">${n}</span>`).join("")}</div>
      <p class="sim-diff"><b>الفرق:</b> ${g.diff}</p>
    </div>`;
  }).join("");

  // فيديوهات الحروف
  const lvid = VIDEOS.map((v, i) => ({ v, i })).filter(({ v }) => v.cat === "huruf");
  $("#letterVids").innerHTML = lvid.map(({ v, i }) => videoCard(v, i)).join("");

  bindVideoCards(app);
  revealInit();
}

/* ---------------- معرض الصور ---------------- */
let imgFilter = "all", imgQuery = "";
function viewImages() {
  app.innerHTML = `
  <div class="page-head">
    <div class="container">
      <nav class="breadcrumb"><a href="#/home">الرئيسية</a><span class="sep">/</span><span>معرض الصور</span></nav>
      <h1>🖼️ معرض الصور</h1>
      <p class="sub">ارفع صورك (مخططات، أمثلة إعراب مرسومة، صور الحروف…) واحفظها داخل المتصفح، واربطها بالقاعدة لتظهر في صفحتها.</p>
    </div>
  </div>

  <div class="container">
    <div class="upload-zone" id="uploadZone">
      <input type="file" id="fileInput" accept="image/*" multiple hidden>
      <div class="uz-icon">📤</div>
      <h2>اسحب صورك هنا أو اضغط للاختيار</h2>
      <p>تُصغَّر الصور تلقائيًا إلى ${IMG_MAX_W} بكسل لتوفير المساحة، وتُحفظ في متصفحك فقط (لا تُرفع إلى أي خادم).</p>
      <div class="uz-form">
        <input type="text" id="imgCaption" placeholder="اسم/وصف الصورة (اختياري)" aria-label="وصف الصورة">
        <select id="imgLesson" aria-label="اربط الصورة بقاعدة">
          <option value="">— بلا ربط —</option>
          ${GRAMMAR.map(g => `<option value="${g.id}">${g.title}</option>`).join("")}
          ${LETTERS.map(L => `<option value="letter:${L.id}">حرف: ${L.name}</option>`).join("")}
        </select>
        <button class="qbtn" id="pickBtn">اختر صورًا</button>
      </div>
      <div class="uz-info" id="uzInfo"></div>
    </div>

    <div class="toolbar">
      <input type="search" id="imgSearch" placeholder="ابحث في الصور… مثال: إعراب، حروف" aria-label="بحث في الصور">
      <div class="tabs" id="imgTabs">
        <button class="tab ${imgFilter==="all"?"active":""}" data-c="all">🗂️ الكل</button>
        <button class="tab ${imgFilter==="gram"?"active":""}" data-c="gram">📐 مرتبطة بقاعدة</button>
        <button class="tab ${imgFilter==="letter"?"active":""}" data-c="letter">🔤 صور الحروف</button>
        <button class="tab ${imgFilter==="free"?"active":""}" data-c="free">🆓 غير مرتبطة</button>
      </div>
    </div>

    <div class="img-grid" id="imgGrid"></div>
  </div>

  <div class="lightbox" id="lightbox" aria-hidden="true">
    <button class="lb-close" data-lb-close aria-label="إغلاق">✕</button>
    <div class="lb-inner">
      <img id="lbImg" src="" alt="">
      <div class="lb-meta">
        <h3 id="lbTitle"></h3>
        <p id="lbSub"></p>
      </div>
    </div>
  </div>`;

  const zone = $("#uploadZone"), fileInput = $("#fileInput");
  const capIn = $("#imgCaption"), lesSel = $("#imgLesson");

  $("#pickBtn").addEventListener("click", () => fileInput.click());
  zone.addEventListener("click", e => { if (e.target === zone || e.target.closest(".uz-icon,.uz-title")) fileInput.click(); });
  ["dragenter", "dragover"].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add("drag"); }));
  ["dragleave", "drop"].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove("drag"); }));
  zone.addEventListener("drop", e => {
    const files = Array.from((e.dataTransfer && e.dataTransfer.files) || []);
    handleFiles(files);
  });
  fileInput.addEventListener("change", () => { handleFiles(Array.from(fileInput.files || [])); fileInput.value = ""; });

  const handleFiles = async (files) => {
    if (!files.length) return;
    let ok = 0, fail = 0;
    for (const f of files) {
      try {
        const { url } = await resizeImage(f, IMG_MAX_W, IMG_MAX_H, IMG_QUALITY);
        const id = ImageStore.add(url, capIn.value.trim(), lesSel.value);
        if (id) ok++; else fail++;
      } catch (err) { fail++; }
    }
    capIn.value = "";
    toast(ok ? `تم رفع ${ok} صورة` + (fail ? ` (فشل ${fail})` : "") : "تعذّر رفع الصور");
    draw();
  };

  const inp = $("#imgSearch");
  inp.value = imgQuery;
  const syncTabs = () => $$("#imgTabs .tab").forEach(t => t.classList.toggle("active", t.dataset.c === imgFilter));
  const draw = () => {
    imgQuery = inp.value.trim();
    const t = norm(imgQuery);
    const list = ImageStore.all().filter(it => {
      if (imgFilter === "gram" && !it.lesson) return false;
      if (imgFilter === "letter" && it.lesson.indexOf("letter:") !== 0) return false;
      if (imgFilter === "free" && it.lesson) return false;
      if (!t) return true;
      return norm((it.caption || "") + " " + (it.lesson || "")).includes(t);
    });
    $("#uzInfo").innerHTML = `<span>📦 ${ImageStore.all().length} صورة</span><span>💾 ${ImageStore.usageLabel()}</span><span>الحد الأقصى ${IMG_LIMIT} صورة</span>`;
    const grid = $("#imgGrid");
    if (!list.length) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="e-ico">🖼️</div>
        <h3>${ImageStore.all().length ? "لا توجد نتائج" : "لا توجد صور بعد"}</h3>
        <p>${ImageStore.all().length ? "جرّب كلمة أخرى." : "اسحب صورك إلى المنطقة بالأعلى لتبدأ."}</p></div>`;
      return;
    }
    grid.innerHTML = list.map(it => `
      <figure class="img-card" data-id="${it.id}">
        <div class="ic-thumb"><img src="${it.src}" alt="${esc(it.caption || "صورة")}" loading="lazy"></div>
        <figcaption>
          <input type="text" class="ic-cap" value="${esc(it.caption || "")}" placeholder="اكتب وصفًا…" data-id="${it.id}" aria-label="وصف الصورة">
          <div class="ic-meta">
            <select class="ic-lesson" data-id="${it.id}" aria-label="ربط الصورة بقاعدة">
              <option value="">— بلا ربط —</option>
              ${GRAMMAR.map(g => `<option value="${g.id}" ${it.lesson===g.id?"selected":""}>${g.title}</option>`).join("")}
              ${LETTERS.map(L => `<option value="letter:${L.id}" ${it.lesson==="letter:"+L.id?"selected":""}>حرف: ${L.name}</option>`).join("")}
            </select>
          </div>
          <div class="ic-actions">
            <button class="mini-btn ic-open" data-id="${it.id}" title="عرض بالحجم الكامل">🔍</button>
            <button class="mini-btn ic-dl" data-id="${it.id}" title="تنزيل">⤓</button>
            <button class="mini-btn ic-del" data-id="${it.id}" title="حذف">🗑️</button>
          </div>
        </figcaption>
      </figure>`).join("");

    $$(".ic-cap", grid).forEach(inp2 => {
      inp2.addEventListener("change", () => { ImageStore.update(inp2.dataset.id, { caption: inp2.value }); toast("تم حفظ الوصف ✓"); });
    });
    $$(".ic-lesson", grid).forEach(sel => {
      sel.addEventListener("change", () => { ImageStore.update(sel.dataset.id, { lesson: sel.value }); toast("تم الربط بالقاعدة ✓"); });
    });
    $$(".ic-del", grid).forEach(b => b.addEventListener("click", () => {
      if (!confirm("هل تريد حذف هذه الصورة؟")) return;
      ImageStore.remove(b.dataset.id); draw(); toast("تم الحذف");
    }));
    $$(".ic-dl", grid).forEach(b => b.addEventListener("click", () => {
      const it = ImageStore.all().find(x => x.id === b.dataset.id);
      if (!it) return;
      const a = document.createElement("a");
      a.href = it.src; a.download = (it.caption || "صورة") + ".jpg";
      a.click();
    }));
    $$(".ic-open", grid).forEach(b => b.addEventListener("click", () => {
      const it = ImageStore.all().find(x => x.id === b.dataset.id);
      if (!it) return;
      $("#lbImg").src = it.src;
      $("#lbTitle").textContent = it.caption || "صورة";
      const lname = it.lesson ? (GRAMMAR.find(g => g.id === it.lesson) || { title: it.lesson }).title : "غير مرتبطة";
      $("#lbSub").textContent = "الارتباط: " + lname;
      const lb = $("#lightbox");
      lb.classList.add("show"); lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }));
  };
  $$("#imgTabs .tab").forEach(b => b.addEventListener("click", () => { imgFilter = b.dataset.c; syncTabs(); draw(); }));
  inp.addEventListener("input", debounce(draw, 150));
  draw();
}

function openLightboxClose() {
  const lb = $("#lightbox");
  lb.classList.remove("show"); lb.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* ---------------- الرئيسية ---------------- */
function viewHome() {
  const totalExamples = GRAMMAR.reduce((a, l) => a + (l.examples ? l.examples.length : 0), 0);
  const totalPairs = SYN_PAIRS.length + ANT_PAIRS.length;

  const catCards = [
    { href:"#/letters", icon:"🔤", t:"الحروف والأصوات", d:`الحروف الـ ٢٨ بمخارجها وصفاتها، مع مقطع يوتيوب لنطق كل حرف.` },
    { href:"#/grammar", icon:"📐", t:"قواعد النحو", d:`${toArabicNum(GRAMMAR.length)} درسًا شاملًا: المرفوعات والمنصوبات والأساليب والمشتقات.`, },
    { href:"#/vocab",   icon:"🗂️", t:"بنك المفردات", d:`${toArabicNum(VOCAB.length)} مفردة مع المعنى والجذر ونماذج من الاستعمال.`, },
    { href:"#/synonyms",icon:"⚖️", t:"الضد والعكس", d:`${toArabicNum(totalPairs)} زوجًا من المترادفات والمتضادات في مكان واحد.`, },
    { href:"#/irab",    icon:"🧩", t:"الإعراب المصوَّر", d:`محرّك إعراب آلي + ${toArabicNum(IRAB.length)} مثالًا بشجر نحوية توضّح بنية الجملة.`, },
    { href:"#/videos",  icon:"🎬", t:"فيديوهات يوتيوب", d:`${toArabicNum(VIDEOS.length)} مقطعًا تعليميًا موزّعة على تصنيفات.`, },
    { href:"#/images",  icon:"🖼️", t:"معرض الصور", d:"ارفع صورك ومخططاتك واربطها بالقواعد لتظهر في صفحاتها.", },
    { href:"#/search",  icon:"🔍", t:"البحث الشامل", d:"ابحث في كل شيء: القواعد والمفردات والإعراب والفيديوهات معًا.", },
  ];

  app.innerHTML = `
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-text">
        <span class="hero-badge">🌙 دار العربية — منصة شاملة</span>
        <h1>تعلّم <span class="gold">اللغة العربية</span><br>قاعدةً كلمةً وإعرابًا</h1>
        <p class="lead">موقع واحد يجمع <strong>كل القواعد</strong>، و<strong>بنك المفردات</strong>،
        و<strong>الضدَّ والعكس</strong>، و<strong>أمثلة الإعراب المدعّمة بالصور</strong>،
        و<strong>مكتبة مقاطع يوتيوب</strong>، مع محرّك بحث يجرِّب الأقسام كلها في نتائج واحدة.</p>
        <div class="hero-cta">
          <a href="#/grammar" class="btn btn-gold">ابدأ بدراسة القواعد</a>
          <a href="#/search"  class="btn btn-ghost">🔎 ابحث في كل شيء</a>
        </div>
        <div class="hero-stats">
          <div class="hstat"><b>${toArabicNum(GRAMMAR.length)}</b><span>درس قواعد</span></div>
          <div class="hstat"><b>${toArabicNum(VOCAB.length)}</b><span>مفردة</span></div>
          <div class="hstat"><b>${toArabicNum(totalPairs)}</b><span>زوج ضد وعكس</span></div>
          <div class="hstat"><b>${toArabicNum(VIDEOS.length)}</b><span>مقطع فيديو</span></div>
        </div>
      </div>
      <div class="hero-art">
        <div class="book">
          <div class="mini"><span>قاعدة ١</span><span>النحو العربي</span></div>
          <div class="rule"></div>
          <div class="calli">إنَّ <em>العلمَ</em> نورٌ</div>
          <div class="rule"></div>
          <div class="calli" style="font-size:1.7rem">كَتَبَ الطالبُ الدرسَ</div>
          <div class="rule"></div>
          <div class="mini"><span>مبتدأ • خبر</span><span>فاعل • مفعول</span></div>
        </div>
        <div class="float-badge fb1">✍️ إعراب مفصّل</div>
        <div class="float-badge fb2">🎥 فيديوهات لكل موضوع</div>
        <div class="float-badge fb3">🔎 بحث ذكي</div>
      </div>
    </div>
  </section>

  <section class="section" style="padding:56px 0 62px;background:linear-gradient(160deg,rgba(20,97,79,.07),rgba(212,165,55,.06))">
    <div class="container">
      <div class="sec-head">
        <span class="sec-kicker">🔤 نقطة البداية</span>
        <h2>الحروف العربية وأصواتها</h2>
        <p>قبل القواعد والإعراب… الحرف. تعلَّم الحروف الـ ٢٨ ومخارجها وصفاتها وأشكالها، مع مقطع يوتيوب لنطق كل حرف.</p>
        <div style="margin-top:18px"><a class="btn btn-solid" href="#/letters">ابدأ من الحروف ←</a></div>
      </div>
      <div class="alpha-strip">
        ${LETTERS.map(L => `<a class="alpha-cell" href="#/letters" data-letter="${L.id}" title="${L.name}">
            <span class="ac-glyph">${L.glyph}</span>
            <span class="ac-name">${L.name}</span>
          </a>`).join("")}
      </div>
      <div class="grid g-3" style="margin-top:34px">
        ${SOUND_GROUPS.slice(0, 3).map(g => `
          <div class="card reveal">
            <div class="sc-head"><span class="sc-ico">${g.icon}</span><h3>${g.title}</h3></div>
            <p class="sc-desc">${g.desc}</p>
            <div class="sc-letters">${g.letters.map(l => `<span class="sc-letter">${l}</span>`).join("")}</div>
          </div>`).join("")}
      </div>
    </div>
  </section>

  <section class="section alt">
    <div class="container">
      <div class="sec-head">
        <span class="sec-kicker">أقسام الموقع</span>
        <h2>كل ما تحتاجه في مكان واحد</h2>
        <p>ستّة أقسام متكاملة تغطّي اللغة العربية من أبسط قاعدة إلى أدقّ إعراب.</p>
      </div>
      <div class="grid g-3">
        ${catCards.map(c => `
          <a class="card reveal" href="${c.href}">
            <div class="card-ico">${c.icon}</div>
            <h3>${c.t}</h3>
            <p>${c.d}</p>
            <span class="card-link">ادخل القسم ←</span>
          </a>`).join("")}
      </div>
    </div>
  </section>

  <section class="section alt">
    <div class="container">
      <div class="sec-head">
        <span class="sec-kicker">تعرَّف سريع</span>
        <h2>أقسام الكلام الثلاثة</h2>
        <p>كل كلمة في العربية تُنتمي إلى أحد ثلاثة أقسام — وهذه أول دروسك.</p>
      </div>
      <div class="grid g-3">
        <div class="card reveal">
          <div class="card-ico">🏷️</div>
          <h3>الاسم</h3>
          <p>كل كلمة دلّت على معنى في نفسها ولم تنضَم إلى زمن.</p>
          <div class="ex-list" style="margin-top:14px">
            <div class="ex"><span class="ex-mark">١</span><span class="ex-text">القَلَمُ</span></div>
            <div class="ex"><span class="ex-mark">٢</span><span class="ex-text">محمدٌ</span></div>
            <div class="ex"><span class="ex-mark">٣</span><span class="ex-text">جميلٌ</span></div>
          </div>
        </div>
        <div class="card reveal">
          <div class="card-ico">⚡</div>
          <h3>الفعل</h3>
          <p>كل كلمة دلّت على معنى وانضمت إلى زمن: ماضٍ أو مضارع أو أمر.</p>
          <div class="ex-list" style="margin-top:14px">
            <div class="ex"><span class="ex-mark">١</span><span class="ex-text">كَتَبَ</span></div>
            <div class="ex"><span class="ex-mark">٢</span><span class="ex-text">يَقرأُ</span></div>
            <div class="ex"><span class="ex-mark">٣</span><span class="ex-text">اُقرَأْ</span></div>
          </div>
        </div>
        <div class="card reveal">
          <div class="card-ico">🧲</div>
          <h3>الحرف</h3>
          <p>كل كلمة دلّت على معنى ولم تنضَم إلى زمن، ولا يتقدّم عليها ما يصلح له.</p>
          <div class="ex-list" style="margin-top:14px">
            <div class="ex"><span class="ex-mark">١</span><span class="ex-text">مِنْ</span></div>
            <div class="ex"><span class="ex-mark">٢</span><span class="ex-text">إلى</span></div>
            <div class="ex"><span class="ex-mark">٣</span><span class="ex-text">لَمْ</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="sec-head">
        <span class="sec-kicker">عيّنة من الإعراب</span>
        <h2>إعراب مُصوَّر بأشجار نحوية</h2>
        <p>كل مثال يأتي بجرفٍ كامل + رسم يوضّح كيف تنقسم الجملة إلى أجزائها.</p>
      </div>
      <div class="irab-grid">
        ${IRAB.slice(0, 3).map(irabCard).join("")}
      </div>
      <div style="text-align:center;margin-top:26px">
        <a href="#/irab" class="btn btn-solid">شاهد كل الأمثلة ←</a>
      </div>
    </div>
  </section>

  <section class="section alt">
    <div class="container">
      <div class="sec-head">
        <span class="sec-kicker">مكتبة الفيديو</span>
        <h2>مقاطع يوتيوب لكل موضوع</h2>
        <p>اضغط أي بطاقة لفتح البحث المصمَّم عنها في يوتيوب، أو الصق رابطًا لمشاهدتها داخل الموقع.</p>
      </div>
      <div class="vid-grid">
        ${VIDEOS.slice(0, 6).map((v, i) => videoCard(v, i)).join("")}
      </div>
      <div style="text-align:center;margin-top:26px">
        <a href="#/videos" class="btn btn-solid">تصفّح المكتبة كاملة ←</a>
      </div>
    </div>
  </section>

  <section class="section" style="padding-bottom:90px">
    <div class="container">
      <div class="card reveal" style="text-align:center;padding:44px 28px;background:linear-gradient(150deg,var(--green-100),var(--gold-100))">
        <div style="font-size:2.4rem;margin-bottom:10px">🔎</div>
        <h3 style="font-family:var(--font-head);font-size:1.7rem;color:var(--green-900);margin:0 0 10px">جاهز للبحث؟</h3>
        <p style="max-width:60ch;margin:0 auto 22px">محرّك البحث يغطّي القواعد والمفردات والمتضادات وأمثلة الإعراب والفيديوهات، ويعرض كل النتائج في قائمة واحدة مع تمييز الكلمة المطلوبة.</p>
        <div class="big-search">
          <input id="homeSearch" type="search" placeholder="مثال: المفعول به، جميل، ضد الفرح، إعراب" aria-label="بحث">
          <button class="qbtn" id="homeSearchGo">بحث</button>
        </div>
        <div class="sugg" style="margin-top:16px">
          ${["المفعول به","كان وأخواتها","جميل","الفرح","إعراب","الشرط","ممنوع من الصرف","النحو"]
            .map(t=>`<button data-s="${esc(t)}">${esc(t)}</button>`).join("")}
        </div>
      </div>
    </div>
  </section>`;

  bindExamples(app);
  bindVideoCards(app);
  revealInit();

  const hs = $("#homeSearch");
  const doGo = () => { const v = hs.value.trim(); if (v) go("#/search?q=" + encodeURIComponent(v)); };
  $("#homeSearchGo").addEventListener("click", doGo);
  hs.addEventListener("keydown", e => { if (e.key === "Enter") doGo(); });
  $$(".sugg button", app).forEach(b => b.addEventListener("click", () => { hs.value = b.dataset.s; doGo(); }));
}

/* ---------------- صفحة القواعد ---------------- */
let grammarFilter = "all", grammarQuery = "";
function viewGrammar() {
  app.innerHTML = `
  <div class="page-head">
    <div class="container">
      <nav class="breadcrumb"><a href="#/home">الرئيسية</a><span class="sep">/</span><span>قواعد النحو والصرف</span></nav>
      <h1>📐 قواعد اللغة العربية</h1>
      <p class="sub">من أقسام الكلام إلى المشتقات والصرف: ${toArabicNum(GRAMMAR.length)} درسًا مرتبة في سبع فئات، مع أمثلة وشروحات مُعرَبة.</p>
    </div>
  </div>
  <div class="container">
    <div class="toolbar">
      <input type="search" id="grammarSearch" placeholder="ابحث في القواعد… مثال: النعت، الظرف، التوكيد" aria-label="بحث في القواعد">
      <div class="tabs" id="grammarTabs">
        ${GRAMMAR_CATS.map(c => `<button class="tab ${c.id === grammarFilter ? "active" : ""}" data-c="${c.id}">${c.icon} ${c.name}${c.id!=="all"?` <span style="opacity:.7">(${toArabicNum(GRAMMAR.filter(g=>g.cat===c.id).length)})</span>`:""}</button>`).join("")}
      </div>
    </div>
    <div class="lessons-grid" id="grammarGrid"></div>
  </div>`;

  const inp = $("#grammarSearch");
  inp.value = grammarQuery;
  const draw = () => {
    grammarQuery = inp.value.trim();
    const list = GRAMMAR.filter(g => {
      if (grammarFilter !== "all" && g.cat !== grammarFilter) return false;
      if (!grammarQuery) return true;
      const t = norm(grammarQuery);
      return norm(g.title + " " + g.summary + " " + stripTags(g.html)).includes(t);
    });
    const grid = $("#grammarGrid");
    if (!list.length) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1">
        <div class="e-ico">🤔</div><h3>لا توجد نتائج</h3>
        <p>لم نعثر على قاعدة تطابق «${esc(grammarQuery)}».</p>
        <button class="btn btn-outline" id="resetG">إعادة ضبط البحث</button></div>`;
      $("#resetG").addEventListener("click", () => { inp.value=""; grammarFilter="all"; syncTabs(); draw(); });
      return;
    }
    grid.innerHTML = list.map(g => `
      <a class="lesson-card" href="#/grammar/${g.id}">
        <div class="lc-top">
          <div class="lc-ico">${g.icon}</div>
          <div><span class="lc-cat">${(GRAMMAR_CATS.find(c=>c.id===g.cat)||{}).name}</span><h3>${g.title}</h3></div>
        </div>
        <div class="lc-body">
          <p>${g.summary}</p>
          <div class="lc-meta">
            <span>📝 ${toArabicNum(g.examples ? g.examples.length : 0)} أمثلة</span>
            <span>🎬 ${toArabicNum((g.videos||[]).length)} فيديو</span>
            <span>🧩 إعراب</span>
          </div>
        </div>
      </a>`).join("");
    revealInit();
  };
  const syncTabs = () => $$("#grammarTabs .tab").forEach(t => t.classList.toggle("active", t.dataset.c === grammarFilter));
  $$("#grammarTabs .tab").forEach(t => t.addEventListener("click", () => { grammarFilter = t.dataset.c; syncTabs(); draw(); }));
  inp.addEventListener("input", debounce(draw, 160));
  draw();
}

/* ---------------- صفحة الدرس ---------------- */
function viewLesson(id) {
  const g = GRAMMAR.find(x => x.id === id);
  if (!g) { viewNotFound("هذا الدرس غير موجود."); return; }

  const prev = GRAMMAR[GRAMMAR.indexOf(g) - 1];
  const next = GRAMMAR[GRAMMAR.indexOf(g) + 1];

  app.innerHTML = `
  <div class="page-head">
    <div class="container">
      <nav class="breadcrumb">
        <a href="#/home">الرئيسية</a><span class="sep">/</span>
        <a href="#/grammar">القواعد</a><span class="sep">/</span>
        <span>${(GRAMMAR_CATS.find(c=>c.id===g.cat)||{}).name}</span>
      </nav>
      <h1>${g.icon} ${g.title}</h1>
      <p class="sub">${g.summary}</p>
    </div>
  </div>

  <div class="container lesson-wrap">
    <aside class="toc">
      <h4>📖 محتويات الدرس</h4>
      <ol id="tocList"></ol>
      <div style="border-top:1px dashed var(--line);margin-top:14px;padding-top:12px">
        <button class="btn btn-outline" style="width:100%;padding:10px 14px;font-size:.86rem" id="printBtn">🖨️ طباعة الدرس</button>
      </div>
    </aside>

    <article class="article" id="article">
      <h2 class="big">${g.icon} ${g.title} <span class="r-badge grammar" style="font-size:.78rem">${(GRAMMAR_CATS.find(c=>c.id===g.cat)||{}).name}</span></h2>
      ${g.html}

      <h3 class="sec" id="exSec">📝 أمثلة تطبيقية</h3>
      <div class="ex-list">
        ${(g.examples||[]).map((e,i) => `
          <div class="ex">
            <span class="ex-mark">${toArabicNum(i+1)}</span>
            <span class="ex-text">${e.text}</span>
            <span class="ex-note">${e.note||""}</span>
            <span class="ex-actions">
              <button class="mini-btn js-speak" data-t="${esc(e.text)}" title="استمع" aria-label="استمع">${ICO.sound}</button>
              <button class="mini-btn js-copy" data-t="${esc(e.text)}" title="نسخ" aria-label="نسخ">${ICO.copy}</button>
            </span>
          </div>`).join("")}
      </div>

      <div class="note gold"><span class="n-ico">🔑</span><div class="n-body"><h5>خلاصة الدرس</h5>
        <p>${g.summary} راجع الأمثلة أعلاه ثم انتقل إلى الفيديوهات المرتبطة بالدرس.</p></div></div>

      <h3 class="sec" id="vidSec">🎬 فيديوهات مرتبطة</h3>
      <div class="grid g-2" id="lessonVids"></div>

      <div class="sec" id="imgSec" style="display:none">🖼️ صور مرتبطة بهذه القاعدة</div>
      <div class="lesson-imgs" id="lessonImgs"></div>

      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:34px;border-top:1px solid var(--line);padding-top:24px">
        ${prev ? `<a class="btn btn-outline" href="#/grammar/${prev.id}">→ ${prev.title}</a>` : `<span></span>`}
        ${next ? `<a class="btn btn-outline" href="#/grammar/${next.id}">${next.title} ←</a>` : `<span></span>`}
      </div>
    </article>
  </div>`;

  // توليد الفهرس
  const heads = $$("#article h3.sec");
  $("#tocList").innerHTML = heads.map((h, i) => `<li><a href="#${h.id}" data-t="${h.id}">${h.textContent}</a></li>`).join("");

  // فيديوهات الدرس + فيديوهات ذات صلة من المكتبة
  const rel = VIDEOS.map((v, i) => ({ v, i })).filter(({ v }) => {
    const t = norm(g.title + " " + g.summary);
    return norm(v.title + " " + v.desc + " " + v.q).split(" ").some(w => w.length > 3 && t.includes(w));
  }).slice(0, 3);

  const cards = [];
  (g.videos || []).forEach((v, j) => {
    const yt = ytInfo(`g_${g.id}_${j}`);
    cards.push({
      title: (yt && yt.title) || v.title,
      desc: v.title === ((yt && yt.title) || v.title) ? "مقطع تعليمي مرتبط بهذا الدرس" : v.title,
      dur: (yt && yt.dur) || "",
      q: v.q, id: yt ? yt.id : "",
    });
  });
  rel.forEach(({ v, i }) => {
    const yt = ytInfo("v" + i);
    cards.push({ title: (yt && yt.title) || v.title, desc: v.desc, dur: (yt && yt.dur) || v.dur, q: v.q, id: yt ? yt.id : "" });
  });

  $("#lessonVids").innerHTML = cards.length ? cards.map(v => `
    <div class="vcard-vid js-vq" data-q="${esc(v.q)}" data-title="${esc(v.title)}"
         data-desc="${esc(v.desc)}" data-id="${esc(v.id || "")}" data-dur="${esc(v.dur)}">
      <div class="vthumb"><span class="play">${ICO.play}</span><span class="vlabel">يوتيوب</span><span class="vdur">${v.dur}</span></div>
      <div class="vbody"><h3>${v.title}</h3><p>${v.desc}</p>
        <div class="vfoot"><span>اضغط للمشاهدة</span><span class="vwatch">▸ يوتيوب</span></div></div>
    </div>`).join("") : `<div class="empty"><p>لا توجد فيديوهات مرتبطة.</p></div>`;

  bindExamples(app);
  bindVideoCards(app);
  revealInit();
  $("#printBtn").addEventListener("click", () => window.print());

  /* الصور المرتبطة بهذه القاعدة */
  const imgs = ImageStore.byLesson(g.id);
  const imgWrap = $("#lessonImgs"), imgHead = $("#imgSec");
  if (imgs.length) {
    imgHead.style.display = "";
    imgWrap.innerHTML = imgs.map(it => `
      <figure class="img-card sm">
        <div class="ic-thumb"><img src="${it.src}" alt="${esc(it.caption || "صورة")}" loading="lazy"></div>
        <figcaption>${esc(it.caption || "صورة توضيحية")}</figcaption>
      </figure>`).join("");
  }

  // تتبّع الفهرس
  const links = $$("#tocList a");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(l => l.classList.toggle("active", l.dataset.t === en.target.id));
      }
    });
  }, { rootMargin:"-25% 0px -65% 0px" });
  heads.forEach(h => observer.observe(h));
}

/* ---------------- المفردات ---------------- */
let vocabFilter = "all", vocabQuery = "";
function viewVocab() {
  app.innerHTML = `
  <div class="page-head">
    <div class="container">
      <nav class="breadcrumb"><a href="#/home">الرئيسية</a><span class="sep">/</span><span>بنك المفردات</span></nav>
      <h1>🗂️ بنك المفردات</h1>
      <p class="sub">${toArabicNum(VOCAB.length)} مفردة بمعناها وجذرها ونمونج من الاستعمال، مع أزواج المترادفات والمتضادات لكل كلمة.</p>
    </div>
  </div>
  <div class="container">
    <div class="toolbar">
      <input type="search" id="vocabSearch" placeholder="ابحث عن كلمة أو معنى… مثال: شهر، قلم، فرح" aria-label="بحث في المفردات">
      <div class="tabs" id="vocabTabs">
        ${VOCAB_CATS.map(c => `<button class="tab ${c.id===vocabFilter?"active":""}" data-c="${c.id}">${c.icon} ${c.name}${c.id!=="all"?` <span style="opacity:.7">(${toArabicNum(VOCAB.filter(v=>v.cat===c.id).length)})</span>`:""}</button>`).join("")}
      </div>
    </div>
    <div class="vocab-grid" id="vocabGrid"></div>
  </div>`;

  const inp = $("#vocabSearch");
  inp.value = vocabQuery;
  const syncTabs = () => $$("#vocabTabs .tab").forEach(t => t.classList.toggle("active", t.dataset.c === vocabFilter));
  const draw = () => {
    vocabQuery = inp.value.trim();
    const list = VOCAB.filter(v => {
      if (vocabFilter !== "all" && v.cat !== vocabFilter) return false;
      if (!vocabQuery) return true;
      const t = norm(vocabQuery);
      return norm([v.word, v.meaning, v.sentence, v.root, (v.syn||[]).join(" "), (v.ant||[]).join(" ")].join(" ")).includes(t);
    });
    const grid = $("#vocabGrid");
    if (!list.length) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="e-ico">🔍</div>
        <h3>لا توجد مفردات</h3><p>لا توجد نتائج تطابق «${esc(vocabQuery)}».</p>
        <button class="btn btn-outline" id="resetV">إعادة ضبط</button></div>`;
      $("#resetV").addEventListener("click", () => { inp.value=""; vocabFilter="all"; syncTabs(); draw(); });
      return;
    }
    grid.innerHTML = list.map(v => `
      <div class="vcard">
        <div class="vtop">
          <span class="vword">${v.word}</span>
          <span class="vcat">${(VOCAB_CATS.find(c=>c.id===v.cat)||{}).name}</span>
        </div>
        <div class="vmean">${v.meaning}</div>
        ${v.root ? `<div class="vroot">الجذر: ${v.root}</div>` : ""}
        <div class="vsent">${v.sentence}</div>
        <div class="vtags">
          ${(v.syn||[]).map(s=>`<span class="vtag syn">↔ مترادف: ${s}</span>`).join("")}
          ${(v.ant||[]).map(a=>`<span class="vtag ant">✕ ضد: ${a}</span>`).join("")}
        </div>
        <div class="ex-actions" style="margin-top:12px;gap:8px">
          <button class="mini-btn js-speak" data-t="${esc(v.sentence)}" title="استمع">${ICO.sound}</button>
          <button class="mini-btn js-copy" data-t="${esc(v.word + " — " + v.meaning)}" title="نسخ">${ICO.copy}</button>
          <button class="mini-btn js-vq" data-q="${esc(v.word + " معنى")}" data-title="${esc(v.word)}" title="فيديو">${ICO.play}</button>
        </div>
      </div>`).join("");
    bindExamples(grid);
    bindVideoCards(grid);
  };
  $$("#vocabTabs .tab").forEach(t => t.addEventListener("click", () => { vocabFilter = t.dataset.c; syncTabs(); draw(); }));
  inp.addEventListener("input", debounce(draw, 150));
  draw();
}

/* ---------------- الضد والعكس ---------------- */
let synFilter = "all", synQuery = "";
function viewSynonyms() {
  app.innerHTML = `
  <div class="page-head">
    <div class="container">
      <nav class="breadcrumb"><a href="#/home">الرئيسية</a><span class="sep">/</span><span>الضد والعكس</span></nav>
      <h1>⚖️ المترادفات والمتضادات</h1>
      <p class="sub">${toArabicNum(SYN_PAIRS.length)} زوجًا متقاربًا في المعنى، و${toArabicNum(ANT_PAIRS.length)} زوجًا متضادًا، مع نموذج يوضح الاستعمال.</p>
    </div>
  </div>
  <div class="container">
    <div class="toolbar">
      <input type="search" id="synSearch" placeholder="ابحث عن كلمة… مثال: الفرح، الصدق، النور" aria-label="بحث في الضد والعكس">
      <div class="tabs" id="synTabs">
        <button class="tab ${synFilter==="all"?"active":""}" data-c="all">🗂️ الكل</button>
        <button class="tab ${synFilter==="syn"?"active":""}" data-c="syn">🤝 المترادفات (${toArabicNum(SYN_PAIRS.length)})</button>
        <button class="tab ${synFilter==="ant"?"active":""}" data-c="ant">⚖️ المتضادات (${toArabicNum(ANT_PAIRS.length)})</button>
      </div>
    </div>
    <div class="syn-grid" id="synGrid"></div>
  </div>`;

  const inp = $("#synSearch");
  inp.value = synQuery;
  const syncTabs = () => $$("#synTabs .tab").forEach(t => t.classList.toggle("active", t.dataset.c === synFilter));
  const draw = () => {
    synQuery = inp.value.trim();
    const t = norm(synQuery);
    let cards = [];
    if (synFilter === "all" || synFilter === "syn") {
      SYN_PAIRS.forEach(p => { if (!t || norm(p.a + " " + p.b + " " + p.sentence).includes(t)) cards.push({ kind:"syn", ...p }); });
    }
    if (synFilter === "all" || synFilter === "ant") {
      ANT_PAIRS.forEach(p => { if (!t || norm(p.a + " " + p.b + " " + p.sentence).includes(t)) cards.push({ kind:"ant", ...p }); });
    }
    const grid = $("#synGrid");
    if (!cards.length) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="e-ico">⚖️</div>
        <h3>لا توجد نتائج</h3><p>لم نجد زوجًا يطابق «${esc(synQuery)}».</p>
        <button class="btn btn-outline" id="resetS">إعادة ضبط</button></div>`;
      $("#resetS").addEventListener("click", () => { inp.value=""; synFilter="all"; syncTabs(); draw(); });
      return;
    }
    grid.innerHTML = cards.map(c => `
      <div class="pair-card">
        <div class="pair-head ${c.kind}">
          ${c.kind === "syn" ? "🤝 مترادف" : "⚖️ ضدّ"}
          <span style="margin-inline-start:auto;opacity:.75">${c.kind==="syn"?"=":"✕"}</span>
        </div>
        <div class="pair-body">
          <div class="pair-w"><b>${c.a}</b><small>الكلمة الأولى</small></div>
          <div class="pair-op ${c.kind}">${c.kind === "syn" ? "=" : "✕"}</div>
          <div class="pair-w"><b>${c.b}</b><small>${c.kind === "syn" ? "مرادفها" : "عكسها"}</small></div>
        </div>
        <div class="pair-sent">${c.sentence}</div>
        <div style="padding:0 18px 16px;display:flex;gap:8px;justify-content:center">
          <button class="mini-btn js-speak" data-t="${esc(c.sentence)}" title="استمع">${ICO.sound}</button>
          <button class="mini-btn js-copy" data-t="${esc(c.a + (c.kind === "syn" ? " — مترادفها " : " — ضدها ") + c.b)}" title="نسخ">${ICO.copy}</button>
          <button class="mini-btn js-vq" data-q="${esc(c.a + " " + c.b)}" data-title="${esc(c.a + " / " + c.b)}" title="فيديو">${ICO.play}</button>
        </div>
      </div>`).join("");
    bindExamples(grid);
    bindVideoCards(grid);
  };
  $$("#synTabs .tab").forEach(b => b.addEventListener("click", () => { synFilter = b.dataset.c; syncTabs(); draw(); }));
  inp.addEventListener("input", debounce(draw, 150));
  draw();
}

/* ---------------- الإعراب ---------------- */
function ytIdForTitle(title) {
  const want = norm(title);
  let best = null, bs = 0;
  VIDEOS.forEach((v, i) => {
    const t = norm(v.title + " " + v.desc);
    let sc = 0;
    want.split(" ").forEach(w => { if (w.length > 2 && t.includes(w)) sc += 10; });
    if (sc > bs) { bs = sc; best = ytInfo("v" + i); }
  });
  return bs >= 20 ? best : null;
}

/* بطاقة فيديو مرتبطة بحل الإعراب */
function relatedVideoHTML(yt, q, label) {
  if (!yt) return "";
  return `<div class="irab-related js-vq" data-q="${esc(q || yt.title)}" data-title="${esc(label || yt.title)}"
      data-desc="${esc(label || yt.title)}" data-id="${esc(yt.id)}" data-dur="${esc(yt.dur || "")}">
      <span class="ir-rel-thumb"><img src="${thumbUrl(yt.id)}" alt="" loading="lazy"
        onerror="this.parentNode.classList.add('noimg')"><span class="mv-play">▶</span></span>
      <span class="ir-rel-body">
        <small>🎬 مقطع يشرح المطلوب</small>
        <b>${esc(yt.title)}</b>
        <span class="ir-rel-dur">يوتيوب${yt.dur ? " · " + esc(yt.dur) : ""} — اضغط للمشاهدة</span>
      </span>
    </div>`;
}

function irabCard(x) {
  const yt = x.yt ? ytInfo(x.yt) : ytIdForTitle(x.videos[0] ? x.videos[0].title : x.type);
  const vq = x.videos[0] ? x.videos[0].q : ("إعراب " + x.sentence);
  return `
  <div class="irab-card">
    <div class="irab-visual">
      ${renderTree(x.tree)}
      <span class="irab-caption">${x.caption}</span>
    </div>
    <div class="irab-content">
      <div class="irab-sent">${x.sentence}</div>
      <div class="irab-rows">
        ${x.words.map(w => `<div class="irab-row"><span class="rw">${w.w}</span><span class="ri">${w.i}</span></div>`).join("")}
      </div>
      <div class="irab-note">📌 ${x.note}</div>
      ${relatedVideoHTML(yt, vq, "إعراب " + x.sentence)}
      <div class="irab-actions">
        <button class="mini-btn js-speak" data-t="${esc(x.sentence)}" title="استمع">${ICO.sound}</button>
        <button class="mini-btn js-copy" data-t="${esc(x.sentence + "\n" + x.words.map(w => w.w + ": " + w.i).join("\n"))}" title="نسخ الإعراب">${ICO.copy}</button>
        <button class="mini-btn js-vq" data-q="${esc(vq)}" data-title="${esc(x.sentence)}"
          data-desc="شرح إعراب هذه الجملة" data-id="${yt ? yt.id : ""}" title="فيديو">${ICO.play}</button>
      </div>
    </div>
  </div>`;
}

/* ---------- محرّك «أعرب جملة» ---------- */
function arabSentence(text) {
  const q = norm(text);
  if (!q) return null;
  const words = q.split(" ").filter(w => w.length > 1);

  const exact = IRAB.find(x => norm(x.sentence) === q);
  if (exact) return { kind:"exact", irab:exact };

  let best = null, bs = 0;
  IRAB.forEach(x => {
    const h = norm(x.sentence);
    let sc = 0;
    words.forEach(w => { if (h.includes(w)) sc += 1; });
    const ratio = sc / Math.max(words.length, 1);
    if (ratio > bs) { bs = ratio; best = x; }
  });
  if (best && bs >= 0.5) return { kind:"near", irab:best, score:bs };

  const rules = GRAMMAR.map(g => {
    const h = norm(g.title + " " + g.summary + " " + stripTags(g.html));
    let sc = 0;
    words.forEach(w => { if (w.length > 2 && h.includes(w)) sc += 1; });
    return { g, sc };
  });

  // استنتاج نوع الجملة من الفعل المستخدم في أوّلها
  const first = words[0] || "";
  const VERBS = ["ذهب","ذهبت","ذهبوا","جاء","جاءت","جاءوا","كتب","كتبت","كتبوا","قرأ","قرأت","قرأوا","شرب","شربت","شربوا",
    "أكل","أكلت","أكلوا","ركب","ركبت","ركبوا","نظر","نظرت","نظروا","سمع","سمعت","سمعوا","فعل","فعلت","فعلوا","أخذ","أخذت","أخذوا",
    "أعطى","أعطت","أعطوا","سافر","سافر","سافروا","جلس","جلست","جلسوا","وقف","وقف","وقفت","نام","نامت","ناموا","خرج","خرجت","خرجوا",
    "شرح","شرح","شرح","سأل","سأل","سأل","عرف","عرف","عرف","لعب","لعبت","لعبوا","عمل","عمل","عمل","حفظ","حفظ","حفظ",
    "زرع","زرع","زرع","سقيا","سقى","قطع","قطع","قطر","قطر","لقط","لقط","نبت","نبت","حصد","حصد","غرس","غرس","بذر","بذر"];
  const startsWithVerb = VERBS.some(v => first === norm(v));
  if (startsWithVerb) {
    ["jumla-fiiliya", "maf'ool", "fail", "irab-maf'ool"].forEach(id => {
      const hit = rules.find(r => r.g.id === id);
      if (hit) hit.sc += 6;
    });
  }
  const top = rules.filter(x => x.sc > 0).sort((a, b) => b.sc - a.sc).slice(0, 3).map(x => x.g);

  const vids = VIDEOS.map((v, i) => {
    const hay = norm(v.title + " " + v.desc + " " + v.q);
    let sc = 0;
    words.forEach(w => { if (w.length > 2 && hay.includes(w)) sc += 10; });
    return { v, i, sc };
  }).filter(x => x.sc > 0).sort((a, b) => b.sc - a.sc).slice(0, 3);

  // مقاطع عامة للإعراب تُعرض دائمًا عند عدم وجود تطابق
  if (vids.length < 3) {
    ["v28", "v34", "v35"].forEach(k => {
      const y = ytInfo(k);
      if (!y) return;
      const idx = VIDEOS.findIndex((v, i) => { const z = ytInfo("v" + i); return z && z.id === y.id; });
      if (idx >= 0 && !vids.some(x => x.i === idx)) vids.push({ v: VIDEOS[idx], i: idx, sc: 0 });
    });
  }

  /* --- المحرك الآلي: حلٌّ كامل للجملة --- */
  const auto = analyzeArabic(text);
  return { kind:"none", rules: top, vids, words, auto };
}

/* ربط قواعد الإعراب بالمقاطع المناسبة */
const RULE_VIDEOS = {
  "jumla-ismiya":  ["المبتدأ والخبر وأحوالهما","إعراب الجملة الاسمية كاملة"],
  "mubtada-khabar": ["المبتدأ والخبر وأحوالهما"],
  "naasikh":        ["كان وأخواتها","إنّ وأخواتها"],
  "jumla-fiiliya":  ["إعراب الجملة الفعلية كاملة","أساسيات الإعراب من الصفر"],
  "fail":           ["الفاعل والضمير المستتر","أساسيات الإعراب من الصفر"],
  "maf'ool":        ["المفعول به وأنواعه","أساسيات الإعراب من الصفر"],
  "hal":            ["الحال وأنواعها"],
  "na't":           ["النعت الحقيقي والسبي"],
  "badal":          ["البدل وأنواعه الخمسة"],
  "tawkid":         ["التوكيد اللفظي والمعنوي"],
  "atraf":          ["حروف العطف"],
  "idafa":          ["الإضافة"],
  "zuroof":         ["الظروف وأنواعها"],
  "adad":           ["العدد"],
  "harf-jarr":      ["حروف الجر"],
  "aslub":          ["أسلوب النداء","أسلوب الشرط"],
  "mamnu'":         ["إعراب الممنوع من الصرف"],
  "mabniyat":       ["المرفوعات والمنصوبات والمجرورات - تأسيس"],
  "mushtaqqat":     ["إعراب المشتقات: اسم الفاعل والمفعول"],
  "hamz-wasl":      ["الفرق بين همزة الوصل وهمزة القطع"],
  "maqsu":          ["الاسم المقصور والمنقوص والممدود"],
  "harakat":        ["أساسيات الإعراب من الصفر"],
  "misdar":         ["المصدر وأنواعه"],
  "sharth":         ["أخطاء شائعة في الإعراب"],
  "shajarah":       ["شجرة نحوية: كيف تُحلّل الجملة"],
};

function videosForRules(ruleIds, limit) {
  const out = [], seen = {};
  const add = (title) => {
    const idx = VIDEOS.findIndex(v => v.title === title);
    if (idx < 0) return;
    const y = ytInfo("v" + idx);
    if (!y || !y.id || seen[y.id]) return;
    seen[y.id] = 1;
    out.push({ id:y.id, title:y.title, dur:y.dur, q:VIDEOS[idx].q });
  };
  (ruleIds || []).forEach(r => (RULE_VIDEOS[r] || []).forEach(add));
  return out.slice(0, limit || 3);
}

/* عرض تحليل المحرّك الآلي */
function autoResultHTML(auto) {
  if (!auto) return "";
  const rows = auto.words.map(x => `
    <div class="ar-wrow">
      <span class="aw-w">${esc(x.w)}</span>
      <span class="aw-kind">${esc(x.kindLabel || "")}</span>
      <span class="aw-role">${esc(x.role || "")}</span>
      <span class="aw-irab">${esc(x.irab || "")}</span>
    </div>`).join("");

  const vids = videosForRules(auto.rules, 3);
  const lessons = auto.rules.map(id => GRAMMAR.find(g => g.id === id)).filter(Boolean);

  return `<div class="auto-box">
    <div class="auto-head">
      <span class="auto-badge">🤖 التحليل الآلي</span>
      <span class="auto-type">${esc(auto.type)}</span>
      <span class="auto-kind">${esc(auto.kind)}</span>
    </div>
    <div class="ar-wrows">${rows}</div>
    ${auto.notes && auto.notes.length ? `<div class="auto-notes">${auto.notes.map(n => `<p>💡 ${esc(n)}</p>`).join("")}</div>` : ""}
    ${lessons.length ? `<div class="auto-lessons">
        <h5>📖 القواعد المطبَّقة</h5>
        ${lessons.map(g => `<a class="ar-rule" href="#/grammar/${g.id}"><b>${esc(g.title)}</b><span>${esc(g.summary)}</span></a>`).join("")}
      </div>` : ""}
    ${vids.length ? `<div class="ac-vids" style="margin-top:16px">
        <h5>🎬 مقاطع يوتيوب تشرح الحل</h5>
        <div class="vid-strip">${vids.map(v => stripVideoHTML(v)).join("")}</div>
      </div>` : ""}
    <p class="auto-disclaimer">⚠️ هذا تحليل آلي مبني على قواعد النحو؛ راجعه مع معلّمك أو مع المقطع المرفق للتأكد.</p>
  </div>`;
}

function arabResultHTML(res, text) {
  if (!res) return "";
  if (res.kind === "exact" || res.kind === "near") {
    const x = res.irab;
    const yt = x.yt ? ytInfo(x.yt) : ytIdForTitle(x.videos[0] ? x.videos[0].title : x.type);
    const vq = x.videos[0] ? x.videos[0].q : ("إعراب " + x.sentence);
    return `<div class="arab-result ok">
      <div class="ar-head">
        <span class="ar-badge">${res.kind === "exact" ? "✅ إعراب الجملة" : "🔎 أقرب مثال في القاعدة"}</span>
        <span class="ar-note">${res.kind === "exact" ? "مطابقة تامة" : "لم تُوجد جملة مطابقة تمامًا، وهذا أقرب مثال"}</span>
      </div>
      <div class="ar-sent">${x.sentence}</div>
      <div class="ar-tree">${renderTree(x.tree)}</div>
      <div class="ar-rows">
        ${x.words.map(w => `<div class="irab-row"><span class="rw">${w.w}</span><span class="ri">${w.i}</span></div>`).join("")}
      </div>
      <div class="irab-note">📌 ${x.note}</div>
      ${relatedVideoHTML(yt, vq, "إعراب " + x.sentence)}
      <div class="ar-actions">
        <button class="btn btn-outline btn-xs js-speak" data-t="${esc(x.sentence)}">🔊 استمع</button>
        <button class="btn btn-outline btn-xs js-copy" data-t="${esc(x.sentence + "\n" + x.words.map(w => w.w + ": " + w.i).join("\n"))}">📋 نسخ</button>
        <a class="btn btn-solid btn-xs" href="#/irab">عرض كل الأمثلة</a>
      </div>
    </div>`;
  }

  return `<div class="arab-result miss">
    <div class="ar-head">
      <span class="ar-badge warn">🤖 حلٌّ آلي للجملة</span>
      <span class="ar-note">الجملة غير مسجَّلة في الأمثلة، لكن المحرّك حلّلها بقواعد النحو</span>
    </div>
    ${autoResultHTML(res.auto)}
    ${res.rules.length ? `<div class="ar-rules" style="margin-top:18px">
      <h5>📖 قواعد أخرى قد تحتاجها</h5>
      ${res.rules.map(g => `<a class="ar-rule" href="#/grammar/${g.id}">
          <b>${g.title}</b><span>${g.summary}</span>
          <span class="ar-rule-go">افتح الدرس ←</span></a>`).join("")}
    </div>` : ""}
    <div class="ac-vids" style="margin-top:18px">
      <h5>🎬 مقاطع يوتيوب إضافية</h5>
      <div class="vid-strip">
        ${res.vids.map(({ v, i }) => { const y = ytInfo("v" + i); return y ? stripVideoHTML({ id:y.id, title:y.title, dur:y.dur, q:v.q }) : ""; }).join("")}
        ${stripVideoHTML({ id:null, title:"ابحث في يوتيوب عن: " + text, dur:"فتح نتائج يوتيوب", q:text })}
      </div>
    </div>
  </div>`;
}

let irabFilter = "all";
function viewIrab() {
  app.innerHTML = `
  <div class="page-head">
    <div class="container">
      <nav class="breadcrumb"><a href="#/home">الرئيسية</a><span class="sep">/</span><span>الإعراب</span></nav>
      <h1>🧩 الإعراب المُصوَّر</h1>
      <p class="sub">${toArabicNum(IRAB.length)} مثالاً كاملًا: جملة + إعراب كل كلمة + رسم شجرة نحوية يوضّح البنية + زر الاستماع والنسخ والفيديو.</p>
    </div>
  </div>
  <div class="container">
    <div class="arab-tool">
      <div class="at-head">
        <div class="at-title">
          <span class="at-ico">🧩</span>
          <div>
            <h2>أعرِب جملة</h2>
            <p>اكتب الجملة، فيعطيك الموقع <b>الحلَّ الكامل</b> (إعراب كل كلمة + شجرة نحوية) ومعه <b>مقطع يوتيوب</b> يشرح المطلوب.</p>
          </div>
        </div>
      </div>
      <div class="at-form">
        <input type="text" id="arabInput" placeholder="اكتب الجملة هنا… مثال: كان الجوُّ جميلًا" aria-label="اكتب الجملة لإعرابها">
        <button class="qbtn" id="arabBtn">🔍 أعرب</button>
      </div>
      <div class="at-sugg" id="arabSugg"></div>
      <div id="arabOut"></div>
    </div>

    <div class="toolbar">
      <input type="search" id="irabSearch" placeholder="ابحث في الأمثلة… مثال: مسرعين، خبر إنّ، حال" aria-label="بحث في الإعراب">
      <div class="tabs" id="irabTabs">
        <button class="tab ${irabFilter==="all"?"active":""}" data-c="all">🗂️ كل الأمثلة</button>
        ${[...new Set(IRAB.map(x=>x.type))].map(t => `<button class="tab ${irabFilter===t?"active":""}" data-c="${t}">${t}</button>`).join("")}
      </div>
    </div>
    <div class="irab-grid" id="irabGrid"></div>
  </div>`;

  const inp = $("#irabSearch");
  const syncTabs = () => $$("#irabTabs .tab").forEach(t => t.classList.toggle("active", t.dataset.c === irabFilter));
  const draw = () => {
    const t = norm(inp.value.trim());
    const list = IRAB.filter(x => {
      if (irabFilter !== "all" && x.type !== irabFilter) return false;
      if (!t) return true;
      return norm(x.sentence + " " + x.type + " " + x.note + " " + x.words.map(w=>w.w+" "+w.i).join(" ")).includes(t);
    });
    const grid = $("#irabGrid");
    if (!list.length) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="e-ico">🧩</div>
        <h3>لا توجد نتائج</h3><p>لم نجد مثالًا يطابق «${esc(inp.value)}».</p></div>`;
      return;
    }
    grid.innerHTML = list.map(irabCard).join("");
    bindExamples(grid);
    bindVideoCards(grid);
  };
  $$("#irabTabs .tab").forEach(b => b.addEventListener("click", () => { irabFilter = b.dataset.c; syncTabs(); draw(); }));
  inp.addEventListener("input", debounce(draw, 150));
  draw();

  /* ---------- أداة «أعرب جملة» ---------- */
  const arabIn = $("#arabInput"), arabOut = $("#arabOut");
  const samples = IRAB.slice(0, 4).map(x => x.sentence);
  $("#arabSugg").innerHTML = `<span>جرّب:</span>` +
    samples.map(s => `<button data-s="${esc(s)}">${esc(s)}</button>`).join("") +
    `<button data-s="سافر الطالبُ إلى المدينةِ">سافر الطالبُ إلى المدينةِ</button>`;

  const runArab = () => {
    const txt = arabIn.value.trim();
    if (!txt) { toast("اكتب جملة أولًا"); return; }
    const res = arabSentence(txt);
    arabOut.innerHTML = arabResultHTML(res, txt);
    bindExamples(arabOut);
    bindVideoCards(arabOut);
    wireVideoButtons(arabOut);
    $$("#arabSugg button").forEach(b => b.addEventListener("click", () => {
      arabIn.value = b.dataset.s; runArab();
    }));
    arabOut.scrollIntoView({ behavior:"smooth", block:"center" });
  };
  $("#arabBtn").addEventListener("click", runArab);
  arabIn.addEventListener("keydown", e => { if (e.key === "Enter") runArab(); });
  $$("#arabSugg button").forEach(b => b.addEventListener("click", () => {
    arabIn.value = b.dataset.s; runArab();
  }));
}

/* ---------------- الفيديو ---------------- */
function videoCard(v, i) {
  const yt = ytInfo("v" + i);
  const dur = (yt && yt.dur) || v.dur;
  const real = (yt && yt.title) || v.title;
  return `
  <div class="vcard-vid js-vq" data-q="${esc(v.q)}" data-title="${esc(real)}"
       data-desc="${esc(v.desc)}" data-id="${yt ? yt.id : ""}" data-dur="${esc(dur)}">
    <div class="vthumb">
      <span class="play">${ICO.play}</span>
      <span class="vlabel">${(VIDEO_CATS.find(c=>c.id===v.cat)||{}).name || "فيديو"}</span>
      <span class="vdur">${dur}</span>
    </div>
    <div class="vbody">
      <h3>${real}</h3>
      <p>${v.desc}</p>
      <div class="vfoot"><span>${ICO.ext} يُعرض داخل الموقع</span><span class="vwatch">▸ شاهد</span></div>
    </div>
  </div>`;
}

let videoFilter = "all", videoQuery = "";
function viewVideos() {
  app.innerHTML = `
  <div class="page-head">
    <div class="container">
      <nav class="breadcrumb"><a href="#/home">الرئيسية</a><span class="sep">/</span><span>فيديوهات يوتيوب</span></nav>
      <h1>🎬 مكتبة الفيديو</h1>
      <p class="sub">${toArabicNum(VIDEOS.length)} مقطعًا تعليميًا في ${toArabicNum(VIDEO_CATS.length-1)} تصنيفات. اضغط أي بطاقة لفتح بحث يوتيوب المصمَّم عنها، أو الصق رابط فيديو في المشغّل لمشاهدته داخل الموقع.</p>
      <div style="margin-top:18px"><button class="btn btn-gold" id="openPlayer">▶ افتح مشغّل الفيديو</button></div>
    </div>
  </div>
  <div class="container">
    <div class="toolbar">
      <input type="search" id="videoSearch" placeholder="ابحث عن فيديو… مثال: النحو، الإعراب، الصرف" aria-label="بحث في الفيديو">
      <div class="tabs" id="videoTabs">
        ${VIDEO_CATS.map(c => `<button class="tab ${c.id===videoFilter?"active":""}" data-c="${c.id}">${c.icon} ${c.name}${c.id!=="all"?` <span style="opacity:.7">(${toArabicNum(VIDEOS.filter(v=>v.cat===c.id).length)})</span>`:""}</button>`).join("")}
      </div>
    </div>
    <div class="vid-grid" id="videoGrid"></div>
  </div>`;

  const inp = $("#videoSearch");
  inp.value = videoQuery;
  const syncTabs = () => $$("#videoTabs .tab").forEach(t => t.classList.toggle("active", t.dataset.c === videoFilter));
  const draw = () => {
    videoQuery = inp.value.trim();
    const t = norm(videoQuery);
    const list = VIDEOS.map((v, i) => ({ v, i })).filter(({ v }) => {
      if (videoFilter !== "all" && v.cat !== videoFilter) return false;
      if (!t) return true;
      return norm(v.title + " " + v.desc + " " + v.q).includes(t);
    });
    const grid = $("#videoGrid");
    if (!list.length) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="e-ico">🎬</div>
        <h3>لا توجد مقاطع</h3><p>لم نجد فيديو يطابق «${esc(videoQuery)}».</p>
        <button class="btn btn-outline" id="resetVid">إعادة ضبط</button></div>`;
      $("#resetVid").addEventListener("click", () => { inp.value=""; videoFilter="all"; syncTabs(); draw(); });
      return;
    }
    grid.innerHTML = list.map(({ v, i }) => videoCard(v, i)).join("");
    bindVideoCards(grid);
  };
  $$("#videoTabs .tab").forEach(b => b.addEventListener("click", () => { videoFilter = b.dataset.c; syncTabs(); draw(); }));
  inp.addEventListener("input", debounce(draw, 150));
  $("#openPlayer").addEventListener("click", () => {
    const first = VIDEOS.map((v, i) => ({ v, i })).find(({ v }) => videoFilter === "all" || v.cat === videoFilter) || { v: VIDEOS[0], i: 0 };
    const yt = ytInfo("v" + first.i);
    openVideo({
      title: (yt && yt.title) || first.v.title,
      sub: "مقطع تعليمي من يوتيوب" + (yt && yt.dur ? " · المدة: " + yt.dur : ""),
      videoId: yt ? yt.id : null,
      query: first.v.q,
      suggest: VIDEOS.slice(0, 5).map(v => v.title),
    });
  });
  draw();
}

/* ---------------- صفحة البحث ---------------- */
let pageQuery = "";
function viewSearch(q) {
  if (q != null) pageQuery = q;
  app.innerHTML = `
  <section class="search-hero">
    <div class="container">
      <span class="sec-kicker">🔍 البحث الشامل</span>
      <h1 style="font-family:var(--font-head);font-size:clamp(1.7rem,3.4vw,2.6rem);color:var(--green-900);margin:8px 0 4px">ابحث في كل شيء</h1>
      <p style="color:var(--ink-soft);margin:0">القواعد، المفردات، المترادفات والمتضادات، الأمثلة المُعرَبة، والفيديوهات — كلها في نتيجة واحدة.</p>
      <div class="big-search">
        <input id="pageSearch" type="search" value="${esc(pageQuery)}" placeholder="اكتب كلمة للبحث…" aria-label="بحث">
        <button class="qbtn" id="pageSearchGo">بحث</button>
      </div>
      <div class="sugg" style="margin-top:16px">
        ${["المفعول به","الحال","جميل","الفرح","مكرر","إعراب","كان","الممنوع من الصرف","الصرف","الشرط"]
          .map(t=>`<button data-s="${esc(t)}">${esc(t)}</button>`).join("")}
      </div>
    </div>
  </section>
  <div class="container results">
    <div class="res-count" id="resCount"></div>
    <div class="res-list" id="resList"></div>
  </div>`;

  const inp = $("#pageSearch");
  const draw = () => {
    pageQuery = inp.value.trim();
    const list = searchAll(pageQuery, "all");
    const count = $("#resCount"), box = $("#resList");
    if (!pageQuery) {
      count.innerHTML = `ابدأ بكتابة كلمة للبحث في <b>${toArabicNum(INDEX.length)}</b> عنصرًا من محتوى الموقع.`;
      box.innerHTML = `<div class="empty"><div class="e-ico">🔎</div><h3>محرّك البحث جاهز</h3>
        <p>جرّب أحد الاقتراحات أعلاه، أو اكتب ما تبحث عنه.</p></div>`;
      return;
    }
    if (!list.length) {
      count.innerHTML = `لا نتائج لـ <b>${esc(pageQuery)}</b>`;
      box.innerHTML = `<div class="empty"><div class="e-ico">😕</div><h3>لا توجد نتائج</h3>
        <p>لم نعثر على نتائج لـ «${esc(pageQuery)}». جرّب كلمة أعم أو راجع أقسام الموقع.</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <a class="btn btn-outline" href="#/grammar">القواعد</a>
          <a class="btn btn-outline" href="#/vocab">المفردات</a>
          <a class="btn btn-outline" href="#/synonyms">الضد والعكس</a>
        </div></div>`;
      return;
    }
    const byType = {};
    list.forEach(r => byType[r.type] = (byType[r.type] || 0) + 1);
    count.innerHTML = `<b>${toArabicNum(list.length)}</b> نتيجة لـ «${esc(pageQuery)}» — ` +
      Object.entries(byType).map(([k,v]) => `${TYPE_ICON[k]} ${TYPE_LABEL[k]}: ${toArabicNum(v)}`).join(" · ");
    box.innerHTML = answerPanelHTML(pageQuery, list) + list.map(r => resultHTML(r, pageQuery)).join("");
    wireResults(box, pageQuery);
    wireVideoButtons(box);
    const acOpen = $("#acOpen"), acCopy = $("#acCopy");
    if (acOpen) acOpen.addEventListener("click", () => {
      const b = list[0]; if (!b) return;
      if (b.videoId) { openVideo({ title:b.title, sub:b.snip || "", videoId:b.videoId, query:b.videoQuery || b.youtube, suggest:[b.youtube] }); return; }
      b.link();
    });
    if (acCopy) acCopy.addEventListener("click", () => copyText(bestPassage(list[0].body || list[0].snip, pageQuery)));
  };
  const run = () => { draw(); history.replaceState(null, "", "#/search?q=" + encodeURIComponent(inp.value.trim())); };
  $("#pageSearchGo").addEventListener("click", run);
  inp.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
  inp.addEventListener("input", debounce(draw, 180));
  $$(".sugg button", app).forEach(b => b.addEventListener("click", () => { inp.value = b.dataset.s; run(); inp.focus(); }));
  draw();
}

function viewNotFound(msg) {
  app.innerHTML = `<div class="container results"><div class="empty">
    <div class="e-ico">🧭</div><h3>الصفحة غير موجودة</h3><p>${esc(msg || "ربما تغيّر الرابط.")}</p>
    <a class="btn btn-solid" href="#/home">العودة للرئيسية</a></div></div>`;
}

/* ---------------- ربط عناصر الأمثلة والفيديو ---------------- */
function bindExamples(root) {
  $$(".js-speak", root).forEach(b => { if (b._b) return; b._b = 1; b.addEventListener("click", e => { e.stopPropagation(); speak(b.dataset.t); }); });
  $$(".js-copy",  root).forEach(b => { if (b._b) return; b._b = 1; b.addEventListener("click", e => { e.stopPropagation(); copyText(b.dataset.t); }); });
  $$(".js-letter-speak", root).forEach(b => { if (b._b) return; b._b = 1; b.addEventListener("click", e => {
    e.stopPropagation();
    const L = LETTERS.find(x => x.id === b.dataset.lid);
    if (L) speakLetter(L);
  }); });
}
function bindVideoCards(root) {
  $$(".js-vq", root).forEach(el => { if (el._b) return; el._b = 1;
    el.addEventListener("click", e => { e.stopPropagation();
      openVideo({
        title: el.dataset.title || "فيديو",
        sub: (el.dataset.desc || "مقطع تعليمي من يوتيوب") + (el.dataset.dur ? " · المدة: " + el.dataset.dur : ""),
        videoId: el.dataset.id || null,
        query: el.dataset.q,
        suggest: [el.dataset.q, "شرح مبسّط", "مثال محلول"],
      });
    });
  });
}

/* ============================================================
   التوجيه
   ============================================================ */
function go(hash) {
  if (location.hash === hash) route();
  else location.hash = hash;
}

function route() {
  const raw = location.hash.replace(/^#/, "") || "/home";
  const [path, queryString] = raw.split("?");
  const params = new URLSearchParams(queryString || "");
  const seg = path.split("/").filter(Boolean).map(s => {
    try { return decodeURIComponent(s); } catch (e) { return s; }
  });

  $$("#mainNav a").forEach(a => a.classList.remove("active"));
  $("#mainNav").classList.remove("open");
  $("#menuBtn").setAttribute("aria-expanded", "false");
  $("#quickBar").classList.toggle("show", seg[0] === "search");

  switch (seg[0]) {
    case undefined:
    case "home":        setNav("home");        viewHome(); break;
    case "letters":     setNav("letters");     viewLetters(); break;
    case "grammar":     setNav("grammar");
                        seg[1] ? viewLesson(seg[1]) : viewGrammar(); break;
    case "vocab":       setNav("vocab");       viewVocab(); break;
    case "synonyms":    setNav("synonyms");    viewSynonyms(); break;
    case "irab":        setNav("irab");        viewIrab(); break;
    case "videos":      setNav("videos");      viewVideos(); break;
    case "images":      setNav("images");      viewImages(); break;
    case "search":      viewSearch(params.get("q") || ""); break;
    default:            viewNotFound();
  }

  if (!location.hash.includes("#exSec")) window.scrollTo({ top: 0, behavior: "auto" });
  $("#siteHeader").classList.remove("scrolled");
  const pageTitle = (document.querySelector("#app h1")?.textContent || "").trim().replace(/\s+/g, " ");
  document.title = seg[0] === "home" || !pageTitle
    ? "دار العربية | منصة تعلّم اللغة العربية"
    : "دار العربية | " + pageTitle.slice(0, 60);
}
function setNav(key) {
  const a = $(`#mainNav a[data-nav="${key}"]`);
  if (a) a.classList.add("active");
}

/* ============================================================
   تهيئة عامة
   ============================================================ */
function revealInit() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold:0.12 });
  els.forEach((e, i) => { e.style.transitionDelay = (i % 6) * 60 + "ms"; io.observe(e); });
}

function init() {
  buildIndex();
  $("#year").textContent = new Date().getFullYear();

  // القائمة الجانبية
  $("#menuBtn").addEventListener("click", () => {
    const nav = $("#mainNav"), open = nav.classList.toggle("open");
    $("#menuBtn").setAttribute("aria-expanded", String(open));
  });

  // زر البحث في الهيدر
  $("#searchBtn").addEventListener("click", () => openSearchOverlay($("#quickSearch").value || ""));

  // شريط البحث العلوي
  $("#quickSearchGo").addEventListener("click", () => {
    const v = $("#quickSearch").value.trim();
    if (v) go("#/search?q=" + encodeURIComponent(v));
  });
  $("#quickSearch").addEventListener("keydown", e => {
    if (e.key === "Enter") { const v = e.target.value.trim(); if (v) go("#/search?q=" + encodeURIComponent(v)); }
  });

  // لوحة البحث المنبثقة
  const run = debounce(runOverlaySearch, 140);
  $("#overlaySearch").addEventListener("input", run);
  $("#overlaySearch").addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); moveSel(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); moveSel(-1); }
    else if (e.key === "Enter") {
      const items = $$("#spResults .res");
      const el = items[spSel >= 0 ? spSel : 0];
      if (el) el.click();
      else { const v = e.target.value.trim(); if (v) { closeSearchOverlay(); go("#/search?q=" + encodeURIComponent(v)); } }
    }
  });
  $("#searchOverlay").addEventListener("click", e => { if (e.target.id === "searchOverlay") closeSearchOverlay(); });
  $$("[data-close-search]").forEach(b => b.addEventListener("click", closeSearchOverlay));
  $$("#spFilters .chip").forEach(c => c.addEventListener("click", () => {
    $$("#spFilters .chip").forEach(x => x.classList.remove("active"));
    c.classList.add("active"); spFilter = c.dataset.filter; runOverlaySearch();
  }));

  // مشغّل الفيديو
  $$("#videoModal [data-close]").forEach(b => b.addEventListener("click", closeVideo));
  const lbEl = $("#lightbox");
  if (lbEl) lbEl.addEventListener("click", e => { if (e.target.id === "lightbox" || e.target.hasAttribute("data-lb-close")) openLightboxClose(); });

  // سرعة النطق
  const sel = $("#speedSel");
  if (sel) {
    sel.value = String(SPEED);
    sel.addEventListener("change", () => setSpeed(sel.value));
  }
  if ("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = () => {};
  $("#playUrlBtn").addEventListener("click", () => {
    const id = YT.idFromUrl($("#videoUrl").value);
    if (!id) { toast("الرجاء لصق رابط يوتيوب صحيح"); return; }
    $("#playerWrap").innerHTML = `<iframe src="${YT.embedUrl(id)}" title="فيديو يوتيوب"
      allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    toast("تم تحميل الفيديو ✓");
  });
  $("#videoUrl").addEventListener("keydown", e => { if (e.key === "Enter") $("#playUrlBtn").click(); });

  // اختصارات لوحة المفاتيح
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearchOverlay(); }
    else if (e.key === "Escape") { closeSearchOverlay(); closeVideo(); openLightboxClose(); }
    else if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); openSearchOverlay(); }
  });

  // الهيدر وزر الصعود
  const onScroll = () => {
    $("#siteHeader").classList.toggle("scrolled", window.scrollY > 12);
    $("#toTop").classList.toggle("show", window.scrollY > 420);
  };
  window.addEventListener("scroll", onScroll, { passive:true });
  $("#toTop").addEventListener("click", () => window.scrollTo({ top:0, behavior:"smooth" }));

  // الروابط الداخلية داخل المحتوى
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#/"]');
    if (a) { $("#mainNav").classList.remove("open"); $("#menuBtn").setAttribute("aria-expanded", "false"); }
  });

  window.addEventListener("hashchange", route);
  route();
  onScroll();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();

})();
