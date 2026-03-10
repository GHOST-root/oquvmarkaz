import React, { useState, useEffect, useRef } from "react";
import "./Group.css";
import GroupItem from "./Group-item.jsx";

const initialGroups = [
  {
    id: 1,
    name: "FrontEnd",
    course: "First Course",
    teacher: "First teacher",
    days: "Toq kunlar",
    time: "09:00",
    start: "2025-10-17",
    end: "2026-01-17",
    duration: "0 oy / 0 hafta",
    room: "Room #1",
    students: 3,    
    status: "faol",
  },
  {
    id: 2,
    name: "BackEnd",
    course: "Second Course",
    teacher: "Second teacher",
    days: "Juft kunlar",
    time: "11:00",
    start: "2025-11-01",
    end: "2026-02-01",
    duration: "0 oy / 0 hafta",
    room: "Room #2",
    students: 0,
    status: "faol",
  },
];

const LS_GROUPS = "om_groups_restored";
const LS_STUDENTS = "om_students_restored";

function DatePopup({ anchorRef, value, onChange, onClose }) {
  if (!anchorRef?.current) return null;
  const rect = anchorRef.current.getBoundingClientRect();
  const style = {
    position: "fixed",
    left: Math.max(10, Math.min(rect.left, window.innerWidth - 300)),
    top: rect.bottom + 6,
    zIndex: 4200,
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 6,
    padding: 10,
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    maxWidth: "calc(100vw - 20px)",
  };

  const fmt = (d) => d.toISOString().slice(0, 10);
  return (
    <div style={style} onMouseDown={(e) => e.stopPropagation()}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => { onChange(fmt(new Date())); onClose(); }}>Today</button>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => { const d = new Date(); d.setDate(d.getDate() + 1); onChange(fmt(d)); onClose(); }}>Tomorrow</button>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => { const d = new Date(); d.setDate(d.getDate() + 7); onChange(fmt(d)); onClose(); }}>+7d</button>
      </div>
      <div style={{ fontSize: 13 }}>
        <input type="date" className="form-control form-control-sm" value={value || ""} onChange={(e) => onChange(e.target.value)} />
      </div>
      <div className="mt-2 text-end">
        <button className="btn btn-sm btn-secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function Guruhlar() {

  const [groups, setGroups] = useState([]);
  const [query, setQuery] = useState("");
  
  // FILTER STATES
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTeacher, setFilterTeacher] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterDays, setFilterDays] = useState("all");
  const [filterStudents, setFilterStudents] = useState("all");
  
  const [selectedGroupId, setSelectedGroupId] = useState(null);

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

  useEffect(() => {
    setGroups(restoreGroups());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_GROUPS, JSON.stringify(groups));
    } catch (e) {
      // ignore
    }
  }, [groups]);

  const [newGroup, setNewGroup] = useState({
    name: "",
    course: "",
    teacher: "",
    days: "",
    time: "",
    start: "",
    room: "",
    end: "",
  });

  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState("");
  const saveTimeoutRef = useRef(null);

  const startAnchorRef = useRef(null);
  const endAnchorRef = useRef(null);
  const [datePopupFor, setDatePopupFor] = useState(null);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const updateGroupStudentCount = (groupId, newCount) => {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, students: newCount } : g)));
  };

  const updateGroup = (groupId, patch) => {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, ...patch } : g)));
    setSaveSuccess("Guruh ma'lumotlari saqlandi");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => setSaveSuccess(""), 2500);
  };

  const handleSave = () => {
    const e = {};
    if (!newGroup.name) e.name = "Iltimos, guruh nomini kiriting";
    if (!newGroup.course) e.course = "Iltimos, kursni tanlang";
    if (!newGroup.teacher) e.teacher = "Iltimos, o'qituvchini tanlang";
    if (!newGroup.days) e.days = "Iltimos, kunlarni tanlang";
    if (!newGroup.time) e.time = "Iltimos, boshlanish vaqtini kiriting";
    if (!newGroup.start) e.start = "Iltimos, boshlanish sanasini kiriting";
    if (!newGroup.end) e.end = "Iltimos, tugash sanasini kiriting";
    if (!newGroup.room) e.room = "Iltimos, xonani tanlang";

    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const id = Math.max(0, ...groups.map((g) => g.id || 0)) + 1;
    const item = {
      id,
      ...newGroup,
      end: newGroup.end || "—",
      duration: "0 oy / 0 hafta",
      students: 0,
      status: "faol",
    };

    setGroups((p) => [...p, item]);

    try {
      const offcanvas = document.getElementById("addGroupOffcanvas");
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
      if (bsOffcanvas) bsOffcanvas.hide();
    } catch (e) {}

    setNewGroup({
      name: "",
      course: "",
      teacher: "",
      days: "",
      time: "",
      start: "",
      end: "",
      room: "",
    });

    setSaveSuccess("Guruh yaratildi");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => setSaveSuccess(""), 2500);

    setSelectedGroupId(item.id);
  };

  const exportGroupsToCSV = (list) => {
    const rows = (list ?? groups).map((g) => ({
      id: g.id,
      name: g.name,
      course: g.course,
      teacher: g.teacher,
      days: g.days,
      time: g.time,
      start: g.start,
      end: g.end,
      duration: g.duration,
      room: g.room,
      students: g.students ?? 0,
      status: g.status,
    }));
    const headers = ["ID", "Guruh", "Kurs", "O'qituvchi", "Kunlar", "Vaqt", "Boshlanish", "Tugash", "Davomiylik", "Xona", "Talabalar", "Status"];
    const csv = [headers, ...rows.map((r) => Object.values(r))].map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `groups_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // GET UNIQUE VALUES FOR DROPDOWNS
  const uniqueTeachers = ["all", ...new Set(groups.map(g => g.teacher))];
  const uniqueCourses = ["all", ...new Set(groups.map(g => g.course))];
  const uniqueDays = ["all", ...new Set(groups.map(g => g.days))];

  // APPLY ALL FILTERS
  const filtered = groups.filter((g) => {
    const q = query.trim().toLowerCase();
    
    // Search filter
    if (q && !((g.name || "").toLowerCase().includes(q) ||
      (g.course || "").toLowerCase().includes(q) ||
      (g.teacher || "").toLowerCase().includes(q) ||
      (g.room || "").toLowerCase().includes(q))) {
      return false;
    }

    // Status filter
    if (filterStatus !== "all" && g.status.toLowerCase() !== filterStatus) {
      return false;
    }

    // Teacher filter
    if (filterTeacher !== "all" && g.teacher !== filterTeacher) {
      return false;
    }

    // Course filter
    if (filterCourse !== "all" && g.course !== filterCourse) {
      return false;
    }

    // Days filter
    if (filterDays !== "all" && g.days !== filterDays) {
      return false;
    }

    // Students filter
    if (filterStudents !== "all") {
      if (filterStudents === "0" && g.students !== 0) return false;
      if (filterStudents === "1-5" && (g.students < 1 || g.students > 5)) return false;
      if (filterStudents === "6-10" && (g.students < 6 || g.students > 10)) return false;
      if (filterStudents === "10+" && g.students < 10) return false;
    }

    return true;
  });

  if (selectedGroupId !== null) {
    const group = groups.find((g) => g.id === selectedGroupId) || null;
    return (
      <div style={{ minHeight: "100vh", background: "#fafafa", padding: "1rem" }}>
        <button className="btn btn-sm btn-outline-secondary mb-3" onClick={() => setSelectedGroupId(null)}>
          ← Orqaga
        </button>

        <GroupItem
          group={group}
          groups={groups}
          setGroups={setGroups}
          updateGroupStudentCount={updateGroupStudentCount}
          updateGroup={updateGroup}
          onClose={() => setSelectedGroupId(null)}
        />
      </div>
    );
  }

  return (
    <div className="layout">
      <main className="content cardd p-2 p-sm-3 p-md-4">
        {/* HEADER */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2">
          <h3 className="fw-bold mb-0">
            Guruhlar{" "}
            <small className="text-muted ms-2 d-inline-block">Miqdor — {filtered.length}</small>
          </h3>

          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-outline-secondary btn-sm" onClick={() => exportGroupsToCSV(filtered)}>
              <span className="d-none d-sm-inline">Excelga yuklab olish</span>
              <span className="d-inline d-sm-none">Excel</span>
            </button>
            <button
              className="btn btn-warning btn-sm"
              data-bs-toggle="offcanvas"
              data-bs-target="#addGroupOffcanvas"
            >
              <span className="d-none d-sm-inline">Yangisini qo'shish</span>
              <span className="d-inline d-sm-none">+</span>
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="filters bg-white p-2 p-md-3 rounded shadow-sm mb-3">
          <div className="row g-2">
            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label small mb-1">Status</label>
              <select className="form-select form-select-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Hammasi</option>
                <option value="faol">Faol</option>
                <option value="yopilgan">Yopilgan</option>
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <label className="form-label small mb-1">O'qituvchi</label>
              <select className="form-select form-select-sm" value={filterTeacher} onChange={(e) => setFilterTeacher(e.target.value)}>
                {uniqueTeachers.map((t) => (
                  <option key={t} value={t}>
                    {t === "all" ? "Hammasi" : t}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-2">
              <label className="form-label small mb-1">Kurs</label>
              <select className="form-select form-select-sm" value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
                {uniqueCourses.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "Hammasi" : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-2">
              <label className="form-label small mb-1">Kunlar</label>
              <select className="form-select form-select-sm" value={filterDays} onChange={(e) => setFilterDays(e.target.value)}>
                {uniqueDays.map((d) => (
                  <option key={d} value={d}>
                    {d === "all" ? "Hammasi" : d}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-sm-6 col-md-2">
              <label className="form-label small mb-1">Talabalar</label>
              <select className="form-select form-select-sm" value={filterStudents} onChange={(e) => setFilterStudents(e.target.value)}>
                <option value="all">Hammasi</option>
                <option value="0">0 ta</option>
                <option value="1-5">1-5 ta</option>
                <option value="6-10">6-10 ta</option>
                <option value="10+">10+ ta</option>
              </select>
            </div>
          </div>

          <div className="mt-2">
            <div className="input-group input-group-sm">
              <input
                className="form-control form-control-sm"
                placeholder="Qidirish: Guruh nomi, Kurs, O'qituvchi yoki Xona..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuery("")}
              >
                X
              </button>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded shadow-sm table-responsive">
          <table className="table table-hover mb-0 align-middle small">
            <thead className="table-light">
              <tr>
                <th style={{ minWidth: "120px" }}>Guruh</th>
                <th style={{ minWidth: "100px" }}>Kurs</th>
                <th style={{ minWidth: "120px" }}>O'qituvchi</th>
                <th style={{ minWidth: "100px" }}>Kunlar</th>
                <th style={{ minWidth: "110px" }}>Sana</th>
                <th style={{ minWidth: "80px" }}>Xona</th>
                <th style={{ minWidth: "60px" }}>Talabalar</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    Hech qanday guruh topilmadi
                  </td>
                </tr>
              ) : (
                filtered.map((g) => (
                  <tr key={g.id} style={{ cursor: "pointer" }} onClick={() => setSelectedGroupId(g.id)}>
                    <td className="fw-semibold">{g.name}</td>
                    <td>{g.course}</td>
                    <td>{g.teacher}</td>
                    <td>
                      <div className="text-muted small">{g.days}</div>
                      <div className="fw-500">{g.time}</div>
                    </td>
                    <td>
                      <div>{g.start}</div>
                      <div className="text-muted small">{g.end}</div>
                    </td>
                    <td>{g.room}</td>
                    <td className="text-center fw-semibold">{g.students ?? 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* OFFCANVAS */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="addGroupOffcanvas"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title fw-semibold">Yangi guruh qo'shish</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>

        <div className="offcanvas-body">
          {saveSuccess && <div className="alert alert-success small mb-3">{saveSuccess}</div>}

          <div className="mb-3">
            <label className="form-label">Nomi</label>
            <input
              type="text"
              className="form-control form-control-sm"
              value={newGroup.name}
              onChange={(e) => { setNewGroup({ ...newGroup, name: e.target.value }); if (errors.name) setErrors((p) => { const np = { ...p }; delete np.name; return np; }); }}
            />
            {errors.name && <div className="form-text text-danger small">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Kurs tanlash</label>
            <select
              className="form-select form-select-sm"
              value={newGroup.course}
              onChange={(e) => { setNewGroup({ ...newGroup, course: e.target.value }); if (errors.course) setErrors((p) => { const np = { ...p }; delete np.course; return np; }); }}
            >
              <option value="">Kursni tanlang</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Fullstack">Fullstack</option>
              <option value="UI/UX">UI/UX</option>
            </select>
            {errors.course && <div className="form-text text-danger small">{errors.course}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">O'qituvchi</label>
            <select
              className="form-select form-select-sm"
              value={newGroup.teacher}
              onChange={(e) => { setNewGroup({ ...newGroup, teacher: e.target.value }); if (errors.teacher) setErrors((p) => { const np = { ...p }; delete np.teacher; return np; }); }}
            >
              <option value="">O'qituvchini tanlang</option>
              <option value="Ikrombek Xoliqjonov">Ikrombek Xoliqjonov</option>
              <option value="Og'abek Yoqubjonov">Og'abek Yoqubjonov</option>
              <option value="Bekzod Boyqo'ziyev">Bekzod Boyqo'ziyev</option>
              <option value="Behruz">Behruz</option>
            </select>
            {errors.teacher && <div className="form-text text-danger small">{errors.teacher}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Kunlar</label>
            <select
              className="form-select form-select-sm"
              value={newGroup.days}
              onChange={(e) => { setNewGroup({ ...newGroup, days: e.target.value }); if (errors.days) setErrors((p) => { const np = { ...p }; delete np.days; return np; }); }}
            >
              <option value="">Kunlarni tanlang</option>
              <option value="Toq kunlar">Toq kunlar</option>
              <option value="Juft kunlar">Juft kunlar</option>
              <option value="Har kuni">Har kuni</option>
              <option value="Dam olish">Dam olish</option>
            </select>
            {errors.days && <div className="form-text text-danger small">{errors.days}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Boshlanish vaqti</label>
            <input
              type="time"
              className="form-control form-control-sm"
              value={newGroup.time}
              onChange={(e) => { setNewGroup({ ...newGroup, time: e.target.value }); if (errors.time) setErrors((p) => { const np = { ...p }; delete np.time; return np; }); }}
            />
            {errors.time && <div className="form-text text-danger small">{errors.time}</div>}
          </div>

          <div className="mb-3" style={{ position: "relative" }}>
            <label className="form-label">Boshlanish sanasi</label>
            <div style={{ position: "relative" }}>
              <input
                ref={startAnchorRef}
                type="date"
                className="form-control form-control-sm"
                value={newGroup.start}
                onChange={(e) => { setNewGroup({ ...newGroup, start: e.target.value }); if (errors.start) setErrors((p) => { const np = { ...p }; delete np.start; return np; }); }}
                onFocus={() => setDatePopupFor("start")}
                onClick={() => setDatePopupFor("start")}
              />
              {errors.start && <div className="form-text text-danger small">{errors.start}</div>}
            </div>
          </div>

          <div className="mb-3" style={{ position: "relative" }}>
            <label className="form-label">Tugash sanasi</label>
            <div style={{ position: "relative" }}>
              <input
                ref={endAnchorRef}
                type="date"
                className="form-control form-control-sm"
                value={newGroup.end || ""}
                onChange={(e) => { setNewGroup({ ...newGroup, end: e.target.value }); if (errors.end) setErrors((p) => { const np = { ...p }; delete np.end; return np; }); }}
                onFocus={() => setDatePopupFor("end")}
                onClick={() => setDatePopupFor("end")}
              />
              {errors.end && <div className="form-text text-danger small">{errors.end}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Xona</label>
            <select
              className="form-select form-select-sm"
              value={newGroup.room}
              onChange={(e) => { setNewGroup({ ...newGroup, room: e.target.value }); if (errors.room) setErrors((p) => { const np = { ...p }; delete np.room; return np; }); }}
            >
              <option value="">Xonani tanlang</option>
              <option value="Room #1">Room #1</option>
              <option value="Room #2">Room #2</option>
              <option value="Room #3">Room #3</option>
            </select>
            {errors.room && <div className="form-text text-danger small">{errors.room}</div>}
          </div>

          <button
            className="btn btn-warning w-100 btn-sm"
            onClick={handleSave}
          >
            Saqlash
          </button>

          {datePopupFor === "start" && (
            <DatePopup anchorRef={startAnchorRef} value={newGroup.start} onChange={(v) => setNewGroup((p) => ({ ...p, start: v }))} onClose={() => setDatePopupFor(null)} />
          )}
          {datePopupFor === "end" && (
            <DatePopup anchorRef={endAnchorRef} value={newGroup.end} onChange={(v) => setNewGroup((p) => ({ ...p, end: v }))} onClose={() => setDatePopupFor(null)} />
          )}
        </div>
      </div>
    </div>
  );
}