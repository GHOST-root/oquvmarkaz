import React, { useState, useEffect, useMemo } from "react";
import "./Xarajatlar.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Xarajatlar() {
  const [allData, setAllData] = useState([]);
  
  // --- KATEGORIYALAR (TOIFALAR) BAZASI ---
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("xarajatCategories");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Kommunal to‘lovlar' },
      { id: 2, name: 'Kanstovar' },
      { id: 3, name: 'Arenda' },
      { id: 4, name: 'Ish haqi' },
      { id: 5, name: 'Oylik' }
    ];
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Kategoriyalarni xotirada saqlash
  useEffect(() => {
    localStorage.setItem("xarajatCategories", JSON.stringify(categories));
  }, [categories]);

  // --- FORM VA FILTR STATELARI ---
  const [form, setForm] = useState({ nomi: "", sana: "", turkum: "", oluvchi: "", sum: "", tolovTuri: "" });
  const [filterInputs, setFilterInputs] = useState({ from: "", to: "", nomi: "", turkum: "", oluvchi: "", tolovTuri: "" });
  const [appliedFilters, setAppliedFilters] = useState({ from: "", to: "", nomi: "", turkum: "", oluvchi: "", tolovTuri: "" });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Xarajatlarni xotiradan yuklash
  useEffect(() => {
    const saved = localStorage.getItem("xarajatlar");
    if (saved) setAllData(JSON.parse(saved));
  }, []);

  // --- FILTRLASH MANTIG'I ---
  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      if (appliedFilters.from && new Date(item.sana) < new Date(appliedFilters.from)) return false;
      if (appliedFilters.to && new Date(item.sana) > new Date(appliedFilters.to)) return false;
      if (appliedFilters.nomi && !item.nomi.toLowerCase().includes(appliedFilters.nomi.toLowerCase())) return false;
      if (appliedFilters.turkum && item.turkum !== appliedFilters.turkum) return false;
      if (appliedFilters.oluvchi && !item.oluvchi.toLowerCase().includes(appliedFilters.oluvchi.toLowerCase())) return false;
      if (appliedFilters.tolovTuri && item.tolovTuri !== appliedFilters.tolovTuri) return false;
      return true;
    });
  }, [allData, appliedFilters]);

  // --- SARALASH (SORTING) MANTIG'I ---
  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key] || '';
        let bVal = b[sortConfig.key] || '';
        if (sortConfig.key === 'sum') { aVal = Number(aVal); bVal = Number(bVal); }
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "fa-solid fa-sort ms-1 text-muted opacity-25";
    return sortConfig.direction === 'asc' ? "fa-solid fa-sort-up ms-1 text-primary" : "fa-solid fa-sort-down ms-1 text-primary";
  };

  // --- GRAFIKLAR ---
  const getBarChartData = () => {
    const monthlyData = {};
    filteredData.forEach((item) => {
      if (item.sana) {
        const monthYear = new Date(item.sana).toLocaleString("uz-UZ", { year: "numeric", month: "short" });
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + Number(item.sum || 0);
      }
    });
    const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));
    return {
      labels: sortedMonths.length > 0 ? sortedMonths : ["Hozircha bo'sh"],
      datasets: [{ label: "Xarajatlar", data: sortedMonths.length > 0 ? sortedMonths.map(m => monthlyData[m]) : [0], backgroundColor: "#ff8383", borderRadius: 4 }],
    };
  };

  const getPieChartData = () => {
    const categoryData = {};
    filteredData.forEach((item) => {
      const category = item.turkum || "Boshqa";
      categoryData[category] = (categoryData[category] || 0) + Number(item.sum || 0);
    });
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    const colors = ["#5ce1c5", "#4a5759", "#ff8383", "#ffd166", "#8b5cf6", "#0ea5e9", "#f59e0b"];

    return {
      labels: labels.length > 0 ? labels : ["Ma'lumot yo'q"],
      datasets: [{ data: data.length > 0 ? data : [1], backgroundColor: data.length > 0 ? colors.slice(0, labels.length) : ["#e0e0e0"], borderWidth: 0 }],
    };
  };

  // --- XARAJAT SAQLASH / O'CHIRISH ---
  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (!form.nomi || !form.sana || !form.sum || !form.tolovTuri || !form.turkum) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      return;
    }
    const newItem = {
      id: Date.now(),
      nomi: form.nomi, sana: form.sana, turkum: form.turkum, oluvchi: form.oluvchi,
      sum: Number(form.sum), tolovTuri: form.tolovTuri,
      xodim: "Hojimurod Nasriddinov", time: new Date().toLocaleString(),
    };
    const updatedAll = [...allData, newItem];
    setAllData(updatedAll);
    localStorage.setItem("xarajatlar", JSON.stringify(updatedAll));
    setForm({ nomi: "", sana: "", turkum: "", oluvchi: "", sum: "", tolovTuri: "" });
  };

  const handleDeleteExpense = (id) => {
    if (!window.confirm("Haqiqatan o'chirmoqchimisiz?")) return;
    const updated = allData.filter((i) => i.id !== id);
    setAllData(updated);
    localStorage.setItem("xarajatlar", JSON.stringify(updated));
  };

  // --- KATEGORIYA QO'SHISH / O'CHIRISH ---
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    setCategories([...categories, { id: Date.now(), name: newCategoryName }]);
    setNewCategoryName('');
    setShowAddCategoryInput(false);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Bu toifani o'chirishni xohlaysizmi?")) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  // Filtr amallari
  const applyFilter = () => setAppliedFilters(filterInputs);
  const clearFilter = () => {
    const emptyFilters = { from: "", to: "", nomi: "", turkum: "", oluvchi: "", tolovTuri: "" };
    setFilterInputs(emptyFilters); setAppliedFilters(emptyFilters);
  };

  const totalSum = filteredData.reduce((t, i) => t + Number(i.sum || 0), 0);

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
      
      <div className="row g-4 mb-4">
        {/* ================= CHAP TOMON (Grafiklar va Jami) ================= */}
        <div className="col-lg-8">
          <h3 className="fw-bold text-dark mb-4">Xarajatlar</h3>
          
          <div className="card border-0 shadow-sm p-4 mb-4 d-flex flex-row justify-content-between align-items-center">
            <div>
              <div className="text-muted small fw-medium mb-1">Jami xarajatlar miqdori:</div>
              <h3 className="fw-bold text-danger m-0">{totalSum.toLocaleString()} UZS</h3>
            </div>
            <div className="fs-1">💰</div>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm p-3 h-100">
                <div className="mb-3 d-flex align-items-center gap-2">
                  <div style={{ width: '4px', height: '20px', backgroundColor: '#007bff', borderRadius: '2px' }}></div>
                  <strong className="text-dark">Xarajatlar dinamikasi</strong>
                </div>
                <div style={{ height: '250px', position: 'relative' }}>
                  <Bar data={getBarChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm p-3 h-100">
                <div className="mb-3 d-flex align-items-center gap-2">
                  <div style={{ width: '4px', height: '20px', backgroundColor: '#5ce1c5', borderRadius: '2px' }}></div>
                  <strong className="text-dark">Turkumlar bo'yicha</strong>
                </div>
                <div style={{ height: '250px', position: 'relative' }}>
                  <Pie data={getPieChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= O'NG TOMON (Yangi xarajat qo'shish) ================= */}
        <div className="col-lg-4 mt-lg-5 pt-lg-2">
          <div className="card-clean">
            <h5 className="title">Yangi xarajatlar</h5>

            <form onSubmit={handleSaveExpense} className="expense-form">

              <div className="f-item">
                <label>Nomi *</label>
                <input
                  type="text"
                  value={form.nomi}
                  onChange={(e) => setForm({ ...form, nomi: e.target.value })}
                  required
                />
              </div>

              <div className="f-item">
                <label>Sana *</label>
                <input
                  type="date"
                  value={form.sana}
                  onChange={(e) => setForm({ ...form, sana: e.target.value })}
                  required
                />
              </div>

              <div className="f-item">
                <label>Turkum *</label>
                <select
                  value={form.turkum}
                  onChange={(e) => setForm({ ...form, turkum: e.target.value })}
                  required
                >
                  <option value="">Tanlang</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="f-item">
                <label>Oluvchi</label>
                <input
                  type="text"
                  value={form.oluvchi}
                  onChange={(e) => setForm({ ...form, oluvchi: e.target.value })}
                />
              </div>

              <div className="f-item">
                <label>Summa (UZS) *</label>
                <input
                  type="text"
                  value={form.sum ? Number(form.sum).toLocaleString("en-US") : ""}
                  onChange={(e) =>
                    setForm({ ...form, sum: e.target.value.replace(/[^\d]/g, "") })
                  }
                  placeholder="0"
                  required
                />
              </div>

              <div className="f-item">
                <label>To'lov turi *</label>

                <div className="radio-grid">
                  {["Naqd pul","Plastik karta","Click","Bank hisobi","Payme","Uzum","Humo"].map((v)=>(
                    <label key={v} className="radio-item">
                      <input
                        type="radio"
                        name="tolovTuri"
                        checked={form.tolovTuri === v}
                        onChange={() => setForm({ ...form, tolovTuri: v })}
                        required
                      />
                      <span>{v}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="save-btn">Saqlash</button>

            </form>
          </div>
        </div>

      </div>

      {/* ================= FILTER PANEL ================= */}
      <div className="filter-card">

        <div className="filter-grid">

          <div className="f-item">
            <label>Sanadan boshlab</label>
            <input
              type="date"
              value={filterInputs.from}
              onChange={(e) =>
                setFilterInputs({ ...filterInputs, from: e.target.value })
              }
            />
          </div>

          <div className="f-item">
            <label>Sana bo'yicha</label>
            <input
              type="date"
              value={filterInputs.to}
              onChange={(e) =>
                setFilterInputs({ ...filterInputs, to: e.target.value })
              }
            />
          </div>

          <div className="f-item">
            <label>Nomi</label>
            <input
              type="text"
              value={filterInputs.nomi}
              onChange={(e) =>
                setFilterInputs({ ...filterInputs, nomi: e.target.value })
              }
            />
          </div>

          <div className="f-item">
            <label>Kategoriya</label>
            <select
              value={filterInputs.turkum}
              onChange={(e) =>
                setFilterInputs({ ...filterInputs, turkum: e.target.value })
              }
            >
              <option value="">Barchasi</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="f-item">
            <label>Oluvchi</label>
            <input
              type="text"
              value={filterInputs.oluvchi}
              onChange={(e) =>
                setFilterInputs({ ...filterInputs, oluvchi: e.target.value })
              }
            />
          </div>

          <div className="f-item">
            <label>To'lov turi</label>
            <select
              value={filterInputs.tolovTuri}
              onChange={(e) =>
                setFilterInputs({ ...filterInputs, tolovTuri: e.target.value })
              }
            >
              <option value="">Barchasi</option>
              <option value="Naqd pul">Naqd pul</option>
              <option value="Click">Click</option>
              <option value="Plastik karta">Plastik karta</option>
            </select>
          </div>

        </div>

        <div className="filter-actions">
          <button className="btn-orange" onClick={applyFilter}>Filter</button>
          <button className="btn-light" onClick={clearFilter}>Tozalash</button>
        </div>

      </div>

      {/* ================= JADVAL QISMI ================= */}
      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: '14px' }}>
            <thead className="bg-light text-muted">
              <tr>
                <th className="py-3 px-4 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('sana')}>Sana <i className={getSortIcon('sana')}></i></th>
                <th className="py-3 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('turkum')}>Turkum <i className={getSortIcon('turkum')}></i></th>
                <th className="py-3 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('nomi')}>Nomi <i className={getSortIcon('nomi')}></i></th>
                <th className="py-3 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('oluvchi')}>Oluvchi <i className={getSortIcon('oluvchi')}></i></th>
                <th className="py-3 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('tolovTuri')}>To'lov turi <i className={getSortIcon('tolovTuri')}></i></th>
                <th className="py-3 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('sum')}>Sum <i className={getSortIcon('sum')}></i></th>
                <th className="py-3 border-0" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('xodim')}>Xodim <i className={getSortIcon('xodim')}></i></th>
                <th className="py-3 border-0 text-center">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-muted">Ma'lumot topilmadi. Xarajat qo'shing.</td>
                </tr>
              ) : (
                sortedData.map((i) => (
                  <tr key={i.id}>
                    <td className="px-4 text-muted">{i.sana}</td>
                    <td><span className="badge bg-light text-secondary border px-2 py-1">{i.turkum}</span></td>
                    <td className="fw-medium text-dark">{i.nomi}</td>
                    <td className="text-muted">{i.oluvchi || "Ko'rsatilmagan"}</td>
                    <td className="text-muted">{i.tolovTuri}</td>
                    <td className="text-danger fw-bold">{Number(i.sum).toLocaleString()} UZS</td>
                    <td>
                      <div className="text-dark">{i.xodim.split(' ')[0]} {i.xodim.split(' ')[1]}</div>
                      <div className="small text-muted" style={{ fontSize: '11px' }}>{i.time}</div>
                    </td>
                    <td className="text-center">
                      {/* RASMDAGI IKONKALAR */}
                      <i className="fa-regular fa-pen-to-square text-warning me-3" style={{ cursor: 'pointer', fontSize: '16px' }} title="Tahrirlash" onClick={() => alert("Tahrirlash bosildi")}></i>
                      <i className="fa-regular fa-trash-can text-danger" style={{ cursor: 'pointer', fontSize: '16px' }} title="O'chirish" onClick={() => handleDeleteExpense(i.id)}></i>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* TUGMALAR (Yuklab olish va Kategoriya qo'shish) */}
        <div className="d-flex justify-content-end align-items-center gap-3 p-3 bg-white border-top">
          <button className="btn btn-light border text-muted shadow-sm" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Yuklab olish">
            <i className="fa-solid fa-download"></i>
          </button>
          <button className="btn btn-light border text-muted shadow-sm fw-medium px-4" onClick={() => setShowCategoryModal(true)}>
            Kategoriya qo'shing
          </button>
        </div>
      </div>

      {/* ================= XARAJAT TOIFALARI MODALI (Kategoriya boshqaruvi) ================= */}
      {showCategoryModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px', minHeight: '400px' }}>
              
              <div className="modal-header border-bottom p-4">
                <h4 className="modal-title text-dark">Xarajat toifalari</h4>
                <button type="button" className="btn text-white px-4 fw-medium" style={{ backgroundColor: '#ff7a00', borderRadius: '30px' }} onClick={() => setShowAddCategoryInput(true)}>
                  Yangisini qo'shish
                </button>
              </div>

              <div className="modal-body p-4">
                
                {/* Yangi kategoriya kiritish formasi */}
                {showAddCategoryInput && (
                  <div className="d-flex gap-2 mb-4 bg-light p-3 rounded border">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Kategoriya nomini kiriting (masalan: Kommunal to'lovlar)" 
                      value={newCategoryName} 
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      autoFocus
                    />
                    <button className="btn text-white px-4" style={{ backgroundColor: '#10B981' }} onClick={handleAddCategory}>Saqlash</button>
                    <button className="btn btn-light border" onClick={() => { setShowAddCategoryInput(false); setNewCategoryName(''); }}>Bekor qilish</button>
                  </div>
                )}

                {/* Kategoriyalar jadvali */}
                <table className="table align-middle">
                  <thead className="text-muted" style={{ borderBottom: '2px solid #eaeaea' }}>
                    <tr>
                      <th className="fw-medium pb-3 border-0">id</th>
                      <th className="fw-medium pb-3 border-0">Ism</th>
                      <th className="fw-medium pb-3 border-0 text-center">Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length > 0 ? categories.map((cat) => (
                      <tr key={cat.id}>
                        <td className="text-muted">{cat.id.toString().slice(-4)}</td>
                        <td className="fw-medium text-dark">{cat.name}</td>
                        <td className="text-center">
                          <i className="fa-regular fa-trash-can text-danger me-3" style={{ cursor: 'pointer', fontSize: '15px' }} title="O'chirish" onClick={() => handleDeleteCategory(cat.id)}></i>
                          <i className="fa-regular fa-pen-to-square text-warning" style={{ cursor: 'pointer', fontSize: '15px' }} title="Tahrirlash"></i>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="3" className="text-center py-4 text-muted">Toifalar mavjud emas.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="modal-footer border-top-0 d-flex justify-content-end p-4 pt-0">
                <button className="btn btn-secondary px-4" onClick={() => setShowCategoryModal(false)}>Yopish</button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}