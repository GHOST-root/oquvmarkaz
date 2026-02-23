import { useState, useEffect } from "react";

function EditTeacherDrawer({ teacher, onClose, onSave }) {
  const [form, setForm] = useState({
    photo: "",
    phone: "+998",
    name: "",
    surname: "",
    birth: "",
    gender: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (teacher) {
      setForm({
        photo: teacher.photo || "",
        phone: teacher.phone || "+998",
        name: teacher.name || "",
        surname: teacher.surname || "",
        birth: teacher.birth || "",
        gender: teacher.gender || "",
        password: teacher.password || ""
      });
    }
  }, [teacher]);

  const validate = () => {
    const e = {};
    if (!form.phone || form.phone.length < 13) e.phone = true;
    if (!form.name) e.name = true;
    if (!form.surname) e.surname = true;
    if (!form.birth) e.birth = true;
    if (!form.gender) e.gender = true;
    if (!form.password || form.password.length !== 7) e.password = true;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;

    onSave({
      ...teacher,
      ...form
    });
  };

  return (
    <div className="drawer-overlay">
      <div className="drawer p-4">
        <h5 className="mb-3">O‘qituvchini tahrirlash</h5>

        {/* FOTO */}
        <label>Foto</label>
        <input
          type="file"
          className={`form-control mb-2 ${errors.photo ? "border-danger" : ""}`}
          onChange={(e) =>
            setForm({ ...form, photo: URL.createObjectURL(e.target.files[0]) })
          }
        />

      <label>Telefon</label>
<input
  className={`form-control mb-2 ${errors.phone ? "border-danger" : ""}`}
  value={form.phone}
  onChange={(e) => {
    let v = e.target.value.replace(/[^\d]/g, "");

    if (!v.startsWith("998")) {
      v = "998";
    }

    v = v.slice(0, 12); // 998 + 9 raqam

    let formatted = "+998";
    if (v.length > 3) formatted += " " + v.slice(3, 5);
    if (v.length > 5) formatted += " " + v.slice(5, 8);
    if (v.length > 8) formatted += " " + v.slice(8, 10);
    if (v.length > 10) formatted += " " + v.slice(10, 12);

    setForm({ ...form, phone: formatted });
  }}
/>


        {/* ISM / FAMILIYA */}
        <div className="d-flex gap-2">
          <div className="w-50">
            <label>Ism</label>
            <input
              className={`form-control ${errors.name ? "border-danger" : ""}`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="w-50">
            <label>Familiya</label>
            <input
              className={`form-control ${errors.surname ? "border-danger" : ""}`}
              value={form.surname}
              onChange={(e) => setForm({ ...form, surname: e.target.value })}
            />
          </div>
        </div>

        {/* TUG‘ILGAN SANA */}
        <label className="mt-2">Tug‘ilgan sana</label>
        <input
          type="date"
          className={`form-control mb-2 ${errors.birth ? "border-danger" : ""}`}
          value={form.birth}
          onChange={(e) => setForm({ ...form, birth: e.target.value })}
        />

        {/* JINS */}
        <label>Jins</label>
        <div className="d-flex gap-3 mb-2">
          <label>
            <input
              type="radio"
              checked={form.gender === "erkak"}
              onChange={() => setForm({ ...form, gender: "erkak" })}
            />{" "}
            Erkak
          </label>
          <label>
            <input
              type="radio"
              checked={form.gender === "ayol"}
              onChange={() => setForm({ ...form, gender: "ayol" })}
            />{" "}
            Ayol
          </label>
        </div>
        {errors.gender && <div className="text-danger">Jins tanlang</div>}

        {/* PAROL */}
        <label>Parol (7 xonali)</label>
        <div className="position-relative">
          <input
            type={showPass ? "text" : "password"}
            className={`form-control ${errors.password ? "border-danger" : ""}`}
            value={form.password}
            maxLength={7}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <span
            onClick={() => setShowPass(!showPass)}
            style={{
              position: "absolute",
              right: 10,
              top: 10,
              cursor: "pointer"
            }}
          >
            👁
          </span>
        </div>

        {/* SAQLASH */}
        <button
          className="btn btn-warning w-100 text-white mt-4"
          onClick={save}
        >
          Saqlash
        </button>

        <button
          className="btn btn-light w-100 mt-2"
          onClick={onClose}
        >
          Bekor qilish
        </button>
      </div>
    </div>
  );
}

export default EditTeacherDrawer;
