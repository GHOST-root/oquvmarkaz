import React, { useState, useMemo } from "react";
import "./YechibOlish.css";
import { Line } from "react-chartjs-2";
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

export default function YechibOlish() {
  const [filters, setFilters] = useState({
    from: "", to: "", search: "", sum: "", kurs: "",
  });

  const [data, setData] = useState([
    { sana: "17.10.2025", name: "Jumaqozi", sum: 250000, izoh: "FrontEnd 7 dars (17.10 — 31.10)", xodim: "Hojimurod Nasriddinov 16:04" },
    { sana: "17.10.2025", name: "Kamoldin", sum: 250000, izoh: "FrontEnd 7 dars (17.10 — 31.10)", xodim: "Hojimurod Nasriddinov 16:05" },
    { sana: "17.10.2025", name: "Faxriddin", sum: 250000, izoh: "FrontEnd 7 dars (17.10 — 31.10)", xodim: "Hojimurod Nasriddinov 16:40" },
  ]);

  // 🔴 MODAL VA SORTING STATES
  const [showModal, setShowModal] = useState(false);
  const [selectedName, setSelectedName] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // 1. Filtrlash mantig'i
  const handleFilter = () => {
    return data.filter((item) => {
      // (Vaqtinchalik: Sana formatlari to'g'rilanishi kerak, chunki 17.10.2025 string holatida)
      const matchSearch = item.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchSum = filters.sum ? item.sum == filters.sum : true;
      return matchSearch && matchSum;
    });
  };

  const filtered = handleFilter();
  const totalSum = filtered.reduce((a, b) => a + b.sum, 0);

  // 2. Saralash (Sorting) mantig'i
  const sortedData = useMemo(() => {
    let sortableItems = [...filtered];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filtered, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "fa-solid fa-sort ms-1 text-muted opacity-25";
    return sortConfig.direction === 'asc' ? "fa-solid fa-sort-up ms-1 text-primary" : "fa-solid fa-sort-down ms-1 text-primary";
  };

  // ✅ HA bosilganda o‘chadi
  const confirmDelete = () => {
    setData(data.filter((x) => x.name !== selectedName));
    setShowModal(false);
    setSelectedName(null);
  };

  // --- GRAFIK (CHART) DATA VA OPTIONS ---
  const chartData = {
    labels: ["Okt 25", "Okt 26", "Okt 27", "Okt 28", "Okt 29"],
    datasets: [
      {
        label: "Yechib olishlar",
        data: [1150100, 950001, 850000, 839999, 750000],
        borderColor: "#1d8ff0",
        backgroundColor: "rgba(29, 143, 240, 0.2)",
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Grafik o'z qutisiga to'liq sig'ishi uchun juda muhim
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: false, suggestedMin: 749990, suggestedMax: 750010 },
    },
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
      <h3 className="fw-bold text-dark mb-4">Yechib olish</h3>

      {/* SUMMARY VA CHART (Grafik izohdan chiqarildi va to'g'ri o'lcham berildi) */}
      <div className="row g-4 mb-4">
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100 p-4 d-flex justify-content-center">
            <div>
              <div className="text-muted small fw-medium mb-1">Jami yechib olishlar:</div>
              <h3 className="fw-bold text-primary m-0">
                {totalSum.toLocaleString()} UZS
              </h3>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm border-0 p-3 h-100">
            <div style={{ position: 'relative', height: '230px', width: '100%' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm p-0 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: '14px' }}>
            <thead className="bg-light text-muted">
              <tr>
                <th className="py-3 px-4 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('sana')}>Sana <i className={getSortIcon('sana')}></i></th>
                <th className="py-3 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('name')}>Talaba <i className={getSortIcon('name')}></i></th>
                <th className="py-3 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('sum')}>Sum <i className={getSortIcon('sum')}></i></th>
                <th className="py-3 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('izoh')}>Izoh <i className={getSortIcon('izoh')}></i></th>
                <th className="py-3 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('xodim')}>Xodim <i className={getSortIcon('xodim')}></i></th>
                <th className="py-3 border-0 text-center">Harakat</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, i) => (
                <tr key={i}>
                  <td className="px-4 text-muted">{item.sana}</td>
                  <td className="fw-medium text-dark">{item.name}</td>
                  <td className="text-danger fw-medium">{item.sum.toLocaleString()} UZS</td>
                  <td className="text-muted"><span className="badge bg-light text-secondary border">{item.izoh}</span></td>
                  <td>
                    <div className="text-dark">{item.xodim.split(' ')[0]} {item.xodim.split(' ')[1]}</div>
                    <div className="small text-muted" style={{ fontSize: '11px' }}>{item.xodim.split(' ')[2]}</div>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm text-danger bg-transparent border-0"
                      onClick={() => {
                        setSelectedName(item.name);
                        setShowModal(true);
                      }}
                      title="O'chirish"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              ))}

              {sortedData.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    Maʼlumot topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-end p-3 bg-white border-top">
          <button className="btn btn-light border text-muted shadow-sm" title="Yuklab olish">
            <i className="fa-solid fa-download me-2"></i> Yuklab olish
          </button>
        </div>
      </div>

      {/* 🔴 TASDIQLASH MODALI */}
      {showModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Haqiqatan ham o'chirasizmi?</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body text-center py-4">
                <div className="mb-3">
                  <i className="fa-solid fa-circle-exclamation text-warning" style={{ fontSize: '48px' }}></i>
                </div>
                <p className="text-muted m-0 fs-5">
                  Siz <strong>{selectedName}</strong> maʼlumotini tizimdan o'chirmoqchisiz.
                </p>
              </div>

              <div className="modal-footer border-top-0 d-flex justify-content-center gap-2 pt-0 pb-4">
                <button className="btn btn-light border px-4" onClick={() => setShowModal(false)}>
                  Bekor qilish
                </button>
                <button className="btn btn-danger px-4" onClick={confirmDelete}>
                  Ha, o‘chirish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}