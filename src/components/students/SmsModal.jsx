import React, { useState, useEffect } from 'react';

const SmsModal = ({ isOpen, onClose, selectedCount, onSuccess }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) setMessage('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!message.trim()) {
      alert("Iltimos, xabar matnini kiriting!");
      return;
    }
    onSuccess(message);
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose} 
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}
    >
      <div 
        className="bg-white rounded-3 shadow p-4" 
        onClick={(e) => e.stopPropagation()} 
        style={{ width: '100%', maxWidth: '450px' }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0 fw-semibold text-dark">
            SMS yuborish <span className="text-muted fs-6">({selectedCount} ta talaba)</span>
          </h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="mb-4">
          <label className="form-label text-muted" style={{fontSize: '13px'}}>Xabar matni</label>
          <textarea
            className="form-control"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hurmatli talaba, sizning darsingiz..."
            style={{resize: 'none', fontSize: '14px'}}
          ></textarea>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-light border" onClick={onClose}>Bekor qilish</button>
          <button className="btn" style={{backgroundColor: '#60C3C5', color: 'white'}} onClick={handleSubmit}>
            <i className="fa-regular fa-paper-plane me-2"></i> Yuborish
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmsModal;