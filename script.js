// 🔗 네 구글 시트 ID
const SHEET_ID = "1X8y2tnuJG2d04Wu-lN--T_pM_uTUvfRoaQDG2yQUavc";

// 📄 시트 이름 (게시글 시트)
const SHEET_NAME = "Sheet1";

// 📡 구글 시트 JSON URL
const SHEET_URL =
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

fetch(SHEET_URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substr(47).slice(0, -2));
    const rows = json.table.rows;

    const container = document.querySelector(".left");

    rows.forEach(row => {
      const [
        postId,
        title,
        content,
        date,
        isPrivate
      ] = row.c.map(cell => cell ? cell.v : "");

      // 🔒 비공개 글은 건너뜀
      if (isPrivate === true || isPrivate === "true") return;

      const box = document.createElement("div");
      box.className = "box";

      box.innerHTML = `
        <div class="box-title">게시글</div>
        <div class="post-title">${title}</div>
        <div class="post-date">${date}</div>
        <div class="post-content">${content}</div>
      `;

      container.appendChild(box);
    });
  })
  .catch(err => {
    console.error("시트 불러오기 실패", err);
  });
