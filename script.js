// 🔗 구글 시트 ID
const SHEET_ID = "1X8y2tnuJG2d04Wu-lN--T_pM_uTUvfRoaQDG2yQUavc";

// 시트 이름
const BOARD_SHEET = "Sheet1";
const GUESTBOOK_SHEET = "Sheet2";

// 영역
const boardEl = document.getElementById("board");
const guestbookEl = document.getElementById("guestbook");

/* ======================
   유틸 함수
====================== */

// 날짜 포맷: YYYY-MM-DD → YYYY.MM.DD
function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return value;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// 안전한 텍스트 엘리먼트 생성 (XSS 방지)
function createTextEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.textContent = text ?? "";
  return el;
}

/* ======================
   공통 시트 로드
====================== */
function loadSheet(sheetName, targetEl, renderFn) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substr(47).slice(0, -2));
      const rows = json.table.rows;

      targetEl.innerHTML = "";

      rows.forEach(row => renderFn(row, targetEl));
    });
}

/* ======================
   게시판 (Sheet1)
====================== */
loadSheet(BOARD_SHEET, boardEl, (row, el) => {
  const [postId, title, content, date, isPrivate] =
    row.c.map(c => (c ? c.v : ""));

  if (isPrivate === true || isPrivate === "true") return;

  const box = document.createElement("div");
  box.className = "box";

  const boxTitle = createTextEl("div", "box-title", "게시글");
  const postTitle = createTextEl("div", "post-title", title);
  const postDate = createTextEl("div", "post-date", formatDate(date));
  const postContent = createTextEl("div", "post-content", content);

  box.append(boxTitle, postTitle, postDate, postContent);
  el.appendChild(box);
});

/* ======================
   방명록 (Sheet2)
====================== */
loadSheet(GUESTBOOK_SHEET, guestbookEl, (row, el) => {
  const [name, message, date] =
    row.c.map(c => (c ? c.v : ""));

  const item = document.createElement("div");
  item.className = "guestbook-item";
  item.textContent = `${name} : ${message}`;
  el.appendChild(item);
});

/* ======================
   메뉴 UX 제어
====================== */
function showHome() {
  boardEl.style.display = "none";
  guestbookEl.style.display = "none";
}

function showBoard() {
  boardEl.style.display = "block";
  guestbookEl.style.display = "none";
}

function showGuestbook() {
  boardEl.style.display = "none";
  guestbookEl.style.display = "block";
}

// 버튼 이벤트
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

// 초기 화면
showHome();
