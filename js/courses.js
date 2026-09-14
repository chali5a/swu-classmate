/* ===========================================
   SWU CLASSMATE - เฉพาะหน้า courses.html
   ทำ 2 อย่าง: กรองรายการวิชา และ เรียงลำดับ
   ข้อมูลทั้งหมดอ่านจาก data-* ที่เขียนไว้ใน HTML
   =========================================== */

const courseList = document.getElementById("courseList");
const allCourses = [...document.querySelectorAll(".course-row")];
const resultCount = document.getElementById("resultCount");
const emptyResult = document.getElementById("emptyResult");
const keywordBox = document.getElementById("courseSearch");
const sortSelect = document.getElementById("sortSelect");
const facultySelect = document.getElementById("facultySelect");

/* อ่านค่าที่ติ๊กไว้ของกลุ่ม checkbox กลุ่มหนึ่ง -> ได้อาร์เรย์ของ value */
function checkedValues(group) {
  // '[data-filter="' + group + '"]'  ต่อสตริง ถ้า group เป็น "credit" จะได้ [data-filter="credit"]
  // :checked                          เอาเฉพาะอันที่ติ๊กอยู่
  // [...]                             แปลง NodeList เป็นอาร์เรย์จริง จะได้ใช้ .map() ได้
  // .map((box) => box.value)          ดึงเฉพาะค่า value ออกมา
  // ผลลัพธ์: ติ๊ก 3 กับ 6 หน่วยกิต จะได้ ["3", "6"]
  return [...document.querySelectorAll('[data-filter="' + group + '"]:checked')]
    .map((box) => box.value);
}

/* ถ้าไม่ติ๊กอะไรเลย = ไม่กรอง (ผ่านหมด) */
function matchAny(list, value) {
  // ตรรกะสำคัญ: ถ้าไม่ติ๊กอะไรเลย (อาร์เรย์ว่าง) ให้ถือว่าผ่านหมด = ไม่กรอง
  //   matchAny([], "3")          -> true   ไม่ติ๊ก = ผ่าน
  //   matchAny(["3","6"], "3")   -> true   ติ๊ก 3 ไว้ และวิชานี้ 3 หน่วยกิต = ผ่าน
  //   matchAny(["3","6"], "4")   -> false  ติ๊ก 3,6 แต่วิชานี้ 4 = ไม่ผ่าน
  return list.length === 0 || list.includes(value);
}

/* ---------- กรองรายการ ---------- */
function applyFilter() {
  // อ่านค่าจากตัวกรองทั้งหมด
  const keyword = keywordBox.value.trim().toLowerCase();

  const cats = checkedValues("cat");
  const credits = checkedValues("credit");
  const modes = checkedValues("mode");
  const langs = checkedValues("lang");

  const faculty = facultySelect.value;

  let found = 0;

  allCourses.forEach((course) => {
    const d = course.dataset;

    const okKeyword = d.search.toLowerCase().includes(keyword);
    const okCat = matchAny(cats, d.cat);
    const okCredit = matchAny(credits, d.credit);
    const okMode = matchAny(modes, d.mode);
    const okLang = matchAny(langs, d.lang);
    const okFaculty = faculty === "" || d.faculty === faculty;

    // && แปลว่า "และ" — ต้องผ่านทุกเงื่อนไขถึงจะแสดง
    const show = okKeyword && okCat && okCredit && okMode && okLang && okFaculty;

    // ซ่อนด้วยคลาส d-none ของ Bootstrap ไม่ได้ลบการ์ดทิ้ง
    // พอยกเลิกตัวกรองก็กลับมาแสดงได้ทันที
    course.classList.toggle("d-none", !show);
    if (show) found++;
  });

  resultCount.textContent = found;
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
    // ใส่ "th" เพื่อให้เรียงภาษาไทยถูกต้อง ถ้าไม่ใส่ คำที่ขึ้นต้นด้วยสระอย่าง "โครงงาน" จะไปอยู่ผิดที่
    if (mode === "name") return x.name.localeCompare(y.name, "th");
    if (mode === "creditAsc") return x.credit - y.credit;
    if (mode === "creditDesc") return y.credit - x.credit;
    return y.popular - x.popular; // ยอดนิยม
  });

  // ย้ายลำดับจริงใน HTML
  // เคล็ดลับ: appendChild กับ element ที่อยู่ในหน้าอยู่แล้ว = "ย้ายที่" ไม่ใช่คัดลอก
  // วนใส่ตามลำดับที่เรียงได้ ผลคือลำดับในหน้าเว็บถูกจัดใหม่ทั้งหมด
  sorted.forEach((course) => courseList.appendChild(course));
}

/* ---------- ผูก event ---------- */
keywordBox.addEventListener("input", applyFilter);
sortSelect.addEventListener("change", applySort);

document.querySelectorAll("[data-filter]").forEach((input) => {
  input.addEventListener("change", applyFilter);
});

// ปุ่มล้างตัวกรอง (รอให้ฟอร์ม reset เสร็จก่อนค่อยกรองใหม่)
document.getElementById("filterForm").addEventListener("reset", () => {
  // ตอน event reset ทำงาน เบราว์เซอร์ "ยังไม่ได้" ล้างค่าในฟอร์ม
  // ถ้าเรียก applyFilter() ตรงนี้เลยจะอ่านค่าเก่า
  // setTimeout ที่ไม่ใส่เวลา = "ทำทีหลัง พอเบราว์เซอร์ว่าง" ตอนนั้นฟอร์มล้างเสร็จแล้ว
  setTimeout(applyFilter);
});
