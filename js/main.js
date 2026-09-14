/* ===========================================
   SWU CLASSMATE - JavaScript ส่วนเสริม
   ใช้เท่าที่จำเป็น 3 อย่างเท่านั้น
   1) ปีปัจจุบันใน footer
   2) สลับโหมดสว่าง/มืด
   3) กรองการ์ดวิชาตามคำค้น
   =========================================== */

/* 1) ปี พ.ศ. ใน footer */
// getElementById หา <span id="year"> ที่เว้นว่างไว้ใน footer
// new Date().getFullYear() ได้ปี ค.ศ. แล้ว +543 แปลงเป็น พ.ศ.
// .textContent = เขียนข้อความลงไปข้างใน element นั้น
document.getElementById("year").textContent = new Date().getFullYear() + 543;

/* 2) สลับโหมดสว่าง/มืด */
const themeBtn = document.getElementById("themeToggle");

function applyTheme(theme) {
  // documentElement คือแท็ก <html> ตัวนอกสุดของหน้า
  // แค่เปลี่ยนแอตทริบิวต์เดียวนี้ สีทั้งเว็บก็เปลี่ยนตาม
  // เพราะใน style.css มีบล็อก [data-bs-theme="dark"] ที่ประกาศตัวแปรสีชุดใหม่ไว้
  document.documentElement.setAttribute("data-bs-theme", theme);
  // เครื่องหมาย ? : เรียกว่า ternary อ่านว่า "เงื่อนไข ? ค่าถ้าจริง : ค่าถ้าเท็จ"
  // ตอนอยู่โหมดมืดโชว์ไอคอนดวงอาทิตย์ (หมายถึง "กดเพื่อไปโหมดสว่าง")
  // ไอคอนบอกสิ่งที่จะเกิดขึ้น ไม่ใช่สถานะปัจจุบัน
  themeBtn.querySelector("i").className =
    theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
}

// localStorage คือที่เก็บข้อมูลในเบราว์เซอร์ อยู่ถาวรแม้ปิดเบราว์เซอร์ไปแล้ว
// ถ้ายังไม่เคยเก็บจะได้ null แล้ว || จะใช้ค่าสำรองคือ "light"
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

// ด่านสำคัญ: ไฟล์นี้โหลดทุกหน้า แต่ช่องค้นหามีแค่หน้าแรก
// ถ้าอยู่หน้าอื่นจะได้ null พอเอาไปใช้ต่อจะ error แล้ว JS หยุดทำงานทั้งไฟล์
// (ปุ่มสลับธีมจะพังตามไปด้วย) จึงต้องเช็กก่อนว่าหาเจอไหม
if (searchInput) {
  const emptyState = document.getElementById("emptyState");

  const filterCourses = () => {
    const keyword = searchInput.value.trim().toLowerCase();
    let found = 0;

    document.querySelectorAll("[data-search]").forEach((item) => {
      // .dataset.search อ่านค่าจากแอตทริบิวต์ data-search ใน HTML (ตัด data- ออกเสมอ)
      // .includes() เช็กว่ามีคำที่ค้นอยู่ข้างในไหม ได้ true หรือ false
      const match = item.dataset.search.toLowerCase().includes(keyword);

      // classList.toggle ที่ใส่ค่าที่สอง จะไม่ใช่การสลับไปมา แต่เป็นการ "บังคับ"
      // true = ใส่คลาส · false = เอาคลาสออก
      // !match คือค่าตรงข้าม — ถ้าเจอ (true) จะได้ false = เอา d-none ออก = การ์ดโผล่
      // สังเกตว่าเราแค่ "ซ่อน" ไม่ได้ "ลบ" การ์ดยังอยู่ใน HTML ครบ
      item.classList.toggle("d-none", !match);
      if (match) found++;
    });

    emptyState.classList.toggle("d-none", found > 0);
  };

  searchInput.addEventListener("input", filterCourses);

  document.getElementById("searchForm").addEventListener("submit", (e) => {
    // ปกติฟอร์มจะโหลดหน้าใหม่ตอน submit ซึ่งเราไม่ต้องการ
    // preventDefault บอกว่า "อย่าทำพฤติกรรมปกติ" หน้าจึงไม่กระพริบ
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
