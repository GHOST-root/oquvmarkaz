import React, { useState } from 'react';
import './Profile.css';
import EditStudentModal from './EditStudentModal';
import PaymentModal from './PaymentModal';
import ReceiptModal from './ReceiptModal';
import AddGroupModal from './AddGroupModal';
import SmsModal from './SmsModal';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('guruhlar');
  const [receiptPayment, setReceiptPayment] = useState(null); // Chek uchun state
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  
  // --- SMS TARIXI STATI ---
  const [smsList, setSmsList] = useState([
    {
      id: 1,
      date: '08.05.2025',
      time: '14:30',
      message: "Hurmatli Bekzod, bugun sizning darsingiz soat 15:00 ga ko'chirildi.",
      status: 'Yuborildi'
    }
  ]);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);

  // 2. SMS YUBORISH MODALINI OCHISH
  const handleSendSMS = () => {
    setIsSmsModalOpen(true);
  };

  // SMS NI SAQLASH VA RO'YXATGA QO'SHISH
  const confirmSendSms = (message) => {
    const newSms = {
      id: Date.now(),
      date: new Date().toLocaleDateString('ru-RU'),
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      message: message,
      status: 'Yuborildi'
    };
    
    setSmsList(prev => [newSms, ...prev]); // Yangi xabarni eng tepaga qo'shish
    setIsSmsModalOpen(false); // Modalni yopish
    showToast("SMS muvaffaqiyatli yuborildi!");
  };

  // --- XABARNOMA (TOAST) ---
  const [toast, setToast] = useState({ show: false, message: '' });
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // --- TALABA MA'LUMOTI ---
  const [student, setStudent] = useState({
    id: 1363191,
    name: 'Bekzod Saydaliyev',
    phone: '99 826 46 43',
    balance: -328022,
    coins: 0,
    groups: "Figma boshlang'ich",
    teacher: "Azimjon Ro'ziyev",
    date: '08.05.2025',
    note: 'Eslatma mavjud emas'
  });

  // --- TO'LOVLAR TARIXI STATI ---
  const [paymentsList, setPaymentsList] = useState([
    {
      id: 1,
      date: '08.05.2025',
      type: 'tizim',
      amount: 7692.31,
      note: "To'lov kiritildi",
      employee: 'Hojmurod Nasriddinov',
      time: '08.05.2025 13:30:36'
    }
  ]);

  // --- MODALLAR UCHUN STATELAR ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // 1. TAHRIRLASH (Edit)
  const handleEditSave = (updatedStudent) => {
    setStudent(updatedStudent);
    showToast("Ma'lumotlar muvaffaqiyatli tahrirlandi!");
  };

  // // 2. SMS YUBORISH
  // const handleSendSMS = () => {
  //   const message = prompt("Talabaga yuboriladigan SMS matnini kiriting:");
  //   if(message) showToast("SMS muvaffaqiyatli yuborildi!");
  // };

  // 3. ESLATMA QO'SHISH
  const handleAddNote = () => {
    const newNote = prompt("Yangi eslatma kiriting:");
    if(newNote) {
      setStudent({...student, note: newNote});
      showToast("Eslatma qo'shildi!");
    }
  };

  // 4. O'CHIRISH (Delete)
  const confirmDelete = () => {
    setIsDeleteOpen(false);
    showToast("Talaba tizimdan o'chirildi!");
  };

  // 5. GURUHGA QO'SHISH / KO'CHIRISH
    const handleTransfer = () => {
      setIsGroupModalOpen(true);
    };

  // 7. MUZLATISH (Freeze)
  const handleFreeze = () => {
    if(window.confirm("Talabani muzlatishni tasdiqlaysizmi?")) {
      showToast("Talaba muzlatildi!");
    }
  };

  // 8. QARZDOR HOLATGA O'TKAZISH / ARXIVLASH
  const handleDebtor = () => {
    if(window.confirm("Talabani qarzdor/arxiv holatiga o'tkazasizmi?")) {
      showToast("Talaba holati o'zgartirildi!");
    }
  };

// Saqlash

  const confirmAddToGroup = (groupData) => {
  // Tanlangan uzun textdan faqat guruh nomini ajratib olamiz
    const newGroupName = groupData.groupName.split('(')[0].trim();
    
    // Talaba ma'lumotlarini yangilaymiz
    setStudent(prev => ({
      ...prev,
      groups: newGroupName
    }));
    
    setIsGroupModalOpen(false); // Modalni yopamiz
    showToast(`Talaba ${newGroupName} guruhiga qo'shildi!`); // Xabarnoma
  };

  return (
    <div className="profile-page-bg">
      
      {/* Yashil Xabarnoma (Toast) */}
      {toast.show && (
        <div className="custom-toast">
          <i className="fa-solid fa-circle-check" style={{marginRight: '8px'}}></i>
          {toast.message}
        </div>
      )}

      <div className="row g-4">
        
        {/* ================= CHAP USTUN ================= */}
        <div className="col-lg-4">
          <div className="custom-card">
            <div className="profile-top-row">
              <div className="profile-avatar"><i className="fa-regular fa-image"></i></div>
              
              <div className="profile-actions-stack">
                <button className="circle-action-btn orange" title="Tahrirlash" onClick={() => setIsEditOpen(true)}>
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button className="circle-action-btn orange" title="SMS yuborish" onClick={handleSendSMS}>
                  <i className="fa-regular fa-envelope"></i>
                </button>
                <button className="circle-action-btn red" title="O'chirish" onClick={() => setIsDeleteOpen(true)}>
                  <i className="fa-regular fa-trash-can"></i>
                </button>
                <button className="circle-action-btn orange" title="Tarix">
                  <i className="fa-solid fa-clock-rotate-left"></i>
                </button>
              </div>
            </div>

            <h3 className="profile-name">{student.name}</h3>
            <p className="profile-id">(id: {student.id})</p>

            <div>
              <span className={student.balance < 0 ? "balance-badge" : "balance-badge bg-success"}>
                {student.balance} UZS
              </span>
              <span className="text-muted" style={{fontSize: '13px'}}>balans</span>
            </div>

            <div className="coins-text"><i className="fa-solid fa-coins coin-icon"></i> {student.coins} coins</div>

            <div className="info-text">Telefon:</div>
            <div className="info-value blue-link">{student.phone}</div>

            <hr style={{ borderColor: '#eaeaea', margin: '20px 0' }} />

            <div className="info-text">Talaba qo'shilgan sana: <span className="info-value">{student.date}</span></div>
            <div className="info-text mt-3">
              Filiallar: <span className="branch-badge ml-2">Yunusobod filiali</span>
            </div>

            <div className="profile-bottom-actions">
              <button className="pill-dropdown-btn teal"
               onClick={handleTransfer}
              >
                <i className="fa-solid fa-user-plus"></i> Guruhga qo'shish <i className="fa-solid fa-caret-down ml-1"></i>
              </button>
              <button className="pill-dropdown-btn green" onClick={() => setIsPaymentOpen(true)}>
                <i className="fa-solid fa-money-bill-1-wave"></i> To'lov <i className="fa-solid fa-caret-down ml-1"></i>
              </button>
            </div>
          </div>

          {/* Eslatma Kartasi */}
          <div className="note-card">
            <span className="note-text">{student.note}</span>
            <div className="note-actions">
              <button className="circle-action-btn orange" style={{width: '32px', height: '32px'}} onClick={handleAddNote} title="Eslatma qo'shish">
                <i className="fa-regular fa-flag"></i>
              </button>
              <button className="circle-action-btn red" style={{width: '32px', height: '32px'}} onClick={() => {setStudent({...student, note: ''}); showToast("Eslatma o'chirildi");}}>
                <i className="fa-regular fa-circle-xmark"></i>
              </button>
            </div>
          </div>
        </div>

        {/* ================= O'NG USTUN ================= */}
        <div className="col-lg-8">
          <div className="custom-card" style={{ border: 'none', background: 'transparent', padding: '0' }}>
            
            <div className="custom-tabs">
              {['Guruhlar', 'Izohlar', "Qo'ng'iroq tarixi", 'SMS', 'Tarix', 'Lid tarixi', 'Coin Tarix'].map((tab) => (
                <button key={tab} className={`tab-btn ${activeTab === tab.toLowerCase() ? 'active' : ''}`} onClick={() => setActiveTab(tab.toLowerCase())}>
                  {tab}
             </button>
              ))}
            </div>

            {activeTab === 'guruhlar' && (
              <>
                <div className="group-details-card">
                  <div className="group-top-row">
                    <div>
                      <span className="group-badge">{student.groups}</span>
                      <div className="group-title">Dizayn</div>
                      <div className="group-teacher">{student.teacher}</div>
                    </div>
                    <div className="group-dates">
                      01.05.2025 — <br/> 31.05.2025 <br/> Juft kunlar • 07:00
                    </div>
                  </div>
                  
                  <div className="group-divider"></div>
                  
                  <div className="group-bottom-row">
                    <ul className="group-status-list">
                      <li>Holat: <span>Faol (O'qishni to'laydi)</span></li>
                      <li>Talaba qo'shilgan sana: <span>{student.date}</span></li>
                      <li>Faollashtirilgan: <span>{student.date}</span></li>
                      <li>Bu talaba uchun narx: <span>300 000 UZS</span></li>
                    </ul>
                    <div className="note-actions">
                      <button className="circle-action-btn teal" style={{width: '32px', height: '32px'}} onClick={handleFreeze} title="Muzlatish">
                        <i className="fa-solid fa-pause"></i>
                      </button>
                      <button className="circle-action-btn red" style={{width: '32px', height: '32px'}} onClick={handleDebtor} title="Qarzdor holatga o'tkazish">
                        <i className="fa-solid fa-ghost"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <h4 className="section-title">Oylik balans xolati</h4>
                <div className="monthly-balance-box">
                  <div className="mb-date">2025 M05 1</div>
                  <div className="mb-amount">{student.balance}</div>
                </div>
                
                {/* To'lovlar Jadvali DInamik qilindi */}
                <h4 className="section-title">To'lovlar</h4>
                <div className="payments-table-wrapper">
                  <table className="payments-table">
                    <thead>
                      <tr><th>Sana</th><th>Turi</th><th>Miqdor</th><th>Izoh</th><th>Xodim</th><th>Amallar</th></tr>
                    </thead>
                    <tbody>
                      {paymentsList.map((payment) => (
                        <tr key={payment.id}>
                          <td>{payment.date}</td>
                          <td><span className="badge-system">{payment.type}</span></td>
                          <td className="text-success">+{payment.amount} UZS</td>
                          <td><div style={{fontWeight: '500'}}>{payment.note}</div></td>
                          <td>
                            <div>{payment.employee}</div>
                            <div style={{color: '#888', fontSize: '12px'}}>{payment.time}</div>
                          </td>
                          <td>
                            <div className="btn-group">
                              <button 
                                type="button" 
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setReceiptPayment(payment)}  /* <-- SHUNI QO'SHING */
                              >
                                Chop etish
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm dropdown-toggle dropdown-toggle-split"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              ></button>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li><button className="dropdown-item">↩ Qaytish</button></li>
                                <li><button className="dropdown-item">✏ Tahrirlash</button></li>
                                <li><button className="dropdown-item text-danger">✖ O‘chirish</button></li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ================= SMS TABI ================= */}
            {activeTab === 'sms' && (
              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="section-title m-0">SMS Tarixi</h4>
                  <button className="btn btn-sm" style={{backgroundColor: '#F27A21', color: 'white'}} onClick={handleSendSMS}>
                    <i className="fa-regular fa-paper-plane me-2"></i> SMS Yuborish
                  </button>
                </div>
                
                <div className="payments-table-wrapper border-0 shadow-sm">
                  {smsList.length > 0 ? (
                    <table className="payments-table table-hover mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="text-muted" style={{width: '20%'}}>Sana va Vaqt</th>
                          <th className="text-muted" style={{width: '60%'}}>Xabar matni</th>
                          <th className="text-muted text-center" style={{width: '20%'}}>Holat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {smsList.map(sms => (
                          <tr key={sms.id}>
                            <td>
                              <div className="fw-medium">{sms.date}</div>
                              <div className="text-muted" style={{fontSize: '12px'}}>{sms.time}</div>
                            </td>
                            <td>
                              <div style={{whiteSpace: 'pre-line', lineHeight: '1.5', color: '#444'}}>
                                {sms.message}
                              </div>
                            </td>
                            <td className="text-center">
                              <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">
                                <i className="fa-solid fa-check me-1"></i> {sms.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <i className="fa-regular fa-comment-dots fs-1 mb-3 text-light"></i>
                      <p>Hozircha xabarlar yo'q</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ================= MODALLAR ================= */}

      {/* 1. Tahrirlash Modali */}
      <EditStudentModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        onSuccess={handleEditSave} 
        student={student} 
      />

      {/* 2. O'chirish Modali */}
      {isDeleteOpen && (
        <div className="mini-modal-overlay">
          <div className="mini-modal">
            <h3>Haqiqatan ham o'chirasizmi?</h3>
            <p>Siz <b>{student.name}</b> profilini butunlay o'chirmoqchisiz.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setIsDeleteOpen(false)}>Bekor qilish</button>
              <button className="btn-confirm" onClick={confirmDelete}>O'chirish</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. To'lov Modali (YANGILANDI) */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={(studentId, amount, formData) => {
          setStudent(prev => ({
            ...prev,
            balance: Math.round((Number(prev.balance) + amount) * 100) / 100
          }));

          const newPayment = {
            id: Date.now(),
            date: formData.date.split('-').reverse().join('.'),
            type: formData.paymentType,
            amount: amount,
            note: formData.note || "To'lov kiritildi",
            employee: 'Joriy Foydalanuvchi',
            time: new Date().toLocaleTimeString('ru-RU')
          };
          
          setPaymentsList(prev => [newPayment, ...prev]);
          setIsPaymentOpen(false);
          showToast(`To'lov saqlandi (${formData.paymentType})`);
          
          // YANGI: To'lov muvaffaqiyatli o'tgach Chekni ochish!
          setReceiptPayment(newPayment);
        }}
        student={student}
      />

      {/* 4. Kvitansiya (Chek) Modali */}
      <ReceiptModal 
        payment={receiptPayment}
        student={student}
        onClose={() => setReceiptPayment(null)}
      />

      <AddGroupModal 
        isOpen={isGroupModalOpen} 
        onClose={() => setIsGroupModalOpen(false)} 
        onSuccess={confirmAddToGroup} 
        selectedCount={1} 
      />

      {/* 6. SMS Modali */}
      <SmsModal 
        isOpen={isSmsModalOpen} 
        onClose={() => setIsSmsModalOpen(false)} 
        onSuccess={confirmSendSms} 
        selectedCount={1} 
      />

    </div>
  );
};

export default Profile;