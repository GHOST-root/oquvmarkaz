// TopFilters.jsx
import React from "react";

function TopFilters() {
  return (
    <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
      {/* Search */}
      <input
        type="text"
        className="form-control"
        placeholder="Ism yoki tel"
        style={{ maxWidth: 200, height: 40 }}
      />

      {/* Bo'lim */}
      <select className="form-select" style={{ maxWidth: 150, height: 40 }}>
        <option>Bo‘lim</option>
      </select>

      {/* Kurslar */}
      <select className="form-select" style={{ maxWidth: 150, height: 40 }}>
        <option>Kurslar</option>
      </select>

      {/* Teglar */}
      <select className="form-select" style={{ maxWidth: 150, height: 40 }}>
        <option>Teglar</option>
      </select>

      {/* Mijoz */}
      <select className="form-select" style={{ maxWidth: 150, height: 40 }}>
        <option>Mijoz</option>
      </select>

      {/* Xodimlar */}
      <select className="form-select" style={{ maxWidth: 150, height: 40 }}>
        <option>Xodimlar</option>
      </select>

      {/* Sana */}
      <input
        type="date"
        className="form-control"
        style={{ maxWidth: 160, height: 40 }}
      />
    </div>
  );
}

export default TopFilters;
