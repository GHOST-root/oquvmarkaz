import { useState, useEffect } from "react";

function AddTeacherDrawer({ onClose, onAdd, teacher }) {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [phone, setPhone] = useState("+998 ");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  /* ================= EDIT HOLAT ================= */
  useEffect(() => {
    if (teacher) {
      const parts = teacher.name?.split(" ") || [];
      setName(parts[0] || "");
      setSurname(parts.slice(1).join(" ") || "");
      setPhone(teacher.phone || "+998 ");
      setBirth(teacher.birth || "");
      setGender(teacher.gender || "");
      setPhotoPreview(teacher.photo || "");
    }
  }, [teacher]);

  /* ================= TELEFON FORMAT ================= */
  const handlePhoneChange = (e) => {
    let digits = e.target.value.replace(/\D/g, "");

    if (!digits.startsWith("998")) digits = "998";
    digits = digits.slice(0, 12);

    let formatted = "+998";
    if (digits.length > 3) formatted += " " + digits.slice(3, 5);
    if (digits.length > 5) formatted += " " + digits.slice(5, 8);
    if (digits.length > 8) formatted += " " + digits.slice(8, 10);
    if (digits.length > 10) formatted += " " + digits.slice(10, 12);

    setPhone(formatted);
  };

  /* ================= FOTO ================= */
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  /* ================= SAQLASH ================= */
  const save = () => {
    const err = {};

    if (phone.replace(/\D/g, "").length !== 12)
      err.phone = "Telefon to‘liq emas";
    if (!name) err.name = "Ism majburiy";
    if (!surname) err.surname = "Familiya majburiy";
    if (!birth) err.birth = "Sana majburiy";
    if (!gender) err.gender = "Jins tanlanmagan";
    if (password.length !== 7)
      err.password = "Parol 7 xonali bo‘lishi kerak";

    setErrors(err);
    if (Object.keys(err).length) return;

    onAdd({
      name: `${name} ${surname}`,
      phone,
      birth,
      gender,
      photo: photoPreview,
    });

    onClose();
  };

  return (
    <div className="drawer-overlay">
      <div className="drawer">
        <div className="drawer-header d-flex justify-content-between">
          <h5>{teacher ? "O‘qituvchini tahrirlash" : "Yangi o‘qituvchi"}</h5>
          <span style={{ cursor: "pointer" }} onClick={onClose}>✕</span>
        </div>

        <div className="drawer-body">
          {/* FOTO */}
          <label>Foto</label>
          <input type="file" className="form-control mb-2" onChange={handlePhoto} />
          {photoPreview && (
            <img
              src={photoPreview}
              alt=""
              style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
              className="mb-2"
            />
          )}

          {/* TELEFON */}
          <label>Telefon</label>
          <input
            className={`form-control mb-1 ${errors.phone ? "border-danger" : ""}`}
            value={phone}
            onChange={handlePhoneChange}
          />
          {errors.phone && <small className="text-danger">{errors.phone}</small>}

          {/* ISM / FAMILIYA */}
          <div className="row mt-2">
            <div className="col">
              <label>Ism</label>
              <input
                className={`form-control ${errors.name ? "border-danger" : ""}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col">
              <label>Familiya</label>
              <input
                className={`form-control ${errors.surname ? "border-danger" : ""}`}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
          </div>

          {/* TUG‘ILGAN SANA */}
          <label className="mt-2">Tug‘ilgan sana</label>
          <input
            type="date"
            className={`form-control ${errors.birth ? "border-danger" : ""}`}
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
          />

          {/* JINS */}
          <label className="mt-2">Jins</label>
          <div className="d-flex gap-4">
            <label className="form-check">
              <input
                type="radio"
                className="form-check-input"
                checked={gender === "male"}
                onChange={() => setGender("male")}
              />
              Erkak
            </label>
            <label className="form-check">
              <input
                type="radio"
                className="form-check-input"
                checked={gender === "female"}
                onChange={() => setGender("female")}
              />
              Ayol
            </label>
          </div>
          {errors.gender && <small className="text-danger">{errors.gender}</small>}

          {/* PAROL */}
          <label className="mt-2">Parol (7 xonali)</label>
          <div className="position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`form-control ${errors.password ? "border-danger" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={7}
            />
            <span
              style={{
                position: "absolute",
                right: 10,
                top: 8,
                cursor: "pointer",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </span>
          </div>
          {errors.password && <small className="text-danger">{errors.password}</small>}

          <button
            className="btn btn-warning w-100 text-white mt-3"
            onClick={save}
          >
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTeacherDrawer;
