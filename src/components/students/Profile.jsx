import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // URL dan ID olish uchun kerak
import './Profile.css';
import EditStudentModal from './EditStudentModal';
import PaymentModal from './PaymentModal';
import ReceiptModal from './ReceiptModal';
import AddGroupModal from './AddGroupModal';
import SmsModal from './SmsModal';

const Profile = ({ student: externalStudent, onClose }) => {
  // Agar Router orqali kelgan bo'lsa ID ni olamiz
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('guruhlar');
  const [receiptPayment, setReceiptPayment] = useState(null); 
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [student, setStudent] = useState(null); // Boshida bo'sh bo'ladi
  const [isLoading, setIsLoading] = useState(true); // Yuklanish holati

  // --- SMS TARIXI STATI ---
  const [smsList, setSmsList] = useState([
    { id: 1, date: '08.05.2025', time: '14:30', message: "Hurmatli Bekzod, bugun sizning darsingiz soat 15:00 ga ko'chirildi.", status: 'Yuborildi' }
  ]);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);

  const handleSendSMS = () => setIsSmsModalOpen(true);
  const confirmSendSms = (message) => {
    const newSms = { id: Date.now(), date: new Date().toLocaleDateString('ru-RU'), time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }), message: message, status: 'Yuborildi' };
    setSmsList(prev => [newSms, ...prev]); 
    setIsSmsModalOpen(false); 
    showToast("SMS muvaffaqiyatli yuborildi!");
  };

  // --- XABARNOMA (TOAST) ---
  const [toast, setToast] = useState({ show: false, message: '' });
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // --- TO'LOVLAR TARIXI STATI ---
  const [paymentsList, setPaymentsList] = useState([
    { id: 1, date: '08.05.2025', type: 'tizim', amount: 7692.31, note: "To'lov kiritildi", employee: 'Hojmurod Nasriddinov', time: '08.05.2025 13:30:36' }
  ]);

  // --- MODALLAR UCHUN STATELAR ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // HARAKATLAR
  const handleEditSave = (updatedStudent) => { setStudent(updatedStudent); showToast("Ma'lumotlar muvaffaqiyatli tahrirlandi!"); };
  const handleAddNote = () => { const newNote = prompt("Yangi eslatma kiriting:"); if(newNote) { setStudent({...student, note: newNote}); showToast("Eslatma qo'shildi!"); } };
  
  const confirmDelete = () => {
    // Agar LocalStorage dan o'chirish kerak bo'lsa
    if (student) {
      const localData = JSON.parse(localStorage.getItem('studentsList') || '[]');
      const filtered = localData.filter(s => s.id !== student.id);
      localStorage.setItem('studentsList', JSON.stringify(filtered));
    }
    setIsDeleteOpen(false);
    showToast("Talaba tizimdan o'chirildi!");
    setTimeout(() => {
      if (onClose) onClose();
      else navigate(-1); // Agar alohida sahifa bo'lsa orqaga qaytish
    }, 1500);
  };

  const handleTransfer = () => setIsGroupModalOpen(true);
  const handleFreeze = () => { if(window.confirm("Talabani muzlatishni tasdiqlaysizmi?")) showToast("Talaba muzlatildi!"); };
  const handleDebtor = () => { if(window.confirm("Talabani qarzdor/arxiv holatiga o'tkazasizmi?")) showToast("Talaba holati o'zgartirildi!"); };
  
  const confirmAddToGroup = (groupData) => {
    const newGroupName = groupData.groupName.split('(')[0].trim();
    setStudent(prev => ({ ...prev, groups: newGroupName }));
    setIsGroupModalOpen(false); 
    showToast(`Talaba ${newGroupName} guruhiga qo'shildi!`); 
  };


  // ================= ENG MUHIM QISM: TALABANI YUKLASH =================
  useEffect(() => {
    // 1-Holat: Agar "Guruhlar" ichidan tayyor student obyekti uzatilgan bo'lsa
    if (externalStudent) {
      setStudent(externalStudent);
      setIsLoading(false);
      return;
    }

    // 2-Holat: Agar URL orqali kelgan bo'lsa (masalan: /students/123)
    if (id) {
      const localData = JSON.parse(localStorage.getItem('studentsList') || '[]');
      const foundStudent = localData.find(s => String(s.id) === String(id));
      
      if (foundStudent) {
        setStudent(foundStudent);
      } else {
        // Topilmasa Default ma'lumot ko'rsatish
        setStudent({
          id: id, name: 'Topilmadi', phone: 'Noma\'lum', balance: 0, coins: 0, groups: "Biriktirilmagan", teacher: "Biriktirilmagan", date: 'Noma\'lum', note: ''
        });
      }
      setIsLoading(false);
    }
  }, [id, externalStudent]);


  // Agar hali o'ylab tursa yoki topolmasa...
  if (isLoading) {
    return <div className="p-5 text-center text-muted">Ma'lumotlar yuklanmoqda...</div>;
  }

  if (!student) {
    return <div className="p-5 text-center text-danger">Talaba topilmadi!</div>;
  }

  // Sahifadan chiqish funksiyasi
  const handleCloseProfile = () => {
    if (onClose) onClose(); // Agar modaldek ochilgan bo'lsa, uni yopish
    else navigate(-1); // Agar URL router orqali kirilgan bo'lsa (masalan /students/123) orqaga bitta sahifa qaytish
  }

  return (
    <div className="profile-page-bg">

      <button className="profile-close" onClick={handleCloseProfile}>
        ×
      </button>
      
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
              <span className={student.balance < 0 ? "balance-badge bg-danger" : "balance-badge bg-success"}>
                {student.balance} UZS
              </span>
              <span className="text-muted ms-2" style={{fontSize: '13px'}}>balans</span>
            </div>

            <div className="coins-text mt-3"><i className="fa-solid fa-coins coin-icon text-warning"></i> {student.coins} coins</div>

            <div className="info-text mt-4">Telefon:</div>
            <div className="info-value blue-link">{student.phone}</div>

            <hr style={{ borderColor: '#eaeaea', margin: '20px 0' }} />

            <div className="info-text">Talaba qo'shilgan sana: <span className="info-value text-dark fw-medium ms-2">{student.date}</span></div>
            <div className="info-text mt-3">
              Filiallar: <span className="badge bg-light text-dark border ms-2 fw-normal">Yunusobod filiali</span>
            </div>

            <div className="profile-bottom-actions mt-4 d-flex flex-column gap-2">
              <button className="btn btn-light border text-start w-100" onClick={handleTransfer} style={{color: '#0d9488'}}>
                <i className="fa-solid fa-user-plus me-2"></i> Guruhga qo'shish 
              </button>
              <button className="btn btn-success text-start w-100" onClick={() => setIsPaymentOpen(true)}>
                <i className="fa-solid fa-money-bill-1-wave me-2"></i> To'lov qilish
              </button>
            </div>
          </div>

          <div className="note-card mt-4 p-3 bg-white border rounded">
            <span className="text-muted small d-block mb-2">{student.note || "Eslatma mavjud emas"}</span>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-sm btn-outline-warning" onClick={handleAddNote} title="Eslatma qo'shish"><i className="fa-regular fa-flag"></i></button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => {setStudent({...student, note: ''}); showToast("Eslatma o'chirildi");}}><i className="fa-regular fa-circle-xmark"></i></button>
            </div>
          </div>
        </div>

        {/* ================= O'NG USTUN ================= */}
        <div className="col-lg-8">
          <div className="custom-card" style={{ border: 'none', background: 'transparent', padding: '0' }}>
            
            <div className="custom-tabs d-flex gap-2 overflow-auto pb-2 border-bottom mb-4">
              {['Guruhlar', 'Izohlar', "Qo'ng'iroq tarixi", 'SMS', 'Tarix', 'Lid tarixi', 'Coin Tarix'].map((tab) => (
                <button key={tab} className={`btn btn-sm ${activeTab === tab.toLowerCase() ? 'btn-primary' : 'btn-light border'}`} onClick={() => setActiveTab(tab.toLowerCase())}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'guruhlar' && (
              <>
                <div className="bg-white p-4 rounded border mb-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className="badge bg-secondary mb-2">{student.groups}</span>
                      <h5 className="m-0 fw-bold">{student.groups}</h5>
                      <div className="text-muted small mt-1">{student.teacher}</div>
                    </div>
                    <div className="text-end small text-muted">
                      01.05.2025 — <br/> 31.05.2025 <br/> Juft kunlar • 07:00
                    </div>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between align-items-end mt-3">
                    <ul className="list-unstyled small text-muted m-0">
                      <li className="mb-1">Holat: <span className="text-success fw-medium">Faol (O'qishni to'laydi)</span></li>
                      <li className="mb-1">Qo'shilgan sana: <span className="text-dark">{student.date}</span></li>
                      <li>Narx: <span className="text-dark fw-medium">300 000 UZS</span></li>
                    </ul>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-info" onClick={handleFreeze} title="Muzlatish"><i className="fa-solid fa-pause"></i></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={handleDebtor} title="Qarzdor holatga o'tkazish"><i className="fa-solid fa-ghost"></i></button>
                    </div>
                  </div>
                </div>

                <h5 className="fw-bold mb-3">To'lovlar tarixi</h5>
                <div className="table-responsive bg-white rounded border">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr><th>Sana</th><th>Turi</th><th>Miqdor</th><th>Izoh</th><th>Xodim</th><th>Amallar</th></tr>
                    </thead>
                    <tbody>
                      {paymentsList.map((payment) => (
                        <tr key={payment.id}>
                          <td className="small">{payment.date}</td>
                          <td><span className="badge bg-light text-dark border">{payment.type}</span></td>
                          <td className="text-success fw-medium">+{payment.amount} UZS</td>
                          <td className="small">{payment.note}</td>
                          <td className="small">
                            <div>{payment.employee}</div>
                            <div className="text-muted">{payment.time}</div>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setReceiptPayment(payment)}>Chek</button>
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
              <div className="bg-white p-4 rounded border">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="m-0 fw-bold">SMS Tarixi</h5>
                  <button className="btn btn-sm btn-warning text-white" onClick={handleSendSMS}>
                    <i className="fa-regular fa-paper-plane me-2"></i> SMS Yuborish
                  </button>
                </div>
                
                <div className="table-responsive">
                  {smsList.length > 0 ? (
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light">
                        <tr><th style={{width: '20%'}}>Sana</th><th style={{width: '60%'}}>Xabar matni</th><th style={{width: '20%'}} className="text-center">Holat</th></tr>
                      </thead>
                      <tbody>
                        {smsList.map(sms => (
                          <tr key={sms.id}>
                            <td><div className="fw-medium small">{sms.date}</div><div className="text-muted" style={{fontSize: '11px'}}>{sms.time}</div></td>
                            <td className="small">{sms.message}</td>
                            <td className="text-center"><span className="badge bg-success bg-opacity-10 text-success rounded-pill"><i className="fa-solid fa-check me-1"></i> {sms.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-5 text-muted"><i className="fa-regular fa-comment-dots fs-1 mb-3 text-light"></i><p>Hozircha xabarlar yo'q</p></div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ================= MODALLAR ================= */}

      <EditStudentModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onSuccess={handleEditSave} student={student} />

      {isDeleteOpen && (
        <div className="modal-overlay" style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="bg-white p-4 rounded text-center" style={{width: '350px'}}>
            <h4 className="mb-3 text-dark">Haqiqatan ham o'chirasizmi?</h4>
            <p className="text-muted mb-4 small">Siz <b>{student.name}</b> profilini butunlay o'chirmoqchisiz.</p>
            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-light border px-4" onClick={() => setIsDeleteOpen(false)}>Bekor</button>
              <button className="btn btn-danger px-4" onClick={confirmDelete}>O'chirish</button>
            </div>
          </div>
        </div>
      )}

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={(studentId, amount, formData) => {
          setStudent(prev => ({ ...prev, balance: Math.round((Number(prev.balance) + amount) * 100) / 100 }));
          const newPayment = { id: Date.now(), date: formData.date.split('-').reverse().join('.'), type: formData.paymentType, amount: amount, note: formData.note || "To'lov kiritildi", employee: 'Joriy Foydalanuvchi', time: new Date().toLocaleTimeString('ru-RU') };
          setPaymentsList(prev => [newPayment, ...prev]);
          setIsPaymentOpen(false);
          showToast(`To'lov saqlandi (${formData.paymentType})`);
          setReceiptPayment(newPayment);
        }}
        student={student}
      />

      <ReceiptModal payment={receiptPayment} student={student} onClose={() => setReceiptPayment(null)} />
      <AddGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} onSuccess={confirmAddToGroup} selectedCount={1} />
      <SmsModal isOpen={isSmsModalOpen} onClose={() => setIsSmsModalOpen(false)} onSuccess={confirmSendSms} selectedCount={1} />

    </div>
  );
};

export default Profile;