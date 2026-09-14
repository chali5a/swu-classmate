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
  return [...document.querySelectorAll('[data-filter="' + group + '"]:checked')]
    .map((box) => box.value);
}

/* ถ้าไม่ติ๊กอะไรเลย = ไม่กรอง (ผ่านหมด) */
function matchAny(list, value) {
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

    const show = okKeyword && okCat && okCredit && okMode && okLang && okFaculty;

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

    if (mode === "rating") return y.rating - x.rating;
    if (mode === "workload") return x.workload - y.workload;
    if (mode === "code") return x.code.localeCompare(y.code);
    if (mode === "name") return x.name.localeCompare(y.name, "th");
    if (mode === "creditAsc") return x.credit - y.credit;
    if (mode === "creditDesc") return y.credit - x.credit;
    return y.popular - x.popular; // ยอดนิยม
  });

  // ย้ายลำดับจริงใน HTML
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
  setTimeout(applyFilter);
});
