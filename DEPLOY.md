# 🚀 دليل نشر «دار العربية» على GitHub

الموقع ملفات ثابتة بالكامل (HTML + CSS + JS) — لذلك ينشر على **GitHub Pages** مجانًا بنقرة واحدة.

---

## ✅ الطريقة الأولى: السحب والإفلات (الأسهل — بدون تثبيت أي برنامج)

> هذه الطريقة لا تحتاج Git ولا حتى تنزيل شيء.

### الخطوات

1. افتح <https://github.com> وسجّل الدخول (إن لم يكن لديك حساب، أنشئ حسابًا مجانيًا).

2. اضغط زر **New repository** (أو «مستودع جديد»).

3. املأ البيانات:
   | الحقل | القيمة |
   |---|---|
   | Repository name | `dar-al-arabia` (أي اسم تريد) |
   | Description | `منصة تعلّم اللغة العربية: القواعد والمفردات والضد والعكس والإعراب` |
   | Public / Private | **Public** ← ضروري لنشر Pages المجاني |
   | ⚙️ Add a README | ❌ **ألغِ** التحديد |
   | .gitignore | **None** |

4. اضغط **Create repository**.

5. في الصفحة الجديدة اضغط: **uploading an existing file** (رفع ملف موجود).

6. **اسحب كل مجلدات المشروع** وأفلتها في نافذة المتصفح:
   ```
   index.html
   404.html
   css/
   js/
   .github/     ← مهم (سير عمل النشر التلقائي) — اضغط أولًا لإظهار الملفات المخفية
   ```
   > 💡 **لإظهار الملفات المخفية** في نافذة الرفع: اضغط **Ctrl + Shift + .** أو **⌘ + .** على الماكيت.

7. اضغط **Commit changes** (اكتب أي رسالة مثل: `الإصدار الأول`).

8. ✅ انتهى الرفع! انتقل للخطوة **«تفعيل النشر»** بالأسفل.

---

## ✅ الطريقة الثانية: باستخدام Git (للمطوّرين)

### ١) تثبيت Git

- **ويندوز:** نزّل من <https://git-scm.com/download/win> ثم ثبّت (.Next-Next-Finish).
- **ماك:** `brew install git` أو من <https://git-scm.com/download/mac>.
- **لينكس:** `sudo apt install git`

### ٢) إنشاء المستودع على GitHub

من <https://github.com/new> أنشئ مستودعًا **Public** باسم `dar-al-arabia` **بدون** README (أو مع README — لا يهم).

### ٣) الرفع من جهازك

افتح **PowerShell** (أو Terminal) في مجلد المشروع ونفّذ:

```powershell
cd "C:\Users\user\Desktop\arabic-language-site"

git init
git branch -M main
git add .
git commit -m "الإصدار الأول: موقع دار العربية"

# استبدل USERNAME باسم مستخدمك على GitHub
git remote add origin https://github.com/USERNAME/dar-al-arabia.git
git push -u origin main
```

عند طلب كلمة المرور في **Push**:
- **اسم المستخدم:** اسمك على GitHub
- **كلمة المرور:** استعمل **Personal Access Token** وليس كلمة المرور العادية:
  Settings → Developer settings → Personal access tokens → **Tokens (classic)** → Generate new token → خذ صلاحية `repo` → انسخه والصقه.

أو استعمل المفتاح SSH (بدون كلمة مرور في كل مرة):
```powershell
ssh-keygen -t ed25519 -C "email@github.com"
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard
```
ثم في GitHub: Settings → SSH and GPG keys → New SSH key → الصق المفتاح.

### ٤) نشر تلقائي؟

المستودع يحتوي ملف `.github/workflows/pages.yml` — أي أن كل `push` جديد ينشر تلقائيًا. فقط فعّل Pages كما في الخطوة التالية.

---

## 🚀 تفعيل النشر على GitHub Pages

1. في مستودعك على GitHub افتح:
   **Settings** ⚙️ ← **Pages** (في الشريط الجانبي الأيسر)

2. في خانة **Source** (المصدر) اختر:
   ```
   ● Deploy from a branch
   ```
   ثم:
   | الحقل | القيمة |
   |---|---|
   | Branch | `main` |
   | Folder | `/ (root)` |

3. اضغط **Save**.

4. انتظر **١–٢ دقيقة** ثم اضغط **Visit site** أو افتح:
   ```
   https://USERNAME.github.io/dar-al-arabia/
   ```

> 💡 لو لم تظهر صفحة Actions تلقائيًا، اذهب إلى تبويب **Actions** ← اختر workflow اسمه «نشر الموقع على GitHub Pages» ← اضغط **Run workflow**. (يلزم تفعيله مرة واحدة فقط: زر **I understand my workflows, enable them**).

---

## 🔄 التحديث لاحقًا

أي تعديل تجريه على الملفات → ارفعها من جديد:

| الطريقة | الأمر |
|---|---|
| **ويب** | احذف الملف القديم في GitHub → ارفع الجديد (نفس مجلد `js/`) |
| **Git** | `git add .` ثم `git commit -m "تحديث"` ثم `git push` |

> ⏱️ النشر يستغرق ١–٢ دقيقة بعد الدفع.

---

## 🌐 نشر بديل على Netlify أو Vercel (اختياري)

| المنصة | الطريقة |
|---|---|
| **Netlify** | <https://app.netlify.com/drop> → اسحب المجلد كاملًا مباشرة |
| **Vercel** | <https://vercel.com/new> → اربط المستودع → Framework Preset: **Other** |
| **Cloudflare Pages** | اربط المستودع → Build command: *(اتركه فارغًا)* → Output directory: `/` |

---

## ⚙️ التخصيص السريع

| ما تريد تغييره | الملف |
|---|---|
| الألوان والثيم | `css/style.css` (أعلى الملف: `--green-900`، `--gold-500`…) |
| اسم الموقع في الشعار | `index.html` → `<strong>دار العربية</strong>` |
| إضافة درس قواعد | `js/data-grammar.js` → مصفوفة `GRAMMAR` |
| إضافة مفردة | `js/data-vocab.js` → مصفوفة `VOCAB` |
| إضافة مثال إعراب | `js/data-irab.js` → مصفوفة `IRAB` |
| إضافة حرف | `js/data-letters.js` → مصفوفة `LETTERS` |
| مقطع يوتيوب | `js/data-yt.js` → `YT_MAP` |

---

## 🧪 اختبار قبل النشر

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ".\serve.ps1"
```
ثم افتح <http://localhost:8765/> وتأكد أن كل الأقسام تعمل.

---

## ❓ حل المشاكل

| المشكلة | الحل |
|---|---|
| الموقع ٤٠٤ بعد النشر | تأكد أنBranch = `main` و Folder = `/ (root)`، وأن `index.html` في الجذر |
| التنسيق مكسور | تأكد أنك رفعت مجلد `css` و `js` كاملين وليس الملفات فقط |
| المقطع لا يعمل | بعض مقاطع يوتيوب تتوقف إذا حُذف أو تغيّر — استبدله في `js/data-yt.js` |
| التعديلات لا تظهر | امسح ذاكرة المتصفح (Ctrl + F5) — GitHub Pages يحدّث خلال ١–٢ دقيقة |
| «Workflow not found» | فعّل الـ Actions من تبويب Actions في المستودع |
