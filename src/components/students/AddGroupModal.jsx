import React, { useState, useEffect } from 'react';
import './AddGroupModal.css';

const AddGroupModal = ({ isOpen, onClose, onSuccess, selectedCount }) => {
  const [formData, setFormData] = useState({
    groupName: '',
    joinDate: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        groupName: '',
        joinDate: new Date().toISOString().split('T')[0] // Bugungi sana
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.groupName || !formData.joinDate) {
      alert("Iltimos, guruh va sanani tanlang!");
      return;
    }
    onSuccess(formData);
  };

  return (
    <div className="group-modal-overlay" onClick={onClose}>
      <div className="group-modal-container" onClick={(e) => e.stopPropagation()}>
        
        <div className="group-modal-header">
          <h2>Talabani guruhga qo'shish {selectedCount > 1 ? `(${selectedCount} ta)` : ''}</h2>
          <button className="close-btn" onClick={onClose} style={{border:'none', background:'none', cursor:'pointer', fontSize: '18px', color: '#888'}}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="group-modal-body">
          
          {/* Guruh tanlash dropdown */}
          <select 
            className="group-form-control"
            value={formData.groupName}
            onChange={(e) => setFormData({...formData, groupName: e.target.value})}
          >
            <option value="" disabled>Guruhni tanlang</option>
            <option value="[BA Front-end #2] Front-end (Bekzod Akbararov • 08:00)">[BA Front-end #2] Front-end (Bekzod Akbararov • 08:00)</option>
            <option value="Figma boshlang'ich: Dizayn Azimjon Ro'ziyev (Juft 07:00)">Figma boshlang'ich: Dizayn (Juft 07:00)</option>
            <option value="Ingliz tili - IELTS (Dushanba-Juma 18:00)">Ingliz tili - IELTS (Dushanba-Juma 18:00)</option>
          </select>

          <div className="group-hint-text">
            Guruh boshlanish sanasi: 01.02.2025
          </div>

          {/* Sana tanlash */}
          <div style={{fontSize: '13px', color: '#555', marginBottom: '8px'}}>Sanadan boshlab</div>
          <input 
            type="date" 
            className="group-form-control"
            value={formData.joinDate}
            onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
            style={{marginBottom: '24px'}}
          />

          <button className="group-save-btn" onClick={handleSubmit}>
            Talabani guruhga qo'shish
          </button>

        </div>
      </div>
    </div>
  );
};

export default AddGroupModal;