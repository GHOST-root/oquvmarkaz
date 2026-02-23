import React, { useState, useEffect } from "react";
import './Teachers.css';
// Raqamni formatlash funksiyasi (XX YYY ZZ VV)

const formatPhoneNumber = (phone) => {
  if (!phone) return "";

  const cleaned = ("" + phone).replace(/\D/g, "");

  if (cleaned.length === 9) {
    return cleaned.replace(/^(\d{2})(\d{3})(\d{2})(\d{2})$/, "$1 $2 $3 $4");
  }

  return phone;
};

// Inputga kiritish vaqtida formatlash (ko'rinish uchun)

const formatInputPhone = (inputPhone) => {
  if (!inputPhone) return "";

  const cleaned = ("" + inputPhone).replace(/\D/g, "");

  let formatted = "";

  if (cleaned.length > 0) formatted += cleaned.substring(0, 2);

  if (cleaned.length > 2) formatted += " " + cleaned.substring(2, 5);

  if (cleaned.length > 5) formatted += " " + cleaned.substring(5, 7);

  if (cleaned.length > 7) formatted += " " + cleaned.substring(7, 9);

  return formatted;
};

const TeachersPlatform = () => {
  // --- STATE (Holatlar) ---

  const [teachers, setTeachers] = useState([]);

  const [view, setView] = useState("list");

  const [currentTeacher, setCurrentTeacher] = useState(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isSmsOpen, setIsSmsOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [activeMenuId, setActiveMenuId] = useState(null);

  // Parol input holati

  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const [showPassword, setShowPassword] = useState("password");

  // Profil ichidagi tablar

  const [profileTab, setProfileTab] = useState("profile");

  // Inputlar holati

  const initialForm = {
    id: null,

    phone: "",

    name: "",

    surname: "",

    dob: "",

    gender: "",

    photo: null,

    password: "",

    fileName: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const [errors, setErrors] = useState({});

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const API_URL = "https://oqituvchilar-4.onrender.com/api/";

    fetch(API_URL)
      .then((res) => {
        // Agar server 404 yoki 500 qaytarsa, JSONga o'tma

        if (!res.ok) throw new Error(`Status: ${res.status}`);

        return res.json();
      })

      .then((data) => {
        console.log("Muvaffaqiyatli:", data);
      });
  }, []);

  // --- FUNKSIYALAR ---

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyNums = value.replace(/[^0-9]/g, "");

      if (onlyNums.length <= 9) {
        setFormData({ ...formData, phone: onlyNums });

        if (errors.phone) setErrors({ ...errors, phone: false });
      }

      return;
    }

    if (name === "password") {
      if (value.length <= 6) {
        setFormData({ ...formData, password: value });

        if (errors.password) setErrors({ ...errors, password: false });
      }

      return;
    }

    setFormData({ ...formData, [name]: value });

    if (errors[name]) setErrors({ ...errors, [name]: false });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        setFormData({ ...formData, photo: reader.result, fileName: file.name });
      };

      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, photo: null, fileName: "" });
    }
  };

  const handleSave = () => {
    const newErrors = {};

    if (!formData.phone || formData.phone.length !== 9) newErrors.phone = true;

    if (!formData.name) newErrors.name = true;

    if (!formData.surname) newErrors.surname = true;

    if (!formData.dob) newErrors.dob = true;

    if (!formData.gender) newErrors.gender = true;

    // >>> YANGILANISH: Parol inputi ko'rinib tursa, u majburiy hisoblanadi

    if (showPasswordInput && !formData.password) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      return;
    }

    const dataToSave = { ...formData };

    // Agar parol input yashirilgan bo'lsa (yangi qo'shishda qo'shilmagan bo'lsa), uni saqlamaslik

    if (!showPasswordInput) dataToSave.password = "";

    if (formData.id) {
      setTeachers(teachers.map((t) => (t.id === formData.id ? dataToSave : t)));

      if (currentTeacher && currentTeacher.id === formData.id) {
        setCurrentTeacher(dataToSave);
      }
    } else {
      const newTeacher = { ...dataToSave, id: Date.now() };

      setTeachers([...teachers, newTeacher]);
    }

    closeDrawer();
  };

  const openEdit = (teacher) => {
    setFormData(teacher);

    // Tahrirlashda parol avvaldan mavjud bo'lsa, uni ko'rsatish

    setShowPasswordInput(!!teacher.password);

    setIsDrawerOpen(true);

    setActiveMenuId(null);
  };

  const openAdd = () => {
    setFormData(initialForm);

    setShowPasswordInput(false);

    setIsDrawerOpen(true);
  };

  const handleDelete = () => {
    setTeachers(teachers.filter((t) => t.id !== currentTeacher.id));

    setIsDeleteModalOpen(false);

    setActiveMenuId(null);

    if (view === "profile") setView("list");
  };

  const handleSendSMS = () => {
    setIsSmsOpen(false);

    setActiveMenuId(null);

    setToastMessage("SMS yuborildi!");

    setTimeout(() => setToastMessage(null), 2000);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);

    setErrors({});
  };

  const togglePasswordInput = () => {
    if (showPasswordInput) {
      setFormData({ ...formData, password: "" });

      setErrors({ ...errors, password: false });
    }

    setShowPasswordInput(!showPasswordInput);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(showPassword === "password" ? "text" : "password");
  };

  return (
    <div className="content-container">
      <div className="content">
        {/* --- ORTGA QAYTISH BUTTONI --- */}

        {view === "profile" && (
          <div className="back-link" onClick={() => setView("list")}>
            <i className="fa-solid fa-arrow-left"></i> O'qituvchilar ro'yxati
          </div>
        )}

        {/* --- RO'YXAT KO'RINISHI --- */}

        {view === "list" && (
          <>
            <div className="header">
              <h2>
                O'qituvchilar{" "}
                <span className="badge">Miqdor — {teachers.length}</span>
              </h2>

              <button className="btn-orange" onClick={openAdd}>
                <span className="plas">+</span> Yangisini qo'shish
              </button>
            </div>

            <div className="table-container">
              {/* Ustun sarlavhalari */}

              <div className="table-header-row">
                <div className="col-name header-col">O'qituvchi</div>

                <div className="col-phone header-col">Telefon</div>

                <div className="col-group header-col">Guruhlar</div>

                <div className="col-action header-col">Amallar</div>
              </div>

              {teachers.length === 0 ? (
                <div className="empty-state">Hozircha o'qituvchilar yo'q</div>
              ) : (
                teachers.map((t) => (
                  <div key={t.id} className="table-row">
                    <div
                      className="col-name"
                      onClick={() => {
                        setCurrentTeacher(t);
                        setView("profile");
                      }}
                    >
                      <strong>
                        {t.name} {t.surname}
                      </strong>
                    </div>

                    {/* FORMATLASH */}

                    <div className="col-phone">
                      +998 {formatPhoneNumber(t.phone)}
                    </div>

                    <div className="col-group">1 guruh</div>

                    <div className="col-action">
                      <div
                        className="menu-trigger"
                        onClick={() =>
                          setActiveMenuId(activeMenuId === t.id ? null : t.id)
                        }
                      >
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </div>

                      {activeMenuId === t.id && (
                        <div className="context-menu">
                          <div onClick={() => openEdit(t)}>
                            <i className="fa-solid fa-pen text-orange"></i>{" "}
                            Tahrirlash
                          </div>

                          <div
                            onClick={() => {
                              setCurrentTeacher(t);
                              setIsSmsOpen(true);
                            }}
                          >
                            <i className="fa-solid fa-comment text-green"></i>{" "}
                            SMS yuborish
                          </div>

                          <div
                            onClick={() => {
                              setCurrentTeacher(t);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <i className="fa-solid fa-trash text-red"></i>{" "}
                            O'chirish
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* --- PROFIL KO'RINISHI --- */}

        {view === "profile" && currentTeacher && (
          <div className="profile-page">
            <div className="profile-header">
              <h1>
                {currentTeacher.name} {currentTeacher.surname}
              </h1>
            </div>

            <div className="tabs">
              <span
                className={profileTab === "profile" ? "tab active" : "tab"}
                onClick={() => setProfileTab("profile")}
              >
                PROFIL
              </span>

              <span
                className={profileTab === "history" ? "tab active" : "tab"}
                onClick={() => setProfileTab("history")}
              >
                Tarix
              </span>

              <span
                className={profileTab === "salary" ? "tab active" : "tab"}
                onClick={() => setProfileTab("salary")}
              >
                Ish haqi
              </span>
            </div>

            {profileTab === "profile" && (
              <div className="profile-grid">
                {/* 1-USTUN: Shaxsiy ma'lumot */}

                <div className="card profile-info-card">
                  <div className="card-actions">
                    <i className="fa-regular fa-flag text-green rounded-icon"></i>

                    <i
                      className="fa-solid fa-pen text-orange rounded-icon"
                      onClick={() => openEdit(currentTeacher)}
                    ></i>
                  </div>

                  <div className="avatar-area">
                    <img
                      src={
                        currentTeacher.photo ||
                        "https://via.placeholder.com/150"
                      }
                      alt="Avatar"
                      className="big-avatar"
                    />

                    <h3>
                      {currentTeacher.name} {currentTeacher.surname}
                    </h3>
                  </div>

                  <div className="info-list">
                    <p className="label-title">Rollari</p>

                    <div className="tags">
                      <span className="pill orange-pill">Teacher</span>
                    </div>

                    <p className="label-title">Filiallar</p>

                    <div className="tags">
                      <span className="pill red-pill">CRM2</span>
                    </div>

                    <hr className="divider" />

                    <p>
                      Telefon:{" "}
                      <span className="phone-text">
                        +998 {formatPhoneNumber(currentTeacher.phone)}
                      </span>
                    </p>

                    <p>Tug'ilgan kun: {currentTeacher.dob}</p>
                  </div>
                </div>

                {/* 2-USTUN: Guruhlar ro'yxati */}

                <div className="card">
                  <h3>Guruhlar</h3>

                  <div className="group-list-item">
                    <div className="group-left">
                      <span className="group-badge">MY Kimyo #1</span>

                      <span className="group-subject">Kimyo</span>
                    </div>

                    <div className="group-right">
                      <span className="student-count">3</span>

                      <span className="group-time">Toq kunlar • 07:00</span>
                    </div>
                  </div>
                </div>

                {/* 3-USTUN: Guruh tafsiloti */}

                <div className="card group-detail-card">
                  <div className="detail-header">
                    <span className="group-badge">MY Kimyo #1</span>

                    <h2>Kimyo</h2>

                    <p>
                      Xona: <strong>Oxford xonasi</strong>
                    </p>

                    <p>
                      Boshlash: <strong>07:00</strong>
                    </p>
                  </div>

                  <div className="students-small-list">
                    <div className="st-row">
                      Aniken Skywalker <span>(99) 200-00-01</span>
                    </div>

                    <div className="st-row">
                      Bekzod Saydaliyev <span>(99) 826-46-43</span>
                    </div>

                    <div className="st-row">
                      Akbar Ibrohimov <span>(90) 199-19-19</span>
                    </div>
                  </div>

                  <button className="btn-outline">Guruhga o'tish →</button>
                </div>
              </div>
            )}

            {profileTab === "history" && (
              <div className="empty-tab">Ma'lumot yo'q (Tarix bo'sh)</div>
            )}

            {profileTab === "salary" && (
              <div className="salary-container">
                <div className="salary-total">Jami: 0</div>

                <table className="salary-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Guruh / Kurs</th>
                      <th>Talaba</th>
                      <th>Darslar / Keldi...</th>
                      <th>Belgilangan miqdor</th>
                      <th>Hisoblangan miqdor</th>
                      <th>Hisoblash usuli</th>
                      <th>Maosh turi</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td
                        colSpan="8"
                        style={{ textAlign: "center", padding: "30px" }}
                      >
                        Bo'sh
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- O'NG DRAWER (Qo'shish va Tahrirlash) --- */}

      {isDrawerOpen && (
        <>
          <div className="overlay" onClick={closeDrawer}></div>

          <div className="drawer right">
            <div className="drawer-header">
              <h3>
                {formData.id
                  ? "O'qituvchini tahrirlash"
                  : "Yangi o'qituvchi qo'shish"}
              </h3>

              <span className="close-x" onClick={closeDrawer}>
                &times;
              </span>
            </div>

            <div className="drawer-body">
              <label>Telefon</label>

              <div
                className={`input-wrapper ${
                  errors.phone ? "error-border" : ""
                }`}
              >
                <span className="prefix">+998</span>

                <input
                  type="text"
                  name="phone"
                  value={formatInputPhone(formData.phone)}
                  onChange={handleChange}
                  placeholder="XX YYY ZZ VV"
                  maxLength={13}
                />
              </div>

              <div className="row">
                <div className="col">
                  <label>Ism</label>

                  <input
                    type="text"
                    name="name"
                    className={errors.name ? "error-border" : ""}
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col">
                  <label>Familiya</label>

                  <input
                    type="text"
                    name="surname"
                    className={errors.surname ? "error-border" : ""}
                    value={formData.surname}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <label>Tug'ilgan sana</label>

              <input
                type="date"
                name="dob"
                min="1800-01-01"
                max="2080-12-31"
                className={errors.dob ? "error-border" : ""}
                value={formData.dob}
                onChange={handleChange}
              />

              <label>Jins</label>

              <div
                className={`radio-group ${errors.gender ? "error-text" : ""}`}
              >
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Erkak"
                    checked={formData.gender === "Erkak"}
                    onChange={handleChange}
                  />{" "}
                  Erkak
                </label>

                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Ayol"
                    checked={formData.gender === "Ayol"}
                    onChange={handleChange}
                  />{" "}
                  Ayol
                </label>
              </div>

              <label>Foto</label>

              <div className="file-box">
                <input
                  type="text"
                  readOnly
                  placeholder={
                    formData.fileName || "Hech qanday fayl tanlanmadi"
                  }
                />

                <label htmlFor="fileUpload" className="browse-btn">
                  Browse
                </label>

                <input
                  id="fileUpload"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFile}
                />
              </div>

              {/* Parol qo'shish / Inputni yashirish funksiyasi */}

              <div className="password-toggle-area">
                <p
                  onClick={togglePasswordInput}
                  className="password-toggle-text"
                >
                  {showPasswordInput
                    ? "- Parol qo'shishni bekor qilish"
                    : "+ Parol qo'shish"}
                </p>

                {showPasswordInput && (
                  <div
                    className={`input-wrapper password-input-field ${
                      errors.password ? "error-border" : ""
                    }`}
                  >
                    <input
                      type={showPassword}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      maxLength={6}
                      placeholder="******"
                    />

                    {/* Ko'z belgisi o'ng tomonga qadalgan */}

                    <i
                      className={`fa-solid ${
                        showPassword === "password" ? "fa-eye-slash" : "fa-eye"
                      } eye-icon`}
                      onClick={togglePasswordVisibility}
                    ></i>
                  </div>
                )}

                {/* Parol majburiy ekanligi haqida xato xabari (agar bo'sh bo'lsa) */}

                {errors.password && showPasswordInput && (
                  <p className="error-text">Parol kiritish majburiy.</p>
                )}
              </div>

              <button className="save-btn" onClick={handleSave}>
                Saqlash
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- SMS YUBORISH OYNASI (Avvalgi kabi) --- */}

      {isSmsOpen && (
        <>
          <div className="overlay" onClick={() => setIsSmsOpen(false)}></div>

          <div className="drawer right">
            <div className="drawer-header">
              <h3>O'qituvchiga SMS yuboring</h3>

              <span className="close-x" onClick={() => setIsSmsOpen(false)}>
                &times;
              </span>
            </div>

            <div className="drawer-body">
              <p>Yuboruvchi: MODME</p>

              <textarea
                rows="5"
                placeholder="Xabarni kiriting"
                className="sms-area"
              ></textarea>

              <div className="sms-info">0 ta belgi (~ 1 SMS)</div>

              <button className="save-btn" onClick={handleSendSMS}>
                SMS yuborish
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- O'CHIRISH MODALI (Avvalgi kabi) --- */}

      {isDeleteModalOpen && (
        <div className="modal-bg">
          <div className="modal-box">
            <h3>Ogohlantirish</h3>

            <p>Rostdan ham shu o'qituvchini o'chirasizmi?</p>

            <div className="modal-btns">
              <button
                className="btn-cancel"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Bekor qilish
              </button>

              <button className="btn-delete" onClick={handleDelete}>
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Xabar */}

      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
};

export default TeachersPlatform;
