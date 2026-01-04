// ===============================
// Apps Script API
// ===============================
const API_URL = "https://script.google.com/macros/s/AKfycbyczWzD2jqdNc3NtmYUwBUFh3Bo60PwjBLL7gejCBy_1EpKShqbDDIG5dDZprSxfo3d/exec";

// ===============================
// DOM
// ===============================
const boardEl = document.getElementById("board");
const guestbookEl = document.getElementById("guestbook");

// ===============================
// 유틸
// ===============================
function formatDate(v) {
  if (!v) return "";
  const d = new Date(v);
  if (isNaN(d)) return v;
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;
}

// ===============================
// 데이터 로드
// ===============================
let boardData = [];
let guestData = [];

fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    boardData = data.board.slice(1);      // 헤더 제거
    guestData = data.guestbook.slice(1);  // 헤더 제거
  })
  .catch(err => {
    console.error("데이터 로드 실패", err);
  });

// ===============================
// 렌더링
// ===============================
function showHome() {
  boardEl.style.display = "none";
  guestbookEl.style.display = "none";
  boardEl.innerHTML = "";
  guestbookEl.innerHTML = "";
}

function showBoard() {
  boardEl.style.display = "block";
  guestbookEl.style.display = "none";
  boardEl.innerHTML = "";

  boardData.forEach(row => {
    const [id, title, content, date, isPrivate] = row;
    if (isPrivate === true || isPrivate === "true") return;

    const box = document.createElement("div");
    box.className = "box";
    box.innerHTML = `
      <div class="box-title">게시글</div>
      <div class="post-title"></div>
      <div class="post-date"></div>
      <div class="post-content"></div>
    `;
    box.querySelector(".post-title").textContent = title;
    box.querySelector(".post-date").textContent = formatDate(date);
    box.querySelector(".post-content").textContent = content;

    boardEl.appendChild(box);
  });
}

function showGuestbook() {
  boardEl.style.display = "none";
  guestbookEl.style.display = "block";
  guestbookEl.innerHTML = "";

  guestData.forEach(row => {
    const [id, name, message, date] = row;
    if (!name || !message) return;

    const div = document.createElement("div");
    div.className = "guestbook-item";
    div.textContent = `${name} : ${message} (${formatDate(date)})`;
    guestbookEl.appendChild(div);
  });
}

// ===============================
// 메뉴 이벤트
// ===============================
document.getElementById("menu-home").onclick = e => {
  e.preventDefault();
  showHome();
};
document.getElementById("menu-board").onclick = e => {
  e.preventDefault();
  showBoard();
};
document.getElementById("menu-guestbook").onclick = e => {
  e.preventDefault();
  showGuestbook();
};

// 초기
showHome();
