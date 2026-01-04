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

// XSS 안전한 엘리먼트 생성
function createTextEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.textContent = text ?? "";
  return el;
}

// ===============================
// 시트 로드 공통 함수 (최종 안정판)
// ===============================
function loadSheet(sheetName, targetEl, renderFn) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substring(47, text.length - 2));
      const rows = json.table.rows || [];

      targetEl.innerHTML = "";

      rows.forEach((row, index) => {
        // 첫 줄 = 헤더 제거
        if (index === 0) return;

        // row.c 없으면 스킵
        if (!row.c) return;

        renderFn(row, targetEl);
      });
    })
    .catch(err => {
      console.error("시트 로드 실패:", err);
    });
}

// ===============================
// 게시판 렌더링 (Sheet1)
// 구조: [postId, title, content, date, isPrivate]
// ===============================
function renderBoard(row, el) {
  const [postId, title, content, date, isPrivate] =
    row.c.map(c => (c ? c.v : ""));

  // 비공개 글 제외
  if (isPrivate === true || isPrivate === "true") return;

  // 제목이나 내용 없으면 스킵
  if (!title || !content) return;

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
// 구조: [id, name, message, date]
// ===============================
function renderGuestbook(row, el) {
  const [, name, message, date] =
    row.c.map(c => (c ? c.v : ""));

  if (!name || !message) return;

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
document.getElementById("menu-home").addEventListener("click", e => {
  e.preventDefault();
  showHome();
});

document.getElementById("menu-board").addEventListener("click", e => {
  e.preventDefault();
  showBoard();
});

document.getElementById("menu-guestbook").addEventListener("click", e => {
  e.preventDefault();
  showGuestbook();
});

// ===============================
// 초기 화면
// ===============================
showHome();
