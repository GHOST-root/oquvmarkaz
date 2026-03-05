import React, { useState, useEffect } from 'react';
import './AddPaymentModal.css';

const PaymentModal = ({ isOpen, onClose, onSuccess, student }) => {
  const [formData, setFormData] = useState({
    amount: '',
    paymentType: 'Naqd pul',
    date: new Date().toISOString().split('T')[0], // Bugungi sana
    note: ''
  });

  // Modal ochilganda formani tozalash
  useEffect(() => {
    if (isOpen) {
      setFormData({
        amount: '',
        paymentType: 'Naqd pul',
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
    }
  }, [isOpen]);

  if (!isOpen || !student) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const amountNum = Number(formData.amount);
    if (!amountNum || amountNum <= 0) {
      alert("Iltimos, to'g'ri summa kiriting!");
      return;
    }
    
    // Saqlash bosilganda asosiy komponentga ma'lumotlarni jo'natamiz
    onSuccess(student.id, amountNum, formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="payment-modal-container" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>To'lov qo'shish</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="payment-modal-body">
          
          <div className="payment-form-group">
            <label>Talaba</label>
            <input 
              type="text" 
              className="payment-form-control" 
              value={student.name} 
              disabled 
            />
          </div>

          <div className="payment-form-group" style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '14px', color: '#555' }}>Balans</span>
            <span className="payment-balance-badge">{student.balance} UZS</span>
          </div>

          <div className="payment-form-group">
            <label>Guruh</label>
            <select className="payment-form-control">
              {/* Talabaga tegishli guruh ma'lumotlari */}
              <option>{student.groups}: {student.time}</option>
            </select>
          </div>

          <div className="payment-form-group">
            <label>To'lov usuli</label>
            <div className="payment-methods-grid">
              {['Naqd pul', 'Click', 'Plastic kartasi', 'Uzum', 'Bank hisobi', 'Humo', 'Payme'].map((method) => (
                <label key={method} className="payment-radio-label">
                  <input 
                    type="radio" 
                    name="paymentType" 
                    value={method} 
                    checked={formData.paymentType === method}
                    onChange={handleChange}
                  /> {method}
                </label>
              ))}
            </div>
          </div>

          <div className="payment-form-group">
            <label>Miqdor</label>
            <input 
              type="number" 
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="payment-form-control" 
            />
          </div>

          <div className="payment-form-group">
            <label>Sana</label>
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="payment-form-control" 
            />
          </div>

          <div className="payment-form-group">
            <label>Izoh</label>
            <textarea 
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="payment-form-control" 
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          <div>
            <button className="payment-save-btn" onClick={handleSubmit}>
              Saqlash
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentModal;