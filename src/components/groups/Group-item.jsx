import React, { useEffect, useMemo, useState, useRef } from "react";
import './Group-item.css';
/*
  Group-item.jsx (yangilangan)
  - Qo'shilgan: MoveDateModal (oy-grid modal) va yordam kartasi (HelpPanel)
  - Date menu: o'tgan sanalar uchun "move" opsiyasi o'chiriladi
  - Move jarayoni: eski sana bekor qilinadi, yangi sanada movedFrom annotatsiyasi qo'shiladi
  - Boshqa funksionallik va dizayn siz bergan original faylga moslashtirildi (faqat shu faylga o'zgartirish kiritildi)
*/
// --- PASTE THIS IN Group-item.jsx (after imports, before `export default function App(...)`) ---

function ReminderModal({ open, onClose, onSave, initial = {} }) {
  const [form, setForm] = React.useState({ title: initial.title || "", note: initial.note || "", date: initial.date || new Date().toISOString().slice(0,10), sid: initial.sid || null });
  React.useEffect(() => { if (open) setForm({ title: initial.title || "", note: initial.note || "", date: initial.date || new Date().toISOString().slice(0,10), sid: initial.sid || null }); }, [open, initial]);
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:4500 }}>
      <div style={{ width:520, margin:"12vh auto", background:"#fff", borderRadius:8, padding:16 }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Yangi eslatma</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>✕</button>
        </div>
        <div>
          <div className="mb-2"><label className="form-label small">Sana</label><input type="date" className="form-control form-control-sm" value={form.date} onChange={(e)=>setForm(f=>({...f,date:e.target.value}))} /></div>
          <div className="mb-2"><label className="form-label small">Nomi</label><input className="form-control form-control-sm" value={form.title} onChange={(e)=>setForm(f=>({...f,title:e.target.value}))} /></div>
          <div className="mb-2"><label className="form-label small">Izoh</label><textarea className="form-control" rows={3} value={form.note} onChange={(e)=>setForm(f=>({...f,note:e.target.value}))} /></div>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-2">
          <button className="btn btn-sm btn-secondary" onClick={onClose}>Bekor</button>
          <button className="btn btn-sm btn-primary" onClick={() => { onSave && onSave(form); onClose && onClose(); }}>Saqlash</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ open, title, children, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:4600 }}>
      <div style={{ width:480, margin:"18vh auto", background:"#fff", borderRadius:8, padding:16 }}>
        <h5>{title}</h5>
        <div className="mb-3">{children}</div>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-sm btn-secondary" onClick={onCancel}>Bekor</button>
          <button className="btn btn-sm btn-danger" onClick={() => { onConfirm && onConfirm(); }}>Tasdiqlash</button>
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
      <div style={{ width:420, margin:"16vh auto", background:"#fff", borderRadius:8, padding:16 }}>
        <h5>Talabani guruhga o'tkazish</h5>
        <div className="mb-2">
          <select className="form-select" value={sel} onChange={(e)=>setSel(e.target.value)}>
            <option value="">Tanlang (bo'sh = olib tashlash)</option>
            {groups.map(g=> <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-sm btn-secondary" onClick={onClose}>Bekor</button>
          <button className="btn btn-sm btn-primary" onClick={() => { onMove && onMove(sel); onClose && onClose(); }}>Ko'chirish</button>
        </div>
      </div>
    </div>
  );
}

function DiscountForm({ onSave, onCancel }) {
  const [form, setForm] = React.useState({ sum: "", start: new Date().toISOString().slice(0,10), end: "", note: "" });
  return (
    <div>
      <div className="mb-2"><label className="form-label small">Sum</label><input className="form-control form-control-sm" value={form.sum} onChange={(e)=>setForm(f=>({...f,sum:e.target.value}))} /></div>
      <div className="mb-2"><label className="form-label small">Boshlanish</label><input type="date" className="form-control form-control-sm" value={form.start} onChange={(e)=>setForm(f=>({...f,start:e.target.value}))} /></div>
      <div className="mb-2"><label className="form-label small">Tugash</label><input type="date" className="form-control form-control-sm" value={form.end} onChange={(e)=>setForm(f=>({...f,end:e.target.value}))} /></div>
      <div className="mb-2"><label className="form-label small">Izoh</label><input className="form-control form-control-sm" value={form.note} onChange={(e)=>setForm(f=>({...f,note:e.target.value}))} /></div>
      <div className="d-flex justify-content-end gap-2 mt-2">
        <button className="btn btn-sm btn-secondary" onClick={onCancel}>Bekor</button>
        <button className="btn btn-sm btn-primary" onClick={() => { onSave && onSave(form); }}>Saqlash</button>
      </div>
    </div>
  );
}

function EditGroupDrawer({ open, onClose, group, onSave }) {
  const [form, setForm] = React.useState({ name: group?.name || "", course: group?.course || "", teacher: group?.teacher || "", days: group?.days || "", room: group?.room || "", startDate: group?.start || "", endDate: group?.end || "", startTime: group?.time || "" });
  React.useEffect(()=>{ if(open) setForm({ name: group?.name || "", course: group?.course || "", teacher: group?.teacher || "", days: group?.days || "", room: group?.room || "", startDate: group?.start || "", endDate: group?.end || "", startTime: group?.time || "" }); }, [open, group]);
  if (!open) return null;
  return (
    <div style={{ position:"fixed", right:0, top:0, height:"100vh", width:420, background:"#fff", zIndex:4700, padding:16 }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Guruhni tahrirlash</h5>
        <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>✕</button>
      </div>
      <div className="mb-2"><label className="form-label small">Nomi</label><input className="form-control form-control-sm" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} /></div>
      <div className="mb-2"><label className="form-label small">Kurs</label><input className="form-control form-control-sm" value={form.course} onChange={e=>setForm(f=>({...f,course:e.target.value}))} /></div>
      <div className="mb-2"><label className="form-label small">O'qituvchi</label><input className="form-control form-control-sm" value={form.teacher} onChange={e=>setForm(f=>({...f,teacher:e.target.value}))} /></div>
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button className="btn btn-sm btn-secondary" onClick={onClose}>Bekor</button>
        <button className="btn btn-sm btn-primary" onClick={() => { onSave && onSave(form); onClose && onClose(); }}>Saqlash</button>
      </div>
    </div>
  );
}
const LS = {
  STUDENTS: "om_students_restored",
  ATTENDANCE: "om_attendance_restored",
  CALENDAR: "om_calendar_restored",
  SETTINGS: "om_settings_restored",
  EXAMS: "om_exams_restored",
  DISCOUNTS: "om_discounts_restored",
  MATERIALS: "om_materials_restored",
  INDIVPRICES: "om_individual_prices_restored",
  PAYMENTS: "om_payments_restored",
  LOGS: "om_logs_restored",
  NOTES: "om_notes_restored",
};

const STATUS = { NONE: "none", PRESENT: "present", ABSENT: "absent", EXCUSED: "excused" };
const STATUS_ORDER = [STATUS.NONE, STATUS.PRESENT, STATUS.ABSENT, STATUS.EXCUSED];

const formatKey = (d) => (typeof d === "string" ? d : d.toISOString().slice(0, 10));
const fmtShort = (d) => new Date(d).toLocaleDateString(undefined, { day: "2-digit", month: "short" });

function getDatesFrom(startIso, count = 7) {
  const base = new Date(startIso);
  const arr = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    arr.push(d);
  }
  return arr;
}

