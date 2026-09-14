/* ===========================================
   SWU CLASSMATE - เฉพาะหน้า write-review.html
   ทำ 3 อย่าง:
   1) ตรวจฟอร์มด้วย Bootstrap validation
   2) แสดงค่าของแถบเลื่อน (range) ใน tag <output>
   3) นับจำนวนตัวอักษรใน textarea
   =========================================== */

const reviewForm = document.getElementById("reviewForm");
const formSuccess = document.getElementById("formSuccess");

/* ---------- 1) แถบเลื่อนให้คะแนน ---------- */
/* จับคู่ id ของ input type="range" กับ id ของ <output> ที่จะแสดงค่า */
const ranges = [
  ["scoreContent", "outContent"],
  ["scoreWorkload", "outWorkload"],
  ["scoreWorth", "outWorth"],
];

// ([inputId, outputId]) => เรียกว่า array destructuring
// แตกอาร์เรย์ย่อย ["scoreContent","outContent"] ออกเป็น 2 ตัวแปรทันที
// เขียนแบบยาวจะเป็น (pair) => { const inputId = pair[0]; const outputId = pair[1]; ... }
ranges.forEach(([inputId, outputId]) => {
  const slider = document.getElementById(inputId);
  const output = document.getElementById(outputId);

  // arrow function ที่ไม่มีวงเล็บปีกกา จะคืนค่าของนิพจน์นั้นเลย
  // ในที่นี้ผลข้างเคียงคือการเขียนตัวเลขลง <output>
  const showValue = () => (output.textContent = slider.value);

  // "input" ทำงานทุกครั้งที่ลากแถบเลื่อน ตัวเลขจึงเปลี่ยนตามแบบสด ๆ
  slider.addEventListener("input", showValue);

  // เรียกครั้งแรกทันที เพื่อให้ตัวเลขโชว์ตั้งแต่เปิดหน้า ไม่ต้องรอผู้ใช้ลาก
  showValue();
});

/* ---------- 2) ข้อความบอกคะแนนรวมที่เลือก ---------- */
const overallHint = document.getElementById("overallHint");

document.querySelectorAll('[name="overall"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    overallHint.textContent = "คุณให้คะแนนรวม " + radio.value + " จาก 5 ดาว";
    overallHint.classList.remove("text-danger");
  });
});

/* ---------- 3) ตัวนับตัวอักษรใต้ textarea ---------- */
const reviewBody = document.getElementById("reviewBody");
const charCount = document.getElementById("charCount");
// อ่านค่าจาก maxlength="500" ที่เขียนไว้ใน HTML ไม่ได้เขียนเลข 500 ซ้ำใน JS
// ถ้าวันหลังแก้ maxlength ใน HTML ตัวนับจะปรับตามเอง ค่าอยู่ที่เดียวไม่มีทางไม่ตรงกัน
const maxLength = reviewBody.maxLength;

reviewBody.addEventListener("input", () => {
  const len = reviewBody.value.length;
  charCount.textContent = len + " / " + maxLength;
  // เปลี่ยนสีเมื่อใกล้เต็มโควตา
  // เหลือน้อยกว่า 50 ตัวอักษร ให้เปลี่ยนสีเตือน
  // toggle ที่ใส่ค่าที่สอง = บังคับ (true ใส่คลาส · false เอาออก)
  charCount.classList.toggle("is-over", len > maxLength - 50);
});

/* ---------- 4) ตรวจฟอร์มตอนกดส่ง ---------- */
reviewForm.addEventListener("submit", (e) => {
  e.preventDefault(); // ไม่มีระบบหลังบ้าน จึงไม่ส่งข้อมูลออกไปจริง

  // checkValidity() ให้เบราว์เซอร์ตรวจทุกช่องในฟอร์มตามกฎที่เขียนใน HTML
  // (required, pattern, minlength, type="email") คืน true ถ้าผ่านหมด
  if (reviewForm.checkValidity()) {
    // ผ่านทุกเงื่อนไข -> ล้างฟอร์มก่อน แล้วค่อยแสดงกล่องแจ้งผล
    // (ต้องล้างก่อน เพราะ event reset ด้านล่างจะซ่อนกล่องแจ้งผลทิ้ง)
    reviewForm.reset();
    reviewForm.classList.remove("was-validated");

    formSuccess.classList.remove("d-none");
    formSuccess.classList.add("d-flex");
    formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    // ยังกรอกไม่ครบ -> ให้ Bootstrap แสดงกรอบแดงและข้อความเตือน
    formSuccess.classList.add("d-none");
    // was-validated เป็นคลาสของ Bootstrap
    // พอฟอร์มมีคลาสนี้ CSS ของ Bootstrap จะโชว์กรอบแดงและข้อความใน .invalid-feedback
    // ให้เองทุกช่องที่ไม่ผ่าน — JS ใส่แค่คลาสเดียว ที่เหลือ CSS จัดการ
    reviewForm.classList.add("was-validated");

    // ปุ่มดาวถูกซ่อนวงกลม radio ไว้ จึงต้องเตือนด้วยข้อความเอง
    const pickedStar = reviewForm.querySelector('[name="overall"]:checked');
    overallHint.classList.toggle("text-danger", !pickedStar);
    if (!pickedStar) overallHint.textContent = "กรุณาเลือกคะแนนรวมก่อนส่งรีวิว";

    // เลื่อนไปยังช่องแรกที่ยังไม่ผ่าน
    // querySelector (ไม่มี All) คืน "ตัวแรก" ที่เจอ = ช่องที่ผิดช่องแรก
    // :invalid เป็น pseudo-class ที่เบราว์เซอร์ติดให้เองเมื่อค่าไม่ผ่านกฎ
    const firstBad = reviewForm.querySelector(
      "input:invalid, select:invalid, textarea:invalid"
    );
    if (firstBad) {
      firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      // preventScroll: true = โฟกัสแต่อย่าเลื่อนจอ
      // เพราะบรรทัดบนสั่งเลื่อนแบบนุ่มนวลไปแล้ว ถ้าไม่ใส่จะเลื่อน 2 ครั้งกระตุก
      firstBad.focus({ preventScroll: true });
    }
  }
});

/* ---------- 5) ล้างฟอร์ม ---------- */
function resetHelpers() {
  // รอให้ฟอร์ม reset เสร็จก่อน ค่อยอัปเดตตัวเลขที่แสดงอยู่
  // setTimeout ที่ไม่ใส่เวลา = "ทำทีหลัง พอเบราว์เซอร์ว่าง"
  // จำเป็นเพราะตอน event reset ทำงาน เบราว์เซอร์ยังไม่ได้ล้างค่าในฟอร์ม
  // ถ้าอ่านค่าตรงนี้เลยจะได้ค่าเก่า
  setTimeout(() => {
    ranges.forEach(([inputId, outputId]) => {
      document.getElementById(outputId).textContent =
        document.getElementById(inputId).value;
    });
    charCount.textContent = "0 / " + maxLength;
    charCount.classList.remove("is-over");
    overallHint.textContent = "ยังไม่ได้เลือกคะแนนรวม";
    overallHint.classList.remove("text-danger");
  });
}

reviewForm.addEventListener("reset", () => {
  reviewForm.classList.remove("was-validated");
  formSuccess.classList.add("d-none");
  resetHelpers();
});
