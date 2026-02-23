import React, { useState, useEffect } from "react";

function AddLeadForm({ onSend, editData }) {
  const [form, setForm] = useState({
    name: "",
    phone: "99 ",
    source: "",
    comment: ""
  });

  /* ===== EDIT DATA KELSA FORMGA QO‘Y ===== */
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.title || "",
        phone: editData.phone
          ? editData.phone.replace("+998 ", "")
          : " ",
        source: editData.source || "",
        comment: editData.comment || ""
      });
    }
  }, [editData]);

  /* ===== PHONE FORMAT ===== */
  const formatPhone = (value) => {
    let nums = value.replace(/\D/g, "").slice(0, 9);
    let res = "";
    if (nums.length > 0) res += nums.slice(0, 2);
    if (nums.length > 2) res += " " + nums.slice(2, 5);
    if (nums.length > 5) res += " " + nums.slice(5, 7);
    if (nums.length > 7) res += " " + nums.slice(7, 9);
    return res;
  };

  const handleSubmit = () => {
    if (!form.name || form.phone.length < 11) return;

    onSend({
      id: editData?.id,
      name: form.name,
      phone: "+998 " + form.phone,
      source: form.source,
      comment: form.comment
    });

    // reset
    setForm({
      name: "",
      phone: " ",
      source: "",
      comment: ""
    });
  };

  return (
    <div className="card mt-2 p-2 shadow-sm">
      <input
        className="form-control mb-2"
        placeholder="Ism familiya"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <div className="input-group mb-2">
        <span className="input-group-text">+998</span>
        <input
          className="form-control"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: formatPhone(e.target.value) })
          }
        />
      </div>

      <input
        className="form-control mb-2"
        placeholder="Manba"
        value={form.source}
        onChange={(e) => setForm({ ...form, source: e.target.value })}
      />

      <textarea
        className="form-control mb-2"
        rows={2}
        placeholder="Izoh"
        value={form.comment}
        onChange={(e) => setForm({ ...form, comment: e.target.value })}
      />

      <button className="btn btn-primary w-100" onClick={handleSubmit}>
        Send
      </button>
    </div>
  );
}

export default AddLeadForm;
