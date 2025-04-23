const API_KEY = "$2a$10$NFUSo8sG9ArSl9qM9yHKYOc2EC.8GaSPpsZnQzYTQXuVzkyAfDJgq";  // ضع مفتاح API هنا
const BIN_ID = "68096ba58960c979a58bc0b3";            // ضع معرف BIN هنا

document.getElementById("bookForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const pages = document.getElementById("pages").value;
  const pdfFile = document.getElementById("pdfFile").files[0];
  const coverFile = document.getElementById("coverFile").files[0];

  // استخدام FileReader لقراءة الصورة (غلاف الرواية)
  const reader = new FileReader();
  reader.onload = async () => {
    const coverBase64 = reader.result;

    // رفع ملف PDF إلى GitHub أو استخدام خدمة رفع ملفات أخرى (مثال: Dropbox)
    const pdfUrl = "رابط PDF من GitHub أو خدمة رفع أخرى";

    const newBook = { title, description, pages, pdfUrl, cover: coverBase64 };

    // جلب الروايات السابقة من JSONBin
    const existing = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': API_KEY }
    }).then(res => res.json());

    const updatedBooks = [...existing.record, newBook];

    // تخزين الروايات في JSONBin
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': API_KEY
      },
      body: JSON.stringify(updatedBooks)
    });

    alert("تم حفظ الرواية!");
    window.location.reload();
  };

  reader.readAsDataURL(coverFile);  // قراءة الصورة كـ Base64
});
