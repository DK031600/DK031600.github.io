const API_URL = "https://script.google.com/macros/s/AKfycbyczWzD2jqdNc3NtmYUwBUFh3Bo60PwjBLL7gejCBy_1EpKShqbDDIG5dDZprSxfo3d/exec";

// ===============================
// DOM
// ===============================
const boardEl = document.getElementById("board");

// ===============================
// 유틸
// ===============================
function formatDate(v) {
  const d = new Date(v);
  if (isNaN(d)) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// ===============================
// 데이터
// ===============================
let boardData = [];

// ===============================
// 데이터 로드
// ===============================
function loadBoard() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      boardData = data.board.slice(1); // 헤더 제거
      showBoard();
    })
    .catch(err => {
      console.error("게시판 로드 실패", err);
    });
}

// ===============================
// 화면
// ===============================
function showHome() {
  boardEl.innerHTML = "";
}

function showBoard() {
  boardEl.innerHTML = "";
  boardEl.style.display = "block";

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

// ===============================
// 메뉴
// ===============================
menu-home.onclick = e => {
  e.preventDefault();
  showHome();
};

menu-board.onclick = e => {
  e.preventDefault();
  loadBoard();
};

// 초기
showHome();
