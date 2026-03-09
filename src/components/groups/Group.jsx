import React, { useState, useEffect, useMemo } from "react";
import "./Group.css";
import GroupItem from "./Group-item.jsx";
import AddGroupOffcanvas from "./AddGroupOffCanvas.jsx";

const initialGroups = [
  {
    id: 1, name: "FrontEnd", course: "First Course", teacher: "First teacher",
    days: "Toq kunlar", time: "09:00", start: "2025-10-17", end: "2026-01-17",
    duration: "0 oy / 0 hafta", room: "Room #1", students: 3, status: "faol",
  },
  {
    id: 2, name: "BackEnd", course: "Second Course", teacher: "Second teacher",
    days: "Juft kunlar", time: "11:00", start: "2025-11-01", end: "2026-02-01",
    duration: "0 oy / 0 hafta", room: "Room #2", students: 0, status: "faol",
  },
];

const LS_GROUPS = "om_groups_restored";
const LS_STUDENTS = "om_students_restored";

export default function Guruhlar() {
  const [groups, setGroups] = useState([]);
  const [query, setQuery] = useState("");
  
  // --- FILTR STATELARI ---
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTeacher, setFilterTeacher] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterDays, setFilterDays] = useState("all");
  const [filterStudents, setFilterStudents] = useState("all");
  
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // --- SARALASH (SORTING) STATELARI ---
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // --- DROPDOWN (AMALLAR) STATELARI ---
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // LocalStorage dan ma'lumotni yuklash
  const restoreGroups = () => {
    try {
      const savedGroups = JSON.parse(localStorage.getItem(LS_GROUPS) || "null");
      const savedStudents = JSON.parse(localStorage.getItem(LS_STUDENTS) || "null");
      const base = Array.isArray(savedGroups) ? savedGroups : initialGroups;
      if (Array.isArray(savedStudents)) {
        const counts = {};
        savedStudents.forEach((s) => {
          const gid = s.groupId ?? null;
          if (gid != null) counts[gid] = (counts[gid] || 0) + 1;
        });
        return base.map((g) => ({ ...g, students: counts[g.id] ?? (g.students ?? 0) }));
      }
      return base;
    } catch (e) {
      return initialGroups;
    }
  };

  useEffect(() => { setGroups(restoreGroups()); }, []);

  useEffect(() => {
    try { localStorage.setItem(LS_GROUPS, JSON.stringify(groups)); } catch (e) {}
  }, [groups]);

  // Ekran bo'sh joyiga bosganda Dropdownni yopish
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const updateGroupStudentCount = (groupId, newCount) => {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, students: newCount } : g)));
  };

  const updateGroup = (groupId, patch) => {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, ...patch } : g)));
  };

  const handleAddNewGroup = (newGroupData) => {
    const id = Math.max(0, ...groups.map((g) => g.id || 0)) + 1;
    const item = { id, ...newGroupData, end: newGroupData.end || "—", duration: "0 oy / 0 hafta", students: 0, status: "faol" };
    setGroups((p) => [...p, item]);
    setSelectedGroupId(item.id);
  };

  const exportGroupsToCSV = (list) => {
    const rows = (list ?? groups).map((g) => ({
      id: g.id, name: g.name, course: g.course, teacher: g.teacher, days: g.days,
      time: g.time, start: g.start, end: g.end, duration: g.duration, room: g.room,
      students: g.students ?? 0, status: g.status,
    }));
    const headers = ["ID", "Guruh", "Kurs", "O'qituvchi", "Kunlar", "Vaqt", "Boshlanish", "Tugash", "Davomiylik", "Xona", "Talabalar", "Status"];
    const csv = [headers, ...rows.map((r) => Object.values(r))].map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `groups_export_${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  // --- 1. FILTRLASH MANTIG'I ---
  const filtered = groups.filter((g) => {
    const q = query.trim().toLowerCase();
    if (q && !((g.name || "").toLowerCase().includes(q) || (g.course || "").toLowerCase().includes(q) || (g.teacher || "").toLowerCase().includes(q) || (g.room || "").toLowerCase().includes(q))) return false;
    if (filterStatus !== "all" && g.status.toLowerCase() !== filterStatus) return false;
    if (filterTeacher !== "all" && g.teacher !== filterTeacher) return false;
    if (filterCourse !== "all" && g.course !== filterCourse) return false;
    if (filterDays !== "all" && g.days !== filterDays) return false;
    if (filterStudents !== "all") {
      if (filterStudents === "0" && g.students !== 0) return false;
      if (filterStudents === "1-5" && (g.students < 1 || g.students > 5)) return false;
      if (filterStudents === "6-10" && (g.students < 6 || g.students > 10)) return false;
      if (filterStudents === "10+" && g.students < 10) return false;
    }
    return true;
  });

  // --- 2. SARALASH MANTIG'I ---
  const sortedGroups = useMemo(() => {
    let sortableItems = [...filtered];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key] || '';
        let bVal = b[sortConfig.key] || '';

        if (sortConfig.key === 'students') {
          aVal = Number(aVal);
          bVal = Number(bVal);
        }

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

  // --- 3. DROPDOWN AMALLARI ---
  const handleActionClick = (e, id) => {
    e.stopPropagation(); // Guruh ichiga kirib ketmasligi uchun
    const rect = e.currentTarget.getBoundingClientRect();
    // Dropdown ekrandan toshib ketmasligi uchun joylashuvni hisoblash
    setDropdownPosition({ top: rect.bottom + 5, left: rect.left - 100 });
    setActiveDropdown(prev => prev === id ? null : id);
  };

  const handleDeleteGroup = (id) => {
    if (window.confirm("Guruhni o'chirishni xohlaysizmi?")) {
      setGroups(groups.filter(g => g.id !== id));
      setActiveDropdown(null);
    }
  };

  const handleEditGroup = (id) => {
    setActiveDropdown(null);
    setSelectedGroupId(id); 
    // Yoki tahrirlash modalini shu yerda ochishingiz mumkin
  };

  const uniqueTeachers = ["all", ...new Set(groups.map(g => g.teacher))];
  const uniqueCourses = ["all", ...new Set(groups.map(g => g.course))];
  const uniqueDays = ["all", ...new Set(groups.map(g => g.days))];

  // Agar guruh tanlansa uning ichiga kiradi
  if (selectedGroupId !== null) {
    const group = groups.find((g) => g.id === selectedGroupId) || null;
    return (
      <div style={{ minHeight: "100vh", background: "#fafafa", padding: "1rem" }}>
        <button className="btn btn-sm btn-outline-secondary mb-3" onClick={() => setSelectedGroupId(null)}>← Orqaga</button>
        <GroupItem group={group} groups={groups} setGroups={setGroups} updateGroupStudentCount={updateGroupStudentCount} updateGroup={updateGroup} onClose={() => setSelectedGroupId(null)} />
      </div>
    );
  }

  return (
    <div className="layout position-relative">
      <main className="content cardd p-2 p-sm-3 p-md-4">
        
        {/* HEADER */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2">
          <h3 className="fw-bold mb-0">Guruhlar <small className="text-muted ms-2 d-inline-block" style={{fontSize: '14px', fontWeight: 'normal'}}>Miqdor — {sortedGroups.length}</small></h3>
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => exportGroupsToCSV(sortedGroups)}>Excelga yuklab olish</button>
            <button className="btn text-white btn-sm" style={{backgroundColor: '#ff7a00'}} data-bs-toggle="offcanvas" data-bs-target="#addGroupOffcanvas">
              Yangisini qo'shish
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="filters bg-white p-3 rounded shadow-sm mb-3">
          <div className="row g-2">
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label small mb-1 text-muted">Status</label>
              <select className="form-select form-select-sm text-dark" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Hammasi</option>
                <option value="faol">Faol</option>
                <option value="yopilgan">Yopilgan</option>
              </select>
            </div>
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label small mb-1 text-muted">O'qituvchi</label>
              <select className="form-select form-select-sm text-dark" value={filterTeacher} onChange={(e) => setFilterTeacher(e.target.value)}>
                {uniqueTeachers.map((t) => <option key={t} value={t}>{t === "all" ? "Hammasi" : t}</option>)}
              </select>
            </div>
            <div className="col-12 col-sm-6 col-md-2">
              <label className="form-label small mb-1 text-muted">Kurs</label>
              <select className="form-select form-select-sm text-dark" value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
                {uniqueCourses.map((c) => <option key={c} value={c}>{c === "all" ? "Hammasi" : c}</option>)}
              </select>
            </div>
            <div className="col-12 col-sm-6 col-md-2">
              <label className="form-label small mb-1 text-muted">Kunlar</label>
              <select className="form-select form-select-sm text-dark" value={filterDays} onChange={(e) => setFilterDays(e.target.value)}>
                {uniqueDays.map((d) => <option key={d} value={d}>{d === "all" ? "Hammasi" : d}</option>)}
              </select>
            </div>
            <div className="col-12 col-sm-6 col-md-2">
              <label className="form-label small mb-1 text-muted">Talabalar</label>
              <select className="form-select form-select-sm text-dark" value={filterStudents} onChange={(e) => setFilterStudents(e.target.value)}>
                <option value="all">Hammasi</option>
                <option value="0">0 ta</option>
                <option value="1-5">1-5 ta</option>
                <option value="6-10">6-10 ta</option>
                <option value="10+">10+ ta</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <div className="input-group input-group-sm" style={{maxWidth: '500px'}}>
              <input className="searchbars form-control form-control-sm" placeholder="Qidirish: Guruh nomi, Kurs, O'qituvchi yoki Xona..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <button className="btn btn-outline-secondary" onClick={() => setQuery("")}>✕</button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded shadow-sm table-responsive" style={{minHeight: '400px'}}>
          <table className="table table-hover mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th style={{ minWidth: "140px", cursor: 'pointer', userSelect: 'none', color: '#555' }} onClick={() => requestSort('name')}>
                  Guruh <i className={getSortIcon('name')}></i>
                </th>
                <th style={{ minWidth: "120px", cursor: 'pointer', userSelect: 'none', color: '#555' }} onClick={() => requestSort('course')}>
                  Kurs <i className={getSortIcon('course')}></i>
                </th>
                <th style={{ minWidth: "140px", cursor: 'pointer', userSelect: 'none', color: '#555' }} onClick={() => requestSort('teacher')}>
                  O'qituvchi <i className={getSortIcon('teacher')}></i>
                </th>
                <th style={{ minWidth: "110px", cursor: 'pointer', userSelect: 'none', color: '#555' }} onClick={() => requestSort('days')}>
                  Kunlar <i className={getSortIcon('days')}></i>
                </th>
                <th style={{ minWidth: "120px", cursor: 'pointer', userSelect: 'none', color: '#555' }} onClick={() => requestSort('start')}>
                  Sana <i className={getSortIcon('start')}></i>
                </th>
                <th style={{ minWidth: "90px", cursor: 'pointer', userSelect: 'none', color: '#555' }} onClick={() => requestSort('room')}>
                  Xona <i className={getSortIcon('room')}></i>
                </th>
                <th style={{ minWidth: "80px", cursor: 'pointer', userSelect: 'none', color: '#555' }} className="text-center" onClick={() => requestSort('students')}>
                  Talabalar <i className={getSortIcon('students')}></i>
                </th>
                
                {/* AMALLAR USTUNI */}
                <th style={{ width: "60px", color: '#555' }} className="text-center">Amallar</th>

              </tr>
            </thead>
            <tbody>
              {sortedGroups.length === 0 ? (
                <tr><td colSpan="8" className="text-center text-muted py-5">Hech qanday guruh topilmadi</td></tr>
              ) : (
                sortedGroups.map((g) => (
                  <tr key={g.id} style={{ cursor: "pointer" }} onClick={() => setSelectedGroupId(g.id)}>
                    <td className="fw-semibold text-dark" style={{fontSize: '14.5px'}}>{g.name}</td>
                    <td className="text-muted">{g.course}</td>
                    <td className="text-muted">{g.teacher}</td>
                    <td>
                      <div className="text-muted small">{g.days}</div>
                      <div className="fw-medium text-dark">{g.time}</div>
                    </td>
                    <td>
                      <div className="text-dark">{g.start}</div>
                      <div className="text-muted small">{g.end}</div>
                    </td>
                    <td className="text-muted">{g.room}</td>
                    <td className="text-center fw-bold text-dark">{g.students ?? 0}</td>
                    
                    {/* UCHTA NUQTA (AMALLAR) */}
                    <td className="text-center position-relative" onClick={(e) => e.stopPropagation()}>
                      <div 
                        onClick={(e) => handleActionClick(e, g.id)} 
                        style={{ cursor: 'pointer', padding: '5px 10px', fontSize: '20px', fontWeight: 'bold', color: '#ff7a00', userSelect: 'none', display: 'inline-block' }}
                        title="Amallar"
                      >
                        ⋮
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* TASHQARIDAN CHAQIRILGAN MODAL (OFFCANVAS) */}
      <AddGroupOffcanvas onAddGroup={handleAddNewGroup} />

      {/* DROPDOWN (O'CHIRISH VA TAHRIRLASH) */}
      {activeDropdown !== null && (
        <div 
          style={{
            position: 'fixed',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            background: 'white',
            border: '1px solid #eaeaea',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            minWidth: '150px',
            zIndex: 9999,
            padding: '4px'
          }} 
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="btn btn-sm w-100 text-start border-0 py-2 px-3 text-dark bg-transparent" 
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'} 
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            onClick={() => handleEditGroup(activeDropdown)}
          >
            <i className="fa-solid fa-pen me-2 text-warning"></i> Tahrirlash
          </button>
          
          <button 
            className="btn btn-sm w-100 text-start border-0 py-2 px-3 text-danger bg-transparent" 
            onMouseEnter={(e) => e.target.style.backgroundColor = '#fff5f5'} 
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            onClick={() => handleDeleteGroup(activeDropdown)}
          >
            <i className="fa-solid fa-trash me-2"></i> O'chirish
          </button>
        </div>
      )}

    </div>
  );
}