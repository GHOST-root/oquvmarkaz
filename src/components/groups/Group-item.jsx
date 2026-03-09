import React, { useEffect, useMemo, useState, useRef } from "react";
import './Group-item.css';

/* ================= MODALLAR VA YORDAMCHI KOMPONENTLAR ================= */
function ReminderModal({ open, onClose, onSave, initial = {} }) {
  const [form, setForm] = React.useState({ title: initial.title || "", note: initial.note || "", date: initial.date || new Date().toISOString().slice(0,10), sid: initial.sid || null });
  React.useEffect(() => { if (open) setForm({ title: initial.title || "", note: initial.note || "", date: initial.date || new Date().toISOString().slice(0,10), sid: initial.sid || null }); }, [open, initial]);
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:4500 }}>
      <div style={{ width:520, margin:"12vh auto", background:"#fff", borderRadius:8, padding:20 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-bold">Yangi eslatma</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>✕</button>
        </div>
        <div>
          <div className="mb-2"><label className="form-label small">Sana</label><input type="date" className="form-control form-control-sm" value={form.date} onChange={(e)=>setForm(f=>({...f,date:e.target.value}))} /></div>
          <div className="mb-2"><label className="form-label small">Nomi</label><input className="form-control form-control-sm" value={form.title} onChange={(e)=>setForm(f=>({...f,title:e.target.value}))} /></div>
          <div className="mb-2"><label className="form-label small">Izoh</label><textarea className="form-control" rows={3} value={form.note} onChange={(e)=>setForm(f=>({...f,note:e.target.value}))} /></div>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-sm btn-secondary" onClick={onClose}>Bekor</button>
          <button className="btn btn-sm btn-primary" style={{backgroundColor: '#ff7a00', border: 'none'}} onClick={() => { onSave && onSave(form); onClose && onClose(); }}>Saqlash</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ open, title, children, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:4600 }}>
      <div style={{ width:400, margin:"18vh auto", background:"#fff", borderRadius:8, padding:20, textAlign: 'center' }}>
        <h5 className="mb-3 fw-bold">{title}</h5>
        <div className="mb-4 text-muted">{children}</div>
        <div className="d-flex justify-content-center gap-2">
          <button className="btn btn-sm btn-light border px-4" onClick={onCancel}>Bekor qilish</button>
          <button className="btn btn-sm btn-danger px-4" onClick={onConfirm}>Tasdiqlash</button>
        </div>
      </div>
    </div>
  );
}

