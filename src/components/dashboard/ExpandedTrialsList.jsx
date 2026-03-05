import React from 'react';

const ExpandedTrialList = ({ students, onClose }) => {
  return (
    <div className="dashboard-card mb-4" style={{ animation: 'fadeInDown 0.3s ease' }}>
      
      {/* Tepa qism: Sarlavha va Yopish tugmasi */}
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
        <div>
          <h5 className="m-0 text-dark fw-semibold">Sinov darsidagi talabalar ro'yxati</h5>
          <span className="text-muted small">Miqdor: {students.length} ta unikal talaba</span>
        </div>
        <button className="btn-close" onClick={onClose}></button>
      </div>
      
      {/* Jadval qismi */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0" style={{fontSize: '14px'}}>
          <thead className="bg-light text-muted">
            <tr>
              <th style={{fontWeight: '500', width: '25%'}}>Ism va Familiya</th>
              <th style={{fontWeight: '500', width: '20%'}}>Telefon raqami</th>
              <th style={{fontWeight: '500', width: '30%'}}>Guruh va Kursi</th>
              <th style={{fontWeight: '500', width: '15%'}}>O'qituvchisi</th>
              <th style={{fontWeight: '500', width: '10%'}}>Holati</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? students.map(student => (
              <tr key={student.id}>
                <td className="fw-medium text-dark">{student.name}</td>
                <td className="text-primary">{student.phone}</td>
                
                {/* Guruh va kurs ma'lumotlari */}
                <td>
                  {student.enrollments ? student.enrollments.map((enr, i) => (
                    <div key={i} className="mb-1">
                      <span className="badge bg-light text-secondary border me-1">{enr.group}</span> 
                      {enr.course}
                    </div>
                  )) : (
                    <div><span className="badge bg-light text-secondary border me-1">{student.groups}</span></div>
                  )}
                </td>
                
                {/* O'qituvchilar */}
                <td>
                  {student.enrollments ? student.enrollments.map((enr, i) => (
                    <div key={i} className="mb-1">{enr.teacher}</div>
                  )) : student.teacher}
                </td>
                
                {/* Holati (Sariq rangda) */}
                <td>
                  <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3">
                    {student.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  Hozircha sinov darsida talabalar yo'q.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpandedTrialList;