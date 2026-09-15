/* ===========================================
   SWU CLASSMATE - เฉพาะหน้า simulator.html (ทดลองจัดอันดับ)
   ทำ 3 อย่าง:
   1) ค้นหากรองรายการวิชาในคลัง
   2) กดปุ่ม + เพื่อเพิ่มวิชาเข้าอันดับ (สูงสุด 3)
   3) เลื่อนขึ้น-ลง / เอาออกจากอันดับ
   ข้อมูลวิชาทั้งหมดอ่านจาก data-* ที่เขียนไว้ใน HTML
   =========================================== */

const MAX_RANK = 3;   // มี 3 วิชาในระบบ จึงจัดได้สูงสุด 3 อันดับ

const poolList = document.getElementById("poolList");
// [...] เรียกว่า spread แปลง NodeList ที่ querySelectorAll คืนมา ให้เป็นอาร์เรย์จริง
// ต้องแปลงก่อน ถึงจะใช้ .find() .forEach() .map() ได้
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
  // .find() คืน "ตัวแรก" ที่ตรงเงื่อนไข ถ้าไม่เจอคืน undefined
  // === เทียบทั้งค่าและชนิดข้อมูล ปลอดภัยกว่า == ที่แปลงชนิดให้อัตโนมัติ
  return poolCards.find((c) => c.dataset.code === code);
}

/* ---------- 1) ค้นหาในคลังวิชา ---------- */
function applySearch() {
  const keyword = poolSearch.value.trim().toLowerCase();
  let found = 0;

  poolCards.forEach((card) => {
    // .includes() เช็กว่ารหัสวิชานี้อยู่ในอาร์เรย์ ranked แล้วหรือยัง
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
  // ล้างรายการเดิมทิ้งทั้งหมดก่อนวาดใหม่
  // เหตุผลที่วาดใหม่หมดแทนการแก้เฉพาะจุด: ไม่ต้องคิดว่าลบแล้วเลขอันดับต้องเรียงใหม่ไหม
  // หรือปุ่มลูกศรของใครต้องปิดบ้าง — อาร์เรย์ ranked คือความจริง หน้าจอวาดตามนั้นเสมอ
  rankList.innerHTML = "";

  ranked.forEach((code, i) => {
    const d = cardOf(code).dataset;

    // createElement สร้าง element ใหม่ที่ยังไม่ได้อยู่ในหน้า
    // ต้อง appendChild ตอนท้ายถึงจะเข้าไปอยู่จริง
    const li = document.createElement("li");
    li.className = "rank-slot";
    // เครื่องหมาย ` (backtick) เรียกว่า template literal
    // ข้อดีคือขึ้นบรรทัดใหม่ได้ และแทรกค่าด้วย ${ } ได้เลย ไม่ต้องต่อสตริงด้วย +
    // ${i + 1} คือเลขอันดับ (i เริ่มจาก 0 จึงต้องบวก 1)
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
  // .reduce() ยุบอาร์เรย์ให้เหลือค่าเดียว — เลข 0 ท้ายสุดคือค่าตั้งต้นของ sum
  //   รอบ 1: sum = 0 + 3 = 3   ·   รอบ 2: sum = 3 + 6 = 9
  // Number() จำเป็น เพราะ dataset คืนข้อความเสมอ ถ้าไม่แปลง "3" + "6" จะได้ "36"
  const credits = ranked.reduce((sum, c) => sum + Number(cardOf(c).dataset.credit), 0);
  rankCount.textContent = ranked.length;
  creditSum.textContent = credits;

  rankEmpty.classList.toggle("d-none", ranked.length > 0);
  clearBtn.disabled = ranked.length === 0;

  applySearch();
}

/* ---------- 3) เพิ่ม / สลับ / เอาออก ---------- */
function add(code) {
  // return เปล่า ๆ = ออกจากฟังก์ชันทันที ไม่ทำอะไรต่อ
  // กันสองกรณี: อันดับเต็มแล้ว หรือวิชานี้ถูกเลือกไปแล้ว
  if (ranked.length >= MAX_RANK || ranked.includes(code)) return;
  ranked.push(code);
  // เรียกครั้งแรกตอนโหลดหน้า เพื่อตั้งค่าเริ่มต้นให้ถูก
// (ซ่อนกล่อง "ยังไม่ได้เลือกวิชา" ปิดปุ่มล้าง และนับจำนวนในคลัง)
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
  // .splice(ตำแหน่ง, จำนวน) ลบสมาชิกออกจากอาร์เรย์จริง ๆ
  // ตัวที่อยู่หลังจะเลื่อนขึ้นมาแทนเอง
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
