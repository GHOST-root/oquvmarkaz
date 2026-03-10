import React, { useState, useEffect } from 'react';
import './AddStudentModal.css';

// --- FAKE BACKEND (Guruhlar ro'yxati) ---
// Keyinchalik buni axios.get('api/groups') orqali olasiz
const mockGroupsData = [
  { id: 1, name: "1-guruh - Master Ugvey (Intensive pro)" },
  { id: 2, name: "AK Dizayn #22 - Abror Karimov" },
  { id: 3, name: "BA Front-end #2 - Bekzod Akbararov" },
  { id: 4, name: "FA Geografiya #1 - Faxriddin Abrorov" },
  { id: 5, name: "MY Kimyo #1 - Master Yoda" },
  { id: 6, name: "Roboto texnika #1 SJ - Steve Jobs" }
];

const AddStudentModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  // 1. Yangi ochilgan qo'shimcha maydonlarni kuzatib boruvchi state
  const [activeExtraFields, setActiveExtraFields] = useState([]);

  // 2. Guruhni tanlash maydonini ko'rsatish/yashirish uchun state
  const [showGroupSelect, setShowGroupSelect] = useState(false);
  const [availableGroups, setAvailableGroups] = useState([]); // Backenddan keladigan guruhlar

  // 3. FormData ni qo'shimcha maydonlar bilan kengaytiramiz
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    birthDate: '',
    gender: 'Erkak',
    note: '',
    extraPhone: '',
    password: '',
    parentName: '',
    email: '',
    telegram: '',
    school: '',
    address: '',
    archive: '',
    groupId: '' // YANGI: Tanlangan guruh ID'sini saqlash uchun
  });

  // Modal yopilganda formani tozalash va ochilganda guruhlarni "Fetch" qilish
  useEffect(() => {
    if (isOpen) {
      // Backend ulanganida shu joyda axios.get() ishlatiladi
      setAvailableGroups(mockGroupsData); 
    } else {
      // Yopilganda tozalash
      setActiveExtraFields([]);
      setShowGroupSelect(false);
      setFormData({
        phone: '', name: '', birthDate: '', gender: 'Erkak', note: '',
        extraPhone: '', password: '', parentName: '', email: '', telegram: '', school: '', address: '', archive: '', groupId: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Ikonkalar va ularga tegishli maydonlar konfiguratsiyasi
  const extraContactsConfig = [
    { id: 'extraPhone', icon: 'fa-solid fa-phone', label: "Qo'shimcha telefon", type: 'text', placeholder: "99 123 45 67" },
    { id: 'password', icon: 'fa-solid fa-key', label: "Parol", type: 'text', placeholder: "Parol kiriting" },
    { id: 'parentName', icon: 'fa-regular fa-user', label: "Ota-onasi (F.I.SH)", type: 'text', placeholder: "Ism familiyasi" },
    { id: 'email', icon: 'fa-regular fa-envelope', label: "Email", type: 'email', placeholder: "example@mail.com" },
    { id: 'telegram', icon: 'fa-regular fa-paper-plane', label: "Telegram username", type: 'text', placeholder: "@username" },
    { id: 'school', icon: 'fa-solid fa-graduation-cap', label: "O'qish / Ish joyi", type: 'text', placeholder: "Maktab yoki Universitet" },
    { id: 'address', icon: 'fa-solid fa-location-dot', label: "Manzil", type: 'text', placeholder: "Yashash manzili" },
    { id: 'archive', icon: 'fa-solid fa-box-archive', label: "Qo'shimcha ma'lumot", type: 'text', placeholder: "Boshqa ma'lumotlar" }
  ];

  const toggleExtraField = (id) => {
    setActiveExtraFields(prev => 
      prev.includes(id) ? prev.filter(fieldId => fieldId !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        // Tanlangan guruhni obyektidan qidirib topish (nomini olish uchun)
        const selectedGroupObj = availableGroups.find(g => String(g.id) === String(formData.groupId));
        const groupNameForDisplay = selectedGroupObj ? selectedGroupObj.name.split(' - ')[0] : 'Biriktirilmagan';

        const newStudent = {
          id: Date.now(),
          name: formData.name || 'Ismi kiritilmadi',
          phone: `+998 ${formData.phone}`,
          groups: groupNameForDisplay, // Jadvalda ko'rinishi uchun
          groupId: formData.groupId || null, // Backendga jo'natish uchun haqiqiy ID
          time: 'Belgilanmagan',
          teacher: 'Biriktirilmagan',
          date: formData.birthDate || 'Sana yo\'q',
          balance: 0,
          coins: 0,
          note: formData.note || 'Izoh yo\'q',
          extraDetails: { ...formData } 
        };

        const existingData = JSON.parse(localStorage.getItem('studentsList') || '[]');
        const updatedData = [...existingData, newStudent];
        localStorage.setItem('studentsList', JSON.stringify(updatedData));

        if (onSuccess) onSuccess(); 
        onClose(); 
      } catch (error) {
        console.error("Saqlashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 3000 }}>
      <div className="modal-container bg-white rounded-3 shadow" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        
        <div className="modal-header px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="m-0 fw-semibold">Yangi foydalanuvchi qo'shish</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="modal-body p-4">
          
          <div className="form-group mb-3">
            <label className="form-label text-muted small mb-1">Telefon</label>
            <div className="form-control d-flex align-items-center p-0 overflow-hidden">
              <span className="bg-light countrycode text-muted px-2 py-2 border-end" style={{ userSelect: 'none' }}>
                +998
              </span>
              <input 
                type="text" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                className="border-0 shadow-none flex-grow-1 px-2 py-2" 
                placeholder="90 123 45 67" 
                style={{ outline: 'none', backgroundColor: 'transparent' }} 
              />
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="form-label text-muted small mb-1">Ism</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="Ism familiyani kiriting" />
          </div>

          <div className="form-group mb-3">
            <label className="form-label text-muted small mb-1">Tug'ilgan sana</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="form-control text-muted" />
          </div>

          <div className="form-group mb-3">
            <label className="form-label text-muted small mb-1">Jins</label>
            <div className="d-flex gap-4 mt-1">
              <label className="d-flex align-items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" value="Erkak" checked={formData.gender === 'Erkak'} onChange={handleChange} style={{accentColor: '#F27A21'}}/> Erkak
              </label>
              <label className="d-flex align-items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" value="Ayol" checked={formData.gender === 'Ayol'} onChange={handleChange} style={{accentColor: '#F27A21'}}/> Ayol
              </label>
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="form-label text-muted small mb-1">Izoh</label>
            <textarea name="note" value={formData.note} onChange={handleChange} className="form-control" rows="2" style={{resize: 'none'}} placeholder="Talaba haqida qisqacha..." />
          </div>

          {/* Qo'shimcha aloqa Ikonkalari */}
          <div className="form-group mb-4">
            <label className="form-label text-muted small mb-2">Qo'shimcha aloqa</label>
            <div className="d-flex flex-wrap gap-2">
              {extraContactsConfig.map((item) => (
                <button 
                  key={item.id}
                  type="button"
                  title={item.label}
                  onClick={() => toggleExtraField(item.id)}
                  className={`btn btn-sm d-flex align-items-center justify-content-center rounded-circle border ${
                    activeExtraFields.includes(item.id) ? 'bg-warning text-white border-warning' : 'bg-light text-secondary'
                  }`}
                  style={{ width: '38px', height: '38px', transition: '0.2s' }}
                >
                  <i className={item.icon}></i>
                </button>
              ))}
            </div>
          </div>

          {/* Dinamik tarzda ochiladigan Inputlar */}
          {activeExtraFields.length > 0 && (
            <div className="p-3 bg-light rounded-3 mb-4 border">
              <h6 className="fs-6 mb-3 text-dark">Qo'shimcha ma'lumotlar</h6>
              {activeExtraFields.map((fieldId) => {
                const config = extraContactsConfig.find(c => c.id === fieldId);
                return (
                  <div className="form-group mb-3" key={fieldId}>
                    <label className="form-label text-muted small mb-1">{config.label}</label>
                    <input 
                      type={config.type} 
                      name={fieldId} 
                      value={formData[fieldId]} 
                      onChange={handleChange} 
                      className="form-control form-control-sm" 
                      placeholder={config.placeholder} 
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* ================= YANGI: GURUH TANLASH QISMI ================= */}
          {showGroupSelect && (
            <div className="form-group mb-3 p-3 rounded border" style={{ backgroundColor: '#f0f9fa', borderColor: '#b2e2e3' }}>
              <label className="form-label text-dark small mb-2 fw-medium">Guruhni tanlang</label>
              <select 
                name="groupId" 
                value={formData.groupId} 
                onChange={handleChange} 
                className="form-select shadow-sm"
              >
                <option value="">-- Guruh tanlang --</option>
                {availableGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="d-flex gap-3 mb-4">
            <button 
              type="button" 
              className="btn btn-link text-decoration-none p-0 fw-medium" 
              style={{color: '#60C3C5', fontSize: '14px'}}
              onClick={() => setShowGroupSelect(!showGroupSelect)}
            >
              {showGroupSelect ? "- Guruh tanlashni bekor qilish" : "+ Guruhga qo'shish"}
            </button>
            <button type="button" className="btn btn-link text-decoration-none p-0" style={{color: '#60C3C5', fontSize: '14px'}} onClick={() => toggleExtraField('password')}>+ Parol qo'shing</button>
          </div>

          <div>
            <button 
              className="btn w-100 fw-medium shadow-sm" 
              style={{backgroundColor: '#60C3C5', color: 'white', padding: '10px'}} 
              onClick={handleSubmit} 
              disabled={loading}
            >
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;