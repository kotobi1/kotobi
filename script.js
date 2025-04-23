const API_KEY = "$2a$10$NFUSo8sG9ArSl9qM9yHKYOc2EC.8GaSPpsZnQzYTQXuVzkyAfDJgq";
const BIN_ID = "68096ba58960c979a58bc0b3";

document.getElementById("bookForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const pages = document.getElementById("pages").value;
  const pdfUrl = document.getElementById("pdfUrl").value;
  const coverFile = document.getElementById("cover").files[0];

  const reader = new FileReader();
  reader.onload = async () => {
    const coverBase64 = reader.result;

    const newBook = { title, description, pages, pdfUrl, cover: coverBase64 };

    const existing = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { 'X-Master-Key': API_KEY }
    }).then(res => res.json());

    const updatedBooks = [...existing.record, newBook];

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

  reader.readAsDataURL(coverFile);
});

async function loadBooks() {
  const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: { 'X-Master-Key': API_KEY }
  });
  const data = await res.json();
  const books = data.record;
  const list = document.getElementById("bookList");

  books.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <img src="${book.cover}" alt="غلاف الرواية">
      <h3>${book.title}</h3>
      <p>${book.description}</p>
      <p>الصفحات: ${book.pages}</p>
      <a href="reader.html?pdf=${encodeURIComponent(book.pdfUrl)}" target="_blank">اقرأ الآن</a>
    `;
    list.appendChild(card);
  });
}

loadBooks();