/* ---------- Enhanced DatePopup: month-grid calendar (used embedded) ---------- */
function DatePopup({ anchorRef, value, onChange, onClose, minDate }) {
  // If anchorRef not provided (null), we'll render as centered block (caller handles positioning).
  const rect = anchorRef?.current ? anchorRef.current.getBoundingClientRect() : null;
  const styleBase = {
    position: rect ? "fixed" : "relative",
    left: rect ? rect.left : undefined,
    top: rect ? rect.bottom + 6 : undefined,
    zIndex: 4200,
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 6,
    padding: 10,
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    minWidth: 260,
  };
  const style = styleBase;

  const today = new Date();
  const parse = (v) => (v ? new Date(v) : new Date());
  const sel = parse(value);
  const [viewYear, setViewYear] = useState(sel.getFullYear());
  const [viewMonth, setViewMonth] = useState(sel.getMonth());

  useEffect(() => {
    const s = parse(value);
    setViewYear(s.getFullYear());
    setViewMonth(s.getMonth());
  }, [value]);

  const startOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = startOfMonth.getDay(); // 0..6 (Sun..Sat)
  const days = [];
  const firstDate = new Date(startOfMonth);
  firstDate.setDate(1 - startWeekday);
  for (let i = 0; i < 6 * 7; i++) {
    const d = new Date(firstDate);
    d.setDate(firstDate.getDate() + i);
    days.push(d);
  }

  const isSameDay = (a, b) => formatKey(a) === formatKey(b);
  const onPick = (d) => {
    if (minDate && new Date(formatKey(d)) < new Date(formatKey(minDate))) return;
    onChange(formatKey(d));
    onClose && onClose();
  };

  const monthLabel = startOfMonth.toLocaleString(undefined, { month: "long", year: "numeric" });

  return (
    <div style={style} onMouseDown={(e) => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontWeight: 600 }}>{monthLabel}</div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => { setViewMonth((m) => { const nm = m - 1; if (nm < 0) { setViewYear((y) => y - 1); return 11; } return nm; }); }}>‹</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => { setViewMonth((m) => { const nm = m + 1; if (nm > 11) { setViewYear((y) => y + 1); return 0; } return nm; }); }}>›</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, textAlign: "center", fontSize: 13 }}>
        {["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"].map((wd) => (
          <div key={wd} style={{ opacity: 0.6, fontSize: 12 }}>{wd}</div>
        ))}
        {days.map((d, idx) => {
          const inMonth = d.getMonth() === viewMonth;
          const isToday = isSameDay(d, today);
          const isSelected = isSameDay(d, sel);
          const disabled = minDate && new Date(formatKey(d)) < new Date(formatKey(minDate));
          const btnStyle = {
            padding: 8,
            borderRadius: 6,
            cursor: disabled ? "not-allowed" : "pointer",
            background: isSelected ? "#0d6efd" : isToday ? "#e7f1ff" : "transparent",
            color: isSelected ? "#fff" : inMonth ? "#000" : "#bdbdbd",
            border: "none",
            opacity: disabled ? 0.45 : 1,
          };
          return (
            <div key={idx}>
              <button
                className="btn btn-sm"
                style={btnStyle}
                onClick={() => onPick(d)}
                title={d.toDateString()}
                disabled={disabled}
              >
                {d.getDate()}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-2 text-end">
        <button className="btn btn-sm btn-secondary me-2" onClick={() => { onChange(formatKey(new Date())); onClose && onClose(); }}>Today</button>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => onClose && onClose()}>Close</button>
      </div>
    </div>
  );
}

/* ---------- Small components (kept) ---------- */
function AddStudentModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({ name: "", startDate: formatKey(new Date()) });
  const anchorRef = useRef(null);
  const [showDatePopup, setShowDatePopup] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm({ name: "", startDate: formatKey(new Date()) });
      setShowDatePopup(false);
    }
  }, [open]);

  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 4200 }}>
      <div style={{ width: 520, margin: "8vh auto", background: "#fff", borderRadius: 8, padding: 20 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Yangi talaba</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>✕</button>
        </div>
        <div>
          <div className="mb-2">
            <label className="form-label small">Ism yoki telefon</label>
            <input className="form-control" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Ism Familya" />
          </div>

          <div className="mb-2">
            <label className="form-label small">Sanadan boshlash (majburiy)</label>
            <div style={{ position: "relative" }}>
              <input ref={anchorRef} type="date" className="form-control" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} onFocus={() => setShowDatePopup(true)} onClick={() => setShowDatePopup(true)} />
              {showDatePopup && <DatePopup anchorRef={anchorRef} value={form.startDate} onChange={(v) => setForm((p) => ({ ...p, startDate: v }))} onClose={() => setShowDatePopup(false)} />}
            </div>
            <div className="form-text text-muted">Sanani kiritish majburiy.</div>
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-sm btn-secondary" onClick={onClose}>Bekor qilish</button>
          <button className="btn btn-sm btn-primary" onClick={() => {
            if (!form.name.trim()) { alert("Ism kiriting"); return; }
            if (!form.startDate) { alert("Boshlanish sanasini kiriting"); return; }
            onSave(form.name.trim(), form.startDate);
            onClose();
          }}>Saqlash</button>
        </div>
      </div>
    </div>
  );
}

function GroupSmsDrawer({ open, onClose, onSend, defaultSender = "MODME", studentCount = 0 }) {
  const [msg, setMsg] = useState("");
  useEffect(() => { if (!open) setMsg(""); }, [open]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", right: 0, top: 0, height: "100vh", width: 380, background: "#fff", zIndex: 4300, boxShadow: "-6px 0 24px rgba(0,0,0,0.12)", padding: 18 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Guruhga SMS yuboring</h5>
        <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>✕</button>
      </div>
      <div>
        <div className="mb-2">
          <label className="form-label small">Yuboruvchi</label>
          <div className="form-control form-control-sm">{defaultSender}</div>
        </div>
        <div className="mb-2">
          <label className="form-label small">Xabarni kiriting</label>
          <textarea className="form-control" rows={6} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Xabar matni..." />
          <div className="small text-muted mt-1">{msg.length} ta belgi • {Math.max(1, Math.ceil(msg.length / 70))} SMS • {studentCount} ta talabaga</div>
        </div>
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-sm btn-secondary me-2" onClick={onClose}>Bekor qilish</button>
          <button className="btn btn-sm btn-warning" onClick={() => { if (!msg.trim()) return alert("Xabar kiriting"); onSend(msg); onClose(); }}>SMS yuborish</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- MoveDateModal (NEW): centered modal for choosing target date ---------- */
function MoveDateModal({ open, fromDateKey, onClose, onConfirm }) {
  const [selected, setSelected] = useState(formatKey(new Date()));
  useEffect(() => {
    if (!open) return;
    setSelected(formatKey(new Date())); // default to today
  }, [open]);

  if (!open) return null;
  // minDate is today (cannot choose past)
  const todayKey = formatKey(new Date());
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 4400 }}>
      <div style={{ width: 420, margin: "8vh auto", background: "#fff", borderRadius: 8, padding: 16 }}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="mb-0">Sana tanlang</h5>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>✕</button>
        </div>
        <div className="mb-2">
          <div className="form-text text-muted">Faqat bugungi yoki kelajakdagi sanalarni tanlash mumkin. Tanlangan sana:</div>
          <div style={{ marginTop: 8, marginBottom: 12 }}><input className="form-control form-control-sm" value={selected} readOnly /></div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <DatePopup anchorRef={null} value={selected} onChange={(v) => setSelected(v)} onClose={() => {}} minDate={todayKey} />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-sm btn-secondary" onClick={onClose}>Bekor qilish</button>
          <button className="btn btn-sm btn-primary" onClick={() => { onConfirm && onConfirm(fromDateKey, selected); onClose && onClose(); }}>Saqlash</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helper small UI: HelpPanel (NEW) ---------- */
function HelpPanel({ open = true }) {
  if (!open) return null;
  return (
    <div className="">
     
    </div>
  );
}

/* ---------- Main component ---------- */

export default function App(props) {
  const lsStudents = JSON.parse(localStorage.getItem(LS.STUDENTS) || "null");
  const lsAttendance = JSON.parse(localStorage.getItem(LS.ATTENDANCE) || "null");
  const lsCalendar = JSON.parse(localStorage.getItem(LS.CALENDAR) || "null");
  const lsSettings = JSON.parse(localStorage.getItem(LS.SETTINGS) || "null");
  const lsExams = JSON.parse(localStorage.getItem(LS.EXAMS) || "null");
  const lsDiscounts = JSON.parse(localStorage.getItem(LS.DISCOUNTS) || "null");
  const lsMaterials = JSON.parse(localStorage.getItem(LS.MATERIALS) || "null");
  const lsPrices = JSON.parse(localStorage.getItem(LS.INDIVPRICES) || "null");
  const lsPayments = JSON.parse(localStorage.getItem(LS.PAYMENTS) || "null");
  const lsLogs = JSON.parse(localStorage.getItem(LS.LOGS) || "null");
  const lsNotes = localStorage.getItem(LS.NOTES);

  const [studentsLocal, setStudentsLocal] = useState(lsStudents ?? [
    { id: 1, name: "Faxriddin", phone: "(91) 123-44-56", archived: false, muted: false, balance: 0, createdAt: Date.now() - 100000, startDate: formatKey(new Date()), groupId: 1 },
    { id: 2, name: "Jumaqozi", phone: "(91) 123-43-31", archived: false, muted: false, balance: 0, createdAt: Date.now() - 50000, startDate: formatKey(new Date()), groupId: 1 },
    { id: 3, name: "Kamoldin", phone: "(90) 825-63-08", archived: false, muted: false, balance: 0, createdAt: Date.now() - 20000, startDate: formatKey(new Date()), groupId: null },
  ]);
  const students = studentsLocal;
  const setStudents = setStudentsLocal;

  const [settings, setSettings] = useState(lsSettings ?? { showCoins: true, visibleArchived: false, columns: 7, sortOption: "az", showMuted: true });
  const [calendar, setCalendar] = useState(lsCalendar ?? { startIso: formatKey(new Date()) });

  const dates = useMemo(() => getDatesFrom(calendar.startIso, settings.columns), [calendar, settings.columns]);

  const [attendance, setAttendance] = useState(() => {
    if (lsAttendance) return lsAttendance;
    const init = {};
    const initDates = getDatesFrom(calendar.startIso, settings.columns);
    (lsStudents ?? [{ id: 1 }, { id: 2 }, { id: 3 }]).forEach((s) => {
      const sid = s.id;
      init[sid] = {};
      const studentStart = (s.startDate ? s.startDate : formatKey(new Date()));
      initDates.forEach((d) => {
        const k = formatKey(d);
        if (new Date(k) >= new Date(studentStart)) init[sid][k] = STATUS.NONE;
      });
    });
    return init;
  });

  const [exams, setExams] = useState(lsExams ?? []);
  const [discounts, setDiscounts] = useState(lsDiscounts ?? []);
  const [materials, setMaterials] = useState(lsMaterials ?? []);
  const [individualPrices, setIndividualPrices] = useState(lsPrices ?? {});
  const [payments, setPayments] = useState(lsPayments ?? []);
  const [logs, setLogs] = useState(lsLogs ?? []);
  const [notes, setNotes] = useState(lsNotes ?? "");

  const groups = props.groups ?? [];

  // UI state
  const [activeTab, setActiveTab] = useState("davomat");
  const [hoveredCell, setHoveredCell] = useState(null);

  const [menuState, setMenuState] = useState({ sid: null, rect: null });
  const menuRef = useRef(null);

  // New: date menu state + annotations + cancelled dates
  const [dateMenu, setDateMenu] = useState({ open: false, rect: null, dateKey: null, isPast: false });
  const dateMenuRef = useRef(null);
  const [dateAnnotations, setDateAnnotations] = useState(() => ({}));
  const [cancelledDates, setCancelledDates] = useState(() => ({}));

  // Move modal state
  const [moveModal, setMoveModal] = useState({ open: false, from: null });

  // drawers & modals
  const [editGroupOpen, setEditGroupOpen] = useState(false);
  const [groupSmsOpen, setGroupSmsOpen] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [examDrawerOpen, setExamDrawerOpen] = useState(false);
  const [examInitial, setExamInitial] = useState(null);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [paymentDrawer, setPaymentDrawer] = useState({ open: false, sid: null });
  const [paymentForm, setPaymentForm] = useState({ method: "cash", amount: "", date: formatKey(new Date()), note: "" });
  const [reminderOpen, setReminderOpen] = useState(false);
  const [reminderInitial, setReminderInitial] = useState({});
  const [moveOpen, setMoveOpen] = useState(false);
  const [moveStudentId, setMoveStudentId] = useState(null);

  const [confirmState, setConfirmState] = useState({ open: false, title: "", message: null, onConfirm: null });

  const [newExam, setNewExam] = useState({ name: "", date: formatKey(new Date()), time: "10:00", max: 100, pass: 60, desc: "", fileName: "" });

  useEffect(() => {
    localStorage.setItem(LS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => localStorage.setItem(LS.ATTENDANCE, JSON.stringify(attendance)), [attendance]);
  useEffect(() => localStorage.setItem(LS.CALENDAR, JSON.stringify(calendar)), [calendar]);
  useEffect(() => localStorage.setItem(LS.SETTINGS, JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem(LS.EXAMS, JSON.stringify(exams)), [exams]);
  useEffect(() => localStorage.setItem(LS.DISCOUNTS, JSON.stringify(discounts)), [discounts]);
  useEffect(() => localStorage.setItem(LS.MATERIALS, JSON.stringify(materials)), [materials]);
  useEffect(() => localStorage.setItem(LS.INDIVPRICES, JSON.stringify(individualPrices)), [individualPrices]);
  useEffect(() => localStorage.setItem(LS.PAYMENTS, JSON.stringify(payments)), [payments]);
  useEffect(() => localStorage.setItem(LS.LOGS, JSON.stringify(logs)), [logs]);
  useEffect(() => localStorage.setItem(LS.NOTES, notes), [notes]);

  // ensure attendance keys exist for current date window & students
  useEffect(() => {
    setAttendance((prev) => {
      const next = { ...prev };
      students.forEach((s) => {
        if (!next[s.id]) next[s.id] = {};
        dates.forEach((d) => {
          const k = formatKey(d);
          const studentStart = s.startDate || formatKey(new Date());
          if (new Date(k) >= new Date(studentStart)) {
            if (!(k in next[s.id])) next[s.id][k] = STATUS.NONE;
          } else {
            if (k in next[s.id]) delete next[s.id][k];
          }
        });
      });
      Object.keys(next).forEach((sid) => {
        if (!students.find((s) => String(s.id) === String(sid))) delete next[sid];
      });
      return next;
    });
  }, [students, dates]);

  // close smart menu on scroll/resize/click outside
  useEffect(() => {
    const closeMenu = (ev) => {
      if (menuRef.current && menuRef.current.contains(ev.target)) return;
      setMenuState({ sid: null, rect: null });
      if (dateMenuRef.current && dateMenuRef.current.contains(ev.target)) return;
      setDateMenu({ open: false, rect: null, dateKey: null, isPast: false });
    };
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);
    document.addEventListener("click", closeMenu);
    return () => {
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  const addLog = (type, sid, text) => {
    const time = new Date().toISOString();
    const entry = { id: Math.max(0, ...logs.map((l) => l.id || 0)) + 1, type, sid, text, time };
    setLogs((l) => [entry, ...l]);
  };

  /* ---------- Attendance handlers ---------- */
  const toggleCellCycle = (sid, dateKey) => {
    if (cancelledDates[dateKey]) return;
    setAttendance((prev) => {
      if (!prev?.[sid] || !(dateKey in prev[sid])) return prev;
      const cur = prev[sid][dateKey] ?? STATUS.NONE;
      const nxt = STATUS_ORDER[(STATUS_ORDER.indexOf(cur) + 1) % STATUS_ORDER.length];
      const next = { ...prev, [sid]: { ...(prev[sid] || {}), [dateKey]: nxt } };
      addLog("attendance", sid, `Status changed for ${dateKey} → ${nxt}`);
      return next;
    });
  };
  const setCellStatus = (sid, dateKey, status) => {
    if (cancelledDates[dateKey]) return;
    setAttendance((prev) => {
      if (!prev?.[sid] || !(dateKey in prev[sid])) return prev;
      const next = { ...prev, [sid]: { ...(prev[sid] || {}), [dateKey]: status } };
      return next;
    });
    addLog("attendance", sid, `Status set for ${dateKey} → ${status}`);
    setHoveredCell(null);
  };
  const markAll = (dateKey, status) => {
    if (cancelledDates[dateKey]) return;
    setAttendance((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((sid) => {
        if (dateKey in next[sid]) {
          next[sid] = { ...next[sid], [dateKey]: status };
        }
      });
      return next;
    });
    addLog("attendance", null, `All students set to ${status} for ${dateKey}`);
  };

  /* ---------- Students CRUD (unchanged) ---------- */
  const addStudent = (name, startDate) => {
    const id = Math.max(0, ...students.map((s) => s.id)) + 1;
    const sd = startDate || formatKey(new Date());
    const currentGroup = props.group ?? null;
    const gid = currentGroup ? currentGroup.id : null;
    const newStudent = { id, name, phone: "", archived: false, muted: false, balance: 0, createdAt: Date.now(), startDate: sd, groupId: gid };
    setStudents((prev) => [...prev, newStudent]);

    setAttendance((prev) => {
      const next = { ...prev, [id]: { ...(prev[id] || {}) } };
      dates.forEach((d) => {
        const k = formatKey(d);
        if (new Date(k) >= new Date(sd)) next[id][k] = STATUS.NONE;
      });
      return next;
    });
    addLog("student", null, `Added student ${name}`);

    if (typeof props.updateGroupStudentCount === "function" && currentGroup) {
      const newCount = (currentGroup.students || 0) + 1;
      props.updateGroupStudentCount(currentGroup.id, newCount);
    }
  };

  const requestDeleteStudent = (id) => {
    const s = students.find((x) => x.id === id);
    setConfirmState({
      open: true,
      title: "Haqiqatan ham o'chirmoqchimisiz?",
      message: (<div><div>Talabani butunlay o'chirish: <strong>{s?.name}</strong></div><div className="form-check mt-2"><input className="form-check-input" type="checkbox" id="recBal" /><label className="form-check-label small" htmlFor="recBal">Balansni qayta hisoblash</label></div></div>),
      onConfirm: () => {
        setStudents((sarr) => sarr.filter((x) => x.id !== id));
        setAttendance((a) => { const n = { ...a }; delete n[id]; return n; });
        addLog("student", id, `Deleted student ${s?.name}`);
        setConfirmState({ open: false });

        const currentGroup = props.group ?? null;
        if (typeof props.updateGroupStudentCount === "function" && currentGroup) {
          const newCount = Math.max(0, (currentGroup.students || 0) - 1);
          props.updateGroupStudentCount(currentGroup.id, newCount);
        }
      },
    });
  };

  const toggleArchive = (id) => { setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, archived: !s.archived } : s))); addLog("student", id, `Archive toggled`); };
  const toggleMute = (id) => { setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, muted: !s.muted } : s))); addLog("student", id, `Mute toggled`); };

  /* ---------- Payments (unchanged) ---------- */
  const openPaymentDrawer = (sid) => { setPaymentDrawer({ open: true, sid }); setPaymentForm({ method: "cash", amount: "", date: formatKey(new Date()), note: "" }); addLog("ui", sid, `Opened payment drawer for ${sid}`); };
  const closePaymentDrawer = () => setPaymentDrawer({ open: false, sid: null });
  const savePayment = () => {
    const sid = paymentDrawer.sid; if (!sid) return;
    const amt = Number(paymentForm.amount || 0); if (!amt || isNaN(amt) || amt <= 0) return alert("Iltimos, miqdorni kiriting");
    setStudents((prev) => prev.map((s) => (s.id === sid ? { ...s, balance: (s.balance || 0) - amt } : s)));
    const id = Math.max(0, ...payments.map((p) => p.id || 0)) + 1;
    const rec = { id, sid, amount: amt, method: paymentForm.method, date: paymentForm.date, note: paymentForm.note, time: new Date().toISOString() };
    setPayments((p) => [rec, ...p]); addLog("payment", sid, `Payment ${amt} UZS by ${paymentForm.method}`); closePaymentDrawer();
  };

  /* ---------- Reminders / Moves / Exams / Discounts / Materials (unchanged) ---------- */
  const openReminderFor = (sid) => { setReminderInitial({ personId: null, title: "", note: "", date: formatKey(new Date()), sid }); setReminderOpen(true); };
  const onSaveReminder = (data) => { addLog("reminder", data.sid || null, `Reminder saved: ${data.title} (${data.date})`); };

  const openMoveModal = (sid) => { setMoveStudentId(sid); setMoveOpen(true); };
  const onMoveToGroup = (groupId) => {
    const gid = (groupId === "" || groupId == null) ? null : Number(groupId);
    const sid = moveStudentId;
    if (sid == null) return alert("Talaba tanlanmadi");

    setStudents((prev) => {
      const s = prev.find((x) => x.id === sid);
      const oldGid = s?.groupId ?? null;
      const updated = prev.map((st) => (st.id === sid ? { ...st, groupId: gid } : st));

      const counts = {};
      updated.forEach((st) => {
        const g = st.groupId ?? null;
        counts[g] = (counts[g] || 0) + 1;
      });

      if (typeof props.updateGroupStudentCount === "function") {
        if (oldGid !== null && !Number.isNaN(oldGid)) {
          props.updateGroupStudentCount(oldGid, counts[oldGid] || 0);
        }
        if (gid !== null && !Number.isNaN(gid)) {
          props.updateGroupStudentCount(gid, counts[gid] || 0);
        }
        const currentGroup = props.group ?? null;
        if (currentGroup) {
          props.updateGroupStudentCount(currentGroup.id, counts[currentGroup.id] || 0);
        }
      }

      addLog("group", sid, `Moved ${s?.name} from ${oldGid} to ${gid}`);
      return updated;
    });

    setMoveOpen(false);
  };

  const openExamDrawer = (initial = null) => { if (initial) { setNewExam(initial); setExamInitial(initial); } else { setNewExam({ name: "", date: formatKey(new Date()), time: "10:00", max: 100, pass: 60, desc: "", fileName: "" }); setExamInitial(null); } setExamDrawerOpen(true); };
  const closeExamDrawer = () => setExamDrawerOpen(false);
  const saveExam = () => { if (!newExam.name.trim()) return alert("Imtihon nomi kiriting"); const id = Math.max(0, ...exams.map((e) => e.id || 0)) + 1; setExams((e) => [{ ...newExam, id }, ...e]); addLog("exam", null, `Exam added: ${newExam.name}`); closeExamDrawer(); };

  const openDiscountModal = () => setDiscountModalOpen(true);
  const closeDiscountModal = () => setDiscountModalOpen(false);
  const saveDiscount = (d) => { const id = Math.max(0, ...discounts.map((x) => x.id || 0)) + 1; setDiscounts((prev) => [{ ...d, id }, ...prev]); addLog("discount", null, `Discount added: ${d.sum}`); closeDiscountModal(); };

  const uploadMaterial = (title, file) => { if (!title) return alert("Nom kiriting"); const id = Math.max(0, ...materials.map((m) => m.id || 0)) + 1; setMaterials((m) => [{ id, title, filename: file?.name || "" }, ...m]); addLog("material", null, `Material uploaded: ${title}`); };
  const setIndividualPrice = (sid, price) => { setIndividualPrices((p) => ({ ...p, [sid]: Number(price) })); addLog("price", sid, `Individual price set: ${price}`); };

  /* ---------- Calendar nav ---------- */
  const prevDates = () => setCalendar((c) => { const d = new Date(c.startIso); d.setDate(d.getDate() - settings.columns); return { startIso: formatKey(d) }; });
  const nextDates = () => setCalendar((c) => { const d = new Date(c.startIso); d.setDate(d.getDate() + settings.columns); return { startIso: formatKey(d) }; });
  const jumpToday = () => setCalendar({ startIso: formatKey(new Date()) });

  /* ---------- Date menu helpers (UPDATED) ---------- */
  const openDateMenu = (ev, dateKey) => {
    ev.stopPropagation();
    const rect = ev.currentTarget.getBoundingClientRect();
    const todayKey = formatKey(new Date());
    const isPast = new Date(dateKey) < new Date(todayKey); // if true, past date
    setDateMenu({ open: true, rect, dateKey, isPast });
  };
  const computeDateMenuStyle = (rect) => {
    if (!rect) return { display: "none" };
    const menuW = 220;
    const approxMenuH = 160;
    const padding = 8;
    let left = rect.left + rect.width / 2 - menuW / 2;
    if (left < padding) left = padding;
    if (left + menuW > window.innerWidth - padding) left = Math.max(padding, window.innerWidth - menuW - padding);

    let top;
    if (rect.bottom + approxMenuH + padding <= window.innerHeight) {
      top = rect.bottom + padding;
    } else {
      top = Math.max(padding, rect.top - approxMenuH - padding);
    }
    return { position: "fixed", left: Math.round(left), top: Math.round(top), width: menuW, zIndex: 1600 };
  };

  const handleDateAction = (action, dateKey) => {
    setDateMenu({ open: false, rect: null, dateKey: null, isPast: false });
    const todayKey = formatKey(new Date())  ;
    const isPast = new Date(dateKey) < new Date(todayKey);

    switch (action) {
      case "cancel":
        if (isPast) { alert("O'tgan sanalarni bekor qilish mumkin emas."); return; }
        if (!window.confirm("Darsni bekor qilasizmi?")) return;
        setCancelledDates((p) => ({ ...p, [dateKey]: true }));
        addLog("group", null, `Class cancelled on ${dateKey}`);
        break;
      case "move":
        if (isPast) { alert("O'tgan sanalardagi darslarni boshqa sanaga ko'chirish mumkin emas."); return; }
        // open move modal with fromDateKey
        setMoveModal({ open: true, from: dateKey });
        break;
      case "topic":
        {
          const topic = prompt("Dars mavzusini kiriting", (dateAnnotations[dateKey] && dateAnnotations[dateKey].topic) || "");
          if (topic == null) return;
          setDateAnnotations((p) => ({ ...p, [dateKey]: { ...(p[dateKey] || {}), topic } }));
          addLog("group", null, `Topic set for ${dateKey}: ${topic}`);
        }
        break;
      case "exam":
        if (isPast) { alert("O'tgan sanada imtihon qo'shib bo'lmaydi."); return; }
        setNewExam((p) => ({ ...p, date: dateKey }));
        openExamDrawer({ name: `Imtihon (${dateKey})`, date: dateKey, time: "10:00", max: 100, pass: 60 });
        addLog("group", null, `Exam creation opened for ${dateKey}`);
        break;
      default:
        break;
    }
  };

  // performMove: from -> to
  const performMove = (fromKey, toKey) => {
    if (!fromKey || !toKey) return;
    // disallow moving to past
    const todayKey = formatKey(new Date());
    if (new Date(toKey) < new Date(todayKey)) { alert("Nishon sana bugun yoki kelajak bo'lishi kerak."); return; }

    // mark old date cancelled
    setCancelledDates((p) => ({ ...p, [fromKey]: true }));

    // annotate target date with movedFrom
    const note = `→ ${new Date(fromKey).toLocaleDateString(undefined, { day: "2-digit", month: "short" })}`;
    setDateAnnotations((p) => ({ ...p, [toKey]: { ...(p[toKey] || {}), movedFrom: fromKey, note } }));

    // optional: if you want to set attendance presets for new date, you could do here
    addLog("group", null, `Moved class from ${fromKey} to ${toKey}`);
  };

  /* ---------- Left list actions (unchanged) ---------- */
  const handleMenuAction = (sid, action) => {
    setMenuState({ sid: null, rect: null });
    switch (action) {
      case "freeze": toggleMute(sid); break;
      case "payment": openPaymentDrawer(sid); break;
      case "reminder": openReminderFor(sid); break;
      case "move": openMoveModal(sid); break;
      case "removeFromGroup":
        {
          const s = students.find((x) => x.id === sid);
          setConfirmState({
            open: true,
            title: "Guruhdan olib tashlash",
            message: <div>Talaba guruhdan olib tashlanadi. Davom etilsinmi?</div>,
            onConfirm: () => {
              setStudents((prev) => prev.map((st) => (st.id === sid ? { ...st, groupId: null } : st)));
              addLog("group", sid, `Removed ${s?.name} from group`);
              setConfirmState({ open: false });
              const currentGroup = props.group ?? null;
              if (currentGroup && typeof props.updateGroupStudentCount === "function") {
                const newCount = students.filter(x => x.groupId === currentGroup.id && x.id !== sid).length;
                props.updateGroupStudentCount(currentGroup.id, newCount);
              }
            }
          });
        }
        break;
      case "notes": openReminderFor(sid); break;
      case "delete": requestDeleteStudent(sid); break;
      default: break;
    }
  };

  /* ---------- Filtering & Sorting for group students (unchanged) ---------- */
  const [query, setQuery] = useState("");
  const currentGroup = props.group ?? (props.groups && props.groups[0]) ?? null;
  const groupStudents = currentGroup ? students.filter((s) => s.groupId === currentGroup.id) : students.filter(s => !s.groupId);
  const filteredStudents = groupStudents
    .filter((s) => (settings.visibleArchived ? true : !s.archived))
    .filter((s) => (settings.showMuted ? true : !s.muted))
    .filter((s) => (query.trim() ? `${s.name} ${s.phone}`.toLowerCase().includes(query.toLowerCase()) : true));

  const sortedStudents = useMemo(() => {
    const arr = [...filteredStudents];
    const opt = settings.sortOption || "az";
    switch (opt) {
      case "az": arr.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "za": arr.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "new": arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); break;
      case "old": arr.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)); break;
      case "balance_desc": arr.sort((a, b) => (b.balance || 0) - (a.balance || 0)); break;
      case "balance_asc": arr.sort((a, b) => (a.balance || 0) - (b.balance || 0)); break;
      case "muted_first": arr.sort((a, b) => (b.muted === true ? 1 : 0) - (a.muted === true ? 1 : 0)); break;
      default: break;
    }
    return arr;
  }, [filteredStudents, settings.sortOption]);

  /* ---------- CSV Export (unchanged) ---------- */
  const exportCSV = () => {
    const headers = ["Name", "Phone", ...dates.map((d) => d.toLocaleDateString())];
    const rows = groupStudents.map((s) => [s.name, s.phone, ...dates.map((d) => attendance[s.id]?.[formatKey(d)] ?? "")]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `attendance_group_${currentGroup ? currentGroup.id : "all"}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  /* ---------- Styles (unchanged except small additions) ---------- */
  const styles = (
    <style>{`
      .sidebar { width:72px; background:#fff; border-right:1px solid #eee; padding-top:12px; }
      .icon-btn { display:block; width:52px; height:52px; margin:8px auto; border-radius:10px; background:transparent; border:none; color:#666; }
      .card-left { background:#fff; border-radius:6px; padding:18px; box-shadow:0 1px 0 rgba(0,0,0,0.03); }
      .card-right { background:#fff; border-radius:6px; padding:18px; box-shadow:0 1px 0 rgba(0,0,0,0.03); }
      .avatar { width:34px; height:34px; border-radius:50%; background:#e9ecef; display:inline-block; }
      .attendance-cell { width:36px; height:36px; border-radius:50%; border:2px solid transparent; display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative; }
      .attendance-cell.none { background: #fff; border:1px solid #e7e7; }
      .attendance-cell.present { background: yellowgreen; border-color: #2cb36a; }
      .attendance-cell.absent { background: pink; border-color: red; }
      .attendance-cell.excused { background: #87CEEB; border-color: #3aa0d9; }
      .attendance-cell.disabled { background:#f5f5f5; border:1px solid #ddd; cursor:not-allowed; opacity:0.7; }
      .cell-wrapper { position:relative; display:inline-block; }
      .status-pop { position:absolute; top:-28px; left:50%; transform:translateX(-50%); background:white; border:1px solid #ddd; padding:6px; border-radius:6px; box-shadow:0 2px 6px rgba(0,0,0,0.08); display:flex; gap:6px; z-index:1050; white-space:nowrap; }
      .status-pop button { padding:4px 8px; font-size:12px; }
      .exam-drawer, .payment-drawer { position:fixed; right:0; top:0; height:100vh; width:380px; background:#fff; box-shadow:-6px 0 24px rgba(0,0,0,0.12); z-index:2000; padding:18px; overflow:auto; }
      .payment-drawer { width:360px; }  
      .student-menu { background:white; border:1px solid #ddd; padding:8px; border-radius:6px; box-shadow:0 6px 20px rgba(0,0,0,0.08); z-index:1600; min-width:220px; }
      .date-menu { background:white; border:1px solid #ddd; padding:8px; border-radius:6px; box-shadow:0 6px 20px rgba(0,0,0,0.08); z-index:1600; min-width:220px; }
      .modal-center { position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); background:#fff; padding:18px; zIndex:3000; border-radius:8px; box-shadow:0 6px 30px rgba(0,0,0,0.2); }
      @media (max-width: 991px) { .sidebar { display:none; } .exam-drawer, .payment-drawer { width:100%; } }
    `}</style>  
  );

  const openStudentMenu = (ev, sid) => {
    ev.stopPropagation();
    const rect = ev.currentTarget.getBoundingClientRect();
    setMenuState({ sid, rect });
  };

  const computeMenuStyle = (rect) => {
    if (!rect) return { display: "none" };
    const menuW = 240;
    const approxMenuH = 240;
    const padding = 8;
    let left = rect.left + rect.width - menuW;
    if (left < padding) left = padding;
    if (left + menuW > window.innerWidth - padding) left = Math.max(padding, window.innerWidth - menuW - padding);

    let top;
    if (rect.bottom + approxMenuH + padding <= window.innerHeight) {
      top = rect.bottom + padding;
    } else {
      top = Math.max(padding, rect.top - approxMenuH - padding);
    }
    return { position: "fixed", left: Math.round(left), top: Math.round(top), width: menuW, zIndex: 1600 };
  };

  useEffect(() => {
    if (currentGroup && typeof props.updateGroupStudentCount === "function") {
      props.updateGroupStudentCount(currentGroup.id, groupStudents.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupStudents.length, currentGroup?.id]);

  /* ---------- Render ---------- */
  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }} className="d-flex">
      {styles}

      <main className="flex-fill p-3">
        {/* <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <small className="text-muted">Litsenziya: <strong>17.10.2025 - 23:59</strong></small>
            <h4 className="mt-2">{currentGroup ? `${currentGroup.name} · ${currentGroup.course || "—"} · ${currentGroup.teacher || "—"}` : "Guruh"}</h4>
          </div>
          <div className="text-end">
            <button className="btn btn-warning btn-sm me-2">To'lash</button>
            <div className="form-check form-switch d-inline-block">
              <input className="form-check-input" type="checkbox" id="coins" checked={settings.showCoins} onChange={() => setSettings((s) => ({ ...s, showCoins: !s.showCoins }))} />
              <label className="form-check-label small text-muted" htmlFor="coins">{settings.showCoins ? "Show coins" : "Hide coins"}</label>
            </div>
          </div>
        </div> */}

        <HelpPanel open={true} />

        <div className="row g-3">
          {/* Left card */}
          <div className="col-xl-4 col-lg-5">
            <div className="card-left">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="mb-1"><strong>Guruh:</strong> {currentGroup?.name}</p>
                  <p className="mb-1"><strong>Kurs:</strong> {currentGroup?.course ?? "—"}</p>
                  <p className="mb-1"><strong>O'qituvchi:</strong> {currentGroup?.teacher ?? "—"}</p>
                  <p className="mb-1"><strong>Kunlar:</strong> {currentGroup?.days ?? "—"} {currentGroup?.time ? `· ${currentGroup.time}` : ""}</p>
                  <p className="mb-1"><strong>Sana:</strong> {currentGroup?.start ?? "—"} — {currentGroup?.end ?? "—"}</p>
                  <p className="mb-1"><strong>Xona:</strong> {currentGroup?.room ?? "—"}</p>
                  <p className="mb-1"><strong>Talabalar:</strong> {currentGroup?.students ?? groupStudents.length}</p>
                </div>
                <div className="text-end">
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button className="btn btn-sm btn-outline-secondary" title="Edit" onClick={() => setEditGroupOpen(true)}><i className="fa-solid fa-pen"></i></button>
                    <button className="btn btn-sm btn-outline-secondary" title="SMS" onClick={() => setGroupSmsOpen(true)}><i className="fa-solid fa-message"></i></button>
                    <button className="btn btn-sm btn-outline-secondary" title="Add student" onClick={() => setAddStudentOpen(true)}><i className="fa-solid fa-plus"></i></button>
                    <button className="btn btn-sm btn-outline-secondary" title="Eslatma" onClick={() => { setReminderInitial({ personId: null, title: "", note: "", date: formatKey(new Date()), sid: null }); setReminderOpen(true); }}><i className="fa-solid fa-bell"></i></button>
                    <button className="btn btn-sm btn-outline-secondary" title="Delete" onClick={() => {
                      setConfirmState({
                        open: true,
                        title: "Guruhni o'chirish",
                        message: <div>Guruh o'chiriladi. Davom etilsinmi?</div>,
                        onConfirm: () => { addLog("group", null, "Group deleted (demo)"); setConfirmState({ open: false }); if (typeof props.onClose === "function") props.onClose(); },
                      });
                    }}><i className="fa-solid fa-trash"></i></button>
                  </div>
                </div>
              </div>

              <hr />

              <div className="mb-2 d-flex align-items-center gap-3">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="archivedToggle" checked={settings.visibleArchived} onChange={() => setSettings((s) => ({ ...s, visibleArchived: !s.visibleArchived }))} />
                  <label className="form-check-label small" htmlFor="archivedToggle">Archived</label>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="mutedToggle" checked={settings.showMuted} onChange={() => setSettings((s) => ({ ...s, showMuted: !s.showMuted }))} />
                  <label className="form-check-label small" htmlFor="mutedToggle">Muted</label>
                </div>
                <div className="ms-auto">
                  <select className="form-select form-select-sm" value={settings.sortOption || "az"} onChange={(e) => setSettings((s) => ({ ...s, sortOption: e.target.value }))}>
                    <option value="az">A–Z bo'yicha</option>
                    <option value="za">Z–A bo'yicha</option>
                    <option value="new">Yangilari</option>
                    <option value="old">Eskilari</option>
                    <option value="balance_desc">Balance bo'yicha (kamayish)</option>
                    <option value="balance_asc">Balance bo'yicha (o'sish)</option>
                    <option value="muted_first">Muzlatilganlar avval</option>
                  </select>
                </div>
              </div>

              <div className="mb-2">
                <div className="input-group input-group-sm">
                  <input className="form-control" placeholder="Izlash..." value={query} onChange={(e) => setQuery(e.target.value)} />
                  <button className="btn btn-outline-secondary" onClick={() => setQuery("")}>X</button>
                </div>
              </div>

              <div style={{ maxHeight: 240, overflowY: "auto", position: "relative" }}>
                {sortedStudents.map((s) => (
                  <div key={s.id} className="d-flex justify-content-between align-items-center mb-2 position-relative">
                    <div className="d-flex gap-2 align-items-center">
                      <div className="avatar d-flex justify-content-center align-items-center"><i className="fa-solid fa-user"></i> </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{s.name} {s.muted && <small className="text-muted">(Muzlatilgan)</small>}</div>
                        <div className="small text-muted">{s.phone}</div>
                        <div className="small text-success">Balance: {s.balance?.toLocaleString?.() ?? s.balance} UZS</div>
                      </div>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      <button className="btn btn-sm btn-outline-secondary" onClick={(e) => openStudentMenu(e, s.id)}>⋮</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between mt-3 ">
                <div>
                  <button className="btn btn-sm btn-success p-1 m-1" onClick={() => setAddStudentOpen(true)}>Talaba qo'shish</button>
                  <button className="btn btn-sm btn-primary p-1" onClick={() => {
                    const list = groupStudents.map((s) => `${s.name} — ${s.phone} — ${s.balance} UZS`).join("\n");
                    const blob = new Blob([list], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a"); a.href = url; a.download = `students_group_${currentGroup ? currentGroup.id : "all"}.txt`; a.click(); URL.revokeObjectURL(url);
                  }}>Ro'yxatni yuklab olish</button>
                </div>
                <div>
                  <button className="btn btn-sm btn-outline-secondary p-1 mt-1" onClick={() => setActiveTab("chegirma")}>Chegirmalar</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right card (tabs) */}
          <div className="col-xl-8 col-lg-7">
            <div className="card-right">
              <ul className="nav nav-tabs mb-3">
                <li className="nav-item"><a className={`nav-link ${activeTab === "davomat" ? "active" : ""}`} href="#davomat" onClick={(e) => { e.preventDefault(); setActiveTab("davomat"); }}>Davomat</a></li>
                <li className="nav-item"><a className={`nav-link ${activeTab === "online" ? "active" : ""}`} href="#online" onClick={(e) => { e.preventDefault(); setActiveTab("online"); }}>Onlayn Darslar va materiallar</a></li>
                <li className="nav-item"><a className={`nav-link ${activeTab === "chegirma" ? "active" : ""}`} href="#chegirma" onClick={(e) => { e.preventDefault(); setActiveTab("chegirma"); }}>Chegirmali Narx</a></li>
                <li className="nav-item"><a className={`nav-link ${activeTab === "imtihon" ? "active" : ""}`} href="#imtihon" onClick={(e) => { e.preventDefault(); setActiveTab("imtihon"); }}>Imtihonlar</a></li>
                <li className="nav-item"><a className={`nav-link ${activeTab === "tarix" ? "active" : ""}`} href="#tarix" onClick={(e) => { e.preventDefault(); setActiveTab("tarix"); }}>Tarix</a></li>
                <li className="nav-item"><a className={`nav-link ${activeTab === "izoh" ? "active" : ""}`} href="#izoh" onClick={(e) => { e.preventDefault(); setActiveTab("izoh"); }}>Izohlar</a></li>
              </ul>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex gap-2 align-items-center">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => jumpToday()}>Joriy</button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={prevDates}>&lt;</button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={nextDates}>&gt;</button>

                  <div className="input-group input-group-sm ms-2">
                    <span className="input-group-text">Boshlang'ich sana</span>
                    <input type="date" className="form-control" value={calendar.startIso} onChange={(e) => setCalendar({ startIso: e.target.value })} />
                  </div>
                </div>

                <div className="d-flex gap-2 align-items-center">
                  <button className="btn btn-sm btn-outline-success" onClick={exportCSV}>Export CSV</button>
                  <button className="btn btn-sm btn-outline-info" onClick={() => openExamDrawer()}>Imtihon qo'shish</button>
                  <button className="btn btn-sm btn-outline-warning" onClick={() => openDiscountModal()}>Chegirma qo'shish</button>
                </div>
              </div>

              {/* DAVOMAT */}
              {activeTab === "davomat" && (
                <div>
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                        <tr><th style={{ width: 260 }}>Ism</th>
                          {dates.map((d) => {
                            const k = formatKey(d);
                            const ann = dateAnnotations[k];
                            const cancelled = !!cancelledDates[k];
                            return (
                              <th key={k} className="text-center">
                                <div style={{ fontSize: 12, display: "flex", gap: 8, alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={(e) => openDateMenu(e, k)}>
                                  <div style={{ fontWeight: 600, color: cancelled ? "#b00" : undefined }}>{fmtShort(d)}</div>
                                  {cancelled && <div style={{ fontSize: 11, color: "#b00", marginLeft: 6 }}>Bekor</div>}
                                </div>
                                <div className="mt-1">
                                  <div className="btn-group btn-group-sm" role="group">
                                    <button className="btn btn-outline-success" title="Hammasini Bor qilish" onClick={() => markAll(k, STATUS.PRESENT)}>Bor</button>
                                    <button className="btn btn-outline-danger" title="Hammasini Yoq qilish" onClick={() => markAll(k, STATUS.ABSENT)}>Yoq</button>
                                  </div>
                                </div>
                                {ann && ann.movedFrom && <div className="small text-muted mt-1">{ann.note}</div>}
                                {ann && ann.topic && <div className="small text-muted mt-1">Topic: {ann.topic}</div>}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {sortedStudents.length === 0 && <tr><td colSpan={1 + dates.length} className="text-center text-muted">Talaba topilmadi</td></tr>}
                        {sortedStudents.map((s) => (
                          <tr key={s.id}>
                            <td>
                              <div className="d-flex gap-2 align-items-center"><div className="avatar  d-flex justify-content-center align-items-center"><i className="fa-solid fa-user"></i></div><div><div style={{ fontWeight: 600 }}>{s.name} {s.archived && <small className="text-muted">(archived)</small>}</div><div className="small text-muted">{s.phone}</div></div></div>
                            </td>
                            {dates.map((d) => {
                              const k = formatKey(d);
                              const st = attendance[s.id]?.[k];
                              const popVisible = hoveredCell && hoveredCell.sid === s.id && hoveredCell.dateKey === k;
                              const disabled = !!cancelledDates[k] || st === undefined;
                              return (
                                <td key={k} className="text-center">
                                  <div className="cell-wrapper" onMouseEnter={() => { if (st !== undefined && !disabled) setHoveredCell({ sid: s.id, dateKey: k }); }} onMouseLeave={() => setHoveredCell((h) => (h && h.sid === s.id && h.dateKey === k ? null : h))} style={{ display: "inline-block", minWidth: 36 }}>
                                    <div
                                      className={`attendance-cell ${disabled ? "disabled" : st === STATUS.NONE ? "none" : st === STATUS.PRESENT ? "present" : st === STATUS.ABSENT ? "absent" : "excused"}`}
                                      onClick={() => { if (disabled) return; if (st === undefined) return; toggleCellCycle(s.id, k); }}
                                      title={disabled ? "Dars bekor qilingan yoki talaba shu sanada kursga yozilmagan" : st === STATUS.NONE ? "Hech narsa" : st === STATUS.PRESENT ? "Bor" : st === STATUS.ABSENT ? "Yoq" : "Ruxsat (excused)"}></div>
                                    {popVisible && !disabled && (
                                      <div className="status-pop" onMouseEnter={() => setHoveredCell({ sid: s.id, dateKey: k })} onMouseLeave={() => setHoveredCell(null)}>
                                        <button className={`btn btn-sm ${st === STATUS.PRESENT ? "btn-success active" : "btn-outline-success"}`} onClick={() => setCellStatus(s.id, k, STATUS.PRESENT)}>Bor</button>
                                        <button className={`btn btn-sm ${st === STATUS.ABSENT ? "btn-danger active" : "btn-outline-danger"}`} onClick={() => { setCellStatus(s.id, k, STATUS.ABSENT); setReminderInitial({ sid: s.id, date: k }); setReminderOpen(true); }}>Yoq</button>
                                        <button className={`btn btn-sm ${st === STATUS.EXCUSED ? "btn-primary active" : "btn-outline-secondary"}`} onClick={() => setCellStatus(s.id, k, STATUS.EXCUSED)}>Ruxsat</button>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setCellStatus(s.id, k, STATUS.NONE)}>Ochirish</button>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ONLINE */}
              {activeTab === "online" && (
                <div>
                  <div className="mb-3">
                    <div className="alert alert-light">Darslar va materiallar talabalar uchun yuklanadi. Quyida material qo'shish va ro'yxat ko'rinadi.</div>
                    <div className="d-flex gap-2">
                      <input id="materialTitle" className="form-control form-control-sm" placeholder="Material nomi" />
                      <input id="materialFile" type="file" className="form-control form-control-sm" />
                      <button className="btn btn-sm btn-warning" onClick={() => {
                        const title = document.getElementById("materialTitle").value;
                        const input = document.getElementById("materialFile");
                        const file = input.files && input.files[0];
                        if (!title) return alert("Material nomi kiriting");
                        uploadMaterial(title, file);
                        document.getElementById("materialTitle").value = "";
                        input.value = "";
                      }}>Dars qo'shish</button>
                    </div>
                  </div>

                  <div>
                    {materials.length === 0 ? <div className="p-3 bg-light">Hali yuklanmagan darslar va materiallar</div> :
                      <ul className="list-group">
                        {materials.map((m) => (
                          <li key={m.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <div style={{ fontWeight: 600 }}>{m.title}</div>
                              <div className="small text-muted">{m.filename}</div>
                            </div>
                            <div>
                              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => alert("Materialni ko'rish demo")}>Ko'rish</button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => {
                                if (!window.confirm("Materialni o'chirishni tasdiqlaysizmi?")) return;
                                setMaterials((prev) => prev.filter(x => x.id !== m.id));
                                addLog("material", null, `Material deleted: ${m.title}`);
                              }}>O'chirish</button>
                            </div>
                          </li>
                        ))}
                      </ul>}
                  </div>
                </div>
              )}

              {/* CHEGIRMA */}
              {activeTab === "chegirma" && (
                <div>
                  <div className="mb-3"><div className="alert alert-light">Shaxsiy narx belgilash va chegirmalarni boshqarish.</div></div>

                  <div className="mb-3">
                    <table className="table">
                      <thead><tr><th>Ism</th><th>Tel</th><th>Individual narx</th><th>Sabab</th><th>Amallar</th></tr></thead>
                      <tbody>
                        {groupStudents.map((s) => (
                          <tr key={s.id}>
                            <td>{s.name}</td>
                            <td className="small text-muted">{s.phone}</td>
                            <td>
                              {individualPrices[s.id] ? <span className="badge bg-success">{individualPrices[s.id]} UZS</span> : <span className="text-muted">—</span>}
                              <button className="btn btn-sm btn-success ms-2" onClick={() => {
                                const p = prompt("Yangi individual narx kiriting (UZS)", individualPrices[s.id] ?? "");
                                if (p === null) return;
                                const n = Number(p);
                                if (Number.isNaN(n)) return alert("Raqam kiriting");
                                setIndividualPrices((p0) => ({ ...p0, [s.id]: n }));
                                addLog("price", s.id, `Individual price set: ${n}`);
                              }}>Narxni o'zgartirish</button>
                            </td>
                            <td><small className="text-muted">—</small></td>
                            <td>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => {
                                if (!window.confirm(`Student ${s.name} uchun individual narxni o'chirishni tasdiqlaysizmi?`)) return;
                                setIndividualPrices((prev) => { const np = { ...prev }; delete np[s.id]; return np; });
                                addLog("price", s.id, `Individual price removed`);
                              }}>O'chirish</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mb-2 d-flex gap-2">
                    <button className="btn btn-sm btn-primary" onClick={() => setDiscountModalOpen(true)}>Chegirma qo'shish</button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => { if (!window.confirm("Barcha chegirmalarni o'chirishni tasdiqlaysizmi?")) return; setDiscounts([]); addLog("discount", null, "All discounts cleared"); }}>Barcha chegirmalarni o'chirish</button>
                  </div>

                  <div className="mt-3">
                    <h6>Chegirmalar</h6>
                    {discounts.length === 0 ? <div className="text-muted">Chegirma mavjud emas</div> :
                      <ul className="list-group">
                        {discounts.map((d) => (
                          <li key={d.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <div style={{ fontWeight: 600 }}>{d.sum} UZS</div>
                              <div className="small text-muted">{d.start} — {d.end} · {d.note}</div>
                            </div>
                            <div>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => {
                                if (!window.confirm("Chegirmani o'chirishni tasdiqlaysizmi?")) return;
                                setDiscounts((prev) => prev.filter(x => x.id !== d.id));
                                addLog("discount", null, `Discount deleted: ${d.sum}`);
                              }}>O'chirish</button>
                            </div>
                          </li>
                        ))}
                      </ul>}
                  </div>
                </div>
              )}

              {/* IMTIHON */}
              {activeTab === "imtihon" && (
                <div>
                  <div className="mb-3 d-flex justify-content-between align-items-center">
                    <div className="text-muted">Imtihonlar ro'yxati. Yangi imtihon qo'shish uchun tugmani bosing.</div>
                    <div><button className="btn btn-sm btn-primary me-2" onClick={() => openExamDrawer()}>Imtihon qo'shish</button></div>
                  </div>

                  <div>
                    {exams.length === 0 ? <div className="p-3 bg-light">Hali imtihon qo'shilmagan</div> :
                      <div className="list-group">
                        {exams.map((e) => (
                          <div key={e.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              <div style={{ fontWeight: 600 }}>{e.name}</div>
                              <div className="small text-muted">{e.date} {e.time} · Max: {e.max} · O'tish: {e.pass}</div>
                              <div className="small">{e.desc}</div>
                              {e.fileName && <div className="small text-muted">Fayl: {e.fileName}</div>}
                            </div>
                            <div>
                              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => openExamDrawer(e)}>Tahrirlash</button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => { if (!window.confirm("Imtihonni o'chirishni tasdiqlaysizmi?")) return; setExams((prev) => prev.filter(x => x.id !== e.id)); addLog("exam", null, `Exam deleted: ${e.name}`); }}>O'chirish</button>
                            </div>
                          </div>
                        ))}
                      </div>}
                  </div>
                </div>
              )}

              {/* TARIX */}
              {activeTab === "tarix" && (
                <div>
                  <div className="mb-3 d-flex justify-content-between align-items-center">
                    <div className="text-muted">Holat va harakatlar tarixi (eng so'nggi yuqorida)</div>
                    <div>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => {
                        if (!window.confirm("Barcha tarix yozuvlarini o'chirishni tasdiqlaysizmi?")) return;
                        setLogs([]); addLog("ui", null, "History cleared");
                      }}>Tarixni o'chirish</button>
                    </div>
                  </div>
                  <div>
                    {logs.length === 0 ? <div className="text-muted p-3">Hech qanday voqea yo'q</div> :
                      <div className="list-group">
                        {logs.map((l) => (
                          <div key={l.id} className="list-group-item d-flex justify-content-between">
                            <div>
                              <div style={{ fontWeight: 600 }}>{l.type} {l.sid ? `· ${students.find(s => s.id === l.sid)?.name ?? l.sid}` : ""}</div>
                              <div className="small text-muted">{l.text}</div>
                            </div>
                            <div className="text-end small text-muted">
                              <div>{new Date(l.time).toLocaleString()}</div>
                              <div className="mt-1"><button className="btn btn-sm btn-outline-danger" onClick={() => {
                                setLogs((prev) => prev.filter(x => x.id !== l.id));
                              }}>O'chirish</button></div>
                            </div>
                          </div>
                        ))}
                      </div>}
                  </div>
                </div>
              )}

              {/* IZOH */}
              {activeTab === "izoh" && (
                <div>
                  <div className="alert alert-light">Kurs uchun umumiy izohlar. Saqlash bilan localStorage'ga yoziladi.</div>
                  <textarea className="form-control" rows={8} placeholder="Izoh yozing..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                  <div className="d-flex justify-content-end gap-2 mt-2">
                    <button className="btn btn-sm btn-secondary" onClick={() => { if (!window.confirm("Izohni tozalashni tasdiqlaysizmi?")) return; setNotes(""); }}>Tozalash</button>
                    <button className="btn btn-sm btn-primary" onClick={() => { addLog("note", null, "Notes saved"); alert("Izoh saqlandi"); }}>Saqlash</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Smart positioned student menu */}
      {menuState.sid && menuState.rect && (
        <div
          ref={menuRef}
          className="student-menu"
          style={computeMenuStyle(menuState.rect)}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="d-flex flex-column">
            <button className="btn btn-sm btn-light text-start" onClick={() => handleMenuAction(menuState.sid, "freeze")}>Muzlatish</button>
            <button className="btn btn-sm btn-light text-start" onClick={() => handleMenuAction(menuState.sid, "payment")}>To'lov</button>
            <button className="btn btn-sm btn-light text-start" onClick={() => handleMenuAction(menuState.sid, "reminder")}>Yangi eslatma qo'shish</button>
            <button className="btn btn-sm btn-light text-start" onClick={() => handleMenuAction(menuState.sid, "move")}>Talabani guruhga o'tkazish</button>
            <button className="btn btn-sm btn-light text-start" onClick={() => handleMenuAction(menuState.sid, "removeFromGroup")}>Guruhdan olib tashlash</button>
            <button className="btn btn-sm btn-light text-start" onClick={() => handleMenuAction(menuState.sid, "notes")}>Eslatmalar</button>
            <hr className="my-1" />
            <button className="btn btn-sm btn-light text-start text-danger" onClick={() => handleMenuAction(menuState.sid, "delete")}>Talabani butunlay o'chirish</button>
          </div>
        </div>
      )}

      {/* Date menu */}
      {dateMenu.open && dateMenu.rect && (
        <div ref={dateMenuRef} className="date-menu" style={computeDateMenuStyle(dateMenu.rect)} onClick={(e) => e.stopPropagation()}>
          <div className="d-flex flex-column">
            <button className="btn btn-sm btn-light text-start" onClick={() => handleDateAction("cancel", dateMenu.dateKey)} disabled={dateMenu.isPast}>Darsni bekor qilish</button>
            <button className="btn btn-sm btn-light text-start" onClick={() => handleDateAction("move", dateMenu.dateKey)} disabled={dateMenu.isPast}>Ko'chirish darsi</button>
            <button className="btn btn-sm btn-light text-start" onClick={() => handleDateAction("topic", dateMenu.dateKey)}>Dars mavzusini belgilash</button>
            <button className="btn btn-sm btn-light text-start" onClick={() => handleDateAction("exam", dateMenu.dateKey)} disabled={dateMenu.isPast}>Imtihon qo'shish</button>
          </div>
        </div>
      )}

      {/* Move modal */}
      <MoveDateModal open={moveModal.open} fromDateKey={moveModal.from} onClose={() => setMoveModal({ open: false, from: null })} onConfirm={(from, to) => performMove(from, to)} />

      {/* Exam Drawer */}
      {examDrawerOpen && (
        <div className="exam-drawer">
          <div className="d-flex justify-content-between align-items-center mb-3"><h5 className="mb-0">Imtihon qo'shish</h5><button className="btn btn-sm btn-outline-secondary" onClick={() => setExamDrawerOpen(false)}>✕</button></div>
          <div>
            <div className="mb-2"><label className="form-label small">Nomi</label><input className="form-control form-control-sm" value={newExam.name} onChange={(e) => setNewExam((p) => ({ ...p, name: e.target.value }))} /></div>
            <div className="mb-2"><label className="form-label small">Sana</label><input type="date" className="form-control form-control-sm" value={newExam.date} onChange={(e) => setNewExam((p) => ({ ...p, date: e.target.value }))} /></div>
            <div className="mb-2"><label className="form-label small">Imtihon davomiyligi (vaqt)</label><input type="time" className="form-control form-control-sm" value={newExam.time} onChange={(e) => setNewExam((p) => ({ ...p, time: e.target.value }))} /></div>
            <div className="row"><div className="col-6 mb-2"><label className="form-label small">Maximal ball</label><input type="number" className="form-control form-control-sm" value={newExam.max} onChange={(e) => setNewExam((p) => ({ ...p, max: Number(e.target.value) }))} /></div><div className="col-6 mb-2"><label className="form-label small">O'tish balli</label><input type="number" className="form-control form-control-sm" value={newExam.pass} onChange={(e) => setNewExam((p) => ({ ...p, pass: Number(e.target.value) }))} /></div></div>
            <div className="mb-2"><label className="form-label small">Izoh</label><textarea className="form-control form-control-sm" rows={3} value={newExam.desc} onChange={(e) => setNewExam((p) => ({ ...p, desc: e.target.value }))} /></div>
            <div className="mb-3"><label className="form-label small">Fayl</label><input type="file" className="form-control form-control-sm" onChange={(e) => { const f = e.target.files && e.target.files[0]; setNewExam((p) => ({ ...p, fileName: f ? f.name : "" })); }} />{newExam.fileName && <div className="small text-muted mt-1">Tanlangan fayl: {newExam.fileName}</div>}</div>
            <div className="d-flex justify-content-end gap-2"><button className="btn btn-sm btn-secondary" onClick={() => setExamDrawerOpen(false)}>Bekor qilish</button><button className="btn btn-sm btn-primary" onClick={saveExam}>Saqlash</button></div>
          </div>
        </div>
      )}

      {/* Discount Modal */}
      {discountModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 2500 }}>
          <div className="modal-center" style={{ width: 520 }}><h5>Chegirma qo'shish</h5><DiscountForm onSave={(d) => saveDiscount(d)} onCancel={() => setDiscountModalOpen(false)} /></div>
        </div>
      )}

      {/* Payment Drawer */}
      {paymentDrawer.open && (
        <div className="payment-drawer">
          <div className="d-flex justify-content-between align-items-center mb-3"><h5 className="mb-0">To'lov qo'shish</h5><button className="btn btn-sm btn-outline-secondary" onClick={() => setPaymentDrawer({ open: false, sid: null })}>✕</button></div>
          <div>
            {(() => {
              const s = students.find((x) => x.id === paymentDrawer.sid);
              if (!s) return <div>Talaba topilmadi</div>;
              return (<>
                <div className="mb-2"><label className="form-label small">Talaba</label><div className="form-control form-control-sm">{s.name}</div></div>
                <div className="mb-2"><label className="form-label small">Balans</label><div className="badge bg-warning">{(s.balance || 0).toLocaleString()} UZS</div></div>
                <div className="mb-2"><label className="form-label small">To'lov usuli</label><div>
                  <div className="form-check"><input className="form-check-input" type="radio" id="pm_cash" name="pm" checked={paymentForm.method === "cash"} onChange={() => setPaymentForm((p) => ({ ...p, method: "cash" }))} /><label className="form-check-label" htmlFor="pm_cash">Naqd pul</label></div>
                  <div className="form-check"><input className="form-check-input" type="radio" id="pm_card" name="pm" checked={paymentForm.method === "card"} onChange={() => setPaymentForm((p) => ({ ...p, method: "card" }))} /><label className="form-check-label" htmlFor="pm_card">Plastik kartasi</label></div>
                  <div className="form-check"><input className="form-check-input" type="radio" id="pm_click" name="pm" checked={paymentForm.method === "click"} onChange={() => setPaymentForm((p) => ({ ...p, method: "click" }))} /><label className="form-check-label" htmlFor="pm_click">Click</label></div>
                  <div className="form-check"><input className="form-check-input" type="radio" id="pm_payme" name="pm" checked={paymentForm.method === "payme"} onChange={() => setPaymentForm((p) => ({ ...p, method: "payme" }))} /><label className="form-check-label" htmlFor="pm_payme">Payme</label></div>
                </div></div>
                <div className="mb-2"><label className="form-label small">Miqdor</label><input className="form-control form-control-sm" value={paymentForm.amount} onChange={(e) => setPaymentForm((p) => ({ ...p, amount: e.target.value }))} /></div>
                <div className="mb-2"><label className="form-label small">Sana</label><input type="date" className="form-control form-control-sm" value={paymentForm.date} onChange={(e) => setPaymentForm((p) => ({ ...p, date: e.target.value }))} /></div>
                <div className="mb-2"><label className="form-label small">Izoh</label><textarea className="form-control form-control-sm" rows={3} value={paymentForm.note} onChange={(e) => setPaymentForm((p) => ({ ...p, note: e.target.value }))} /></div>
                <div className="d-flex justify-content-end gap-2"><button className="btn btn-sm btn-secondary" onClick={() => setPaymentDrawer({ open: false, sid: null })}>Bekor qilish</button><button className="btn btn-sm btn-primary" onClick={savePayment}>Saqlash</button></div>
              </>);
            })()}
          </div>
        </div>
      )}

      {/* Reminder modal */}
      <ReminderModal open={reminderOpen} onClose={() => setReminderOpen(false)} onSave={onSaveReminder} initial={reminderInitial} />

      {/* Move group modal */}
      <MoveGroupModal open={moveOpen} onClose={() => setMoveOpen(false)} groups={props.groups ?? groups} onMove={onMoveToGroup} />

      {/* Confirm modal */}
      <ConfirmModal open={confirmState.open} title={confirmState.title} onCancel={() => setConfirmState({ open: false })} onConfirm={() => { confirmState.onConfirm && confirmState.onConfirm(); }}>
        {confirmState.message}
      </ConfirmModal>

      {/* Add student modal */}
      <AddStudentModal open={addStudentOpen} onClose={() => setAddStudentOpen(false)} onSave={(name, startDate) => addStudent(name, startDate)} />
      <GroupSmsDrawer open={groupSmsOpen} onClose={() => setGroupSmsOpen(false)} studentCount={groupStudents.length} onSend={(msg) => { addLog("sms", null, `Group SMS sent: ${msg}`); alert("SMS yuborildi (demo)"); }} />

      {/* Edit Group Drawer */}
      <EditGroupDrawer open={editGroupOpen} onClose={() => setEditGroupOpen(false)} group={currentGroup} onSave={(form) => {
        if (!currentGroup) return;
        const patch = {
          name: form.name,
          course: form.course,
          teacher: form.teacher,
          days: form.days,
          room: form.room,
          time: form.startTime,
          start: form.startDate,
          end: form.endDate,
          title: `${form.name} (${form.teacher} · ${form.startTime})`,
        };
        if (typeof props.updateGroup === "function") {
          props.updateGroup(currentGroup.id, patch);
        } else if (props.setGroups) {
          props.setGroups((prev) => prev.map((g) => (g.id === currentGroup.id ? { ...g, ...patch } : g)));
        }
        addLog("group", null, `Group saved: ${form.name}`);
      }} />

    </div>
  );
}

/* ---------- EditGroupDrawer, ConfirmModal, ReminderModal, MoveGroupModal, DiscountForm ----------
   These components are assumed present elsewhere in your original code or previously in this file.
   If you need, I can inline or adapt them as well. Right now I left them referenced as in original.
*/                      