import React, { useState, useMemo, useEffect } from "react";
import "./Tolovlar.css";
import { Line } from "react-chartjs-2";
import { Outlet } from "react-router-dom";
import Profile from "../students/Profile";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function Tolovlar() {
  useEffect(() => {
    // API ulanishi
  }, []);

  const chartData = {
    labels: ["Okt 25", "Okt 26", "Okt 27", "Okt 28", "Okt 29"],
    datasets: [
      {
        label: "Yechib olishlar",
        data: [750000, 750030, 750200, 751000, 753000],
        borderColor: "#1d8ff0",
        backgroundColor: "rgba(29, 143, 240, 0.2)",
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: false, suggestedMin: 749990, suggestedMax: 750010 },
    },
  };

  const initialPayments = [
    {
      id: 1,
      date: "2025-10-17",
      student: "Kamoldin",
      sum: 500000,
      currency: "UZS",
      type: "Naqd pul",
      teacher: "First teacher",
      note: "FrontEnd",
      staff: "Hojimurod Nasriddinov",
      time: "2025-10-17 16:05:58",
    },
    {
      id: 2,
      date: "2025-10-17",
      student: "Faxriddin",
      sum: 400000,
      currency: "UZS",
      type: "Naqd pul",
      teacher: "First teacher",
      note: "FrontEnd",
      staff: "Hojimurod Nasriddinov",
      time: "2025-10-17 16:40:00",
    },
  ];

  const [payments] = useState(initialPayments);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 1. Inputlarga yozilayotgan vaqtinchalik ma'lumotlar
  const initialFilterState = {
    fromDate: "", toDate: "", name: "", group: "", course: "",
    teacher: "", staff: "", createdFrom: "", createdTo: "", paymentType: "", amount: "",
  };
  const [filters, setFilters] = useState(initialFilterState);

  // 2. TUGMA BOSILGANDA jadvalga ta'sir qiladigan ASOSIY FILTRLAR
  const [appliedFilters, setAppliedFilters] = useState(initialFilterState);

  const filterLabels = {
    fromDate: "Sanadan boshlab", toDate: "Sana bo‘yicha", name: "Ism yoki Telefon",
    group: "Guruhni tanlang", course: "Kurs", teacher: "O‘qituvchi", paymentType: "To‘lov turi",
    staff: "Xodim", amount: "Sum", createdFrom: "Yaratilgan sanadan", createdTo: "Yaratilgan sanagacha"
  };

  const [visibleFilters, setVisibleFilters] = useState(
    Object.keys(filterLabels).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );

  const toggleFilterVisibility = (field) => {
    setVisibleFilters(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const updateField = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  // --- YANGI: TUGMALAR UCHUN FUNKSIYALAR ---
  const handleApplyFilter = () => {
    // Faqat "Filter" tugmasi bosilganda inputdagi ma'lumotlarni asosiy filterga o'tkazamiz
    setAppliedFilters(filters);
  };

  const clearFilters = () => {
    // "Tozalash" bosilganda ham inputlarni, ham qidiruv natijalarini tozalaymiz
    setFilters(initialFilterState);
    setAppliedFilters(initialFilterState);
  };
  // ------------------------------------------

  // Jadvalni "appliedFilters" (Tugma bosilgandagi state) orqali filtrlash
  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (appliedFilters.fromDate && p.date < appliedFilters.fromDate) return false;
      if (appliedFilters.toDate && p.date > appliedFilters.toDate) return false;
      
      if (appliedFilters.name) {
        const searchName = appliedFilters.name.toLowerCase();
        if (!p.student.toLowerCase().includes(searchName)) return false;
      }
      
      if (appliedFilters.group && p.note !== appliedFilters.group) return false;
      if (appliedFilters.teacher && p.teacher !== appliedFilters.teacher) return false;
      if (appliedFilters.paymentType && p.type !== appliedFilters.paymentType) return false;
      if (appliedFilters.amount && Number(appliedFilters.amount) !== p.sum) return false;
      if (appliedFilters.staff && p.staff !== appliedFilters.staff) return false;
      
      if (appliedFilters.createdFrom) {
        const created = p.time.split(" ")[0];
        if (created < appliedFilters.createdFrom) return false;
      }
      if (appliedFilters.createdTo) {
        const created = p.time.split(" ")[0];
        if (created > appliedFilters.createdTo) return false;
      }
      
      return true;
    });
  }, [payments, appliedFilters]);

  const totals = useMemo(() => {
    const totalSum = filtered.reduce((s, p) => s + p.sum, 0);
    return { totalSum, profit: totalSum };
  }, [filtered]);

  // 1. SARALASH UCHUN STATE
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // 2. SARALASH MANTIG'I 
  // (DIQQAT: "payments" degan so'z o'rniga o'zingizdagi to'lovlar bazasi / state nomini yozing)
  const sortedPayments = useMemo(() => {
    let sortableItems = [...payments]; 
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key] || '';
        let bVal = b[sortConfig.key] || '';

        // Agar summa bo'yicha saralansa, raqam sifatida hisoblaymiz
        if (sortConfig.key === 'amount') {
          aVal = Number(aVal);
          bVal = Number(bVal);
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [payments, sortConfig]); // "payments" ni o'zingiznikiga almashtiring

  // 3. TUGMA BOSILGANDA ISHLAYDIGAN FUNKSIYA
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // 4. IKONKALARNI CHIZISH UCHUN
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "fa-solid fa-sort ms-1 text-muted opacity-25";
    return sortConfig.direction === 'asc' ? "fa-solid fa-sort-up ms-1 text-primary" : "fa-solid fa-sort-down ms-1 text-primary";
  };

  // To'lov ustiga bosganda talabani bazadan topib beruvchi funksiya
  // To'lov ustiga bosganda talabani bazadan topib beruvchi funksiya
  const handleOpenProfile = (payment) => {
    const allStudents = JSON.parse(localStorage.getItem('studentsList') || '[]');
    
    // Talabani ism bo'yicha qidiramiz (Katta-kichik harf va bo'shliqlarni hisobga olmaymiz)
    const foundStudent = allStudents.find(s => 
      s.name?.trim().toLowerCase() === payment.student?.trim().toLowerCase()
    );
    
    if (foundStudent) {
      setSelectedStudent(foundStudent); // Topilsa haqiqiy profilni ochadi
    } else {
      // Agar bazada topilmasa (Fake data to'qnashuvi sababli), alert o'rniga vaqtinchalik profil ochamiz
      const tempStudent = {
        id: `temp-${payment.id}`,
        name: payment.student,
        phone: "Noma'lum",
        balance: payment.sum, // To'lagan pulini balansida ko'rsatamiz
        coins: 0,
        groups: payment.note || "Noma'lum",
        teacher: payment.teacher || "Noma'lum",
        date: payment.date,
        note: "Diqqat: Bu talaba haqiqiy bazada yo'q. Vaqtinchalik profil."
      };
      setSelectedStudent(tempStudent);
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => (document.body.style.overflow = "auto");
  }, [selectedStudent]);

  return (
    <div className="container-fluid my-4 tolovlar-page px-4">
      
      <h3 className="mb-4 fw-bold text-dark">Barcha to'lovlar</h3>

      <div className="row g-4">
        {/* LEFT CARDS */}
        <div className="col-lg-5">
          <div className="card card-stat mb-3 border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center p-4">
              <div className="orovchi">
                <div className="text-muted small fw-medium mb-1">To'lovlar miqdori:</div>
                <h3 className="fw-bold text-dark m-0">
                  {totals.totalSum.toLocaleString()} UZS
                </h3>
                <div className="small smtxt d-flex text-muted mt-1">01.10.2025 — 31.10.2025</div>
              </div>
              <div className="icon-stack bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '24px' }}>💰</div>
            </div>
          </div>

          <div className="card card-stat border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center p-4">
              <div className="orovchi">
                <div className="text-muted small fw-medium mb-1">Sof foyda miqdori:</div>
                <h3 className="fw-bold text-dark m-0">
                  {totals.profit.toLocaleString()} UZS
                </h3>
                <div className="small smtxt text-muted mt-1">01.10.2025 — 31.10.2025</div>
              </div>
              <div className="icon-stack bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '24px' }}>💵</div>
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className="col-lg-7">
          <div className="card chart-card border-0 shadow-sm h-100">
            <div className="card-body" style={{ height: '230px', position: 'relative' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* DROPDOWN (⚙ Filtr) */}
      <div className="d-flex justify-content-end mt-4 mb-2">
        <div className="dropdown">

          <button
            className="btn btn-outline-secondary dropdown-toggle px-3 py-2 "
            type="button"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
          >
            ⚙ Filtr
          </button>

          <ul
            className="dropdown-menu shadow p-3 border-0"
            style={{ width: "250px", borderRadius: "10px" }}
          >
            <h6 className="dropdown-header px-1 text-dark fw-bold mb-2">
              Ko‘rinadigan ustunlar
            </h6>

            {Object.entries(filterLabels).map(([key, label]) => (
              <li key={key}>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`chk-${key}`}
                    checked={visibleFilters[key]}
                    onChange={() => toggleFilterVisibility(key)}
                  />
                  <label
                    className="form-check-label text-muted"
                    htmlFor={`chk-${key}`}
                    style={{ fontSize: "14px" }}
                  >
                    {label}
                  </label>
                </div>
              </li>
            ))}
          </ul>

        </div>
      </div>


      {/* FILTERS WRAPPER */}
      <div className="filter-wrapper">

        {visibleFilters.fromDate && (
          <div className="f-item">
            <label>Sanadan boshlab</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => updateField("fromDate", e.target.value)}
            />
          </div>
        )}

        {visibleFilters.toDate && (
          <div className="f-item">
            <label>Sana bo‘yicha</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => updateField("toDate", e.target.value)}
            />
          </div>
        )}

        {visibleFilters.name && (
          <div className="f-item wide">
            <label>Ism yoki Telefon</label>
            <input
              type="text"
              placeholder="Qidiruv..."
              value={filters.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>
        )}

        {visibleFilters.group && (
          <div className="f-item">
            <label>Guruhni tanlang</label>
            <select
              value={filters.group}
              onChange={(e) => updateField("group", e.target.value)}
            >
              <option value="">Barchasi</option>
              <option>FrontEnd</option>
            </select>
          </div>
        )}

        {visibleFilters.course && (
          <div className="f-item">
            <label>Kurs</label>
            <select
              value={filters.course}
              onChange={(e) => updateField("course", e.target.value)}
            >
              <option value="">Barchasi</option>
              <option>FrontEnd</option>
            </select>
          </div>
        )}

        {visibleFilters.teacher && (
          <div className="f-item">
            <label>O‘qituvchi</label>
            <select
              value={filters.teacher}
              onChange={(e) => updateField("teacher", e.target.value)}
            >
              <option value="">Barchasi</option>
              <option>First teacher</option>
            </select>
          </div>
        )}

        {visibleFilters.paymentType && (
          <div className="f-item">
            <label>To‘lov turi</label>
            <select
              value={filters.paymentType}
              onChange={(e) => updateField("paymentType", e.target.value)}
            >
              <option value="">Barchasi</option>
              <option>Naqd pul</option>
            </select>
          </div>
        )}

        {visibleFilters.staff && (
          <div className="f-item">
            <label>Xodim</label>
            <select
              value={filters.staff}
              onChange={(e) => updateField("staff", e.target.value)}
            >
              <option value="">Barchasi</option>
              <option>Hojimurod Nasriddinov</option>
            </select>
          </div>
        )}

        {visibleFilters.amount && (
          <div className="f-item">
            <label>Sum</label>
            <input
              type="number"
              placeholder="0"
              value={filters.amount}
              onChange={(e) => updateField("amount", e.target.value)}
            />
          </div>
        )}

        {visibleFilters.createdFrom && (
          <div className="f-item">
            <label>Yaratilgan sanadan</label>
            <input
              type="date"
              value={filters.createdFrom}
              onChange={(e) => updateField("createdFrom", e.target.value)}
            />
          </div>
        )}

        {visibleFilters.createdTo && (
          <div className="f-item">
            <label>Yaratilgan sanagacha</label>
            <input
              type="date"
              value={filters.createdTo}
              onChange={(e) => updateField("createdTo", e.target.value)}
            />
          </div>
        )}

      </div>

          {/* YANGILANGAN TUGMALAR */}
          <div className="filter-actions">
            <button 
              className="btn text-white px-4 fw-medium" 
              style={{ backgroundColor: '#F27A21', border: 'none' }} 
              onClick={handleApplyFilter} 
            >
              Filter
            </button>

            <button 
              className="btn btn-light border px-4 fw-medium text-muted" 
              onClick={clearFilters}
            >
              Tozalash
            </button>
          </div>


      {/* TABLE */}
      <div className="table-responsive card border-0 shadow-sm">
        <table className="table table-hover align-middle mb-0" style={{ fontSize: '14px' }}>
          <thead className="bg-light text-muted">
            <tr>
              <th className="fw-medium py-3 px-4 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('date')}>
                Sana <i className={getSortIcon('date')}></i>
              </th>
              <th className="fw-medium py-3 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('studentName')}>
                Talaba ismi <i className={getSortIcon('studentName')}></i>
              </th>
              <th className="fw-medium py-3 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('amount')}>
                Sum <i className={getSortIcon('amount')}></i>
              </th>
              <th className="fw-medium py-3 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('type')}>
                To'lov turi <i className={getSortIcon('type')}></i>
              </th>
              <th className="fw-medium py-3 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('teacher')}>
                O'qituvchi <i className={getSortIcon('teacher')}></i>
              </th>
              <th className="fw-medium py-3 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('note')}>
                Izoh <i className={getSortIcon('note')}></i>
              </th>
              <th className="fw-medium py-3 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('employee')}>
                Xodim <i className={getSortIcon('employee')}></i>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                onClick={() => handleOpenProfile(p)} /* <--- MANA SHU YER O'ZGARDI */
                style={{ cursor: "pointer" }}
              >
                <td className="px-4 text-muted">{p.date}</td>
                <td className="fw-medium text-dark">{p.student}</td>
                <td className="text-success fw-bold">
                  {p.sum.toLocaleString()} {p.currency}
                </td>
                <td className="text-muted">{p.type}</td>
                <td className="text-primary">{p.teacher}</td>
                <td><span className="badge bg-light text-secondary border">{p.note}</span></td>
                <td>
                  <div className="text-dark">{p.staff}</div>
                  <div className="small text-muted" style={{ fontSize: '11px' }}>{p.time}</div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-5 text-muted">Hech qanday ma'lumot topilmadi.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Outlet />

      {selectedStudent && (
        <div className="profile-fullscreen">
          <Profile
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        </div>
      )}

    </div>
  );
}