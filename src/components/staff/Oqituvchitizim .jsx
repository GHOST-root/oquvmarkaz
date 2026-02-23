import React, { useState, useRef } from 'react';
import './staff.css'

const Xodimlar = () => {
  const [users, setUsers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSMSOpen, setIsSMSOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', phone: '', password: '', roles: [], 
    birthDate: '', gender: 'Erkak', photoName: '', photoUrl: '', position: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Telefon raqamni formatlash: 99 123 45 67
  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 9) val = val.slice(0, 9);
    
    // Raqamlar orasini ochish (formatlash)
    let formatted = val;
    if (val.length > 2) formatted = val.slice(0, 2) + ' ' + val.slice(2);
    if (val.length > 5) formatted = formatted.slice(0, 6) + ' ' + val.slice(5);
    if (val.length > 7) formatted = formatted.slice(0, 9) + ' ' + val.slice(7);
    
    setFormData({ ...formData, phone: formatted });
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({
      ...prev,
      roles: [role]
    }));
  };
  
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ 
        ...formData, 
        photoName: file.name, 
        photoUrl: URL.createObjectURL(file) 
      });
    }
  };

  const handleSave = () => {
    if (!formData.name || formData.phone.length < 12 || formData.password.length < 6) {
      setErrors({ name: !formData.name, phone: formData.phone.length < 12, password: formData.password.length < 6 });
      return;
    }
    setUsers([...users, { ...formData, id: Date.now() }]);
    setIsFormOpen(false);
    setFormData({ name: '', phone: '', password: '', roles: [], birthDate: '', gender: 'Erkak', photoName: '', photoUrl: '', position: '' });
  };

  return (
    <div className="main-wrapper">
      <div className="top-bar">
        <h2>Xodimlar</h2>
        <div className="top-btns">
          <button className="btn-add" onClick={() => setIsFormOpen(true)}>Yangisini qo'shish</button>
          <button className="btn-import"><i className="fas fa-file-import"></i> Import</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>Ism</th>
              <th>Roli</th>
              <th>Lavozimi</th>
              <th>Telefon</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id.toString().slice(-6)}</td>
                <td className="name-cell">
                  <div className="avatar-mini">
                    {u.photoUrl ? <img src={u.photoUrl} alt="" /> : <i className="fas fa-user"></i>}
                  </div>
                  {u.name}
                </td>
                <td>{u.roles.join(', ')}</td>
                <td>{u.position || '—'}</td>
                <td>+998 {u.phone}</td>
                <td className="actions-cell">
                   <i className="fas fa-envelope sms-icon" onClick={() => setIsSMSOpen(true)}></i>
                   <i className="fas fa-trash trash-icon" onClick={() => setDeleteId(u.id)}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* XODIM QO'SHISH OYNASI */}
      {isFormOpen && (
        <div className="drawer-overlay">
          <div className="drawer-content">
            <div className="drawer-header">
              <h4>Yangi xodimlarni qo'shing</h4>
              <button className="close-x" onClick={() => setIsFormOpen(false)}>&times;</button>
            </div>
            <div className="drawer-body">
              <div className="field">
                <label>Ism</label>
                <input type="text" className={errors.name ? 'err-inp' : ''} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="field">
                <label>Telefon</label>
                <div className={`input-group ${errors.phone ? 'err-inp' : ''}`}>
                  <span className="prefix">+998</span>
                  <input type="text" value={formData.phone} onChange={handlePhoneChange} placeholder="99 123 45 67" />
                </div>
              </div>
              <div className="field">
                <label>Parol</label>
                <div className={`input-group ${errors.password ? 'err-inp' : ''}`}>
                  <input type={showPass ? "text" : "password"} maxLength="6" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  <i className={`fas ${showPass ? 'fa-eye' : 'fa-eye-slash'} eye-btn`} onClick={() => setShowPass(!showPass)}></i>
                </div>
              </div>
              <div className="field">
                <label>Lavozimi</label>
                <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
              </div>
              {/* TUG'ILGAN SANA QISMI */}
<div className="field">
  <label>Tug'ilgan sana</label>
  <input 
    type="date" 
    className="date-input" 
    min="1500-01-01" 
    max="2080-12-31" 
    value={formData.birthDate}
    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
  />
</div>

{/* JINSNI TANLASH QISMI */}
<div className="field">
  <label>Jins</label>
  <div className="gender-row">
    <label className="radio-label">
      <input 
        type="radio" 
        name="gender" 
        value="Erkak" 
        checked={formData.gender === 'Erkak'} 
        onChange={(e) => setFormData({...formData, gender: e.target.value})} 
      />
      <span>Erkak</span>
    </label>
    <label className="radio-label">
      <input 
        type="radio" 
        name="gender" 
        value="Ayol" 
        checked={formData.gender === 'Ayol'} 
        onChange={(e) => setFormData({...formData, gender: e.target.value})} 
      />
      <span>Ayol</span>
    </label>
  </div>
</div>
              <div className="field">
                <label>Rol</label>
                <div className="roles-container">
                  {['CEO', 'Branch Director', 'Administrator', 'Administrator 2', 'Limited Administrator', 'Teacher', 'Marketer', 'Cashier'].map(r => (
                    <label key={r} className="checkbox-item">
                      <input type="checkbox" checked={formData.roles.includes(r)} onChange={() => handleRoleChange(r)} />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>Foto</label>
                <div className="file-box">
                  <input type="text" readOnly value={formData.photoName} placeholder="Hech qanday fayl tanlanmadi" />
                  <button onClick={() => fileInputRef.current.click()}>Browse</button>
                  <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                </div>
              </div>
            </div>
            <div className="drawer-footer">
              <button className="btn-save" onClick={handleSave}>Saqlash</button>
            </div>
          </div>
        </div>
      )}

      {/* SMS YUBORISH OYNASI */}
      {isSMSOpen && (
        <div className="drawer-overlay">
          <div className="drawer-content">
            <div className="drawer-header">
              <h4>SMS Yuborish</h4>
              <button className="close-x" onClick={() => setIsSMSOpen(false)}>&times;</button>
            </div>
            <div className="drawer-body">
              <p className="modem-text">Yuboruvchi: <strong>Modem</strong></p>
              <textarea className="sms-input" placeholder="SMS matnini kiriting..."></textarea>
            </div>
            <div className="drawer-footer">
              <button className="btn-save">Jo'natish</button>
            </div>
          </div>
        </div>
      )}

      {/* O'CHIRISH MODALI */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <i className="fas fa-exclamation-triangle warn-icon"></i>
            <h3>Ogohlantirish!</h3>
            <p>Ushbu xodimni ro'yxatdan o'chirmoqchimisiz?</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setDeleteId(null)}>Bekor qilish</button>
              <button className="confirm-btn" onClick={() => {
                setUsers(users.filter(u => u.id !== deleteId));
                setDeleteId(null);
              }}>O'chirish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Xodimlar;