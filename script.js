const form = document.getElementById("upload-form");
const booksContainer = document.getElementById("books-container");

form.addEventListener("submit", async e => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const pages = document.getElementById("pages").value;
  const coverFile = document.getElementById("cover").files[0];
  const pdfFile = document.getElementById("pdf").files[0];

  if (!coverFile || !pdfFile) return alert("الرجاء رفع صورة الغلاف وملف PDF.");

  const coverData = await toBase64(coverFile);
  const pdfData = await toBase64(pdfFile);

  const book = { title, description, pages, cover: coverData };
  localStorage.setItem(`book-${title}`, JSON.stringify(book));
  localStorage.setItem(`pdf-${title}`, pdfData);

  addBookCard(book);
  form.reset();
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = e => reject(e);
    reader.readAsDataURL(file);
  });
}

function loadBooks() {
  for (let key in localStorage) {
    if (key.startsWith("book-")) {
      const book = JSON.parse(localStorage.getItem(key));
      addBookCard(book);
    }
  }
}

function addBookCard(book) {
  const card = document.createElement("div");
  card.className = "book-card";
  card.innerHTML = `
    <img src="${book.cover}" alt="غلاف الرواية">
    <h3>${book.title}</h3>
    <p>${book.description}</p>
    <p>عدد الصفحات: ${book.pages}</p>
    <button onclick="readBook('${book.title}')">اقرأ الآن</button>
  `;
  booksContainer.appendChild(card);
}

function readBook(title) {
  window.location.href = `reader.html?title=${encodeURIComponent(title)}`;
}

loadBooks();