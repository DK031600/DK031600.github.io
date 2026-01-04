const API_URL =
  "https://script.google.com/macros/s/AKfycbyczWzD2jqdNc3NtmYUwBUFh3Bo60PwjBLL7gejCBy_1EpKShqbDDIG5dDZprSxfo3d/exec";

const boardEl = document.getElementById("board");

// 날짜 포맷
function formatDate(v) {
  const d = new Date(v);
  if (isNaN(d)) return v;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// 게시판 로드
function loadBoard() {
  fetch(API_URL)
    .then(res => res.text()) // 🔥 JSON 파싱조차 안 함
    .then(text => {
      const data = JSON.parse(text);
      const rows = data.board.slice(1); // 헤더 제거

      boardEl.innerHTML = "";

      rows.forEach(row => {
        const [title, writer, content, date] = row;

        const box = document.createElement("div");
        box.className = "box";
        box.innerHTML = `
          <div class="box-title">게시글</div>
          <div class="post-title">${title}</div>
          <div class="post-date">${formatDate(date)} · ${writer}</div>
          <div class="post-content">${content}</div>
        `;

        boardEl.appendChild(box);
      });
    })
    .catch(err => {
      console.error(err);
      boardEl.innerHTML = "<p>게시글을 불러오지 못했습니다.</p>";
    });
}

// 메뉴
document.getElementById("menu-home").onclick = e => {
  e.preventDefault();
  boardEl.innerHTML = "";
};

document.getElementById("menu-board").onclick = e => {
  e.preventDefault();
  loadBoard();
};

// 자동 로딩
window.addEventListener("DOMContentLoaded", loadBoard);
