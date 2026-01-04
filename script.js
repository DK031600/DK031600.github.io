// ===============================
// 구글 시트 설정
// ===============================
const SHEET_ID = "1X8y2tnuJG2d04Wu-lN--T_pM_uTUvfRoaQDG2yQUavc";
const BOARD_SHEET = "Sheet1";
const GUESTBOOK_SHEET = "Sheet2";

// ===============================
// DOM
// ===============================
const boardEl = document.getElementById("board");
const guestbookEl = document.getElementById("guestbook");

// ===============================
// 유틸 함수
// ===============================

// 날짜 포맷: YYYY-MM-DD → YYYY.MM.DD
function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return value;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// XSS 안전한 텍스트 엘리먼트 생성
function createTextEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.textContent = text ?? "";
  return el;
}

// ===============================
// 시트 로드 공통 함수 (🔥 헤더 제거)
// ===============================
function loadSheet(sheetName, targetEl, renderFn) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substr(47).slice(0, -2));
      const rows = json.table.rows;

      targetEl.innerHTML = "";

      // 🔥 첫 줄(헤더) 제거
      rows.slice(1).forEach(row => {
        renderFn(row, targetEl);
      });
    });
}

// ===============================
// 게시판 렌더링 (Sheet1)
// ===============================
function renderBoard(row, el) {
  const [postId, title, content, date, isPrivate] =
    row.c.map(c => (c ? c.v : ""));

  if (isPrivate === true || isPrivate === "true") return;

  const box = document.createElement("div");
  box.className = "box";

  box.append(
    createTextEl("div", "box-title", "게시글"),
    createTextEl("div", "post-title", title),
    createTextEl("div", "post-date", formatDate(date)),
    createTextEl("div", "post-content", content)
  );

  el.appendChild(box);
}

// ===============================
// 방명록 렌더링 (Sheet2)
// ===============================
function renderGuestbook(row, el) {
  // Sheet2: [id, name, message, date]
  const [, name, message, date] =
    row.c.map(c => (c ? c.v : ""));

  const item = document.createElement("div");
  item.className = "guestbook-item";
  item.textContent = `${name} : ${message} (${formatDate(date)})`;

  el.appendChild(item);
}


// ===============================
// 화면 제어 (UX)
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
  loadSheet(BOARD_SHEET, boardEl, renderBoard);
}

function showGuestbook() {
  boardEl.style.display = "none";
  guestbookEl.style.display = "block";
  guestbookEl.innerHTML = "";
  loadSheet(GUESTBOOK_SHEET, guestbookEl, renderGuestbook);
}

// ===============================
// 메뉴 버튼 이벤트
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

// ===============================
// 초기 화면
// ===============================
showHome();
