/* ===========================================
   SWU CLASSMATE - เฉพาะหน้า courses.html
   ทำ 2 อย่าง: ค้นหารายวิชา และ เรียงลำดับ
   ข้อมูลทั้งหมดอ่านจาก data-* ที่เขียนไว้ใน HTML
   =========================================== */

const courseList = document.getElementById("courseList");
const allCourses = [...document.querySelectorAll(".course-row")];
const resultCount = document.getElementById("resultCount");
const emptyResult = document.getElementById("emptyResult");
const keywordBox = document.getElementById("courseSearch");
const sortSelect = document.getElementById("sortSelect");

/* ---------- ค้นหารายวิชา ---------- */
function applySearch() {
  // .trim() ตัดช่องว่างหน้า-หลังทิ้ง (กันคนเผลอเคาะ space)
  // .toLowerCase() แปลงเป็นพิมพ์เล็ก เพื่อให้ SWU กับ swu ค้นเจอเหมือนกัน
  const keyword = keywordBox.value.trim().toLowerCase();

  let found = 0; // ใช้ let เพราะค่านี้ต้องเปลี่ยน (นับเพิ่มขึ้นเรื่อย ๆ)

  allCourses.forEach((course) => {
    // .dataset.search อ่านค่าจาก data-search ใน HTML (ตัด data- ออกเสมอ)
    // ใน data-search มีทั้งรหัสวิชาและชื่อวิชา จึงค้นหาได้ทั้งสองอย่าง
    const match = course.dataset.search.toLowerCase().includes(keyword);

    // classList.toggle ที่ใส่ค่าที่สอง จะไม่ใช่การสลับไปมา แต่เป็นการ "บังคับ"
    // true = ใส่คลาส · false = เอาคลาสออก
    // !match คือค่าตรงข้าม — ถ้าเจอ (true) จะได้ false = เอา d-none ออก = การ์ดโผล่
    // สังเกตว่าเราแค่ "ซ่อน" ไม่ได้ "ลบ" การ์ดยังอยู่ใน HTML ครบ
    course.classList.toggle("d-none", !match);

    if (match) found++;
  });

  resultCount.textContent = found;

  // เจอมากกว่า 0 ใบ -> ซ่อนกล่อง "ไม่พบวิชาที่ค้นหา"
  emptyResult.classList.toggle("d-none", found > 0);
}

/* ---------- เรียงลำดับ ---------- */
function applySort() {
  const mode = sortSelect.value;

  const sorted = [...allCourses].sort((a, b) => {
    const x = a.dataset;
    const y = b.dataset;

    // กติกาของ .sort() คือฟังก์ชันข้างในต้องคืนตัวเลข
    //   คืนค่าติดลบ = a มาก่อน b   ·   คืนค่าบวก = b มาก่อน a
    // y ลบ x = เรียงมากไปน้อย   ·   x ลบ y = เรียงน้อยไปมาก
    if (mode === "rating") return y.rating - x.rating;
    if (mode === "workload") return x.workload - y.workload;
    if (mode === "code") return x.code.localeCompare(y.code);

    // localeCompare เปรียบเทียบข้อความตามลำดับตัวอักษร
    // ใส่ "th" เพื่อให้เรียงภาษาไทยถูกต้อง
    // ถ้าไม่ใส่ คำที่ขึ้นต้นด้วยสระอย่าง "โครงงาน" จะไปอยู่ผิดที่
    if (mode === "name") return x.name.localeCompare(y.name, "th");

    if (mode === "creditAsc") return x.credit - y.credit;
    if (mode === "creditDesc") return y.credit - x.credit;

    return y.popular - x.popular; // ค่าเริ่มต้น: ยอดนิยม
  });

  // เคล็ดลับ: appendChild กับ element ที่อยู่ในหน้าอยู่แล้ว = "ย้ายที่" ไม่ใช่คัดลอก
  // วนใส่ตามลำดับที่เรียงได้ ผลคือลำดับในหน้าเว็บถูกจัดใหม่ทั้งหมด
  sorted.forEach((course) => courseList.appendChild(course));
}

/* ---------- ผูก event ---------- */
// "input" ทำงานทุกครั้งที่พิมพ์ 1 ตัวอักษร จึงค้นหาได้สด ๆ ไม่ต้องกดปุ่ม
keywordBox.addEventListener("input", applySearch);

sortSelect.addEventListener("change", applySort);
