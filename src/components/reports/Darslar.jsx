import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import './reports.css'
import './darslar.css'

// =====================
// Statistikani hisoblash
// =====================
const calculateStats = (students) => {
  // HIMOYA: students har doim array bo‘lsin
  if (!Array.isArray(students)) students = [];

  const kelganlar = students.filter((s) => s.kelgan).length;
  const kelmaganlar = students.filter((s) => !s.kelgan).length;

  return {
    mainStats: [
      { label: "Kelgan talabalar (eng kami bir marta)", count: kelganlar, filterKey: "Kelgan" },
      { label: "Kelmagan (martadan ko'p)", count: kelmaganlar, filterKey: "Kelmagan" },
      { label: "Davomat belgilanmagan", count: 0, filterKey: "Belgilanmagan" },
      { label: "Barchasi", count: students.length, filterKey: "Barchasi" },
    ],
    statusStats: [
      { label: "Aktiv", count: students.filter((s) => s.holati === "Aktiv").length, filterKey: "Aktiv" },
      { label: "Demo", count: students.filter((s) => s.holati === "Demo").length, filterKey: "Demo" },
      { label: "Muzlatilgan", count: students.filter((s) => s.holati === "Muzlatilgan").length, filterKey: "Muzlatilgan" },
      { label: "Barchasi", count: students.length, filterKey: "BarchasiTotal" },
    ],
  };
};

// =====================
// Component
// =====================
const Darslar = () => {
  const [activeFilter, setActiveFilter] = useState("Barchasi");
  const [allStudents, setAllStudent] = useState([]);
  const [dateFrom, setDateFrom] = useState("2025-10-17");
  const [dateTo, setDateTo] = useState("2025-10-17");
  const [filial, setFilial] = useState("itbooster");
  const [guruh, setGuruh] = useState("");

  // STATISTIKA
  const stats = useMemo(() => calculateStats(allStudents), [allStudents]);

  // DATA FETCH
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://hisobot.pythonanywhere.com/accounts/"
        );

        // 🔴 MUAMMO SHU YERDA EDI
        // API array yoki object qaytarishidan qat'i nazar
        // allStudents HAR DOIM ARRAY bo‘ladi
        const studentsData = Array.isArray(response.data)
          ? response.data
          : response.data?.results || [];

        setAllStudent(studentsData);
      } catch (error) {
        console.error("Axios fetch error:", error);
        setAllStudent([]); // xavfsizlik
      }
    };

    fetchData();
  }, []);

  const handleFilterClick = (key) => {
    setActiveFilter(key);
  };

  const handleClearFilters = () => {
    setDateFrom("2025-10-17");
    setDateTo("2025-10-17");
    setFilial("itbooster");
    setGuruh("");
    setActiveFilter("Barchasi");
  };

  // FILTERED STUDENTS
  const filteredStudents = useMemo(() => {
    let filtered = Array.isArray(allStudents) ? allStudents : [];

    if (guruh) {
      filtered = filtered.filter((s) => s.guruh === guruh);
    }

    if (activeFilter === "Kelgan") return filtered.filter((s) => s.kelgan);
    if (activeFilter === "Kelmagan") return filtered.filter((s) => !s.kelgan);
    if (activeFilter === "Belgilanmagan") return [];
    if (activeFilter === "Barchasi" || activeFilter === "BarchasiTotal") return filtered;

    return filtered.filter((s) => s.holati === activeFilter);
  }, [activeFilter, guruh, allStudents]);

  return (
    <div className="attendance-container">
   

      <div className="main-content">
        <div className="report-section">
          <h1 className="report-title">Darsga kelish hisobotlari</h1>

          <div className="stats-grid d-flex flex-row justify-content-around">
           <div className="stats-table-wrap">

              <table className="stats-table">
                <tbody className="tablebody">

                  {stats.mainStats.map((left, i) => {
                    const right = stats.statusStats[i];

                    return (
                      <tr key={left.filterKey}>

                        {/* Chap label */}
                        <td
                          className={`label ${
                            activeFilter === left.filterKey ? "active" : ""
                          }`}
                          onClick={() => handleFilterClick(left.filterKey)}
                        >
                          {left.label}
                        </td>

                        {/* Chap count */}
                        <td
                          className={`count ${
                            activeFilter === left.filterKey ? "active" : ""
                          }`}
                          onClick={() => handleFilterClick(left.filterKey)}
                        >
                          {left.count}
                        </td>

                        {/* O‘ng label */}
                        <td
                          className={`label ${
                            activeFilter === right?.filterKey ? "active" : ""
                          }`}
                          onClick={() => handleFilterClick(right?.filterKey)}
                        >
                          {right?.label}
                        </td>

                        {/* O‘ng count */}
                        <td
                          className={`count ${
                            activeFilter === right?.filterKey ? "active" : ""
                          }`}
                          onClick={() => handleFilterClick(right?.filterKey)}
                        >
                          {right?.count}
                        </td>

                      </tr>
                    );
                  })}

                </tbody>
              </table>

            </div>
          </div>

          {/* TABLE */}
          <div className="table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Ism</th>
                  <th>Holati</th>
                  <th>Guruh</th>
                  <th>Davomat</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={index}>
                    <td>{student.ism}</td>
                    <td>{student.holati}</td>
                    <td>{student.guruh}</td>
                    <td>
                      <span
                        className={`attendance-indicator ${
                          student.kelgan ? "present" : "absent"
                        }`}
                      />
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="4" className="no-data">
                      Ma'lumot topilmadi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FILTER */}
        <div className="filter-section">
          <h2 className="filter-title">Filtr</h2>

          <div className="filter-group">
            <label>Sanadan boshlab</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Sana bo‘yicha</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Filiallar</label>
            <select value={filial} onChange={(e) => setFilial(e.target.value)}>
              <option value="itbooster">Itbooster</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Guruh</label>
            <select value={guruh} onChange={(e) => setGuruh(e.target.value)}>
              <option value="">Barchasi</option>
              <option value="FrontEnd">FrontEnd</option>
              <option value="BackEnd">BackEnd</option>
              <option value="Design">Design</option>
            </select>
          </div>

          <div className="filter-buttons">
            <button className="filter-button primary">Filtr</button>
            <button
              className="filter-button secondary"
              onClick={handleClearFilters}
            >
              Tozalash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Darslar;