function MoveGroupModal({ open, onClose, groups = [], onMove }) {
  const [sel, setSel] = React.useState("");
  React.useEffect(()=>{ if(open) setSel(""); }, [open]);
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:4600 }}>
      <div style={{ width:420, margin:"16vh auto", background:"#fff", borderRadius:8, padding:20 }}>
        <h5 className="fw-bold mb-3">Talabani guruhga o'tkazish</h5>
        <div className="mb-3">
          <select className="form-select" value={sel} onChange={(e)=>setSel(e.target.value)}>
            <option value="">Tanlang (bo'sh = olib tashlash)</option>
            {groups.map(g=> <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-sm btn-secondary" onClick={onClose}>Bekor</button>
          <button className="btn btn-sm btn-primary" style={{backgroundColor: '#ff7a00', border: 'none'}} onClick={() => { onMove && onMove(sel); onClose && onClose(); }}>Ko'chirish</button>
        </div>
      </div>
    </div>
  );
}

function EditGroupDrawer({ open, onClose, group, onSave }) {
  const [form, setForm] = React.useState({ name: group?.name || "", course: group?.course || "", teacher: group?.teacher || "", days: group?.days || "", room: group?.room || "", startDate: group?.start || "", endDate: group?.end || "", startTime: group?.time || "" });
  React.useEffect(()=>{ if(open) setForm({ name: group?.name || "", course: group?.course || "", teacher: group?.teacher || "", days: group?.days || "", room: group?.room || "", startDate: group?.start || "", endDate: group?.end || "", startTime: group?.time || "" }); }, [open, group]);
  if (!open) return null;
  return (
    <div style={{ position:"fixed", right:0, top:0, height:"100vh", width:420, background:"#fff", zIndex:4700, padding:24, boxShadow: "-4px 0 24px rgba(0,0,0,0.1)" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-bold">Guruhni tahrirlash</h5>
        <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>✕</button>
      </div>
      <div className="mb-3"><label className="form-label small">Nomi</label><input className="form-control form-control-sm" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} /></div>
      <div className="mb-3"><label className="form-label small">Kurs</label><input className="form-control form-control-sm" value={form.course} onChange={e=>setForm(f=>({...f,course:e.target.value}))} /></div>
      <div className="mb-3"><label className="form-label small">O'qituvchi</label><input className="form-control form-control-sm" value={form.teacher} onChange={e=>setForm(f=>({...f,teacher:e.target.value}))} /></div>
      <div className="mb-3"><label className="form-label small">Xona</label><input className="form-control form-control-sm" value={form.room} onChange={e=>setForm(f=>({...f,room:e.target.value}))} /></div>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button className="btn btn-sm btn-secondary" onClick={onClose}>Bekor</button>
        <button className="btn btn-sm text-white" style={{backgroundColor: '#ff7a00'}} onClick={() => { onSave && onSave(form); onClose && onClose(); }}>Saqlash</button>
      </div>
    </div>
  );
}

function AddStudentModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({ name: "", startDate: new Date().toISOString().slice(0, 10) });
  useEffect(() => { if (!open) setForm({ name: "", startDate: new Date().toISOString().slice(0, 10) }); }, [open]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 4200 }}>
      <div style={{ width: 450, margin: "10vh auto", background: "#fff", borderRadius: 8, padding: 20 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-bold">Yangi talaba</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>✕</button>
        </div>
        <div className="mb-3">
          <label className="form-label small">Ism yoki telefon</label>
          <input className="form-control" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Ism Familya" />
        </div>
        <div className="mb-3">
          <label className="form-label small">Sanadan boshlash</label>
          <input type="date" className="form-control" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} />
        </div>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-sm btn-secondary" onClick={onClose}>Bekor</button>
          <button className="btn btn-sm text-white" style={{backgroundColor: '#ff7a00'}} onClick={() => {
            if (!form.name.trim()) return alert("Ism kiriting");
            onSave(form.name.trim(), form.startDate);
            onClose();
          }}>Qo'shish</button>
        </div>
      </div>
    </div>
  );
}

function GroupSmsDrawer({ open, onClose, onSend, studentCount = 0 }) {
  const [msg, setMsg] = useState("");
  useEffect(() => { if (!open) setMsg(""); }, [open]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", right: 0, top: 0, height: "100vh", width: 380, background: "#fff", zIndex: 4300, boxShadow: "-6px 0 24px rgba(0,0,0,0.12)", padding: 24 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-bold">SMS Yuborish</h5>
        <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>✕</button>
      </div>
      <div className="mb-3">
        <label className="form-label small">Yuboruvchi</label>
        <div className="form-control form-control-sm bg-light">MODME</div>
      </div>
      <div className="mb-3">
        <label className="form-label small">Xabar matni</label>
        <textarea className="form-control" rows={6} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Assalomu alaykum..." />
        <div className="small text-muted mt-2">{msg.length} ta belgi • {Math.max(1, Math.ceil(msg.length / 70))} SMS • {studentCount} ta talabaga</div>
      </div>
      <div className="d-flex justify-content-end mt-4">
        <button className="btn btn-sm btn-warning w-100" onClick={() => { if (!msg.trim()) return alert("Xabar kiriting"); onSend(msg); onClose(); }}>Yuborish</button>
      </div>
    </div>
  );
}

function MoveDateModal({ open, fromDateKey, onClose, onConfirm }) {
  const [selected, setSelected] = useState("");
  useEffect(() => { if (open) setSelected(new Date().toISOString().slice(0, 10)); }, [open]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 4400 }}>
      <div style={{ width: 350, margin: "15vh auto", background: "#fff", borderRadius: 8, padding: 20 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-bold">Darsni ko'chirish</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>✕</button>
        </div>
        <div className="mb-3">
          <label className="form-label small">Yangi sanani tanlang</label>
          <input type="date" className="form-control" value={selected} onChange={(e) => setSelected(e.target.value)} />
        </div>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-sm btn-secondary" onClick={onClose}>Bekor</button>
          <button className="btn btn-sm btn-primary" onClick={() => { onConfirm && onConfirm(fromDateKey, selected); onClose && onClose(); }}>Saqlash</button>
        </div>
      </div>
    </div>
  );
}

