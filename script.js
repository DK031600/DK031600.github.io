const API_URL =
  "https://script.google.com/macros/s/AKfycbyczWzD2jqdNc3NtmYUwBUFh3Bo60PwjBLL7gejCBy_1EpKShqbDDIG5dDZprSxfo3d/exec";

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
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// ===============================
// 데이터
// ===============================
let boardData = [];

// ===============================
// 로드
// ===============================
function loadBoard() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      boardData = data.board.slice(1); // 헤더 제거
      showBoard();
    })
    .catch(err => {
      console.error(err);
      boardEl.innerHTML = "<p>게시글을 불러오지 못했습니다.</p>";
    });
}

// ===============================
// 렌더링
// ===============================
function showBoard() {
  boardEl.innerHTML = "";

  boardData.forEach(row => {
    // 🔥 Sheet1 구조 정확히 반영
    const [
      title,
      writer,
      content,
      date,
      isSecret,
      password
    ] = row;

    const box = document.createElement("div");
    box.className = "box";

    // 🔒 비밀글
    if (String(isSecret).toUpperCase() === "TRUE") {
      box.innerHTML = `
        <div class="box-title">🔒 비밀글</div>
        <div class="post-title">${title}</div>
        <div class="post-date">${formatDate(date)} · ${writer}</div>

        <input type="password" class="pw-input" placeholder="비밀번호 입력">
        <button class="pw-btn">확인</button>

        <div class="post-content" style="display:none;"></div>
      `;

      const btn = box.querySelector(".pw-btn");
      const input = box.querySelector(".pw-input");
      const contentEl = box.querySelector(".post-content");

      btn.onclick = () => {
        if (input.value === String(password)) {
          contentEl.textContent = content;
          contentEl.style.display = "block";
          input.remove();
          btn.remove();
        } else {
          alert("비밀번호가 틀렸습니다.");
        }
      };

    } 
    // 🔓 공개글
    else {
      box.innerHTML = `
        <div class="box-title">게시글</div>
        <div class="post-title">${title}</div>
        <div class="post-date">${formatDate(date)} · ${writer}</div>
        <div class="post-content">${content}</div>
      `;
    }

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
