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

ranges.forEach(([inputId, outputId]) => {
  const slider = document.getElementById(inputId);
  const output = document.getElementById(outputId);

  const showValue = () => (output.textContent = slider.value);

  slider.addEventListener("input", showValue);
  showValue(); // แสดงค่าเริ่มต้นตั้งแต่เปิดหน้า
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
const maxLength = reviewBody.maxLength;

reviewBody.addEventListener("input", () => {
  const len = reviewBody.value.length;
  charCount.textContent = len + " / " + maxLength;
  // เปลี่ยนสีเมื่อใกล้เต็มโควตา
  charCount.classList.toggle("is-over", len > maxLength - 50);
});

/* ---------- 4) ตรวจฟอร์มตอนกดส่ง ---------- */
reviewForm.addEventListener("submit", (e) => {
  e.preventDefault(); // ไม่มีระบบหลังบ้าน จึงไม่ส่งข้อมูลออกไปจริง

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
    reviewForm.classList.add("was-validated");

    // ปุ่มดาวถูกซ่อนวงกลม radio ไว้ จึงต้องเตือนด้วยข้อความเอง
    const pickedStar = reviewForm.querySelector('[name="overall"]:checked');
    overallHint.classList.toggle("text-danger", !pickedStar);
    if (!pickedStar) overallHint.textContent = "กรุณาเลือกคะแนนรวมก่อนส่งรีวิว";

    // เลื่อนไปยังช่องแรกที่ยังไม่ผ่าน
    const firstBad = reviewForm.querySelector(
      "input:invalid, select:invalid, textarea:invalid"
    );
    if (firstBad) {
      firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      firstBad.focus({ preventScroll: true });
    }
  }
});

/* ---------- 5) ล้างฟอร์ม ---------- */
function resetHelpers() {
  // รอให้ฟอร์ม reset เสร็จก่อน ค่อยอัปเดตตัวเลขที่แสดงอยู่
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
