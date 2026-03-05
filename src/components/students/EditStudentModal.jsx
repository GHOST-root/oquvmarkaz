import React, { useState, useEffect } from 'react';
import './EditStudentModal.css';

const EditStudentModal = ({ isOpen, onClose, onSuccess, student }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    groups: '',
    time: '',
    teacher: '',
    date: '',
    balance: 0,
    coins: 0,
    note: ''
  });

  // Modal ochilganda va student prop kelganda formani to'ldiramiz
  useEffect(() => {
    if (student && isOpen) {
      setFormData({
        name: student.name || '',
        // Agar raqam boshida +998 bo'lsa, uni kesib tashlaymiz (prefix alohida turgani uchun)
        phone: student.phone ? student.phone.replace('+998 ', '').replace('+998', '').trim() : '',
        groups: student.groups || '',
        time: student.time || '',
        teacher: student.teacher || '',
        date: student.date || '',
        balance: student.balance || 0,
        coins: student.coins || 0,
        note: student.note || ''
      });
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const updatedStudent = {
      ...student,
      name: formData.name,
      phone: `+998 ${formData.phone}`,
      groups: formData.groups,
      time: formData.time,
      teacher: formData.teacher,
      date: formData.date,
      balance: Number(formData.balance),
      coins: Number(formData.coins),
      note: formData.note
    };
    
    onSuccess(updatedStudent); // O'zgartirilgan ma'lumotni orqaga qaytaramiz
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-modal-container" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>Talaba ma'lumotlarini tahrirlash</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="edit-modal-body">
          
          <div className="edit-form-group">
            <label>Ism va Familiya</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="edit-form-control" />
          </div>

          <div className="edit-form-group">
            <label>Telefon</label>
            <div className="edit-input-wrapper">
              <span className="edit-prefix">+998</span>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="edit-form-control" />
            </div>
          </div>

          <div className="edit-row">
            <div className="edit-form-group">
              <label>Guruh</label>
              <input type="text" name="groups" value={formData.groups} onChange={handleChange} className="edit-form-control" />
            </div>
            <div className="edit-form-group">
              <label>Vaqt</label>
              <input type="text" name="time" value={formData.time} onChange={handleChange} className="edit-form-control" />
            </div>
          </div>

          <div className="edit-form-group">
            <label>O'qituvchi</label>
            <input type="text" name="teacher" value={formData.teacher} onChange={handleChange} className="edit-form-control" />
          </div>

          <div className="edit-form-group">
            <label>Mashg'ulot sanalari</label>
            <input type="text" name="date" value={formData.date} onChange={handleChange} className="edit-form-control" />
          </div>

          <div className="edit-row">
            <div className="edit-form-group">
              <label>Balans</label>
              <input type="number" name="balance" value={formData.balance} onChange={handleChange} className="edit-form-control" />
            </div>
            <div className="edit-form-group">
              <label>Coins</label>
              <input type="number" name="coins" value={formData.coins} onChange={handleChange} className="edit-form-control" />
            </div>
          </div>

          <div className="edit-form-group">
            <label>Izoh</label>
            <textarea name="note" value={formData.note} onChange={handleChange} className="edit-form-control" style={{minHeight: '80px', resize: 'vertical'}} />
          </div>

          <div>
            <button className="edit-save-btn" onClick={handleSubmit}>
              O'zgarishlarni saqlash
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditStudentModal;