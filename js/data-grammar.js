/* ============================================================
   بيانات قواعد النحو والصرف
   كل درس: معرّف، عنوان، فئة، أيقونة، ملخّص، محتوى، أمثلة، فيديوهات
   ============================================================ */

const GRAMMAR_CATS = [
  { id:"all",      name:"كل الفئات",  icon:"🗂️" },
  { id:"asasi",    name:"أساسيات",    icon:"🌱" },
  { id:"marfuat",  name:"المرفوعات",  icon:"⬆️" },
  { id:"mansuubat",name:"المنصوبات",  icon:"⬇️" },
  { id:"mabniyat", name:"المبنيات",   icon:"🧱" },
  { id:"asalib",   name:"الأساليب",   icon:"🎭" },
  { id:"mushtaqq", name:"المشتقات",   icon:"🌱" },
  { id:"sarf",     name:"الصرف",      icon:"🔤" },
];

const GRAMMAR = [

/* ============ 1. أقسام الكلام ============ */
{
  id:"aslam",
  title:"أقسام الكلام",
  cat:"asasi",
  icon:"🗣️",
  summary:"الاسم والفعل والحرف: أساس بناء الجملة العربية وحدود كل قسم وعلاماته.",
  examples:[
    {text:"جاءَ الطالبُ مسرورًا", note:"اسم + فعل + اسم"},
    {text:"يكتبُ الدرسَ", note:"فعل + مفعول"},
    {text:"مِنَ البيتِ", note:"حرف جرّ + اسم مجرور"},
  ],
  videos:[
    {title:"أقسام الكلام الثلاثة", q:"أقسام الكلام الاسم والفعل والحرف"},
    {title:"كيف تميّز الاسم من الفعل", q:"تمييز الاسم من الفعل من الحرف"},
  ],
  html:`
  <p class="art-lead">تنقسم الكلمة في اللغة العربية إلى ثلاثة أقسام لا رابع لها: <strong>اسم</strong>، و<strong>فعل</strong>، و<strong>حرف</strong>. وميزان النحاة لكل قسم يُعرف بـ«الميزان».</p>

  <h3 class="sec" id="s1">أولًا: الاسم</h3>
  <p>هو كل كلمة دلّت على معنى في نفسها، ولم تنضم إلى زمن. ويُعرَف بدخول <strong>أل</strong> أو بحرف جرّ عليه، أو بتقدّمه على الفعل.</p>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الاسم</th><th>الميزان</th><th>مثال</th></tr></thead>
    <tbody>
      <tr><td>اسم فاعل</td><td class="ser">فَعَال</td><td class="ser">كَاتِب</td></tr>
      <tr><td>مفرد</td><td class="ser">فَعْل</td><td class="ser">قَلَم</td></tr>
      <tr><td>جمع</td><td class="ser">أَفْعَال</td><td class="ser">أَقْلَام</td></tr>
      <tr><td>صفة</td><td class="ser">فَعِيل</td><td class="ser">كَبِير</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s2">ثانيًا: الفعل</h3>
  <p>هو كل كلمة دلّت على معنى في نفسها، وانضمت إلى <strong>زمن</strong>؛ إمّا ماضٍ، أو مضارع، أو أمر. وينقسم إلى قسمين:</p>
  <ul>
    <li><strong>فعل ثلاثي</strong>: ثلاث أحرف أصلية مثل: كَتَبَ، نَصَرَ، سَمِعَ.</li>
    <li><strong>فعل غير ثلاثي</strong>: أكثر من ثلاثة أحرف مثل: أَكْرَمَ (أربعة)، اسْتَغْفَرَ (ستة)، تَعَالَى (أربعة).</li>
  </ul>
  <div class="note gold"><span class="n-ico">💡</span><div class="n-body"><h5>قاعدة سريعة</h5><p>الفعل الماضي مؤكَّد لزمنه، والمضارع متغيّر بتغيّر الزمان مع الفاعل، والأمر يتضمّن معنى الطلب.</p></div></div>

  <h3 class="sec" id="s3">ثالثًا: الحرف</h3>
  <p>هو كل كلمة دلّت على معنى في نفسها، ولم تنضَم إلى زمن، ولا يتقدّم عليها ما يصلح له. ولا يُعرَف بالميزان ولا بـ«أل» ولا بحرف الجرّ.</p>
  <div class="ex-list">
    <div class="ex"><span class="ex-mark">١</span><span class="ex-text">سَأَذْهَبُ</span><span class="ex-note">السين حرف استقبال</span></div>
    <div class="ex"><span class="ex-mark">٢</span><span class="ex-text">مِنَ البيتِ</span><span class="ex-note">مِن حرف جرّ</span></div>
    <div class="ex"><span class="ex-mark">٣</span><span class="ex-text">لام التعليل</span><span class="ex-note">جاءت لتفيد السببية</span></div>
  </div>

  <div class="note tip"><span class="n-ico">🎯</span><div class="n-body"><h5>حيلة عملية</h5><p>ضع الكلمة قبل «أل»: إن صارت معدودة فهي اسم (القَلَمُ)، وإن لم تصحّ فهي حرف (لا نقول: الحاء، ولا الشين).</p></div></div>
  `
},

/* ============ 2. الجملة الاسمية ============ */
{
  id:"jumla-ismiya",
  title:"الجملة الاسمية: المبتدأ والخبر",
  cat:"asasi",
  icon:"🏛️",
  summary:"تبدأ بـ«اسم»، وتشمل المبتدأ والخبر، وأنواع الخبر المفرد والجملة والشبه جملة.",
  examples:[
    {text:"الطالبُ مجتهدٌ", note:"مبتدأ مرفوع + خبر مرفوع"},
    {text:"المهندسُونَ أنجزوا المشروعَ", note:"خبره جملة فعلية"},
    {text:"الكتابُ على الطاولةِ", note:"خبره شبه جملة (جار ومجرور)"},
  ],
  videos:[
    {title:"المبتدأ والخبر", q:"المبتدأ والخبر الجملة الاسمية"},
    {title:"أحوال المبتدأ والخبر الستة", q:"أحوال المبتدأ والخبر النحوي"},
  ],
  html:`
  <p class="art-lead">الجملة الاسمية هي التي تبدأ بـ<strong>اسم</strong>، وتتركّب من ركنين: <strong>المبتدأ</strong> (الذي تُحدَّد به المسألة) و<strong>الخبر</strong> (الذي يُخبَر به عنه).</p>

  <h3 class="sec" id="s1">أولًا: المبتدأ</h3>
  <p>هو الاسم المرفوع الذي بدأنا به الكلام. شرطه أن يكون <strong>معرَّفًا</strong> غالبًا، أو نكرة تدلّ على معيّن.</p>
  <ul>
    <li>معرَّف بـ«أل»: <span class="ser">الطالبُ</span></li>
    <li>ضمير: <span class="ser">أنا، أنتَ، هو، نحن</span></li>
    <li>اسم إشارة: <span class="ser">هذا، تلك</span></li>
    <li>اسم موصول: <span class="ser">الذي، التي</span></li>
    <li>مضاف: <span class="ser">كتابُ الطالبِ</span></li>
    <li>منادى مضاف أو نكرة مقصودة: <span class="ser">يا طالبُ</span></li>
  </ul>

  <h3 class="sec" id="s2">ثانيًا: الخبر</h3>
  <p>ينقسم الخبر إلى ثلاثة أقسام:</p>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>القسم</th><th>الوصف</th><th>مثال</th></tr></thead>
    <tbody>
      <tr><td><strong>مفرد</strong></td><td>كلمة واحدة تدلّ على المبتدأ</td><td class="ser">الجوُّ جميلٌ</td></tr>
      <tr><td><strong>جملة</strong></td><td>فعلية أو اسمية</td><td class="ser">الطالبُ يقرأُ / الطالبُ مجتهدٌ</td></tr>
      <tr><td><strong>شبه جملة</strong></td><td>جار ومجرور، أو ظرف</td><td class="ser">الزهرُ في الحديقةِ</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s3">ثالثًا: أحوال المبتدأ والخبر الستة</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الحالة</th><th>المبتدأ</th><th>الخبر</th><th>المثال</th></tr></thead>
    <tbody>
      <tr><td>١</td> مرفوع <td>مرفوع</td><td class="ser">الطالبُ مجتهدٌ</td></tr>
      <tr><td>٢</td> مرفوع <td>مجرور</td><td class="ser">الطالبُ في القاعةِ</td></tr>
      <tr><td>٣</td> منصوب <td>مرفوع</td><td class="ser">إنَّ الطالبَ مجتهدٌ</td></tr>
      <tr><td>٤</td> منصوب <td>مجرور</td><td class="ser">إنَّ الطالبَ في القاعةِ</td></tr>
      <tr><td>٥</td> مضاف <td>مرفوع</td><td class="ser">أعجبَني طالبُ الفصلِ مجتهدٌ</td></tr>
      <tr><td>٦</td> مضاف <td>مجرور</td><td class="ser">أعجبَني طالبُ الفصلِ في القاعةِ</td></tr>
    </tbody>
  </table></div>

  <div class="note warn"><span class="n-ico">⚠️</span><div class="n-body"><h5>تنبيه</h5><p>لا يصحّ أن يكون المبتدأ نكرة صريحة في صدر الجملة، فلا نقول: «رجلٌ في الحقلِ»، بل نقول: «في الحقلِ رجلٌ» لأن الظاهر يقدَّم على النكرة.</p></div></div>

  <div class="irab-inline">
    <div class="i-sent">الطالبُ <span class="tok">مجتهدٌ</span></div>
    <ul>
      <li><span class="w">الطالبُ</span> مبتدأ مرفوع وعلامة رفعه الضمة الظاهرة على آخره.</li>
      <li><span class="w">مجتهدٌ</span> خبر المبتدأ مرفوع وعلامة رفعه الضمة الظاهرة على آخره.</li>
    </ul>
  </div>
  `
},

/* ============ 3. الجملة الفعلية ============ */
{
  id:"jumla-fiiliya",
  title:"الجملة الفعلية: الفعل والفاعل والمفعول",
  cat:"asasi",
  icon:"⚡",
  summary:"تبدأ بفعل، وتشمل الفعل وفاعلٍ ومفعولٍ به، مع أحوال الفاعل وأقسام الفعل.",
  examples:[
    {text:"كتبَ الطالبُ الدرسَ", note:"فعل ماضٍ + فاعل + مفعول به"},
    {text:"يقرأُ محمدٌ القصةَ", note:"فعل مضارع + فاعل + مفعول"},
    {text:"اُقرأْ الدرسَ", note:"فعل أمر + مفعول به"},
  ],
  videos:[
    {title:"الجملة الفعلية", q:"الجملة الفعلية الفاعل المفعول به"},
    {title:"أحوال الفاعل", q:"أحوال الفاعل النحوي"},
  ],
  html:`
  <p class="art-lead">الجملة الفعلية هي التي تبدأ بـ<strong>فعل</strong>، وهي أكثر استعمالًا في العربية لأنها تُفيد الترتيب والزمن.</p>

  <h3 class="sec" id="s1">أركان الجملة الفعلية</h3>
  <ul>
    <li><strong>الفعل</strong>: ركنها الأصلي، ولا يقوم مقامه شيء.</li>
    <li><strong>الفاعل</strong>: من قام بالفعل، وهو ركن ثانٍ لا تقوم الجملة بدونه.</li>
    <li><strong>المفعول به</strong>: من وقع عليه الفعل، ووجوده مُعلَّق بلفظ الفعل (إن كان متعدّيًا).</li>
  </ul>
  <div class="note info"><span class="n-ico">📘</span><div class="n-body"><h5>الفعل اللازم والمتعدّي</h5><p><strong>اللازم</strong> لا يحتاج مفعولًا: «اجتهدَ الطالبُ». <strong>المتعدّي</strong> يحتاج مفعولًا: «كتبَ الطالبُ الدروسَ».</p></div></div>

  <h3 class="sec" id="s2">أحوال الفاعل</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الحالة</th><th>المثال</th><th>علامة الرفع</th></tr></thead>
    <tbody>
      <tr><td>مرفوع مفرد</td><td class="ser">جاءَ الأستاذُ</td><td>الضمة</td></tr>
      <tr><td>مرفوع جمع</td><td class="ser">جاءَ المعلّمونَ</td><td>الضمة (جمع مذكر سالم)</td></tr>
      <tr><td>مثنّى</td><td class="ser">جاءَ الطالبانِ</td><td>الألف</td></tr>
      <tr><td>مضمر</td><td class="ser">جاءَ هو، جاءَ هُما</td><td>ضمير منفصل</td></tr>
      <tr><td>محلّ رفع</td><td class="ser">أحبُّ أن أنجحَ</td><td>فعل مضارع منصوب</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s3">أقسام الفعل باعتبار الزمن</h3>
  <div class="ex-list">
    <div class="ex"><span class="ex-mark">١</span><span class="ex-text">ذهبَ الوالدُ</span><span class="ex-note">فعل ماضٍ — يدلّ على زمن سابق</span></div>
    <div class="ex"><span class="ex-mark">٢</span><span class="ex-text">يذهبُ الوالدُ</span><span class="ex-note">فعل مضارع — حاضر</span></div>
    <div class="ex"><span class="ex-mark">٣</span><span class="ex-text">اذهبْ</span><span class="ex-note">فعل أمر — طلب</span></div>
  </div>

  <div class="irab-inline">
    <div class="i-sent">كتبَ الطالبُ <span class="tok">الدرسَ</span></div>
    <ul>
      <li><span class="w">كتبَ</span> فعل ماضٍ مبني على الفتح، والفاعل ضمير مستتر وجوبًا تقديره «هو».</li>
      <li><span class="w">الطالبُ</span> توكيد للفاعل مرفوع وعلامة رفعه الضمة.</li>
      <li><span class="w">الدرسَ</span> مفعول به منصوب وعلامة نصبه الفتحة الظاهرة.</li>
    </ul>
  </div>
  `
},

/* ============ 4. المبتدأ والخبر تفصيلًا ============ */
{
  id:"mubtada-khabar",
  title:"المبتدأ والخبر: أنواعهما وأحكامهما",
  cat:"asasi",
  icon:"⚖️",
  summary:"تفصيل أحوال المبتدأ والخبر، الخبر الجملة، شبه الجملة، والتقديم والتأخير.",
  examples:[
    {text:"في الصفِّ طلابٌ", note:"مبتدأ مؤخَّر + خبر مقدَّم"},
    {text:"أقامةُ الجمعةِ واجبةٌ", note:"مبتدأ مضاف"},
    {text:"ما زالَ الجوُّ ربيعًا", note:"خبر كان اسم نكرة"},
  ],
  videos:[
    {title:"شبه الجملة خبرًا", q:"شبه الجملة خبر المبتدأ"},
    {title:"تقديم الخبر وتأخيره", q:"تقديم الخبر وتأخير المبتدأ"},
  ],
  html:`
  <h3 class="sec" id="s1">الخبر الجملة</h3>
  <p>إذا كان الخبر جملةً فهو نوعان:</p>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>النوع</th><th>المثال</th></tr></thead>
    <tbody>
      <tr><td>جملة فعلية</td><td class="ser">الطالبُ يجتهدُ</td></tr>
      <tr><td>جملة اسمية</td><td class="ser">الطالبُ مجتهدٌ</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s2">شبه الجملة</h3>
  <p>هي الجار والمجرور، أو الظرف، وتقدَّم غالبًا على المبتدأ.</p>
  <div class="ex-list">
    <div class="ex"><span class="ex-mark">١</span><span class="ex-text">على الطاولةِ كتابٌ</span><span class="ex-note">ظرف مكان مقدَّم خبره</span></div>
    <div class="ex"><span class="ex-mark">٢</span><span class="ex-text">مِنَ الماءِ اشربْ</span><span class="ex-note">جار ومجرور مقدَّم</span></div>
  </div>

  <h3 class="sec" id="s3">ما لا يقع مبتدأً</h3>
  <ul>
    <li>النكرة المفردة: لا نقول «كتابٌ على الطاولةِ».</li>
    <li>اسم الفعل: <span class="ser">نَعَمْ، بُشْرَى</span> لا تُسبَق بـ«أل».</li>
    <li>الظرف الميمي «مَنْ» إذا دلّ على غير العاقل.</li>
  </ul>

  <div class="note gold"><span class="n-ico">🔑</span><div class="n-body"><h5>قاعدة التقديم</h5><p>إذا تقدّم النكرة على المبتدأ فالمقدَّم هو الخبر، والمؤخَّر هو المبتدأ: «في المسجدِ مصلٍّ».</p></div></div>
  `
},

/* ============ 5. النواسخ ============ */
{
  id:"naasikh",
  title:"النواسخ: كان وأخواتها وإنّ وأخواتها",
  cat:"asasi",
  icon:"🔄",
  summary:"الأفعال والحرف المشبّهة بالفعل التي تدخل على الجملة الاسمية فتُغيّر إعرابها.",
  examples:[
    {text:"كان الجوُّ جميلًا", note:"كان + مبتدأ + خبر منصوب"},
    {text:"إنَّ العلمَ نورٌ", note:"إنّ + اسمها + خبرها"},
    {text:"ليس الفقرُ فضيلةً", note:"ليس + اسمها + خبرها"},
  ],
  videos:[
    {title:"كان وأخواتها", q:"كان وأخواتها إعراب"},
    {title:"إنّ وأخواتها", q:"إن وأخواتها إعراب"},
  ],
  html:`
  <p class="art-lead">النواسخ هي الأفعال الناسخة (<strong>كان وأخواتها</strong>) والحرف الناسخ (<strong>إنّ وأخواتها</strong> وما شابهها)، وسماها نواسخ لأنها تُغيِّر إعراب ما بعدها.</p>

  <h3 class="sec" id="s1">أولًا: كان وأخواتها</h3>
  <p>تدخل على الجملة الاسمية فترفع المبتدأ <strong>اسمًا لها</strong> وتنصب الخبر <strong>خبرًا لها</strong>.</p>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الفعل</th><th>المعنى</th><th>مثال</th></tr></thead>
    <tbody>
      <tr><td>كان</td><td>الاستمرار في الماضي</td><td class="ser">كان الجوُّ باردًا</td></tr>
      <tr><td>أصبح</td><td>التحوّل إلى الصباح</td><td class="ser">أصبحَ العملُ مُنجَزًا</td></tr>
      <tr><td>أضحى</td><td>التحوّل إلى الضحى</td><td class="ser">أضحى الطالبُ متأخّرًا</td></tr>
      <tr><td>بات</td><td>الاستمرار في الليل</td><td class="ser">باتَ الساهرُ مستيقظًا</td></tr>
      <tr><td>أمسى</td><td>التحوّل إلى المساء</td><td class="ser">أمسى القلبُ ساكنًا</td></tr>
      <tr><td>ظلّ</td><td>الاستمرار في النهار</td><td class="ser">ظلَّ العاملُ متعبًا</td></tr>
      <tr><td>صار</td><td>التحوّل</td><td class="ser">صارَ الماءُ ثلجًا</td></tr>
      <tr><td>ما زال / ما برح / ما فتئ / ما انفكّ</td><td>الاستمرار</td><td class="ser">ما زالَ العلمُ منورًا</td></tr>
      <tr><td>ليس</td><td>النفي</td><td class="ser">ليس الفقرُ عيبًا</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s2">ثانيًا: إنّ وأخواتها</h3>
  <p>تدخل على الجملة الاسمية فتنصب المبتدأ <strong>اسمًا لها</strong> وترفع الخبر <strong>خبرًا لها</strong>.</p>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الحرف</th><th>المعنى</th><th>مثال</th></tr></thead>
    <tbody>
      <tr><td>إنَّ</td><td>التوكيد</td><td class="ser">إنَّ الحقَّ ظاهرٌ</td></tr>
      <tr><td>أنَّ</td><td>التوكيد</td><td class="ser">علمتُ أنَّ العدلَ واجبٌ</td></tr>
      <tr><td>كأنَّ</td><td>التشبيه</td><td class="ser">كأنَّ القمرَ لؤلؤةٌ</td></tr>
      <tr><td>لعلَّ</td><td>الترجّي</td><td class="ser">لعلَّ المطرَ نازلٌ</td></tr>
      <tr><td>لكنَّ</td><td>الاستدراك</td><td class="ser">جاءَ زيدٌ لكنَّ عمْرًا مُتأخّرٌ</td></tr>
      <tr><td>ليتَ</td><td>التمنّي</td><td class="ser">ليتَ الشبابَ عائدٌ</td></tr>
      <tr><td>قالَ إنَّ</td><td>القول</td><td class="ser">قالَ المعلّمُ إنَّ الاجتهادَ مفتاحٌ</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s3">ثالثًا: لا النافية للجنس</h3>
  <p>تدخل على الجملة الاسمية فتنصب المبتدأ <strong>اسمًا لها</strong> وترفع الخبر <strong>خبرًا لها</strong>، ويجب أن يكون اسمها نكرة.</p>
  <div class="ex-list">
    <div class="ex"><span class="ex-mark">١</span><span class="ex-text">لا رجاءَ بلا عملٍ</span><span class="ex-note">لا: حرف نفي — رجاءَ: اسمها منصوب</span></div>
    <div class="ex"><span class="ex-mark">٢</span><span class="ex-text">لا مُجتهدَ بلا صبرٍ</span><span class="ex-note">مُجتهدَ: اسم لا منصوب</span></div>
  </div>

  <div class="irab-inline">
    <div class="i-sent">إنَّ <span class="tok">العلمَ</span> <span class="tok">نورٌ</span></div>
    <ul>
      <li><span class="w">إنَّ</span> حرف توكيد ونصب، لا محلّ له من الإعراب.</li>
      <li><span class="w">العلمَ</span> اسم إنّ منصوب وعلامة نصبه الفتحة الظاهرة.</li>
      <li><span class="w">نورٌ</span> خبر إنّ مرفوع وعلامة رفعه الضمة الظاهرة.</li>
    </ul>
  </div>
  `
},

/* ============ 6. الفاعل ============ */
{
  id:"fail",
  title:"الفاعل وأنواعه",
  cat:"marfuat",
  icon:"🏃",
  summary:"تعريف الفاعل وشروطه، وأقسامه: ظاهر، ضمير مستتر، مصدر مؤول، مؤول بـ«أن».",
  examples:[
    {text:"اجتهدَ المجتهدُ", note:"فاعل ظاهر"},
    {text:"اجتهدْتُ", note:"فاعل ضمير مستتر «التاء»"},
    {text:"يجبُ عليَّ أن أُجتهدَ", note:"أن أُجتهدَ: مفعول مؤول"},
  ],
  videos:[
    {title:"الفاعل والضمير المستتر", q:"الفاعل والضمير المستتر"},
    {title:"المصدر المؤول", q:"المصدر المؤول في الإعراب"},
  ],
  html:`
  <h3 class="sec" id="s1">تعريف الفاعل</h3>
  <p>هو الاسم المرفوع الذي دلّ على من قام بالفعل. ولا يصحّ أن يكون ضميرًا في محل رفع إلا مع الأفعال الناسخة.</p>
  <div class="note tip"><span class="n-ico">🎯</span><div class="n-body"><h5>شرط الفاعل</h5><p>يجب أن يكون مرفوعًا، وأن يكون مفردًا في المعنى وإن كان جمعًا في الصورة.</p></div></div>

  <h3 class="sec" id="s2">أقسام الفاعل</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>القسم</th><th>المثال</th><th>الملاحظة</th></tr></thead>
    <tbody>
      <tr><td>اسم ظاهر</td><td class="ser">درسَ التلميذُ</td><td>مرفوع بالضمة</td></tr>
      <tr><td>ضمير منفصل</td><td class="ser">درسَ هو</td><td>هو: فاعل</td></tr>
      <tr><td>ضمير مستتر وجوبًا</td><td class="ser">اجتهدْتُ</td><td>التاء فاعل في محل رفع</td></tr>
      <tr><td>ضمير مستتر جوازًا</td><td class="ser">يكتبُ</td><td>مستتر تقديره «هو»</td></tr>
      <tr><td>مصدر مؤول</td><td class="ser">يُمْنَى أن تنجحَ</td><td>«أن تنجحَ» فاعل مبني على السكون</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s3">الضمير المستتر</h3>
  <ul>
    <li><strong>وجوبًا</strong>: مع الأفعال غير الظاهرة، مثل: <span class="ser">أنا، نحن، أنتَ، أنتِ، أنتما، هو، هي، هما، هم، هنَّ</span>.</li>
    <li><strong>جوازًا</strong>: مع الأفعال الظاهرة، تقديره <span class="ser">هو</span> أو <span class="ser">هما</span> أو <span class="ser">هم</span>.</li>
  </ul>

  <div class="irab-inline">
    <div class="i-sent">اجتهدَ <span class="tok">التلميذُ</span></div>
    <ul>
      <li><span class="w">اجتهدَ</span> فعل ماضٍ مبني على الفتح.</li>
      <li><span class="w">التلميذُ</span> فاعل مرفوع وعلامة رفعه الضمة الظاهرة.</li>
    </ul>
  </div>
  `
},

/* ============ 7. المفعول به ============ */
{
  id:"maf'ool",
  title:"المفعول به وأنواعه",
  cat:"mansuubat",
  icon:"🎯",
  summary:"تعريف المفعول به وشروطه، وأنواعه: ظاهر، ضمير، مصدر مؤول، متعدّد، منصوب بحرف الجر.",
  examples:[
    {text:"قرأَ الطالبُ القصةَ", note:"مفعول به ظاهر منصوب"},
    {text:"شكرَه المعلّمُ", note:"مفعول به ضمير منفصل منصوب"},
    {text:"أحبُّ أن أتعلمَ", note:"أن أتعلمَ: مفعول به مؤول"},
  ],
  videos:[
    {title:"المفعول به", q:"المفعول به وأنواعه"},
    {title:"المفعول به المتعدد", q:"المفعول به المتعدد"},
  ],
  html:`
  <h3 class="sec" id="s1">تعريفه وشروطه</h3>
  <p>هو الاسم المنصوب الذي دلّ على من وقع عليه فعل الفاعل. وشرطه أن يكون بعده فعل متعدٍّ، وأن يصحّ أن يُسأل: «من وقع عليه الفعل؟».</p>

  <h3 class="sec" id="s2">أنواعه</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>النوع</th><th>المثال</th><th>علامة النصب</th></tr></thead>
    <tbody>
      <tr><td>اسم ظاهر مفرد</td><td class="ser">كتبَ محمدٌ الرسالةَ</td><td>الفتحة</td></tr>
      <tr><td>مثنّى</td><td class="ser">شاهدتُ الطالبَينِ</td><td>الياء</td></tr>
      <tr><td>جمع مذكر سالم</td><td class="ser">أكرمَ المديرُ المعلّمينَ</td><td>الياء</td></tr>
      <tr><td>ضمير منفصل</td><td class="ser">رأيتُه</td><td>الهاء</td></tr>
      <tr><td>مصدر مؤول</td><td class="ser">يُرجى أن تنجحَ</td><td>أن تنجحَ مبني على السكون</td></tr>
      <tr><td>مفعول به متعدّد</td><td class="ser">أعطى المعلّمُ الطالبَ الدرجةَ</td><td>كلاهما منصوب</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s3">ما لا يكون مفعولًا به</h3>
  <ul>
    <li>الاسم المعطوف: <span class="ser">قرأتُ القصةَ والقصيدةَ</span> — «القصيدةَ» معطوفة، لا مفعول.</li>
    <li>ما فيه «أل» مع بعض الأفعال التي تتعدّى بحرف جرّ.</li>
  </ul>

  <div class="note gold"><span class="n-ico">🔑</span><div class="n-body"><h5>المفعول به المتعدد</h5><p>إذا تعدّى الفعل إلى مفعولين فهما معًا مفعولان به منصوبان: «منحتُ الطالبَ جائزةً».</p></div></div>
  `
},

/* ============ 8. المفعول المطلق ============ */
{
  id:"maf'ool-mutlaq",
  title:"المفعول المطلق",
  cat:"mansuubat",
  icon:"🔁",
  summary:"مصدر منصوب من لفظ الفعل، يفيد التوكيد أو التعدية أو العدد أو النوع.",
  examples:[
    {text:"نصرَ اللهُ المسلمينَ نصرًا", note:"توكيد للفعل"},
    {text:"سرتُ سيرًا حثيثًا", note:"مفعول مطلق موصوف"},
    {text:"جلسَ الطلابُ جلوسًا مهيبًا", note:"مفعول مطلق مضاف"},
  ],
  videos:[
    {title:"المفعول المطلق", q:"المفعول المطلق وأنواعه"},
    {title:"المفعول لأجله", q:"المفعول لأجله"},
  ],
  html:`
  <p class="art-lead">المفعول المطلق هو <strong>مصدر منصوب</strong> يُذكَر لتوكيده أو لتعدية الفعل أو لبيان عدده أو نوعه.</p>

  <h3 class="sec" id="s1">أغراضه</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الغرض</th><th>المثال</th></tr></thead>
    <tbody>
      <tr><td>توكيد الفعل</td><td class="ser">فرحَ الطفلُ فرحًا</td></tr>
      <tr><td>بيان النوع</td><td class="ser">سرتُ سيرًا حثيثًا</td></tr>
      <tr><td>العدد</td><td class="ser">جلسَ الطلابُ جلوسًا مرتينَ</td></tr>
      <tr><td>التعدية (مصدر ثلاثي)</td><td class="ser">فتحَ المطرُ الأرضَ فتحًا</td></tr>
      <tr><td>المفعول به المطلق</td><td class="ser">كتبْتُ الكتابَ</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s2">حالاته</h3>
  <ul>
    <li>مفرد: <span class="ser">فرحَ الطفلُ فرحًا</span></li>
    <li>مضاف: <span class="ser">جلسَ الطلابُ جلوسَ المخلصينَ</span></li>
    <li>موصوف: <span class="ser">سرتُ سيرًا حثيثًا</span></li>
    <li>مقرون بـ«أل»: <span class="ser">لقد نجحَ النجاحَ</span></li>
  </ul>

  <div class="note warn"><span class="n-ico">⚠️</span><div class="n-body"><h5>تنبيه</h5><p>لا يكون المفعول المطلق مصدرًا ميميًا (مَجْلِس)، بل مصدر ثلاثي أو مزيد.</p></div></div>
  `
},

/* ============ 9. المفاعيل ============ */
{
  id:"mafa'il",
  title:"المفاعيل: المفعول لأجله والمفعول به المطلق",
  cat:"mansuubat",
  icon:"📎",
  summary:"المفعول لأجله (سبب الفعل) والمفعول به المطلق (التعدية) مع أحوالهما.",
  examples:[
    {text:"سافرتُ طلبًا للعلمِ", note:"مفعول لأجله منصوب"},
    {text:"وقعتُ من الشجرةِ وقعةً", note:"مفعول به مطلق"},
    {text:"أكرمَ المديرُ المتفوقينَ إكرامًا", note:"مفعول به مطلق موصوف"},
  ],
  videos:[
    {title:"المفعول لأجله", q:"المفعول لأجله"},
    {title:"المفعول به المطلق", q:"المفعول به المطلق"},
  ],
  html:`
  <h3 class="sec" id="s1">المفعول لأجله</h3>
  <p>هو مصدر منصوب يُذكر لبيان <strong>سبب</strong> وقوع الفعل، ويشارك الفاعل في المعنى.</p>
  <div class="ex-list">
    <div class="ex"><span class="ex-mark">١</span><span class="ex-text">وقفَ الطلابُ إجلالًا للمديرِ</span><span class="ex-note">الإجلال سبب الوقوف</span></div>
    <div class="ex"><span class="ex-mark">٢</span><span class="ex-text">سافرتُ طلبًا للرزقِ</span><span class="ex-note">الطلب سبب السفر</span></div>
  </div>
  <div class="note info"><span class="n-ico">📘</span><div class="n-body"><h5>شروطه</h5><p>يجب أن يشارك الفاعل في الفعل، وأن يدلّ على سببٍ، وأن يكون مصدرًا ثلاثيًا غالبًا، وأن لا يتضمّن معنى الطلب.</p></div></div>

  <h3 class="sec" id="s2">المفعول به المطلق</h3>
  <p>هو المصدر الذي يُذكر لِما <strong>تعدّى إليه</strong> الفعل اللازم، فيصير متعدّيًا.</p>
  <div class="ex-list">
    <div class="ex"><span class="ex-mark">١</span><span class="ex-text">وقفَ الطفلُ وقوفًا</span><span class="ex-note">تعدية اللازم</span></div>
    <div class="ex"><span class="ex-mark">٢</span><span class="ex-text">سرتُ السيرَ</span><span class="ex-note">تعدية مع «أل»</span></div>
  </div>
  `
},

/* ============ 10. الحال ============ */
{
  id:"hal",
  title:"الحال وأنواعها",
  cat:"mansuubat",
  icon:"🌦️",
  summary:"ظرف منصوب يبيّن هيئة صاحبه عند وقوع الفعل، وأنواعه وأحواله.",
  examples:[
    {text:"جاءَ الطالبُ مسرورًا", note:"حال مفردة منصوب"},
    {text:"دخلَ الطلابُ مسرعينَ", note:"حال جمع مؤنث سالم"},
    {text:"انتظرتُك واقفًا", note:"حال مضاف"},
  ],
  videos:[
    {title:"الحال وأنواعها", q:"الحال وأنواعها"},
    {title:"المحال والتمييز", q:"الحال والتمييز"},
  ],
  html:`
  <p class="art-lead">الحال <strong>ظرف منصوب</strong> يُذكر لبيان هيئة صاحب الفعل أو حاله وقت وقوعه، ويشاركه في الزمن.</p>

  <h3 class="sec" id="s1">أحوال الحال</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الحالة</th><th>المثال</th><th>علامة النصب</th></tr></thead>
    <tbody>
      <tr><td>مفردة</td><td class="ser">جاءَ مسرورًا</td><td>الفتحة</td></tr>
      <tr><td>جمع مؤنث سالم</td><td class="ser">جاءَ مسرعينَ</td><td>الياء</td></tr>
      <tr><td>مضاف</td><td class="ser">جاءَ حاملًا كتابه</td><td>فتحة المضاف</td></tr>
      <tr><td>شبه جملة</td><td class="ser">وقفَ بجانبَي الطريقِ</td><td>ظرف منصوب</td></tr>
      <tr><td>جملة (ظرفية)</td><td class="ser">جلسَ حيثُ شاءَ</td><td>ظرف مبني على السكون</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s2">شروط الحال</h3>
  <ul>
    <li>يجب أن يكون <strong>نكرة</strong>، ولا يصحّ أن يكون معرَّف بـ«أل».</li>
    <li>يشارك الفعل في الزمان.</li>
    <li>لا يكون إلا من الفاعل أو من مفعولٍ به.</li>
  </ul>

  <div class="note tip"><span class="n-ico">🎯</span><div class="n-body"><h5>الحال أم التمييز؟</h5><p>إذا دلّت على <strong>هيئة</strong> فهي حال: «جاءَ مسرورًا». وإذا دلّت على <strong>كمال المعنى</strong> فهي تمييز: «ازدادَ العلمُ نورًا».</p></div></div>
  `
},

/* ============ 11. النعت ============ */
{
  id:"na't",
  title:"النعت (الوصف)",
  cat:"marfuat",
  icon:"🎨",
  summary:"الصفة التي تُذكَر لتوسيع معرفة الموصوف، ونوعاه: حقيقي وسبي.",
  examples:[
    {text:"جاءَ الطالبُ المجتهدُ", note:"نعت مرفوع معرَّف"},
    {text:"قرأتُ قصةً ممتعةً", note:"نعت منصوب نكرة"},
    {text:"شاهدتُ رجالًا شجعانَ", note:"نعت لجمع"},
  ],
  videos:[
    {title:"النعت الحقيقي والسبي", q:"النعت الحقيقي والسبي"},
    {title:"النعت والبدل", q:"النعت والبدل الفرق"},
  ],
  html:`
  <h3 class="sec" id="s1">تعريف النعت</h3>
  <p>هو صفة تُذكَر لتوسيع معرفة الموصوف أو بيان حاله، و<b>تتبع الموصوف في أربعة أمور</b>: التعريف/التنكير، العدد، الإعراب، الجنس (أو علامة جنسه).</p>

  <h3 class="sec" id="s2">أنواعه</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>النوع</th><th>المثال</th><th>الحكم</th></tr></thead>
    <tbody>
      <tr><td>نعت حقيقي</td><td class="ser">الطالبُ المجتهدُ</td><td>يوافق الموصوف في التعريف</td></tr>
      <tr><td>نعت سببي</td><td class="ser">الرجلُ الأسدُ</td><td>لا يوافقه، كُسِبَ منه</td></tr>
      <tr><td>نعت مفرد</td><td class="ser">فتاةٌ جميلةٌ</td><td>كلمة واحدة</td></tr>
      <tr><td>نعت جملة</td><td class="ser">الرجلُ الذي ضحكَ</td><td>جملة فعلية</td></tr>
      <tr><td>نعت شبه جملة</td><td class="ser">الكتابُ على الطاولةِ</td><td>جار ومجرور</td></tr>
    </tbody>
  </table></div>

  <div class="note gold"><span class="n-ico">🔑</span><div class="n-body"><h5>حيلة التمييز</h5><p>أضف قبل النعت كلمة «وهو»: «جاءَ الطالبُ وهو مجتهدٌ» — تصحّ؛ أما البدل فلا: «جاءَ الطالبُ وهو الأبيضُ» لا تصحّ بالبدل.</p></div></div>
  `
},

/* ============ 12. البدل ============ */
{
  id:"badal",
  title:"البدل وأنواعه",
  cat:"marfuat",
  icon:"🔁",
  summary:"اسم يأخذ إعراب المبدل منه، وأنواعه: تام، ناقص، عطف بيان، مطلق.",
  examples:[
    {text:"أحبُّ العلمَ والعملَ", note:"بدل كل من كل"},
    {text:"أخذتُ الكتابَ غلافُه", note:"بدل بعض من كل"},
    {text:"قرأتُ في القرآنِ سورةَ الفاتحةِ", note:"بدل مطلق"},
  ],
  videos:[
    {title:"البدل وأنواعه", q:"البدل وأنواعه"},
    {title:"البدل وعطف البيان", q:"البدل وعطف البيان"},
  ],
  html:`
  <p class="art-lead">البدل هو اسم يُذكر <strong>بعد</strong> المبدل منه، ويدلّ عليه وينوب عنه في الإعراب.</p>

  <h3 class="sec" id="s1">أنواعه</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>النوع</th><th>الوصف</th><th>المثال</th></tr></thead>
    <tbody>
      <tr><td>بدل تام (كل من كل)</td><td>يستغرق المبدل منه</td><td class="ser">أحبُّ العلمَ والعملَ</td></tr>
      <tr><td>بدل بعض من كل</td><td>جزء من المبدل منه</td><td class="ser">أخذتُ الكتابَ غلافُه</td></tr>
      <tr><td>بدل اشتمال</td><td>لَم ينُلْ المبدل منه</td><td class="ser">عجبتُ منكَ صبرُكَ</td></tr>
      <tr><td>بدل مطلق</td><td>يُذكر تكثيرًا أو تفصيلًا</td><td class="ser">قرأتُ القصصَ قصةَ الأسدِ</td></tr>
      <tr><td>بدل نكرة من معرفة</td><td>لتفصيل</td><td class="ser">جاءَ الأستاذُ رجلٌ طويلٌ</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s2">عطف البيان</h3>
  <p>هو اسم يُذكر لبيان مدلول الاسم الذي قبله، ويُعرَب بإعرابه، ولا يتقدّم على المبدل منه.</p>
  <div class="ex-list">
    <div class="ex"><span class="ex-mark">١</span><span class="ex-text">قرأتُ كتابَ النحوِ</span><span class="ex-note">عطف بيان: النحو تفسير لـ«كتاب»</span></div>
    <div class="ex"><span class="ex-mark">٢</span><span class="ex-text">سافرَ سعيدٌ</span><span class="ex-note">اسم علم تفسيري</span></div>
  </div>
  `
},

/* ============ 13. التوكيد ============ */
{
  id:"tawkid",
  title:"التوكيد اللفظي والمعنوي",
  cat:"marfuat",
  icon:"📢",
  summary:"تقوية المعنى باللفظ أو بالمعني، مع الميزان والمرفوع والمنصوب.",
  examples:[
    {text:"نجحَ النجاحَ نجاحًا", note:"توكيد لفظي"},
    {text:"نجحَ الجميعُ كلُّهم", note:"توكيد معنوي"},
    {text:"أحبُّ العلمَ حبًّا شديدًا", note:"توكيد لفظي منصوب"},
  ],
  videos:[
    {title:"التوكيد اللفظي والمعنوي", q:"التوكيد اللفظي والمعنوي"},
  ],
  html:`
  <h3 class="sec" id="s1">التوكيد اللفظي</h3>
  <p>هو تكرار اللفظ لتوكيده، ويُعرَب بإعراب المُؤكَّد.</p>
  <div class="ex-list">
    <div class="ex"><span class="ex-mark">١</span><span class="ex-text">فرحَ الطفلُ فرحًا</span><span class="ex-note">مفعول مطلق توكيد</span></div>
    <div class="ex"><span class="ex-mark">٢</span><span class="ex-text">نجحَ النجاحَ</span><span class="ex-note">مفعول به توكيد</span></div>
    <div class="ex"><span class="ex-mark">٣</span><span class="ex-text">عادَ عائدًا</span><span class="ex-note">حال توكيد</span></div>
  </div>

  <h3 class="sec" id="s2">التوكيد المعنوي</h3>
  <p>هو أن يُقوَّى المعنى بغير اللفظ، بواسطة:</p>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الواو</th><th>كل</th><th>عامة</th><th>أجمع</th><th>كلا</th></tr></thead>
    <tbody>
      <tr><td>الناسُ <b>وهم</b></td><td>الطالبُ <b>كلُّه</b></td><td>المالُ <b>عامةً</b></td><td>البيتُ <b>أجمعُ</b></td><td>الكتابُ <b>كِلاهما</b></td></tr>
    </tbody>
  </table></div>
  <div class="note info"><span class="n-ico">📘</span><div class="n-body"><h5>مرفوع ومنصوب</h5><p><strong>المرفوع</strong>: كل، أجمع، أكتع، أبصع، أصلع، كِلا، كلتا. <strong>المنصوب</strong>: جميعًا، أجمعين، كِلَيْهما.</p></div></div>
  `
},

/* ============ 14. حروف العطف ============ */
{
  id:"atraf",
  title:"حروف العطف وأنواع المعطوف",
  cat:"asasi",
  icon:"🔗",
  summary:"حروف العطف ومدلولاتها، وأنواع المعطوف: مطابق وغير مطابق.",
  examples:[
    {text:"جاءَ الطالبانِ والطالبتانِ", note:"الواو: عطف مطابق"},
    {text:"أحبُّ العلمَ أو الشعرَ", note:"أو: عطف تخيير"},
    {text:"كان زيدٌ لا كريمًا ولا بخيلًا", note:"بل: عطف نفي واثبات"},
  ],
  videos:[
    {title:"حروف العطف", q:"حروف العطف وأنواعها"},
  ],
  html:`
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الحرف</th><th>المدلول</th><th>مثال</th></tr></thead>
    <tbody>
      <tr><td>الفاء</td><td>الترتيب والتعقيب</td><td class="ser">أكلَ ثمّ شربَ → أكلَ فشربَ</td></tr>
      <tr><td>ثمّ</td><td>الترتيب مع التراخٍ</td><td class="ser">سافرَ ثمّ استراحَ</td></tr>
      <tr><td>حتى</td><td>انتهاء الغاية</td><td class="ser">أكلتُ السمكةَ حتى رأسها</td></tr>
      <tr><td>أو</td><td>التخيير</td><td class="ser">العلمُ أو العملُ</td></tr>
      <tr><td>أم</td><td>الاستفهام المنقطع</td><td class="ser">أأنتَ أم أنا</td></tr>
      <tr><td>بل</td><td>الإضراب</td><td class="ser">ليس فلانٌ بخيلًا بل كريمٌ</td></tr>
      <tr><td>لا سيّما</td><td>الاستثناء</td><td class="ser">أحبُّ الطلابَ لا سيّما المتفوقينَ</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s1">أنواع المعطوف</h3>
  <ul>
    <li><strong>مطابق</strong>: يوافق المعطوف عليه في الإعراب والتعريف: <span class="ser">جاءَ زيدٌ وعمروٌ</span></li>
    <li><strong>غير مطابق</strong>: لا يوافقه، مثل عطف النكرة على المعرفة، أو الجمع على المفرد.</li>
  </ul>
  `
},

/* ============ 15. الإضافة ============ */
{
  id:"idafa",
  title:"الإضافة وأنواعها",
  cat:"asasi",
  icon:"📦",
  summary:"الإضافة التزامية والانتهائية، وأحكام المضاف والمضاف إليه، والإضافة اللفظية والمعنوية.",
  examples:[
    {text:"كتابُ الطالبِ", note:"إضافة تزامنية"},
    {text:"غُرفةُ الدراسةِ", note:"إضافة انتهائية"},
    {text:"شاهدتُ طالبًا فاضلًا", note:"إضافة انتهائية نكرة"},
  ],
  videos:[
    {title:"الإضافة التزامية والانتهائية", q:"الإضافة التزامية والانتهائية"},
  ],
  html:`
  <h3 class="sec" id="s1">الإضافة التزامية</h3>
  <p>هو أن يلزم المضاف صورة الإضافة، فلا يُفَرَّد ولا يُؤَنَّث ولا يُجمع.</p>
  <div class="ex-list">
    <div class="ex"><span class="ex-mark">١</span><span class="ex-text">أبو بكرٍ</span><span class="ex-note">لا يقال: أبٌ</span></div>
    <div class="ex"><span class="ex-mark">٢</span><span class="ex-text">ذو العقلِ</span><span class="ex-note">لا يُفَرَّد</span></div>
    <div class="ex"><span class="ex-mark">٣</span><span class="ex-text">حيُّ القيامةِ</span><span class="ex-note">لا يُؤَنَّث</span></div>
  </div>

  <h3 class="sec" id="s2">الإضافة الانتهائية</h3>
  <p>إذا كان المضاف نكرة وكان المضاف إليه صحيحة للاحتمالين، فهذه إضافة انتهائية.</p>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>النوع</th><th>المثال</th><th>الحكم</th></tr></thead>
    <tbody>
      <tr><td>لفظية</td><td class="ser">شاهدتُ طالبًا فاضلًا</td><td>يدلّ على الوصف</td></tr>
      <tr><td>معنوية</td><td class="ser">شاهدتُ طالبًا فضلُه</td><td>يدلّ على الملكية</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s3">أحكام المضاف والمضاف إليه</h3>
  <ul>
    <li><strong>المضاف</strong>: يجرّ ما بعده بالفتحة الظاهرة، ويُعرَّف غالبًا.</li>
    <li><strong>المضاف إليه</strong>: يجرّ بـ«مِن» أو «اللام» أو «الباء»، ويُعرَّف غالبًا.</li>
  </ul>
  <div class="note warn"><span class="n-ico">⚠️</span><div class="n-body"><h5>لا إضافة مع التنكير</h5><p>لا تصحّ الإضافة إذا كان المضاف إليه نكرة صريحة، فلا نقول: «كتابُ رجلٍ».</p></div></div>
  `
},

/* ============ 16. الظروف ============ */
{
  id:"zuroof",
  title:"الظروف وأنواعها",
  cat:"marfuat",
  icon:"🧭",
  summary:"أقسام الظروف: زمانية ومكانية، وأنواعها: ظرف صريح وغير صريح.",
  examples:[
    {text:"جلستُ أمامَ البيتِ", note:"ظرف مكان منصوب"},
    {text:"ذاكرتُ ليلًا", note:"ظرف زمان منصوب"},
    {text:"الكتابُ فوقَ الطاولةِ", note:"ظرف مكان خبر"},
  ],
  videos:[
    {title:"الظروف وأنواعها", q:"الظروف وأنواعها"},
  ],
  html:`
  <h3 class="sec" id="s1">الظرف الصريح</h3>
  <p>هو الظرف الزماني أو المكاني الذي لا يستعمل إلا ظرفًا.</p>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الزمانية</th><th>المكانية</th></tr></thead>
    <tbody>
      <tr><td class="ser">حين، الآن، يومئذ، أمس، غدًا، فورًا، ليلًا، صباحًا</td><td class="ser">أمام، خلف، فوق، تحت، يمين، شمال، بين، عند، حيث</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s2">الظرف غير الصريح</h3>
  <p>هو ما يصحّ استعماله ظرفًا أو لا، مثل: <span class="ser">أبدًا، أبداً، قط، حذاء، صدر، تلقاء، يمين</span>.</p>
  <div class="note tip"><span class="n-ico">🎯</span><div class="n-body"><h5>حالات الظرف</h5><p>قد يكون: مفعولًا به منصوبًا، أو خبرًا مقدمًا، أو حالًا، أو مبتدأ مؤخَّرًا.</p></div></div>

  <h3 class="sec" id="s3">ظروف المكان المتصلة والمنفصلة</h3>
  <ul>
    <li><strong>متصلة</strong>: <span class="ser">فوقَ، تحتَ، أمامَ</span> — ينفكّ ما بعدها.</li>
    <li><strong>منفصلة</strong>: <span class="ser">فوقُ، تحتُ</span> — ما بعدها مضاف أو ضمير.</li>
  </ul>
  `
},

/* ============ 17. العدد ============ */
{
  id:"adad",
  title:"العدد وعلاقته بالاسم",
  cat:"sarf",
  icon:"🔢",
  summary:"أقسام العدد، وإعراب المعدود، والتذكير والتأنيث، وتركيبات العدد المركّبة.",
  examples:[
    {text:"ثلاثةُ كتبٍ", note:"عدد واسم معطوف"},
    {text:"ثلاثُ طالباتٍ", note:"مؤنث"},
    {text:"العشرون طالبًا", note:"معدود منصوب"},
  ],
  videos:[
    {title:"العدد وعلاقته بالاسم", q:"العدد وعلاقته بالاسم"},
  ],
  html:`
  <h3 class="sec" id="s1">أقسام العدد</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>العدد</th><th>المفرد</th><th>المثنّى</th><th>الجمع</th></tr></thead>
    <tbody>
      <tr><td>١</td><td class="ser">واحد</td><td class="ser">اثنان</td><td class="ser">واحدون</td></tr>
      <tr><td>٢</td><td class="ser">اثنان</td><td class="ser">أربعة</td><td class="ser">أربعة</td></tr>
      <tr><td>٣</td><td class="ser">ثلاثة</td><td class="ser">ثلاث</td><td class="ser">ثلاث</td></tr>
      <tr><td>٤</td><td class="ser">أربعة</td><td class="ser">أربع</td><td class="ser">أربع</td></tr>
      <tr><td>٥</td><td class="ser">خمسة</td><td class="ser">خمس</td><td class="ser">خمس</td></tr>
      <tr><td>٦</td><td class="ser">ستة</td><td class="ser">ستّ</td><td class="ser">ستّ</td></tr>
      <tr><td>٧</td><td class="ser">سبعة</td><td class="ser">سبع</td><td class="ser">سبع</td></tr>
      <tr><td>٨</td><td class="ser">ثمانية</td><td class="ser">ثماني</td><td class="ser">ثماني</td></tr>
      <tr><td>٩</td><td class="ser">تسعة</td><td class="ser">تسع</td><td class="ser">تسع</td></tr>
      <tr><td>١٠</td><td class="ser">عشرة</td><td class="ser">عشر</td><td class="ser">عشر</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s2">قواعد العدد والمعدود</h3>
  <ul>
    <li><strong>١ و٢</strong>: يوافقان المعدود تمامًا: <span class="ser">كتابٌ واحدٌ، كتابانِ اثنانِ</span>.</li>
    <li><strong>٣–٩</strong>: يخالفان المعدود في التذكير والتأنيث: <span class="ser">ثلاثةُ كتبٍ / ثلاثُ طالباتٍ</span>.</li>
    <li><strong>١٠</strong>: يوافق المعدود: <span class="ser">عشرُ كتبٍ / عشرةُ كتبٍ</span>.</li>
    <li><strong>١١ و١٢</strong>: يوافقان تمامًا في المعنى: <span class="ser">أحدَ عشرَ كوكبًا</span>.</li>
    <li><strong>١٣–١٩</strong>: الجزء الأول يخالف، والثاني يوافق.</li>
  </ul>

  <h3 class="sec" id="s3">تركيبات العدد المركّبة</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>التركيب</th><th>المعدود</th><th>المثال</th></tr></thead>
    <tbody>
      <tr><td>معدود معطوف</td><td>مجرور</td><td class="ser">ثلاثةُ كتبٍ</td></tr>
      <tr><td>معدود منصوب</td><td>منصوب</td><td class="ser">ثلاثُ كتبٍ ← ثلاثة كتبًا</td></tr>
      <tr><td>معدود مضاف</td><td>مضاف إليه</td><td class="ser">كتبُ الثلاثةِ</td></tr>
      <tr><td>عدد مجرور بـ«من»</td><td>مجرور</td><td class="ser">من ثلاثةِ كتبٍ</td></tr>
    </tbody>
  </table></div>
  `
},

/* ============ 18. الممنوع من الصرف ============ */
{
  id:"mamnu'",
  title:"الممنوع من الصرف",
  cat:"sarf",
  icon:"🚫",
  summary:"الاسم عَلَم الذي لا يُصَرَّف، وشروطه وعلاماته وأحواله في الإعراب.",
  examples:[
    {text:"مررتُ بأحمدَ", note:"مجرور بالفتحة"},
    {text:"مررتُ بالصفَّ", note:"ممنوع من الصرف مضاف"},
    {text:"دخلتُ المساجدَ", note:"منصوب بالفتحة"},
  ],
  videos:[
    {title:"الممنوع من الصرف", q:"الممنوع من الصرف"},
  ],
  html:`
  <p class="art-lead">الممنوع من الصرف هو <strong>الاسم عَلَم</strong> الذي لا يُصَرَّف، فلا يُنوَّن ولا يُؤَنَّث، ويُعرَف بـ«أل» أو الإضافة.</p>

  <h3 class="sec" id="s1">شروطه</h3>
  <ol>
    <li>أن يكون <strong>عَلَمًا</strong>.</li>
    <li>أن يكون <strong>ممنوعًا من الصرف</strong> (ممنوع التأنيث أو التذكير).</li>
    <li>أن يليه ما يُعرِّفه أو يُحدِّده.</li>
  </ol>

  <h3 class="sec" id="s2">علاماته</h3>
  <ul>
    <li><strong>الفتحة</strong>: إذا سبقه حرف الجرّ: <span class="ser">مررتُ بمساجدَ</span></li>
    <li><strong>الياء</strong>: إذا سبقه حرف الجرّ وصحّت الياء: <span class="ser">مررتُ بمساجدِ</span></li>
    <li><strong>السكون</strong>: إذا كان مضافًا إليه: <span class="ser">أعجبني مساجدُ المدينةِ</span></li>
  </ul>

  <h3 class="sec" id="s3">أقسام الممنوع من الصرف</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>القسم</th><th>الشرط</th><th>المثال</th></tr></thead>
    <tbody>
      <tr><td>ممنوع التأنيث</td><td>مؤنث + صيغة مذكر</td><td class="ser">فاطمة، صحراء</td></tr>
      <tr><td>ممنوع التذكير</td><td>مذكر + صيغة مؤنثة</td><td class="ser">أحمد، مساجد</td></tr>
      <tr><td>ملحق بجمع</td><td>شكله جمعًا</td><td class="ser">مساجد، مصابيح</td></tr>
    </tbody>
  </table></div>
  `
},

/* ============ 19. المبنيات ============ */
{
  id:"mabniyat",
  title:"المبنيات: الأسماء الخمسة والمرفوعات والمنصوبات",
  cat:"mabniyat",
  icon:"🧱",
  summary:"الاسم الذي لا يتغيّر آخره بتغيّر العوامل، وأقسامه وعلاماته.",
  examples:[
    {text:"أكرمَ الأخوانِ", note:"مثنى مبني على الفتح"},
    {text:"جاءَ المسلمونَ", note:"جمع مذكر سالم مبني على الضم"},
    {text:"مررتُ بأخي", note:"اسم خمسة مبني على الكسر"},
  ],
  videos:[
    {title:"الأسماء الخمسة", q:"الأسماء الخمسة"},
    {title:"المرفوعات والمنصوبات", q:"المرفوعات والمنصوبات"},
  ],
  html:`
  <h3 class="sec" id="s1">أقسام المبنيات</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>القسم</th><th>علامة البناء</th><th>المثال</th></tr></thead>
    <tbody>
      <tr><td>الأسماء الخمسة</td><td>الكسرة</td><td class="ser">أخي، أبي، حيّي</td></tr>
      <tr><td>المرفوعات</td><td>الضمّة</td><td class="ser">المسلمونَ، الأخوانِ</td></tr>
      <tr><td>المنصوبات</td><td>الفتحة</td><td class="ser">المسلمينَ، الأخوينِ</td></tr>
      <tr><td>جمع المؤنث السالم</td><td>الكسرة</td><td class="ser">المسلماتُ</td></tr>
      <tr><td>المنقوص</td><td>الكسرة</td><td class="ser">المدعوونَ ← المدعوِّ</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s2">الأسماء الخمسة</h3>
  <p>هي: <span class="ser">أبي، أخي، حيّي، مستوردي، ذو</span> — وتُبنى على الكسرة في محل النصب والجرّ.</p>

  <h3 class="sec" id="s3">حالات البناء والرفع</h3>
  <ul>
    <li><strong>المرفوعات</strong>: يُبنى على الضم في محل النصب: <span class="ser">رأيتُ المسلمونَ</span></li>
    <li><strong>المنصوبات</strong>: يُبنى على الفتح في محل الجرّ: <span class="ser">مررتُ بالمسلمينَ</span></li>
    <li><strong>الأسماء الخمسة</strong>: تُبنى على الكسر في كل الأحوال.</li>
  </ul>
  `
},

/* ============ 20. حروف الجر ============ */
{
  id:"harf-jarr",
  title:"حروف الجرّ وأنواع الاسم المجرور",
  cat:"mabniyat",
  icon:"🧲",
  summary:"حروف الجرّ وما تُجرّه، والاسم المجرور والمجرور بغير حرف.",
  examples:[
    {text:"ذهبتُ إلى المدرسةِ", note:"حرف جرّ + اسم مجرور"},
    {text:"كتابُ الطالبِ", note:"مضاف إليه مجرور"},
    {text:"جلستُ أمامَ البيتِ", note:"ظرف مكان مجرور"},
  ],
  videos:[
    {title:"حروف الجرّ", q:"حروف الجرّ"},
    {title:"المجرورات", q:"المجرورات"},
  ],
  html:`
  <h3 class="sec" id="s1">حروف الجرّ</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الحرف</th><th>المدلول</th><th>مثال</th></tr></thead>
    <tbody>
      <tr><td>مِن</td><td>الابتداء</td><td class="ser">ذهبتُ من البيتِ</td></tr>
      <tr><td>إلى</td><td>الانتهاء</td><td class="ser">سافرتُ إلى المدينةِ</td></tr>
      <tr><td>عن</td><td>المجاوزة</td><td class="ser">ابتعدَ عن الشرِّ</td></tr>
      <tr><td>على</td><td>الاستعلاء</td><td class="ser">الكتابُ على الطاولةِ</td></tr>
      <tr><td>في</td><td>الظرفية</td><td class="ser">الماءُ في الكوبِ</td></tr>
      <tr><td>اللام</td><td>المِلك</td><td class="ser">الكتابُ لي</td></tr>
      <tr><td>الباء</td><td>الإلصاق أو الاستعانة</td><td class="ser">كتبتُ بالقلمِ</td></tr>
      <tr><td>كَ</td><td>التشبيه</td><td class="ser">العلمُ كالنورِ</td></tr>
      <tr><td>ربّ</td><td>التقليل</td><td class="ser">ربَّ قويٍّ ذلَّ</td></tr>
      <tr><td>لَمّا / لولا / مذ / منذ</td><td>ظرفية</td><td class="ser">ما رأيتُه منذ يومينِ</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s2">أنواع الاسم المجرور</h3>
  <ul>
    <li><strong>مجرور بحرف</strong>: <span class="ser">ذهبتُ إلى المدرسةِ</span></li>
    <li><strong>مجرور بحرف جازم</strong>: <span class="ser">ما جاءَ إلا زيدٌ</span></li>
    <li><strong>مجرور بحرف لا محلّ له</strong>: <span class="ser">إذا جاءَ رمضانُ</span></li>
  </ul>
  `
},

/* ============ 21. الأساليب ============ */
{
  id:"aslub",
  title:"الأساليب اللغوية",
  cat:"asalib",
  icon:"🎭",
  summary:"الاستفهام، النداء، الشرط، التعجب، التمنّي، الإغراء، النفي، أسلوب الحصر.",
  examples:[
    {text:"أَأنتَ ذاهبٌ؟", note:"استفهام"},
    {text:"يا طالبُ اجتهدْ", note:"نداء"},
    {text:"إن تجتهدْ تنجحْ", note:"شرط"},
    {text:"ما أجملَ السماءَ!", note:"تعجب"},
  ],
  videos:[
    {title:"أسلوب النداء", q:"أسلوب النداء"},
    {title:"أسلوب الشرط", q:"أسلوب الشرط"},
    {title:"أسلوب التعجب", q:"أسلوب التعجب"},
  ],
  html:`
  <h3 class="sec" id="s1">أسلوب الاستفهام</h3>
  <p>هو طلب العلم بشيء مجهول، وينقسم إلى:</p>
  <ul>
    <li><strong>استفهام حقيقي</strong>: <span class="ser">أَجاءَ زيدٌ؟</span></li>
    <li><strong>استفهام إنكاري</strong>: <span class="ser">أَأنتَ تفعلُ ذلكَ؟</span></li>
    <li><strong>استفهام تقريري</strong>: <span class="ser">أَأنتَ صادقٌ؟</span></li>
  </ul>

  <h3 class="sec" id="s2">أسلوب النداء</h3>
  <p>هو نداء المنادى بحرف من حروف النداء، وينقسم إلى:</p>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>النوع</th><th>المنادى</th><th>المثال</th><th>الحالة</th></tr></thead>
    <tbody>
      <tr><td>مفرد نكرة</td><td>منصوب</td><td class="ser">يا رجلُ</td><td>نكرة مقصودة</td></tr>
      <tr><td>مفرد معرَّف بـ«أل»</td><td>مبني على الضم</td><td class="ser">يا الطالبُ</td><td>ممنوع من الصرف</td></tr>
      <tr><td>مضف</td><td>مبني على الضم</td><td class="ser">يا طالبَ الفصلِ</td><td>مضاف</td></tr>
      <tr><td>مستغنى عنه</td><td>مبني على الضم</td><td class="ser">يا معلّمُ</td><td>مفرد معرفة</td></tr>
      <tr><td>مضاف لاسم موصول</td><td>مبني على الضم</td><td class="ser">يا من نجحَ</td><td>مبني على الضم</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s3">أسلوب الشرط</h3>
  <p>هو جملتان: <strong>فعل شرط</strong> و<strong>فعل جزم</strong>، بينهما حرف يربطهما.</p>
  <div class="ex-list">
    <div class="ex"><span class="ex-mark">١</span><span class="ex-text">إن تجتهدْ تنجحْ</span><span class="ex-note">إن + فعل الشرط + فعل الجزم</span></div>
    <div class="ex"><span class="ex-mark">٢</span><span class="ex-text">إذا جاءَ المطرُ ارتاحَ الأرضُ</span><span class="ex-note">إذا: ظرف لما يُستقبل</span></div>
  </div>

  <h3 class="sec" id="s4">أسلوب التعجب والتمنّي والإغراء</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الأسلوب</th><th>الصيغة</th><th>المثال</th></tr></thead>
    <tbody>
      <tr><td>التعجب</td><td class="ser">ما أفعلَه! / ما أفعلْهُ!</td><td class="ser">ما أجملَ السماءَ!</td></tr>
      <tr><td>التمنّي</td><td>ليتَ / يا ليتَ</td><td class="ser">ليتَ الشبابَ عائدٌ</td></tr>
      <tr><td>الإغراء</td><td>أَوْعَدْ / هَيَّا</td><td class="ser">أَوْعَدْ بالاجتهادِ</td></tr>
      <tr><td>النفي</td><td>لا / لن / ما / إمّا</td><td class="ser">لن أنساكَ</td></tr>
      <tr><td>القصر</td><td>ما...إلّا / إنما / إلا</td><td class="ser">ما نجحتُ إلا بالاجتهادِ</td></tr>
    </tbody>
  </table></div>

  <div class="note tip"><span class="n-ico">🎯</span><div class="n-body"><h5>أسلوب الحصر</h5><p>يُفيد القصر نوعين: <strong>قصر إثبات</strong>: «إنما نجحَ المجتهدُ». و<strong>قصر نفي</strong>: «ما نجحتُ إلا بالاجتهادِ».</p></div></div>
  `
},

/* ============ 22. المشتقات ============ */
{
  id:"mushtaqqat",
  title:"المشتقات: الصفة المشبّهة واسم التفضيل وأسماء المبالغة",
  cat:"mushtaqq",
  icon:"🌱",
  summary:"أسماء المشتقّات وصيغها وأحكامها: المفرد، المثنّى، جمع التكسير، الموصولة بالأل.",
  examples:[
    {text:"الطفلُ حسنٌ", note:"صفة مشبّهة"},
    {text:"محمدٌ أجملُ من عليٍّ", note:"اسم تفضيل"},
    {text:"الرجلُ كثيرُ الشجعانِ", note:"مبالغة"},
  ],
  videos:[
    {title:"اسم التفضيل", q:"اسم التفضيل"},
    {title:"أسماء المبالغة", q:"أسماء المبالغة"},
  ],
  html:`
  <h3 class="sec" id="s1">الصفة المشبّهة</h3>
  <p>هي اسم يدلّ على صفة ثابتة، وصيغتها <span class="ser">فَعِيل، فَعِيل، فَعِل</span>.</p>
  <div class="ex-list">
    <div class="ex"><span class="ex-mark">١</span><span class="ex-text">الطفلُ حسنٌ</span><span class="ex-note">صفة مشبّهة</span></div>
    <div class="ex"><span class="ex-mark">٢</span><span class="ex-text">المرأةُ حسناءُ</span><span class="ex-note">مؤنثها</span></div>
  </div>

  <h3 class="sec" id="s2">اسم التفضيل</h3>
  <p>هو اسم يدلّ على أن شيئًا زاد على غيره، وصيغته <span class="ser">أَفْعَل</span>.</p>
  <ul>
    <li>مضافًا: <span class="ser">محمدٌ أكرمُ الناسِ</span></li>
    <li>غير مضاف مع «مِن»: <span class="ser">العلمُ أفضلُ من المالِ</span></li>
    <li>مضافًا لشيء لا مثيل له: <span class="ser">اللهُ أعلمُ</span></li>
  </ul>

  <h3 class="sec" id="s3">أسماء المبالغة</h3>
  <p>هي أسماء تدلّ على كثرة ما تدلّ عليه الصفة.</p>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الصيغة</th><th>المثال</th></tr></thead>
    <tbody>
      <tr><td class="ser">فَعَّال</td><td class="ser">كَاتِب، رامٍ، حاذق</td></tr>
      <tr><td class="ser">مِفْعَال</td><td class="ser">مِحْبَر، مِفتاح</td></tr>
      <tr><td class="ser">فَعُول</td><td class="ser">صبور، شكور</td></tr>
      <tr><td class="ser">فَعِيل</td><td class="ser">رحيم، حليم</td></tr>
      <tr><td class="ser">مِفْعَل</td><td class="ser">مِثقال</td></tr>
      <tr><td class="ser">فَعِل</td><td class="ser">جَمِيل، كَريم</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s4">اسم الفاعل واسم المفعول</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الاسم</th><th>الصيغة</th><th>المثال</th></tr></thead>
    <tbody>
      <tr><td>اسم الفاعل</td><td class="ser">فَاعِل</td><td class="ser">كاتبٌ، يقرأُ</td></tr>
      <tr><td>اسم المفعول</td><td class="ser">مَفْعُول</td><td class="ser">مكتوبٌ، مقروءٌ</td></tr>
    </tbody>
  </table></div>
  `
},

/* ============ 23. همزة الوصل وهمزة القطع ============ */
{
  id:"hamz-wasl",
  title:"همزة الوصل وهمزة القطع",
  cat:"sarf",
  icon:"✂️",
  summary:"الفرق بين الهمزتين في النطق والكتابة والتعلّم والاستعمال.",
  examples:[
    {text:"اِستمعَ", note:"همزة وصل"},
    {text:"أَستمعُ", note:"همزة قطع"},
    {text:"اِقْرَأْ", note:"همزة وصل"},
  ],
  videos:[
    {title:"الفرق بين همزة الوصل وهمزة القطع", q:"الفرق بين همزة الوصل وهمزة القطع"},
  ],
  html:`
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الوجه</th><th>همزة الوصل</th><th>همزة القطع</th></tr></thead>
    <tbody>
      <tr><td>النطق</td><td>تُنطق مع الحركة</td><td>تُنطق دائمًا</td></tr>
      <tr><td>التعلّم</td><td>لا تُعلَّم</td><td>تُعلَّم</td></tr>
      <tr><td>الاستعمال</td><td>في الأسماء والأفعال</td><td>في الأسماء فقط</td></tr>
      <tr><td>المثال</td><td class="ser">اِستمع، اِقْرَأ، مِفتاح</td><td class="ser">أَستمع، أَحمد</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s1">همزة الوصل</h3>
  <p>تُتَرك عند الوصل وتُنطق عند الابتداء، وتُكتب ألفًا مقصورة:</p>
  <div class="ex-list">
    <div class="ex"><span class="ex-mark">١</span><span class="ex-text">اِستمعَ</span><span class="ex-note">الفعل</span></div>
    <div class="ex"><span class="ex-mark">٢</span><span class="ex-text">اِسماعيل</span><span class="ex-note">الاسم</span></div>
    <div class="ex"><span class="ex-mark">٣</span><span class="ex-text">اِمرؤ القيس</span><span class="ex-note">الاسم</span></div>
  </div>

  <h3 class="sec" id="s2">همزة القطع</h3>
  <p>تُنطق دائمًا ولا تُتَرك عند الوصل، وتُكتب ألفًا مقصورة:</p>
  <div class="ex-list">
    <div class="ex"><span class="ex-mark">١</span><span class="ex-text">أَحمد</span><span class="ex-note">الاسم</span></div>
    <div class="ex"><span class="ex-mark">٢</span><span class="ex-text">أَكرمَ</span><span class="ex-note">الفعل</span></div>
  </div>
  `
},

/* ============ 24. الاسم المقصور والممدود ============ */
{
  id:"maqsu",
  title:"الاسم المقصور والممدود والمنقوص",
  cat:"sarf",
  icon:"📐",
  summary:"أقسام الأسماء الثلاثة وأحكامها في الإعراب والصرف.",
  examples:[
    {text:"فتاةٌ عذراءُ", note:"اسم مقصور"},
    {text:"ساحةٌ واسعةٌ", note:"اسم ممدود"},
    {text:"المدعوونَ", note:"منقوص"},
  ],
  videos:[
    {title:"الاسم المقصور والممدود", q:"الاسم المقصور والممدود"},
  ],
  html:`
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>النوع</th><th>التعريف</th><th>المثال</th></tr></thead>
    <tbody>
      <tr><td>مقصور</td><td>ينتهي بـ«ا» مقصورة</td><td class="ser">فتاة، عذراء، عصا</td></tr>
      <tr><td>ممدود</td><td>ينتهي بـ«ا» مدّة</td><td class="ser">ساحة، فتاة، مستشفى</td></tr>
      <tr><td>منقوص</td><td>ينتهي بحرف علّة مكسور</td><td class="ser">مدعو، داعي، قارئ</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s1">الاسم المقصور</h3>
  <ul>
    <li>يُنصَب بالفتحة في محل النصب: <span class="ser">رأيتُ فتاةً</span></li>
    <li>يُجَرّ بالكسرة في محل الجرّ: <span class="ser">مررتُ بفتاةٍ</span></li>
    <li>يُرفع بالضمة في محل الرفع: <span class="ser">جاءَتْ فتاةٌ</span></li>
  </ul>

  <h3 class="sec" id="s2">الاسم الممدود</h3>
  <ul>
    <li>يُنصَب بالفتحة في محل النصب: <span class="ser">رأيتُ ساحةً</span></li>
    <li>يُجَرّ بالكسرة في محل الجرّ: <span class="ser">مررتُ بساحةٍ</span></li>
    <li>يُرفع بالضمة في محل الرفع: <span class="ser">جاءَتْ ساحةٌ</span></li>
  </ul>

  <h3 class="sec" id="s3">الاسم المنقوص</h3>
  <ul>
    <li>يُرفع بالكسرة في محل الرفع: <span class="ser">المدعوُّ</span></li>
    <li>يُنصَب بالفتحة في محل النصب: <span class="ser">رأيتُ المدعوِّ</span></li>
    <li>يُجَرّ بالكسرة في محل الجرّ: <span class="ser">مررتُ بالمدعوِّ</span></li>
  </ul>
  `
},

/* ============ 25. علامات الإعراب ============ */
{
  id:"harakat",
  title:"علامات الإعراب والبناء",
  cat:"asasi",
  icon:"✍️",
  summary:"الضمة والفتحة والكسرة والسكون، وحروف المدّ والألف المقصورة.",
  examples:[
    {text:"جاءَ الطالبُ", note:"الضمة علامة رفع"},
    {text:"قرأتُ الدرسَ", note:"الفتحة علامة نصب"},
    {text:"مررتُ بالطالبِ", note:"الكسرة علامة جرّ"},
  ],
  videos:[
    {title:"علامات الإعراب", q:"علامات الإعراب"},
  ],
  html:`
  <h3 class="sec" id="s1">علامات الإعراب الأصلية</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الإعراب</th><th>العلامة</th><th>المثال</th></tr></thead>
    <tbody>
      <tr><td>الرفع</td><td>الضمة</td><td class="ser">جاءَ الطالبُ</td></tr>
      <tr><td>النصب</td><td>الفتحة</td><td class="ser">قرأتُ الدرسَ</td></tr>
      <tr><td>الجرّ</td><td>الكسرة</td><td class="ser">مررتُ بالطالبِ</td></tr>
      <tr><td>الجزم</td><td>السكون</td><td class="ser">لم يذهبْ</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s2">حروف المدّ</h3>
  <ul>
    <li><strong>الألف</strong>: علامة نصب للمثنى: <span class="ser">الطالبانِ</span></li>
    <li><strong>الياء</strong>: علامة جرّ للمثنى: <span class="ser">الطالبينِ</span></li>
    <li><strong>الواو</strong>: علامة رفع لجمع المذكر السالم: <span class="ser">الطلابونَ</span></li>
    <li><strong>الفتحة</strong>: علامة نصب لجمع المذكر السالم: <span class="ser">الطلابينَ</span></li>
  </ul>

  <div class="note gold"><span class="n-ico">🔑</span><div class="n-body"><h5>قاعدة ذهبية</h5><p>الضمة رفع، الفتحة نصب، الكسرة جرّ، السكون جزم — وهي العلامات الأصلية التي تُستبدل بحروف المدّ في الحالات الخاصة.</p></div></div>
  `
},

/* ============ 26. المصدر ============ */
{
  id:"misdar",
  title:"المصدر وأغراضه",
  cat:"mushtaqq",
  icon:"📚",
  summary:"تعريف المصدر وصيغه وأغراضه البلاغية والنحوية.",
  examples:[
    {text:"نصرَ اللهُ المسلمينَ نصرًا", note:"توكيد"},
    {text:"سافرتُ طلبًا للعلمِ", note:"سبب"},
    {text:"كتبَ الكتابَ", note:"تعدية"},
  ],
  videos:[
    {title:"المصدر وأغراضه", q:"المصدر وأغراضه"},
  ],
  html:`
  <h3 class="sec" id="s1">صيغ المصدر</h3>
  <div class="tbl-wrap"><table class="tbl">
    <thead><tr><th>الصيغة</th><th>المثال</th></tr></thead>
    <tbody>
      <tr><td>فَعْل</td><td class="ser">كتب، نصر</td></tr>
      <tr><td>فَعَل</td><td class="ser">سبح، رحم</td></tr>
      <tr><td>فُعُل</td><td class="ser">قُدُس، حُبّ</td></tr>
      <tr><td>فَعَال</td><td class="ser">كتاب، شراب</td></tr>
      <tr><td>فُعُول</td><td class="ser">قُتُول، صُدُور</td></tr>
      <tr><td>فَعِيل</td><td class="ser">سَعِيد، حَمِيد</td></tr>
      <tr><td>تَفْعِيل</td><td class="ser">تَعْليم، تَعْظيم</td></tr>
      <tr><td>اِفْتِعَال</td><td class="ser">اِفْتِتاح، اِسْتِغْفار</td></tr>
      <tr><td>تَفَعُّل</td><td class="ser">تَذَكُّر، تَعَلُّم</td></tr>
      <tr><td>مَفْعَل</td><td class="ser">مَجْلِس، مَسْجِد</td></tr>
    </tbody>
  </table></div>

  <h3 class="sec" id="s2">أغراض المصدر</h3>
  <ul>
    <li><strong>التوكيد</strong>: <span class="ser">فرحَ الطفلُ فرحًا</span></li>
    <li><strong>التعدية</strong>: <span class="ser">وقفَ الطفلُ وقوفًا</span></li>
    <li><strong>السببية</strong>: <span class="ser">سافرتُ طلبًا للعلمِ</span></li>
    <li><strong>العطف</strong>: <span class="ser">كان زيدٌ كريمًا وشجاعًا</span></li>
    <li><strong>المفعول المطلق</strong>: <span class="ser">كتبْتُ الكتابَ</span></li>
  </ul>
  `
},

];

/* ============ إحصائيات تُستخدم في الصفحة الرئيسية ============ */
const GRAMMAR_STATS = {
  lessons: GRAMMAR.length,
  categories: GRAMMAR_CATS.length - 1,
  examples: GRAMMAR.reduce((a,l)=>a+(l.examples?l.examples.length:0),0),
};
