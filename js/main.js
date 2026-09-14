/* ===========================================
   SWU CLASSMATE - JavaScript ส่วนเสริม
   ใช้เท่าที่จำเป็น 3 อย่างเท่านั้น
   1) ปีปัจจุบันใน footer
   2) สลับโหมดสว่าง/มืด
   3) กรองการ์ดวิชาตามคำค้น
   =========================================== */

/* 1) ปี พ.ศ. ใน footer */
document.getElementById("year").textContent = new Date().getFullYear() + 543;

/* 2) สลับโหมดสว่าง/มืด */
const themeBtn = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
  themeBtn.querySelector("i").className =
    theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
}

applyTheme(localStorage.getItem("swu-theme") || "light");

themeBtn.addEventListener("click", () => {
  const next =
    document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
  localStorage.setItem("swu-theme", next);
  applyTheme(next);
});

/* 3) ค้นหาในหน้าแรก - ซ่อน/แสดงการ์ดที่เขียนไว้ใน HTML
      (ส่วนนี้ทำงานเฉพาะหน้าที่มีช่องค้นหา id="searchInput") */
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  const emptyState = document.getElementById("emptyState");

  const filterCourses = () => {
    const keyword = searchInput.value.trim().toLowerCase();
    let found = 0;

    document.querySelectorAll("[data-search]").forEach((item) => {
      const match = item.dataset.search.toLowerCase().includes(keyword);
      item.classList.toggle("d-none", !match);
      if (match) found++;
    });

    emptyState.classList.toggle("d-none", found > 0);
  };

  searchInput.addEventListener("input", filterCourses);

  document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    filterCourses();
  });

  /* คลิกแท็กยอดฮิตแล้วใส่คำค้นให้อัตโนมัติ */
  document.querySelectorAll("[data-keyword]").forEach((chip) => {
    chip.addEventListener("click", () => {
      searchInput.value = chip.dataset.keyword;
      filterCourses();
    });
  });
}
