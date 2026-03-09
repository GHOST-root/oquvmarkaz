import React, { useState, useMemo, useEffect } from "react";
import './darslar.css';

// --- MOCK BAZA (Asl ma'lumotlar bazasi) ---
// Har bir talabaning "attendance" obyektida sanalar bo'yicha "present" (bor), "absent" (yo'q) kabi qiymatlar saqlanadi.
const mockStudentsData = [
  { id: 1, ism: "Saidahmad", holati: "Aktiv", guruh: "1-guruh", filial: "itbooster", attendance: { "2025-05-10": "present", "2025-05-11": "none" } },
  { id: 2, ism: "Behruzbek", holati: "Aktiv", guruh: "Roboto texnika #1 SJ", filial: "itbooster", attendance: { "2025-05-10": "absent" } },
  { id: 3, ism: "Aniken Skywalker", holati: "Aktiv", guruh: "Roboto texnika #1 SJ", filial: "itbooster", attendance: { "2025-05-10": "none", "2025-05-11": "none" } }, // Belgilanmagan
  { id: 4, ism: "Javohir", holati: "Muzlatilgan", guruh: "BA Front-end #2", filial: "itbooster", attendance: { "2025-05-10": "present", "2025-05-12": "present" } },
  { id: 5, ism: "Aziza", holati: "Demo", guruh: "1-guruh", filial: "itbooster", attendance: { "2025-05-12": "absent" } }
];

