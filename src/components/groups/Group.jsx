import React, { useState, useEffect, useRef } from "react";
import "./Group.css";
import GroupItem from "./Group-item.jsx";


// NOTE: kept as two files only (Group.jsx + Group-item.jsx).
// Group.jsx holds the groups list and passes the selected group to Group-item.jsx.
// It also receives notifications from Group-item.jsx (updateGroupStudentCount, updateGroup).


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

// LocalStorage keys (keep in sync with Group-item.jsx)
const LS_GROUPS = "om_groups_restored";
const LS_STUDENTS = "om_students_restored";

/* ---------- Small Date helper popup (opens under date inputs) ---------- */
function DatePopup({ anchorRef, value, onChange, onClose }) {
  if (!anchorRef?.current) return null;
  const rect = anchorRef.current.getBoundingClientRect();
  const style = {
    position: "fixed",
    left: rect.left,
    top: rect.bottom + 6,
    zIndex: 4200,
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 6,
    padding: 10,
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  };

  const fmt = (d) => d.toISOString().slice(0, 10);
  return (
    <div style={style} onMouseDown={(e) => e.stopPropagation()}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
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
  const [teachers, setTeachers] = useState([]); 
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  // Try to restore groups from localStorage. If not present, use initialGroups.
  // Also, compute accurate students counts from saved students list (if any).
  const restoreGroups = () => {
    try {
      const savedGroups = JSON.parse(localStorage.getItem(LS_GROUPS) || "null");
      const savedStudents = JSON.parse(localStorage.getItem(LS_STUDENTS) || "null");
      const base = Array.isArray(savedGroups) ? savedGroups : initialGroups;
      if (Array.isArray(savedStudents)) {
        // recompute students counts from saved students
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

  // Central groups state (only here + Group-item.jsx)
 // GROUPS FETCH
useEffect(() => {
  fetch("https://devoloper20.pythonanywhere.com/api/groups/")
    .then(res => res.json())
    .then(data => {
      console.log("Groups API:", data.results);
      setGroups(data.results);
    })
    .catch(err => console.error("Groups fetch error:", err));
}, []);



  
  // persist groups whenever they change so created/edited groups survive page refresh
  useEffect(() => {
    try {
      localStorage.setItem(LS_GROUPS, JSON.stringify(groups));
    } catch (e) {
      // ignore
    }
  }, [groups]);

  // Yangi guruh uchun state
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

  // inline validation errors (show under inputs instead of alert)
  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState("");
  const saveTimeoutRef = useRef(null);

  // small date popup anchor ref for start/end in offcanvas
  const startAnchorRef = useRef(null);
  const endAnchorRef = useRef(null);
  const [datePopupFor, setDatePopupFor] = useState(null); // "start" | "end" | null

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const clearErrors = () => setErrors({});

  // Called by Group-item.jsx whenever that component's students list length changes
  const updateGroupStudentCount = (groupId, newCount) => {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, students: newCount } : g)));
  };

  // Called by Group-item.jsx when editing group metadata
  const updateGroup = (groupId, patch) => {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, ...patch } : g)));
    setSaveSuccess("Guruh ma'lumotlari saqlandi");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => setSaveSuccess(""), 2500);
  };

  const handleSave = () => {
    // validation inline
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
      students: 0, // ensure new group starts with 0 students
      status: "faol",
    };

    setGroups((p) => [...p, item]);

    // try hide bootstrap offcanvas if exists
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

    // show nice inline success (not alert)
    setSaveSuccess("Guruh yaratildi");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => setSaveSuccess(""), 2500);

    // open detail view for newly created group
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

  const filtered = groups.filter((g) => {
    const q = query.trim().toLowerCase();
    if (filterStatus !== "all" && g.status.toLowerCase() !== filterStatus) return false;
    if (!q) return true;
    return (
      (g.name || "").toLowerCase().includes(q) ||
      (g.course || "").toLowerCase().includes(q) ||
      (g.teacher || "").toLowerCase().includes(q) ||
      (g.room || "").toLowerCase().includes(q)
    );
  });

  // If a group is selected, render the Group-item (detail) component only.
  if (selectedGroupId !== null) {
    const group = groups.find((g) => g.id === selectedGroupId) || null;
    return (
      <div style={{ minHeight: "100vh", background: "#fafafa", padding: 16 }}>
        <button className="btn btn-sm btn-outline-secondary mb-3" onClick={() => setSelectedGroupId(null)}>
          ← Orqaga
        </button>

        <GroupItem
          // pass group + helpers so Group-item.jsx can update group metadata and notify about student counts
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

  // Default: list view
  return (
    <div className="layout">
      {/* ======= MAIN CONTENT ======= */}
      <main className="content cardd p-3 p-md-4">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="fw-bold">
            Guruhlar{" "}
            <small className="text-muted ms-2">Miqdor — {groups.length}</small>
          </h3>

          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={() => exportGroupsToCSV(filtered)}>Excelga yuklab olish</button>
            <button
              className="btn btn-warning"
              data-bs-toggle="offcanvas"
              data-bs-target="#addGroupOffcanvas"
            >
              Yangisini qo'shish
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="filters bg-white p-3 rounded shadow-sm mb-3">
          <div className="row g-2">
            <div className="col-12 col-md-3">
              <select className="form-select form-select-sm">
                <option>Faol guruhlar</option>
                <option>Yopilgan guruhlar</option>
              </select>
            </div>

            <div className="col-6 col-md-2">
              <select className="form-select form-select-sm">
                <option value="all">O'qituvchilar</option>
                <option value="Ikrombek Xoliqjonov">Ikrombek Xoliqjonov</option>
                <option value="Og'abek Yoqubjonov">Og'abek Yoqubjonov</option>
                <option value="Bekzod Boyqo'ziyev">Bekzod Boyqo'ziyev</option>
                <option value="Behruz">Behruz</option>
              </select>
            </div>

            <div className="col-6 col-md-2">
              <select className="form-select form-select-sm">
                <option value="all">Kurslar</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="UI/UX">UI/UX</option>
              </select>
            </div>

            <div className="col-6 col-md-2">
              <select className="form-select form-select-sm">
                <option value="all">Kunlar</option>
                <option value="Toq kunlar">Toq kunlar</option>
                <option value="Juft kunlar">Juft kunlar</option>
                <option value="Har kuni">Har kuni</option>
                <option value="Dam olish">Dam olish</option>
              </select>
            </div>

            <div className="col-6 col-md-3">
              <div className="input-group input-group-sm">
                <input
                  className="form-control"
                  placeholder="Qidirish..."
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

          <div className="d-flex align-items-center mt-2 gap-3 small">
            <label>
              <input
                type="radio"
                checked={filterStatus === "all"}
                onChange={() => setFilterStatus("all")}
              />{" "}
              Hammasi
            </label>
            <label>
              <input
                type="radio"
                checked={filterStatus === "faol"}
                onChange={() => setFilterStatus("faol")}
              />{" "}
              Faol
            </label>
            <label>
              <input
                type="radio"
                checked={filterStatus === "yopilgan"}
                onChange={() => setFilterStatus("yopilgan")}
              />{" "}
              Yopilgan
            </label>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded shadow-sm">
          <table className="table table-hover mb-0 align-middle small">
            <thead className="table-light">
              <tr>
                <th>Guruh</th>
                <th>Kurs</th>
                <th>O'qituvchi</th>
                <th>Kunlar</th>
                <th>Sana</th>
                <th>Xona</th>
                <th>Talabalar</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((g) => (
                <tr key={g.id} style={{ cursor: "pointer" }} onClick={() => setSelectedGroupId(g.id)}>
                  <td className="fw-semibold">{g.name}</td>
                  <td>{g.course}</td>
                  <td>{g.teacher}</td>
                  <td>
                    <div className="text-muted">{g.days}</div>
                    <div>{g.time}</div>
                  </td>
                  <td>
                    <div>{g.start}</div>
                    <div>{g.end}</div>
                  </td>
                  <td>{g.room}</td>
                  <td className="text-center">{g.students ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* OFFCANVAS */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="addGroupOffcanvas"
        style={{ width: "420px" }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title fw-semibold">Yangi guruh qo‘shish</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>

        <div className="offcanvas-body">
          {/* Success message (not alert) */}
          {saveSuccess && <div className="alert alert-success small">{saveSuccess}</div>}

          <div className="mb-3">
            <label className="form-label">Nomi</label>
            <input
              type="text"
              className="form-control"
              value={newGroup.name}
              onChange={(e) => { setNewGroup({ ...newGroup, name: e.target.value }); if (errors.name) setErrors((p) => { const np = { ...p }; delete np.name; return np; }); }}
            />
            {errors.name && <div className="form-text text-danger">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Kurs tanlash</label>
            <select
              className="form-select"
              value={newGroup.course}
              onChange={(e) => { setNewGroup({ ...newGroup, course: e.target.value }); if (errors.course) setErrors((p) => { const np = { ...p }; delete np.course; return np; }); }}
            >
              <option className="option" value="">Kursni tanlang</option>
              <option className="option" value="Frontend">Frontend</option>
              <option className="option" value="Backend">Backend</option>
              <option className="option" value="Fullstack">Fullstack</option>
              <option className="option" value="UI/UX">UI/UX</option>
            </select>
            {errors.course && <div className="form-text text-danger">{errors.course}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">O'qituvchi</label>
            <select
              className="form-select"
              value={newGroup.teacher}
              onChange={(e) => { setNewGroup({ ...newGroup, teacher: e.target.value }); if (errors.teacher) setErrors((p) => { const np = { ...p }; delete np.teacher; return np; }); }}
            >
              <option className="option" value="">O'qituvchini tanlang</option>
              <option className="option" value="Ikrombek Xoliqjonov">Ikrombek Xoliqjonov</option>
              <option className="option" value="Og'abek Yoqubjonov">Og'abek Yoqubjonov</option>
              <option className="option" value="Bekzod Boyqo'ziyev">Bekzod Boyqo'ziyev</option>
              <option className="option" value="Behruz">Behruz</option>
            </select>
            {errors.teacher && <div className="form-text text-danger">{errors.teacher}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Kunlar</label>
            <select
              className="form-select"
              value={newGroup.days}
              onChange={(e) => { setNewGroup({ ...newGroup, days: e.target.value }); if (errors.days) setErrors((p) => { const np = { ...p }; delete np.days; return np; }); }}
            >
              <option className="option" value="">Kunlarni tanlang</option>
              <option className="option" value="Toq kunlar">Toq kunlar</option>
              <option className="option" value="Juft kunlar">Juft kunlar</option>
              <option className="option" value="Har kuni">Har kuni</option>
              <option className="option" value="Dam olish">Dam olish</option>
            </select>
            {errors.days && <div className="form-text text-danger">{errors.days}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Boshlanish vaqti</label>
            <input
              type="time"
              className="form-control"
              value={newGroup.time}
              onChange={(e) => { setNewGroup({ ...newGroup, time: e.target.value }); if (errors.time) setErrors((p) => { const np = { ...p }; delete np.time; return np; }); }}
            />
            {errors.time && <div className="form-text text-danger">{errors.time}</div>}
          </div>

          <div className="mb-3" style={{ position: "relative" }}>
            <label className="form-label">Boshlanish sanasi</label>
            <div style={{ position: "relative" }}>
              <input
                ref={startAnchorRef}
                type="date"
                className="form-control"
                value={newGroup.start}
                onChange={(e) => { setNewGroup({ ...newGroup, start: e.target.value }); if (errors.start) setErrors((p) => { const np = { ...p }; delete np.start; return np; }); }}
                onFocus={() => setDatePopupFor("start")}
                onClick={() => setDatePopupFor("start")}
              />
              {errors.start && <div className="form-text text-danger">{errors.start}</div>}
            </div>
          </div>

          <div className="mb-3" style={{ position: "relative" }}>
            <label className="form-label">Tugash sanasi</label>
            <div style={{ position: "relative" }}>
              <input
                ref={endAnchorRef}
                type="date"
                className="form-control"
                value={newGroup.end || ""}
                onChange={(e) => { setNewGroup({ ...newGroup, end: e.target.value }); if (errors.end) setErrors((p) => { const np = { ...p }; delete np.end; return np; }); }}
                onFocus={() => setDatePopupFor("end")}
                onClick={() => setDatePopupFor("end")}
              />
              {errors.end && <div className="form-text text-danger">{errors.end}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Xona</label>
            <select
              className="form-select"
              value={newGroup.room}
              onChange={(e) => { setNewGroup({ ...newGroup, room: e.target.value }); if (errors.room) setErrors((p) => { const np = { ...p }; delete np.room; return np; }); }}
            >
              <option className="option" value="">Xonani tanlang</option>
              <option className="option" value="Room #1">Room #1</option>
              <option className="option" value="Room #2">Room #2</option>
              <option className="option" value="Room #3">Room #3</option>
            </select>
            {errors.room && <div className="form-text text-danger">{errors.room}</div>}
          </div>

          <button
            className="btn btn-warning w-100  "
            onClick={() => {
              handleSave();
            }}
          >
            Saqlash
          </button>

          {/* date popup instances */}
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