const LS = { STUDENTS: "om_students_restored", ATTENDANCE: "om_attendance_restored", CALENDAR: "om_calendar_restored", SETTINGS: "om_settings_restored" };
const STATUS = { NONE: "none", PRESENT: "present", ABSENT: "absent", EXCUSED: "excused" };
const STATUS_ORDER = [STATUS.NONE, STATUS.PRESENT, STATUS.ABSENT, STATUS.EXCUSED];
const formatKey = (d) => (typeof d === "string" ? d : d.toISOString().slice(0, 10));
const fmtShort = (d) => new Date(d).toLocaleDateString('uz-UZ', { day: "numeric", month: "short" });

function getDatesFrom(startIso, count = 10) {
  const base = new Date(startIso); const arr = [];
  for (let i = 0; i < count; i++) { const d = new Date(base); d.setDate(base.getDate() + i); arr.push(d); }
  return arr;
}

/* ================= ASOSIY APP KOMPONENTI ================= */
export default function App(props) {
  const lsStudents = JSON.parse(localStorage.getItem(LS.STUDENTS) || "null");
  const lsAttendance = JSON.parse(localStorage.getItem(LS.ATTENDANCE) || "null");
  const lsCalendar = JSON.parse(localStorage.getItem(LS.CALENDAR) || "null");
  const lsSettings = JSON.parse(localStorage.getItem(LS.SETTINGS) || "null");

  const [students, setStudents] = useState(lsStudents ?? [
    { id: 1, name: "Faxriddin", phone: "(91) 123-44-56", archived: false, muted: false, balance: 0, createdAt: Date.now(), startDate: formatKey(new Date()), groupId: 1 },
    { id: 2, name: "Jumaqozi", phone: "(91) 123-43-31", archived: false, muted: false, balance: 0, createdAt: Date.now(), startDate: formatKey(new Date()), groupId: 1 },
  ]);

  const [settings, setSettings] = useState(lsSettings ?? { columns: 10, sortOption: "az" });
  const [calendar, setCalendar] = useState(lsCalendar ?? { startIso: formatKey(new Date()) });
  const dates = useMemo(() => getDatesFrom(calendar.startIso, settings.columns), [calendar, settings.columns]);

  const [attendance, setAttendance] = useState(() => {
    if (lsAttendance) return lsAttendance;
    const init = {};
    students.forEach(s => { init[s.id] = {}; });
    return init;
  });

  const groups = props.groups ?? [];
  const currentGroup = props.group ?? (props.groups && props.groups[0]) ?? null;
  const groupStudents = currentGroup ? students.filter((s) => s.groupId === currentGroup.id) : students.filter(s => !s.groupId);

  // Tab va Menyu holatlari
  const [activeTab, setActiveTab] = useState("davomat");
  const [hoveredCell, setHoveredCell] = useState(null);
  const [menuState, setMenuState] = useState({ sid: null, rect: null });
  const menuRef = useRef(null);
  
  const [dateMenu, setDateMenu] = useState({ open: false, rect: null, dateKey: null, isPast: false });
  const dateMenuRef = useRef(null);

  // Modal Holatlari (States)
  const [editGroupOpen, setEditGroupOpen] = useState(false);
  const [confirmState, setConfirmState] = useState({ open: false, title: "", message: null, onConfirm: null });
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [groupSmsOpen, setGroupSmsOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderInitial, setReminderInitial] = useState({});
  const [moveOpen, setMoveOpen] = useState(false);
  const [moveStudentId, setMoveStudentId] = useState(null);
  const [moveDateModal, setMoveDateModal] = useState({ open: false, from: null });
  const [paymentDrawer, setPaymentDrawer] = useState({ open: false, sid: null });
  const [paymentForm, setPaymentForm] = useState({ method: "cash", amount: "", date: formatKey(new Date()), note: "" });

  // ---------------- KICHIK ESLATMA (QAYD) STATE ----------------
  const [quickNote, setQuickNote] = useState("");

  useEffect(() => {
    if (currentGroup) {
      const savedNote = localStorage.getItem(`om_quicknote_${currentGroup.id}`);
      if (savedNote) setQuickNote(savedNote);
      else setQuickNote("");
    }
  }, [currentGroup]);

  const handleSaveQuickNote = () => {
    if (currentGroup) {
      localStorage.setItem(`om_quicknote_${currentGroup.id}`, quickNote);
      alert("Eslatma muvaffaqiyatli saqlandi!");
    }
  };

  useEffect(() => { localStorage.setItem(LS.STUDENTS, JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem(LS.ATTENDANCE, JSON.stringify(attendance)); }, [attendance]);

  useEffect(() => {
    const closeMenu = (ev) => {
      if (menuRef.current && menuRef.current.contains(ev.target)) return;
      setMenuState({ sid: null, rect: null });
      if (dateMenuRef.current && dateMenuRef.current.contains(ev.target)) return;
      setDateMenu({ open: false, rect: null, dateKey: null, isPast: false });
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  /* --- Davomat funksiyalari --- */
  const toggleCellCycle = (sid, dateKey) => {
    setAttendance((prev) => {
      const cur = prev[sid]?.[dateKey] ?? STATUS.NONE;
      const nxt = STATUS_ORDER[(STATUS_ORDER.indexOf(cur) + 1) % STATUS_ORDER.length];
      return { ...prev, [sid]: { ...(prev[sid] || {}), [dateKey]: nxt } };
    });
  };

  const setCellStatus = (sid, dateKey, status) => {
    setAttendance((prev) => ({ ...prev, [sid]: { ...(prev[sid] || {}), [dateKey]: status } }));
    setHoveredCell(null);
  };

  const jumpToday = () => setCalendar({ startIso: formatKey(new Date()) });
  const prevDates = () => setCalendar((c) => { const d = new Date(c.startIso); d.setDate(d.getDate() - 10); return { startIso: formatKey(d) }; });
  const nextDates = () => setCalendar((c) => { const d = new Date(c.startIso); d.setDate(d.getDate() + 10); return { startIso: formatKey(d) }; });

  /* --- Menyular --- */
  const openStudentMenu = (ev, sid) => {
    ev.stopPropagation();
    setMenuState({ sid, rect: ev.currentTarget.getBoundingClientRect() });
  };
  const computeMenuStyle = (rect) => {
    if (!rect) return { display: "none" };
    return { position: "fixed", left: rect.left - 200, top: rect.bottom, width: 240, zIndex: 1600 };
  };

  const openDateMenu = (ev, dateKey) => {
    ev.stopPropagation();
    const rect = ev.currentTarget.getBoundingClientRect();
    const isPast = new Date(dateKey) < new Date(formatKey(new Date()));
    setDateMenu({ open: true, rect, dateKey, isPast });
  };
  const computeDateMenuStyle = (rect) => {
    if (!rect) return { display: "none" };
    return { position: "fixed", left: rect.left - 100, top: rect.bottom + 5, width: 220, zIndex: 1600 };
  };

  /* --- Modal Harakatlari --- */
  const handleMenuAction = (sid, action) => {
    setMenuState({ sid: null, rect: null });
    if (action === "freeze") setStudents(prev => prev.map(s => s.id === sid ? { ...s, muted: !s.muted } : s));
    if (action === "payment") { setPaymentDrawer({ open: true, sid }); setPaymentForm({ method: "cash", amount: "", date: formatKey(new Date()), note: "" }); }
    if (action === "reminder") { setReminderInitial({ sid, date: formatKey(new Date()) }); setReminderOpen(true); }
    if (action === "move") { setMoveStudentId(sid); setMoveOpen(true); }
    if (action === "delete") {
      setConfirmState({
        open: true, title: "O'chirish", message: "Talabani butunlay o'chirasizmi?", 
        onConfirm: () => { setStudents(prev => prev.filter(x => x.id !== sid)); setConfirmState({ open: false }); }
      });
    }
  };

  const savePayment = () => {
    const sid = paymentDrawer.sid;
    const amt = Number(paymentForm.amount || 0);
    if (!amt) return alert("Miqdor kiriting");
    setStudents(prev => prev.map(s => s.id === sid ? { ...s, balance: (s.balance || 0) + amt } : s));
    setPaymentDrawer({ open: false, sid: null });
    alert("To'lov saqlandi!");
  };

  // --- CSV Eksport ---
  const exportCSV = () => {
    const headers = ["Ism", "Telefon", ...dates.map((d) => d.toLocaleDateString())];
    const rows = groupStudents.map((s) => [s.name, s.phone, ...dates.map((d) => attendance[s.id]?.[formatKey(d)] ?? "")]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `davomat_${currentGroup ? currentGroup.id : "all"}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  // --- Filtrlangan Qidiruv ro'yxati ---
  const [query, setQuery] = useState("");
  const filteredStudents = groupStudents.filter(s => 
    query.trim() ? `${s.name} ${s.phone}`.toLowerCase().includes(query.toLowerCase()) : true
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fcfcfc" }}>
      <main className="p-3 p-md-4" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* ================= TEPADAGI KATTA SARLAVHA ================= */}
        <div className="mb-4 d-flex align-items-center flex-wrap gap-2 border-bottom pb-3">
          <h2 className="m-0 fw-normal text-dark">{currentGroup?.name || "Guruh nomi"}</h2>
          <span className="fs-5 text-muted fw-light mt-1"> • {currentGroup?.course || "Kurs"} • {currentGroup?.teacher || "O'qituvchi"}</span>
        </div>

        <div className="row g-4">
          
          {/* ================= CHAP TOMON (GURUH MA'LUMOTI) ================= */}
          {/* DIQQAT: col-xl-4 qilib kengaytirildi (33% joy oladi) */}
          <div className="col-12 col-lg-5 col-xl-4">
            <div className="card-left h-100 d-flex flex-column">
              
              {/* Info va Ikonkalar */}
              <div className="d-flex justify-content-between align-items-start">
                <div className="group-info-list">
                  <div><span className="fw-semibold">Kurs:</span> {currentGroup?.course ?? "—"}</div>
                  <div><span className="fw-semibold">O'qituvchi:</span> {currentGroup?.teacher ?? "—"}</div>
                  <div><span className="fw-semibold">Narx:</span> 100 000 UZS</div>
                  <div><span className="fw-semibold">Vaqt:</span> {currentGroup?.days ?? "—"} • {currentGroup?.time ?? "—"}</div>
                  <br/>
                  <div><span className="fw-semibold">Xonalar:</span> {currentGroup?.room ?? "—"}</div>
                  <div><span className="fw-semibold">Xona sig'imi:</span> 1000</div>
                  <div><span className="fw-semibold">Mashg'ulotlar sanalari:</span><br/>{currentGroup?.start ?? "01.04.2025"} — {currentGroup?.end ?? "01.04.2026"}</div>
                  <div className="text-muted mt-1">(id: {currentGroup?.id || "132852"})</div>
                  <div className="mt-2"><span className="badge bg-light text-dark border fw-normal px-2 py-1">Yunusobod filiali</span></div>
                </div>
                
                {/* Dumaloq tugmalar */}
                <div className="d-flex flex-column gap-2 ms-2">
                  <button className="circle-btn-action text-warning border-warning" title="Tahrirlash" onClick={() => setEditGroupOpen(true)}><i className="fa-solid fa-pen"></i></button>
                  <button className="circle-btn-action text-danger border-danger" title="O'chirish" onClick={() => setConfirmState({ open: true, title: "Guruhni o'chirish", message: "Guruh o'chiriladi. Davom etilsinmi?", onConfirm: () => { setConfirmState({open:false}); if(props.onClose) props.onClose(); } })}><i className="fa-solid fa-trash"></i></button>
                  <button className="circle-btn-action text-warning border-warning" title="SMS" onClick={() => setGroupSmsOpen(true)}><i className="fa-regular fa-envelope"></i></button>
                  <button className="circle-btn-action text-warning border-warning" title="Qo'shish" onClick={() => setAddStudentOpen(true)}><i className="fa-solid fa-plus"></i></button>
                </div>
              </div>

              {/* Qidiruv, Arxiv va Yuklash (Toshmaydigan qilib tuzatildi) */}
              <div className="mt-4">
                <select className="form-select form-select-sm mb-2 bg-light border border-light">
                  <option>A-Z bo'yicha</option>
                  <option>Z-A bo'yicha</option>
                </select>
                
                <input 
                  type="text" 
                  className="form-control form-control-sm mb-2" 
                  placeholder="Ism orqali qidiruv..." 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                />

                <div className="d-flex gap-2 align-items-center justify-content-between mb-3">
                  <button className="btn btn-sm text-white w-100" style={{backgroundColor: '#e74c3c', borderRadius: '20px', fontSize: '11px', padding: '6px 10px'}}>
                    Arxivlangan talabalarni ko'rsatish
                  </button>
                  <button className="btn btn-sm btn-outline-success rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{width: '34px', height: '34px'}} onClick={exportCSV} title="Jadvalni yuklash">
                    <i className="fa-solid fa-download"></i>
                  </button>
                </div>
              </div>

              {/* Talabalar ro'yxati */}
              <div className="flex-grow-1 overflow-auto pe-2" style={{maxHeight: '280px'}}>
                {filteredStudents.length > 0 ? filteredStudents.map(s => (
                   <div key={s.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div className="d-flex align-items-center gap-2">
                         <div className="avatar"><i className="fa-solid fa-user"></i></div>
                         <div style={{fontSize: '13px', fontWeight: '500'}}>
                           {s.name} {s.muted && <span className="text-danger small">(Muzlatilgan)</span>}
                         </div>
                      </div>
                      <button className="btn btn-sm text-muted" onClick={(e) => openStudentMenu(e, s.id)}>⋮</button>
                   </div>
                )) : (
                  <div className="text-center text-muted small py-4">Hech kim topilmadi</div>
                )}
              </div>

              {/* Kichik Eslatma maydoni (Saqlanadigan qilib tuzatildi) */}
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex align-items-center border rounded px-2 bg-light">
                  <input 
                    type="text" 
                    className="form-control border-0 bg-light shadow-none form-control-sm" 
                    placeholder="Guruh uchun eslatma yozing..." 
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                  />
                  <button className="btn btn-sm text-warning" title="Saqlash" onClick={handleSaveQuickNote}>
                    <i className="fa-regular fa-flag"></i>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ================= O'NG TOMON (TABLAR VA DAVOMAT) ================= */}
          <div className="col-12 col-lg-7 col-xl-8">
            <div className="card-right h-100">
              
              {/* Apelsin Tablar */}
              <div className="modme-tabs">
                <button className={`modme-tab ${activeTab === 'davomat' ? 'active' : ''}`} onClick={() => setActiveTab('davomat')}>Davomat</button>
                <button className={`modme-tab ${activeTab === 'onlayn' ? 'active' : ''}`} onClick={() => setActiveTab('onlayn')}>Onlayn Darslar va materiallar</button>
                <button className={`modme-tab ${activeTab === 'chegirma' ? 'active' : ''}`} onClick={() => setActiveTab('chegirma')}>Chegirmali Narx</button>
                <button className={`modme-tab ${activeTab === 'imtihon' ? 'active' : ''}`} onClick={() => setActiveTab('imtihon')}>Imtihonlar</button>
                <button className={`modme-tab ${activeTab === 'tarix' ? 'active' : ''}`} onClick={() => setActiveTab('tarix')}>Tarix</button>
                <button className={`modme-tab ${activeTab === 'izoh' ? 'active' : ''}`} onClick={() => setActiveTab('izoh')}>Izohlar</button>
              </div>

              {activeTab === 'davomat' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h4 className="m-0 fw-normal">Davomat</h4>
                    <div className="d-flex gap-1 align-items-center nav-btn-group">
                      <button className="btn btn-sm px-3 rounded" onClick={jumpToday}>Joriy</button>
                      <button className="btn btn-sm px-3 rounded" onClick={prevDates}>&laquo;</button>
                      <button className="btn btn-sm px-3 rounded" onClick={prevDates}>&lsaquo;</button>
                      <span className="text-primary fw-medium px-3" style={{fontSize: '14px'}}>{new Date(calendar.startIso).toLocaleDateString('uz-UZ', { month: 'short', year: 'numeric' })}</span>
                      <button className="btn btn-sm px-3 rounded" onClick={nextDates}>&rsaquo;</button>
                      <button className="btn btn-sm px-3 rounded" onClick={nextDates}>&raquo;</button>
                      <button className="btn btn-sm px-3 rounded ms-1"><i className="fa-regular fa-eye"></i></button>
                    </div>
                  </div>

                  <div className="table-responsive border rounded">
                    <table className="table attendance-table align-middle mb-0">
                      <thead className="bg-white">
                        <tr>
                          <th style={{ minWidth: 200 }} className="ps-3 border-end">Ism</th>
                          {dates.map(d => {
                            const k = formatKey(d);
                            return (
                              <th key={k} className="text-center cursor-pointer" style={{ minWidth: '70px', fontWeight: '500', color: '#333' }} onClick={(e) => openDateMenu(e, k)}>
                                {fmtShort(d)}
                              </th>
                            )
                          })}
                          <th className="text-center border-start">Coin</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupStudents.map(s => (
                          <tr key={s.id}>
                            <td className="ps-3 border-end fw-medium" style={{fontSize: '13.5px'}}>{s.name}</td>
                            {dates.map(d => {
                              const k = formatKey(d);
                              const st = attendance[s.id]?.[k];
                              const popVisible = hoveredCell && hoveredCell.sid === s.id && hoveredCell.dateKey === k;
                              return (
                                <td key={k} className="text-center position-relative">
                                  <div className="cell-wrapper" onMouseEnter={() => setHoveredCell({ sid: s.id, dateKey: k })} onMouseLeave={() => setHoveredCell(null)}>
                                    <div className={`attendance-cell ${st === STATUS.NONE ? "none" : st === STATUS.PRESENT ? "present" : st === STATUS.ABSENT ? "absent" : "excused"}`} onClick={() => toggleCellCycle(s.id, k)}>
                                       {st === STATUS.PRESENT && <i className="fa-solid fa-check"></i>}
                                       {st === STATUS.ABSENT && <i className="fa-solid fa-xmark"></i>}
                                    </div>
                                    {popVisible && (
                                      <div className="status-pop" onMouseEnter={() => setHoveredCell({ sid: s.id, dateKey: k })} onMouseLeave={() => setHoveredCell(null)}>
                                        <button className="btn btn-sm btn-success" onClick={() => setCellStatus(s.id, k, STATUS.PRESENT)}>Bor</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => setCellStatus(s.id, k, STATUS.ABSENT)}>Yoq</button>
                                        <button className="btn btn-sm btn-info text-white" onClick={() => setCellStatus(s.id, k, STATUS.EXCUSED)}>Ruxsat</button>
                                        <button className="btn btn-sm btn-light border" onClick={() => setCellStatus(s.id, k, STATUS.NONE)}>Tozala</button>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                            <td className="text-center border-start text-muted">0</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* BOSHQA TABLAR UCHUN JOYLAR */}
              {activeTab !== 'davomat' && (
                <div className="p-5 text-center text-muted border rounded bg-light mt-3">
                  Bu bo'lim hozircha bo'sh...
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* ================= BARCHA YASHIRIN MODALLAR (MENU, DRAWER) ================= */}
      
      {/* 1. Talaba uchta nuqta menyusi */}
      {menuState.sid && menuState.rect && (
        <div ref={menuRef} className="student-menu" style={computeMenuStyle(menuState.rect)}>
          <div className="d-flex flex-column gap-1">
             <button className="btn btn-sm btn-light text-start" onClick={() => handleMenuAction(menuState.sid, "freeze")}>Muzlatish / Faollashtirish</button>
             <button className="btn btn-sm btn-light text-start" onClick={() => handleMenuAction(menuState.sid, "payment")}>To'lov qilish</button>
             <button className="btn btn-sm btn-light text-start" onClick={() => handleMenuAction(menuState.sid, "reminder")}>Eslatma qo'shish</button>
             <button className="btn btn-sm btn-light text-start" onClick={() => handleMenuAction(menuState.sid, "move")}>Boshqa guruhga o'tkazish</button>
             <hr className="my-1" />
             <button className="btn btn-sm btn-light text-danger text-start" onClick={() => handleMenuAction(menuState.sid, "delete")}>O'chirish</button>
          </div>
        </div>
      )}

      {/* 2. Sarlavhadagi sana menyusi */}
      {dateMenu.open && dateMenu.rect && (
        <div ref={dateMenuRef} className="date-menu" style={computeDateMenuStyle(dateMenu.rect)}>
          <div className="d-flex flex-column gap-1">
            <button className="btn btn-sm btn-light text-start text-danger" onClick={() => { setDateMenu({open:false}); alert("Dars bekor qilindi!"); }}>Darsni bekor qilish</button>
            <button className="btn btn-sm btn-light text-start" onClick={() => { setDateMenu({open:false}); setMoveDateModal({open:true, from: dateMenu.dateKey}); }}>Sananini ko'chirish</button>
          </div>
        </div>
      )}

      {/* 3. To'lov qutisi (Drawer) */}
      {paymentDrawer.open && (
        <div className="exam-drawer" style={{position: 'fixed', right: 0, top: 0, height: '100vh', width: 380, background: '#fff', zIndex: 3000, padding: 24, boxShadow: '-5px 0 15px rgba(0,0,0,0.1)'}}>
          <h5 className="mb-4 fw-bold d-flex justify-content-between">To'lov qilish <button className="btn btn-close" onClick={() => setPaymentDrawer({open:false})}></button></h5>
          <div className="mb-3"><label className="small mb-1">To'lov turi</label>
            <select className="form-select form-select-sm" value={paymentForm.method} onChange={(e) => setPaymentForm(p => ({...p, method: e.target.value}))}>
              <option value="cash">Naqd pul</option>
              <option value="card">Plastik karta</option>
              <option value="click">Click</option>
            </select>
          </div>
          <div className="mb-3"><label className="small mb-1">Summa</label><input type="number" className="form-control form-control-sm" value={paymentForm.amount} onChange={(e) => setPaymentForm(p => ({...p, amount: e.target.value}))} /></div>
          <div className="mb-4"><label className="small mb-1">Izoh</label><textarea className="form-control" rows={3}></textarea></div>
          <button className="btn btn-warning w-100" onClick={savePayment}>To'lovni saqlash</button>
        </div>
      )}

      {/* 4. Qolgan modallar */}
      <EditGroupDrawer open={editGroupOpen} onClose={() => setEditGroupOpen(false)} group={currentGroup} onSave={(f) => { alert("Saqlandi!"); setEditGroupOpen(false); }} />
      <ConfirmModal open={confirmState.open} title={confirmState.title} onCancel={() => setConfirmState({open:false})} onConfirm={confirmState.onConfirm}>{confirmState.message}</ConfirmModal>
      <AddStudentModal open={addStudentOpen} onClose={() => setAddStudentOpen(false)} onSave={(name) => { setStudents(p => [...p, {id: Date.now(), name, phone: "", balance: 0, groupId: currentGroup.id}]); }} />
      <GroupSmsDrawer open={groupSmsOpen} onClose={() => setGroupSmsOpen(false)} studentCount={groupStudents.length} onSend={() => alert("Jo'natildi")} />
      <ReminderModal open={reminderOpen} onClose={() => setReminderOpen(false)} initial={reminderInitial} onSave={() => alert("Eslatma saqlandi!")} />
      <MoveGroupModal open={moveOpen} onClose={() => setMoveOpen(false)} groups={props.groups ?? groups} onMove={() => alert("Guruhga o'tkazildi!")} />
      <MoveDateModal open={moveDateModal.open} fromDateKey={moveDateModal.from} onClose={() => setMoveDateModal({open:false})} onConfirm={() => alert("Sana ko'chirildi!")} />

    </div>
  );
}