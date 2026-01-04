// 🔗 네 구글 시트 ID
const SHEET_ID = "1X8y2tnuJG2d04Wu-lN--T_pM_uTUvfRoaQDG2yQUavc";

// 시트 이름
const BOARD_SHEET = "Sheet1";
const GUESTBOOK_SHEET = "Sheet2";

// 영역
const boardEl = document.getElementById("board");
const guestbookEl = document.getElementById("guestbook");

// 🔽 공통 함수
function loadSheet(sheetName, targetEl, renderFn) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substr(47).slice(0, -2));
      const rows = json.table.rows;

      targetEl.innerHTML = ""; // 초기화

      rows.forEach(row => {
        renderFn(row, targetEl);
      });
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
  box.innerHTML = `
    <div class="box-title">게시글</div>
    <div class="post-title">${title}</div>
    <div class="post-date">${date}</div>
    <div class="post-content">${content}</div>
  `;
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
   메뉴 버튼 제어
====================== */
function showBoard() {
  boardEl.style.display = "block";
  guestbookEl.style.display = "none";
}

function showGuestbook() {
  boardEl.style.display = "none";
  guestbookEl.style.display = "block";
}

function showHome() {
  boardEl.style.display = "block";
  guestbookEl.style.display = "block";
}

// 버튼 이벤트
document.getElementById("menu-board").onclick = e => {
  e.preventDefault();
  showBoard();
};

document.getElementById("menu-guestbook").onclick = e => {
  e.preventDefault();
  showGuestbook();
};

document.getElementById("menu-home").onclick = e => {
  e.preventDefault();
  showHome();
};

// 초기 화면
showHome();
