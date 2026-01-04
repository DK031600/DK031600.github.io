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
  const d = new Date(v);
  if (isNaN(d)) return "";
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`;
}

// ===============================
// 데이터
// ===============================
let boardData = [];
let guestData = [];

// ===============================
// 데이터 로드 (중요)
// ===============================
function loadData(callback) {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      boardData = data.board.slice(1);
      guestData = data.guestbook.slice(1);
      if (callback) callback();
    })
    .catch(err => {
      console.error("데이터 로드 실패", err);
    });
}

// ===============================
// 화면
// ===============================
function showHome() {
  boardEl.style.display = "none";
  guestbookEl.style.display = "none";
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
      <div class="post-title">${title}</div>
      <div class="post-date">${formatDate(date)}</div>
      <div class="post-content">${content}</div>
    `;
    boardEl.appendChild(box);
  });
}

function showGuestbook() {
  boardEl.style.display = "none";
  guestbookEl.style.display = "block";

  guestbookEl.querySelectorAll(".box").forEach(el => el.remove());

  guestData.slice().reverse().forEach(row => {
    const [date, name, message] = row;
    if (!name || !message) return;

    const box = document.createElement("div");
    box.className = "box";
    box.innerHTML = `
      <div class="box-title">방명록</div>
      <div class="post-title">${name}</div>
      <div class="post-date">${formatDate(date)}</div>
      <div class="post-content">${message}</div>
    `;
    guestbookEl.appendChild(box);
  });
}

// ===============================
// 방명록 등록
// ===============================
document.getElementById("guest-submit").onclick = () => {
  const name = document.getElementById("guest-name").value.trim();
  const message = document.getElementById("guest-message").value.trim();

  if (!name || !message) {
    alert("이름과 내용을 입력해주세요.");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ name, message })
  })
  .then(() => {
    document.getElementById("guest-name").value = "";
    document.getElementById("guest-message").value = "";
    loadData(showGuestbook);
  });
};

// ===============================
// 메뉴
// ===============================
menu-home.onclick = e => { e.preventDefault(); showHome(); };
menu-board.onclick = e => { e.preventDefault(); loadData(showBoard); };
menu-guestbook.onclick = e => { e.preventDefault(); loadData(showGuestbook); };

// 초기
showHome();