export default function Darslar() {
  const [allStudents, setAllStudents] = useState([]);
  
  // 1. INPUT DAGI FILTRLAR (Faqat yozilayotgan vaqtda turadi)
  const [filterInputs, setFilterInputs] = useState({
    dateFrom: "2025-05-01",
    dateTo: "2025-05-31",
    filial: "itbooster",
    guruh: ""
  });

  // 2. ASOSIY FILTRLAR (Faqat "Filtr" tugmasi bosilganda ishlaydi)
  const [appliedFilters, setAppliedFilters] = useState({
    dateFrom: "2025-05-01",
    dateTo: "2025-05-31",
    filial: "itbooster",
    guruh: ""
  });

  // 3. STATISTIKADAN TANLANGAN FILTR (Masalan, faqat "Kelgan"larni ko'rish)
  const [activeStatFilter, setActiveStatFilter] = useState("Barchasi");

  // Komponent yuklanganda bazani olish (Hozircha Mock ishlatamiz)
  useEffect(() => {
    // API ni shu yerda chaqirasiz. Hozircha Local / Mock ma'lumot yuklaymiz.
    setAllStudents(mockStudentsData);
  }, []);

  // --- FILTRLASH VA DAVOMATNI HISABLASH MANTIG'I ---
  const processedData = useMemo(() => {
    // 1. Avval filial va guruh bo'yicha talabalarni ajratib olamiz
    let baseData = allStudents.filter(s => s.filial === appliedFilters.filial);
    if (appliedFilters.guruh) {
      baseData = baseData.filter(s => s.guruh === appliedFilters.guruh);
    }

    const start = new Date(appliedFilters.dateFrom).getTime();
    const end = new Date(appliedFilters.dateTo).getTime();

    // 2. Har bir talabaning tanlangan sanalar oralig'idagi holatini hisoblaymiz
    const enrichedData = baseData.map(student => {
      let presentCount = 0;
      let absentCount = 0;
      let totalRecordsInRange = 0;
      let squares = []; // Jadvalga to'rtburchak chizish uchun

      if (student.attendance) {
        Object.entries(student.attendance).forEach(([dateStr, status]) => {
          const dTime = new Date(dateStr).getTime();
          // Sana oraliqqa tushadimi?
          if (dTime >= start && dTime <= end) {
            totalRecordsInRange++;
            squares.push(status);
            if (status === "present") presentCount++;
            if (status === "absent") absentCount++;
          }
        });
      }

      // Talaba guruhining (Kelgan, Kelmagan, Belgilanmagan) ekanligini aniqlash
      let attCategory = "Belgilanmagan"; 
      if (presentCount > 0) {
        attCategory = "Kelgan";
      } else if (absentCount > 0 && presentCount === 0) {
        attCategory = "Kelmagan";
      } else if (totalRecordsInRange > 0 && presentCount === 0 && absentCount === 0) {
        // yozuv bor, lekin faqat "none" bo'lsa
        attCategory = "Belgilanmagan";
      }

      return { ...student, attCategory, squares };
    });

    return enrichedData;
  }, [allStudents, appliedFilters]);


  // --- STATISTIKANI YIG'ISH ---
  const stats = useMemo(() => {
    return {
      kelgan: processedData.filter(s => s.attCategory === "Kelgan").length,
      kelmagan: processedData.filter(s => s.attCategory === "Kelmagan").length,
      belgilanmagan: processedData.filter(s => s.attCategory === "Belgilanmagan").length,
      jami: processedData.length,

      aktiv: processedData.filter(s => s.holati === "Aktiv").length,
      demo: processedData.filter(s => s.holati === "Demo").length,
      muzlatilgan: processedData.filter(s => s.holati === "Muzlatilgan").length
    };
  }, [processedData]);

  // --- STATISTIKA BO'YICHA YAKUNIY RO'YXAT (Jadval uchun) ---
  const finalTableData = useMemo(() => {
    if (activeStatFilter === "Barchasi") return processedData;
    if (["Kelgan", "Kelmagan", "Belgilanmagan"].includes(activeStatFilter)) {
      return processedData.filter(s => s.attCategory === activeStatFilter);
    }
    if (["Aktiv", "Demo", "Muzlatilgan"].includes(activeStatFilter)) {
      return processedData.filter(s => s.holati === activeStatFilter);
    }
    return processedData;
  }, [processedData, activeStatFilter]);


  // --- AMALLAR (TUGMALAR) ---
  const applyFilter = () => {
    setAppliedFilters(filterInputs);
    setActiveStatFilter("Barchasi"); // Filtr bosilganda statistika tanlovini tozalaymiz
  };

  const clearFilter = () => {
    const defaultF = { dateFrom: "2025-05-01", dateTo: "2025-05-31", filial: "itbooster", guruh: "" };
    setFilterInputs(defaultF);
    setAppliedFilters(defaultF);
    setActiveStatFilter("Barchasi");
  };

  return (
    <div className="darslar-container">
      <div className="darslar-layout">
        
        {/* CHAP TOMON: HISOBOTLAR VA JADVAL */}
        <div className="darslar-main">
          
          <div className="d-card">
            <h2 className="d-card-title">Darsga kelish hisobotlari</h2>
            
            {/* Statistika Bloklari (2 ta ustunli) */}
            <div className="stats-wrapper">
              
              {/* 1-ustun: Davomat statistikasi */}
              <div className="stats-col">
                <table className="stats-table">
                  <tbody>
                    <tr className={activeStatFilter === "Kelgan" ? "active-stat" : ""} onClick={() => setActiveStatFilter("Kelgan")}>
                      <td>Kelgan talabalar (eng kami bir marta)</td>
                      <td className="stat-count">{stats.kelgan}</td>
                    </tr>
                    <tr className={activeStatFilter === "Kelmagan" ? "active-stat" : ""} onClick={() => setActiveStatFilter("Kelmagan")}>
                      <td>Kelmagan (martadan ko'p)</td>
                      <td className="stat-count">{stats.kelmagan}</td>
                    </tr>
                    <tr className={activeStatFilter === "Belgilanmagan" ? "active-stat" : ""} onClick={() => setActiveStatFilter("Belgilanmagan")}>
                      <td>Davomat belgilanmagan</td>
                      <td className="stat-count">{stats.belgilanmagan}</td>
                    </tr>
                    <tr className={activeStatFilter === "Barchasi" ? "active-stat" : ""} onClick={() => setActiveStatFilter("Barchasi")}>
                      <td>Barchasi</td>
                      <td className="stat-count">{stats.jami}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 2-ustun: Holat statistikasi */}
              <div className="stats-col border-start">
                <table className="stats-table">
                  <tbody>
                    <tr className={activeStatFilter === "Aktiv" ? "active-stat" : ""} onClick={() => setActiveStatFilter("Aktiv")}>
                      <td>Aktiv</td>
                      <td className="stat-count">{stats.aktiv}</td>
                    </tr>
                    <tr className={activeStatFilter === "Demo" ? "active-stat" : ""} onClick={() => setActiveStatFilter("Demo")}>
                      <td>Demo</td>
                      <td className="stat-count">{stats.demo}</td>
                    </tr>
                    <tr className={activeStatFilter === "Muzlatilgan" ? "active-stat" : ""} onClick={() => setActiveStatFilter("Muzlatilgan")}>
                      <td>Muzlatilgan</td>
                      <td className="stat-count">{stats.muzlatilgan}</td>
                    </tr>
                    <tr className={activeStatFilter === "Barchasi" ? "active-stat" : ""} onClick={() => setActiveStatFilter("Barchasi")}>
                      <td>Barchasi</td>
                      <td className="stat-count">{stats.jami}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* ASOSIY JADVAL */}
          <div className="d-card">
            <table className="table data-table mb-0 w-100">
              <thead>
                <tr>
                  <th style={{width: '30%'}}>Ism <i className="fa-solid fa-sort"></i></th>
                  <th style={{width: '25%'}}>Holati <i className="fa-solid fa-sort"></i></th>
                  <th style={{width: '25%'}}>Guruh <i className="fa-solid fa-sort"></i></th>
                  <th style={{width: '20%'}}>Davomat <i className="fa-solid fa-sort"></i></th>
                </tr>
              </thead>
              <tbody>
                {finalTableData.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-5 text-muted">Ushbu shartlarga mos ma'lumot topilmadi</td></tr>
                ) : (
                  finalTableData.map(student => (
                    <tr key={student.id}>
                      <td className="student-name">{student.ism}</td>
                      <td><span className="student-status">{student.guruh}: {student.holati}</span></td>
                      <td>{student.guruh}</td>
                      <td>
                        <div className="att-squares-container">
                          {student.squares.length === 0 && <span className="text-muted small">Yo'q</span>}
                          {student.squares.map((status, i) => (
                            <span key={i} className={`att-square ${status}`} title={status}></span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* O'NG TOMON: FILTR PANEL */}
        <div className="darslar-sidebar">
          <div className="d-card">
            <h3 className="filter-title">Filtr</h3>
            
            <div className="filter-group">
              <label>Sanadan boshlab</label>
              <input type="date" className="form-control" value={filterInputs.dateFrom} onChange={(e) => setFilterInputs({...filterInputs, dateFrom: e.target.value})} />
            </div>

            <div className="filter-group">
              <label>Sana bo'yicha</label>
              <input type="date" className="form-control" value={filterInputs.dateTo} onChange={(e) => setFilterInputs({...filterInputs, dateTo: e.target.value})} />
            </div>

            <div className="filter-group">
              <label>Filiallar</label>
              <select className="form-select" value={filterInputs.filial} onChange={(e) => setFilterInputs({...filterInputs, filial: e.target.value})}>
                <option value="itbooster">Itbooster</option>
                <option value="CRM2">CRM2</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Guruh</label>
              <select className="form-select" value={filterInputs.guruh} onChange={(e) => setFilterInputs({...filterInputs, guruh: e.target.value})}>
                <option value="">Barchasi</option>
                <option value="1-guruh">1-guruh</option>
                <option value="Roboto texnika #1 SJ">Roboto texnika #1 SJ</option>
                <option value="BA Front-end #2">BA Front-end #2</option>
              </select>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button className="btn-tozalash" onClick={clearFilter}>Tozalash</button>
              <button className="btn-filtr" onClick={applyFilter}>Filtr</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}