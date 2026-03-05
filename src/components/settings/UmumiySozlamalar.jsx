import React, { useState } from "react";


export default function UmumiySozlamalar() {
  const [form, setForm] = useState({
    companyType: "",
    centerName: "CRM2",
    logo: null,
    logoPreview: null,
    color: "#8e44ad",
    animation: true,
    startTime: "07:00",
    endTime: "23:00",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange("logo", file);
      handleChange("logoPreview", URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    console.log("Saved data:", form);
    alert("Sozlamalar saqlandi ✅");
  };

  const colors = ["#8e44ad", "#0d6efd", "#556b2f", "#fd7e14", "#8b0000"];

  return (
    <div className="container my-4">
      <h4 className="mb-4">Umumiy sozlamalari</h4>

      <div className="card p-4 shadow-sm">

        {/* Company type */}
        <div className="mb-3">
          <label className="form-label">Kompaniya turi</label>
          <select
            className="form-select"
            value={form.companyType}
            onChange={(e) => handleChange("companyType", e.target.value)}
          >
            <option value="">Select</option>
            <option value="crm">CRM</option>
            <option value="education">Education</option>
          </select>
        </div>

        {/* Center name */}
        <div className="mb-3">
          <label className="form-label">
            O'quv markazining nomi <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            value={form.centerName}
            onChange={(e) => handleChange("centerName", e.target.value)}
          />
        </div>

        {/* Logo */}
        <div className="mb-3">
          <label className="form-label">Logotip</label>
          <input
            type="file"
            className="form-control"
            onChange={handleLogoChange}
          />
        </div>

        {/* Logo preview */}
        {form.logoPreview && (
          <div className="mb-4">
            <img
              src={form.logoPreview}
              alt="preview"
              className="logo-preview"
            />
          </div>
        )}

        {/* Color */}
        <div className="mb-4">
          <label className="form-label">Asosiy rangni ko'rsating</label>
          <div className="d-flex gap-4 mt-2">
            {colors.map((c) => (
              <div
                key={c}
                className={`color-circle ${
                  form.color === c ? "active" : ""
                }`}
                style={{ backgroundColor: c }}
                onClick={() => handleChange("color", c)}
              ></div>
            ))}
          </div>
        </div>

        {/* Animation */}
        <div className="form-check form-switch mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            checked={form.animation}
            onChange={(e) => handleChange("animation", e.target.checked)}
          />
          <label className="form-check-label">Animatsiya</label>
        </div>

        {/* Work start time */}
        <div className="mb-3">
          <label className="form-label">Ish boshlanish vaqti</label>
          <input
            type="time"
            className="form-control"
            value={form.startTime}
            onChange={(e) => handleChange("startTime", e.target.value)}
          />
        </div>

        {/* Work end time */}
        <div className="mb-4">
          <label className="form-label">Ish tugash vaqti</label>
          <input
            type="time"
            className="form-control"
            value={form.endTime}
            onChange={(e) => handleChange("endTime", e.target.value)}
          />
        </div>

        <button className="btn btn-warning px-4 rounded-pill" onClick={handleSave}>
          Saqlash
        </button>

      </div>
    </div>
  );
}