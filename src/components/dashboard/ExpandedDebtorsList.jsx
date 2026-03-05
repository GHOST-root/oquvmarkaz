import React from 'react';

const ExpandedDebtorsList = ({ debtors, onClose }) => {
  // Jami qarz summasini hisoblash
  const totalDebt = debtors.reduce((sum, student) => sum + Number(student.balance), 0);

  // Sonlarni chiroyli formatlash (masalan: -8,062,232)
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' UZS';
  };

  return (
    <div className="dashboard-card mb-4" style={{ animation: 'fadeInDown 0.3s ease' }}>
      
      {/* Tepa qism: Sarlavha va Yopish tugmasi */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="m-0 text-dark fw-semibold">Qarzdorlar <span className="text-muted fs-6 ms-2">Miqdor — {debtors.length}</span></h5>
        </div>
        <button className="btn-close" onClick={onClose}></button>
      </div>

      {/* Jami hisob-kitob bloklari */}
      <div className="d-flex flex-column gap-3 mb-4">
        <div className="p-3 bg-light rounded-3 border-start border-info border-4 d-flex justify-content-between align-items-center">
          <span className="fs-6 text-dark">Jami: {formatMoney(totalDebt)}</span>
          <i className="fa-solid fa-coins text-info fs-5"></i>
        </div>
        <div className="p-3 bg-light rounded-3 border-start border-info border-4 d-flex justify-content-between align-items-center">
          <span className="fs-6 text-dark">Davr bo'yicha jami: {formatMoney(totalDebt)}</span>
          <i className="fa-solid fa-coins text-info fs-5"></i>
        </div>
      </div>

      {/* Filtrlar qatori (Rasmga moslashtirilgan vizual) */}
      <div className="row g-2 mb-4">
        <div className="col-md-2"><input type="text" className="form-control form-control-sm" placeholder="Ism yoki telefon..." /></div>
        <div className="col-md-2"><select className="form-select form-select-sm text-muted"><option>Qarz miqdori (oldin)</option></select></div>
        <div className="col-md-2"><select className="form-select form-select-sm text-muted"><option>Qarz miqdori (gacha)</option></select></div>
        <div className="col-md-2"><input type="date" className="form-control form-control-sm text-muted" title="Sanadan boshlab" /></div>
        <div className="col-md-2"><input type="date" className="form-control form-control-sm text-muted" title="Sana bo'yicha" /></div>
        <div className="col-md-2"><button className="btn btn-sm text-white w-100" style={{backgroundColor: '#F27A21'}}>Filtr</button></div>
      </div>
      
      {/* Jadval qismi */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0" style={{fontSize: '13px'}}>
          <thead className="bg-light text-muted">
            <tr>
              <th style={{width: '3%'}}><input type="checkbox" /></th>
              <th style={{fontWeight: '500', width: '15%'}}>Ism</th>
              <th style={{fontWeight: '500', width: '12%'}}>Telefon</th>
              <th style={{fontWeight: '500', width: '12%'}}>Balans</th>
              <th style={{fontWeight: '500', width: '12%'}}>Davr bo'yicha jami</th>
              <th style={{fontWeight: '500', width: '25%'}}>Guruh</th>
              <th style={{fontWeight: '500', width: '10%'}}>Izoh</th>
              <th style={{fontWeight: '500', width: '5%'}}>Holati</th>
              <th style={{fontWeight: '500', width: '6%'}}>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {debtors.map((student, index) => (
              <tr key={student.id} style={{ cursor: 'pointer' }}>
                <td><input type="checkbox" /></td>
                <td className="fw-medium text-dark">{student.name}</td>
                <td className="text-muted">({student.phone.substring(0,2)}) {student.phone.substring(3)}</td>
                <td className="text-danger">{formatMoney(student.balance)}</td>
                <td className="text-danger">{formatMoney(student.balance)}</td>
                
                {/* Guruh ma'lumotlarini birlashtirib ko'rsatish */}
                <td className="text-muted">
                  {student.enrollments ? student.enrollments.map((enr, i) => (
                    <div key={i} className="mb-1 text-truncate" style={{maxWidth: '250px'}}>
                      <span className="badge bg-light text-secondary border me-1">{enr.group}</span>
                      {enr.course} ({enr.teacher} - {enr.time.replace(/[()]/g, '')}) • {enr.dates.split('-')[0]}
                    </div>
                  )) : (
                    <div><span className="badge bg-light text-secondary border me-1">{student.groups}</span> {student.teacher}</div>
                  )}
                </td>
                
                <td className="text-muted text-truncate" style={{maxWidth: '100px'}} title={student.note}>{student.note}</td>
                <td>
                   <div style={{width: '20px', height: '20px', borderRadius: '50%', backgroundColor: student.status === 'Faol' ? '#10B981' : '#9CA3AF'}}></div>
                </td>
                <td>
                  <div className="d-flex gap-2 text-warning fs-6">
                    <i className="fa-regular fa-clock cursor-pointer"></i>
                    <i className="fa-regular fa-flag cursor-pointer"></i>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpandedDebtorsList;