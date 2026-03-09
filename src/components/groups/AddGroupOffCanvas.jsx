import React, { useState, useEffect, useRef } from "react";
import "./offcanvas.css";

// Kichik DatePopup komponenti (faqat shu modal ichida ishlatiladi)
function DatePopup({ anchorRef, value, onChange, onClose }) {
  if (!anchorRef?.current) return null;
  const rect = anchorRef.current.getBoundingClientRect();
  const style = {
    left: Math.max(10, Math.min(rect.left, window.innerWidth - 300)),
    top: rect.bottom + 6,
  };

  const fmt = (d) => d.toISOString().slice(0, 10);
  return (
    <div className="date-popup-wrapper" style={style} onMouseDown={(e) => e.stopPropagation()}>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => { onChange(fmt(new Date())); onClose(); }}>Bugun</button>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => { const d = new Date(); d.setDate(d.getDate() + 1); onChange(fmt(d)); onClose(); }}>Ertaga</button>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => { const d = new Date(); d.setDate(d.getDate() + 7); onChange(fmt(d)); onClose(); }}>+7 kun</button>
      </div>
      <div style={{ fontSize: 13 }}>
        <input type="date" className="form-control form-control-sm" value={value || ""} onChange={(e) => onChange(e.target.value)} />
      </div>
      <div className="mt-2 text-end">
        <button className="btn btn-sm btn-secondary" onClick={onClose}>Yopish</button>
      </div>
    </div>
  );
}

export default function AddGroupOffcanvas({ onAddGroup }) {
  const [newGroup, setNewGroup] = useState({
    name: "", course: "", teacher: "", days: "", time: "", start: "", end: "", room: "",
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

    // Asosiy sahifaga guruhni uzatish
    onAddGroup(newGroup);

    // Formani tozalash va offcanvas'ni yopish
    setNewGroup({ name: "", course: "", teacher: "", days: "", time: "", start: "", end: "", room: "" });
    
    try {
      const offcanvas = document.getElementById("addGroupOffcanvas");
      // bootstrap global obyekt ekanligini ishonch hosil qilamiz
      if (window.bootstrap) {
        const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvas);
        if (bsOffcanvas) bsOffcanvas.hide();
      }
    } catch (err) {}

    setSaveSuccess("Guruh yaratildi");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => setSaveSuccess(""), 2500);
  };

  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="addGroupOffcanvas" style={{ width: "100%", maxWidth: "420px" }}>
      <div className="offcanvas-header">
        <h5 className="offcanvas-title fw-semibold">Yangi guruh qo'shish</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>

      <div className="offcanvas-body">
        {saveSuccess && <div className="alert alert-success small mb-3">{saveSuccess}</div>}

        <div className="mb-3">
          <label className="form-label">Nomi</label>
          <input type="text" className="form-control form-control-sm" value={newGroup.name} onChange={(e) => { setNewGroup({ ...newGroup, name: e.target.value }); if (errors.name) setErrors((p) => { const np = { ...p }; delete np.name; return np; }); }} />
          {errors.name && <div className="form-text text-danger small">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Kurs tanlash</label>
          <select className="form-select form-select-sm" value={newGroup.course} onChange={(e) => { setNewGroup({ ...newGroup, course: e.target.value }); if (errors.course) setErrors((p) => { const np = { ...p }; delete np.course; return np; }); }}>
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
          <select className="form-select form-select-sm" value={newGroup.teacher} onChange={(e) => { setNewGroup({ ...newGroup, teacher: e.target.value }); if (errors.teacher) setErrors((p) => { const np = { ...p }; delete np.teacher; return np; }); }}>
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
          <select className="form-select form-select-sm" value={newGroup.days} onChange={(e) => { setNewGroup({ ...newGroup, days: e.target.value }); if (errors.days) setErrors((p) => { const np = { ...p }; delete np.days; return np; }); }}>
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
          <input type="time" className="form-control form-control-sm" value={newGroup.time} onChange={(e) => { setNewGroup({ ...newGroup, time: e.target.value }); if (errors.time) setErrors((p) => { const np = { ...p }; delete np.time; return np; }); }} />
          {errors.time && <div className="form-text text-danger small">{errors.time}</div>}
        </div>

        <div className="mb-3" style={{ position: "relative" }}>
          <label className="form-label">Boshlanish sanasi</label>
          <div style={{ position: "relative" }}>
            <input ref={startAnchorRef} type="date" className="form-control form-control-sm" value={newGroup.start} onChange={(e) => { setNewGroup({ ...newGroup, start: e.target.value }); if (errors.start) setErrors((p) => { const np = { ...p }; delete np.start; return np; }); }} onFocus={() => setDatePopupFor("start")} onClick={() => setDatePopupFor("start")} />
            {errors.start && <div className="form-text text-danger small">{errors.start}</div>}
          </div>
        </div>

        <div className="mb-3" style={{ position: "relative" }}>
          <label className="form-label">Tugash sanasi</label>
          <div style={{ position: "relative" }}>
            <input ref={endAnchorRef} type="date" className="form-control form-control-sm" value={newGroup.end || ""} onChange={(e) => { setNewGroup({ ...newGroup, end: e.target.value }); if (errors.end) setErrors((p) => { const np = { ...p }; delete np.end; return np; }); }} onFocus={() => setDatePopupFor("end")} onClick={() => setDatePopupFor("end")} />
            {errors.end && <div className="form-text text-danger small">{errors.end}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Xona</label>
          <select className="form-select form-select-sm" value={newGroup.room} onChange={(e) => { setNewGroup({ ...newGroup, room: e.target.value }); if (errors.room) setErrors((p) => { const np = { ...p }; delete np.room; return np; }); }}>
            <option value="">Xonani tanlang</option>
            <option value="Room #1">Room #1</option>
            <option value="Room #2">Room #2</option>
            <option value="Room #3">Room #3</option>
          </select>
          {errors.room && <div className="form-text text-danger small">{errors.room}</div>}
        </div>

        <button className="btn btn-warning w-100 btn-sm" onClick={handleSave}>Saqlash</button>

        {datePopupFor === "start" && (
          <DatePopup anchorRef={startAnchorRef} value={newGroup.start} onChange={(v) => setNewGroup((p) => ({ ...p, start: v }))} onClose={() => setDatePopupFor(null)} />
        )}
        {datePopupFor === "end" && (
          <DatePopup anchorRef={endAnchorRef} value={newGroup.end} onChange={(v) => setNewGroup((p) => ({ ...p, end: v }))} onClose={() => setDatePopupFor(null)} />
        )}
      </div>
    </div>
  );
}