/* ============================================================
   معرض الصور — رفع وتخزين واستعراض
   تُحفظ الصور محليًا في المتصفح (localStorage) بعد تصغيرها
   ============================================================ */

const IMG_KEY = "dar_arabia_images_v1";
const IMG_MAX_W = 900;
const IMG_MAX_H = 900;
const IMG_QUALITY = 0.72;
const IMG_LIMIT = 30;

const ImageStore = {
  all() {
    try { return JSON.parse(localStorage.getItem(IMG_KEY) || "[]"); }
    catch (e) { return []; }
  },
  save(list) {
    try { localStorage.setItem(IMG_KEY, JSON.stringify(list)); return true; }
    catch (e) { return false; }
  },
  add(dataUrl, caption, lessonId) {
    const list = ImageStore.all();
    const id = "img_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    list.unshift({ id, src: dataUrl, caption: caption || "", lesson: lessonId || "", at: Date.now() });
    while (list.length > IMG_LIMIT) list.pop();
    return ImageStore.save(list) ? id : null;
  },
  remove(id) {
    const list = ImageStore.all().filter(x => x.id !== id);
    return ImageStore.save(list);
  },
  update(id, patch) {
    const list = ImageStore.all();
    const it = list.find(x => x.id === id);
    if (!it) return false;
    Object.assign(it, patch);
    return ImageStore.save(list);
  },
  byLesson(lessonId) {
    return ImageStore.all().filter(x => x.lesson === lessonId);
  },
  usage() {
    const bytes = new Blob([localStorage.getItem(IMG_KEY) || ""]).size;
    return bytes;
  },
  usageLabel() {
    const b = ImageStore.usage();
    if (b < 1024) return b + " بايت";
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " كيلوبايت";
    return (b / (1024 * 1024)).toFixed(2) + " ميجابايت";
  },
};

/* تصغير الصورة وتحويلها إلى dataURL لضغط التخزين */
function resizeImage(file, maxW, maxH, quality) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) { reject(new Error("الملف ليس صورة")); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("تعذّرت قراءة الملف"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("تعذّر فتح الصورة"));
      img.onload = () => {
        let { width: w, height: h } = img;
        const scale = Math.min(1, (maxW || IMG_MAX_W) / w, (maxH || IMG_MAX_H) / h);
        w = Math.round(w * scale); h = Math.round(h * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        try {
          const url = canvas.toDataURL("image/jpeg", quality || IMG_QUALITY);
          resolve({ url, w, h, size: file.size });
        } catch (e) { reject(e); }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
