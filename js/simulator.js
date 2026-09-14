/* ===========================================
   SWU CLASSMATE - เฉพาะหน้า about.html (ทดลองจัดอันดับ)
   ทำ 3 อย่าง:
   1) ค้นหากรองรายการวิชาในคลัง
   2) กดปุ่ม + เพื่อเพิ่มวิชาเข้าอันดับ (สูงสุด 3)
   3) เลื่อนขึ้น-ลง / เอาออกจากอันดับ
   ข้อมูลวิชาทั้งหมดอ่านจาก data-* ที่เขียนไว้ใน HTML
   =========================================== */

const MAX_RANK = 3;   // มี 3 วิชาในระบบ จึงจัดได้สูงสุด 3 อันดับ

const poolList = document.getElementById("poolList");
const poolCards = [...document.querySelectorAll(".pick-row")];
const poolSearch = document.getElementById("poolSearch");
const poolCount = document.getElementById("poolCount");
const poolEmpty = document.getElementById("poolEmpty");

const rankList = document.getElementById("rankList");
const rankEmpty = document.getElementById("rankEmpty");
const rankCount = document.getElementById("rankCount");
const creditSum = document.getElementById("creditSum");

const clearBtn = document.getElementById("clearBtn");

/* เก็บเฉพาะรหัสวิชาที่ถูกเลือก เรียงตามอันดับ
   ข้อมูลรายละเอียดยังอ่านจาก data-* ของการ์ดเดิมเสมอ */
let ranked = [];

/* หาการ์ดในคลังจากรหัสวิชา */
function cardOf(code) {
  return poolCards.find((c) => c.dataset.code === code);
}

/* ---------- 1) ค้นหาในคลังวิชา ---------- */
function applySearch() {
  const keyword = poolSearch.value.trim().toLowerCase();
  let found = 0;

  poolCards.forEach((card) => {
    const picked = ranked.includes(card.dataset.code);
    const match = card.dataset.search.toLowerCase().includes(keyword);

    // วิชาที่เลือกไปแล้วจะซ่อนด้วยคลาส is-added ไม่ว่าจะค้นหาเจอหรือไม่
    card.classList.toggle("is-added", picked);
    card.classList.toggle("d-none", !match);

    if (match && !picked) found++;
  });

  poolCount.textContent = found;
  poolEmpty.classList.toggle("d-none", found > 0);
}

/* ---------- 2) วาดรายการอันดับใหม่ทั้งหมด ---------- */
function renderRank() {
  rankList.innerHTML = "";  // ล้างรายการเดิมก่อนวาดใหม่

  ranked.forEach((code, i) => {
    const d = cardOf(code).dataset;

    const li = document.createElement("li");
    li.className = "rank-slot";
    li.innerHTML = `
      <span class="slot-num" aria-hidden="true">${i + 1}</span>
      <span class="slot-body">
        <span class="slot-name d-block">${d.name}</span>
        <span class="slot-meta">${d.code} · ${d.credit} หน่วยกิต</span>
      </span>
      <button type="button" class="slot-btn" data-up
              aria-label="เลื่อน ${d.name} ขึ้น" ${i === 0 ? "disabled" : ""}>
        <i class="bi bi-chevron-up" aria-hidden="true"></i>
      </button>
      <button type="button" class="slot-btn" data-down
              aria-label="เลื่อน ${d.name} ลง" ${i === ranked.length - 1 ? "disabled" : ""}>
        <i class="bi bi-chevron-down" aria-hidden="true"></i>
      </button>
      <button type="button" class="slot-btn" data-remove
              aria-label="เอา ${d.name} ออกจากอันดับ">
        <i class="bi bi-x-lg" aria-hidden="true"></i>
      </button>`;

    li.querySelector("[data-up]").addEventListener("click", () => swap(i, i - 1));
    li.querySelector("[data-down]").addEventListener("click", () => swap(i, i + 1));
    li.querySelector("[data-remove]").addEventListener("click", () => remove(i));

    rankList.appendChild(li);
  });

  // สรุปจำนวนและหน่วยกิตรวม
  const credits = ranked.reduce((sum, c) => sum + Number(cardOf(c).dataset.credit), 0);
  rankCount.textContent = ranked.length;
  creditSum.textContent = credits;

  rankEmpty.classList.toggle("d-none", ranked.length > 0);
  clearBtn.disabled = ranked.length === 0;

  applySearch();
}

/* ---------- 3) เพิ่ม / สลับ / เอาออก ---------- */
function add(code) {
  if (ranked.length >= MAX_RANK || ranked.includes(code)) return;
  ranked.push(code);
  renderRank();
}

function swap(a, b) {
  // สลับตำแหน่ง a กับ b โดยพักค่าไว้ในตัวแปร temp ก่อน
  const temp = ranked[a];
  ranked[a] = ranked[b];
  ranked[b] = temp;
  renderRank();
}

function remove(i) {
  ranked.splice(i, 1);
  renderRank();
}

/* ---------- ผูก event ---------- */
poolSearch.addEventListener("input", applySearch);

poolCards.forEach((card) => {
  card.querySelector("[data-add]").addEventListener("click", () => add(card.dataset.code));
});

clearBtn.addEventListener("click", () => {
  ranked = [];
  renderRank();
});

renderRank();
