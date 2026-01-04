// ===============================
// CSV URL
// ===============================
const BOARD_CSV =
  "https://docs.google.com/spreadsheets/d/1X8y2tnuJG2d04Wu-lN--T_pM_uTUvfRoaQDG2yQUavc/export?format=csv&gid=0";

const GUESTBOOK_CSV =
  "https://docs.google.com/spreadsheets/d/1X8y2tnuJG2d04Wu-lN--T_pM_uTUvfRoaQDG2yQUavc/export?format=csv&gid=1862305863";

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
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function parseCSV(text) {
  return text
    .trim()
    .split("\n")
    .map(row => row.split(",").map(v => v.replace(/^"|"$/g, "")));
}

// ===============================
// 게시판
// ===============================
function loadBoard() {
  boardEl.innerHTML = "";

  fetch(BOARD_CSV)
    .then(res => res.text())
    .then(text => {
      const rows = parseCSV(text);
      rows.slice(1).forEach(r => {
        const [id, title, content, date, isPrivate] = r;
        if (isPrivate === "true") return;

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
    });
}

// ===============================
// 방명록
// ===============================
function loadGuestbook() {
  guestbookEl.innerHTML = "";

  fetch(GUESTBOOK_CSV)
    .then(res => res.text())
    .then(text => {
      const rows = parseCSV(text);
      rows.slice(1).forEach(r => {
        const [, name, message, date] = r;
        if (!name || !message) return;

        const div = document.createElement("div");
        div.className = "guestbook-item";
        div.textContent = `${name} : ${message} (${formatDate(date)})`;
        guestbookEl.appendChild(div);
      });
    });
}

// ===============================
// 화면 제어
// ===============================
function showHome() {
  boardEl.style.display = "none";
  guestbookEl.style.display = "none";
}

function showBoard() {
  boardEl.style.display = "block";
  guestbookEl.style.display = "none";
  loadBoard();
}

function showGuestbook() {
  boardEl.style.display = "none";
  guestbookEl.style.display = "block";
  loadGuestbook();
}

// ===============================
// 메뉴
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

showHome();
