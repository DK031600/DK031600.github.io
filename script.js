const API_URL =
  "https://script.google.com/macros/s/AKfycbzW2B_PeyeyRslYbMJVn1U4NLEaMxyAmlqX3Y0los2oYEypZLmFSi_ozc5aHnAGz_vp/exec";

// ===============================
// DOM
// ===============================
const boardEl = document.getElementById("board");

// ===============================
// 유틸
// ===============================
function formatDate(v) {
  const d = new Date(v);
  if (isNaN(d)) return v;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

// ===============================
// 게시판 로드
// ===============================
function loadBoard() {
  boardEl.innerHTML = "<p>게시글 불러오는 중...</p>";

  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      if (!data.board || data.board.length <= 1) {
        boardEl.innerHTML = "<p>게시글이 없습니다.</p>";
        return;
      }

      const rows = data.board.slice(1); // 헤더 제거
      renderBoard(rows);
    })
    .catch(err => {
      console.error(err);
      boardEl.innerHTML = "<p>게시글을 불러오지 못했습니다.</p>";
    });
}

// ===============================
// 렌더링
// ===============================
function renderBoard(rows) {
  boardEl.innerHTML = "";

  rows.forEach(row => {
    // ⭐ Sheet1 앞 4칸만 사용
    const title = row[0];
    const writer = row[1];
    const content = row[2];
    const date = row[3];

    if (!title || !content) return;

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
}

// ===============================
// 메뉴
// ===============================
document.getElementById("menu-home").onclick = e => {
  e.preventDefault();
  boardEl.innerHTML = "";
};

document.getElementById("menu-board").onclick = e => {
  e.preventDefault();
  loadBoard();
};

// ===============================
// 자동 로딩
// ===============================
window.addEventListener("DOMContentLoaded", loadBoard);
