import React from 'react';

const ExpandedPaidList = ({ students, onClose }) => {
  // Pullarni formatlash uchun yordamchi funksiya
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' UZS';
  };

  return (
    <div className="dashboard-card mb-4" style={{ animation: 'fadeInDown 0.3s ease' }}>
      
      {/* Sarlavha va yopish tugmasi */}
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
        <div>
          <h5 className="m-0 text-dark fw-semibold">Joriy oyda to'lov qilgan talabalar</h5>
          <span className="text-muted small">Miqdor: {students.length} ta to'lov</span>
        </div>
        <button className="btn-close" onClick={onClose}></button>
      </div>
      
      {/* Jadval qismi */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0" style={{fontSize: '14px'}}>
          <thead className="bg-light text-muted">
            <tr>
              <th style={{fontWeight: '500', width: '25%'}}>Ism va Familiya</th>
              <th style={{fontWeight: '500', width: '15%'}}>Telefon raqami</th>
              <th style={{fontWeight: '500', width: '30%'}}>Guruh</th>
              <th style={{fontWeight: '500', width: '15%'}}>To'lov summasi</th>
              <th style={{fontWeight: '500', width: '15%'}}>Sana</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? students.map((student, index) => (
              <tr key={student.id || index}>
                <td className="fw-medium text-dark">{student.name}</td>
                <td className="text-primary">{student.phone}</td>
                
                {/* Guruh ma'lumoti */}
                <td>
                  {student.enrollments && student.enrollments.length > 0 
                    ? <><span className="badge bg-light text-secondary border me-1">{student.enrollments[0].group}</span> {student.enrollments[0].course}</>
                    : <span className="badge bg-light text-secondary border">{student.groups}</span>
                  }
                </td>
                
                {/* To'lov summasi (Mock data: agar bazada to'lov summasi bo'lmasa, taxminiy summa ko'rsatamiz) */}
                <td className="text-success fw-medium">
                  {formatMoney(student.paymentAmount || 450000)}
                </td>
                
                {/* To'lov sanasi */}
                <td className="text-muted">
                  <i className="fa-regular fa-calendar me-2"></i>
                  {student.paymentDate || '15.02.2025'}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  Bu oyda hozircha to'lovlar yo'q.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpandedPaidList;