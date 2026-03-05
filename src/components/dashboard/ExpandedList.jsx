import React from 'react';

const ExpandedList = ({ students, onClose, title }) => {
  return (
    <div className="dashboard-card mb-4" style={{ animation: 'fadeInDown 0.3s ease' }}>
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
        <div>
          <h5 className="m-0 text-dark fw-semibold">{title}</h5>
          <span className="text-muted small">Miqdor: {students.length} ta unikal talaba</span>
        </div>
        <button className="btn-close" onClick={onClose}></button>
      </div>
      
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0" style={{fontSize: '14px'}}>
          <thead className="bg-light text-muted">
            <tr>
              <th style={{fontWeight: '500'}}>Ism va Familiya</th>
              <th style={{fontWeight: '500'}}>Telefon raqami</th>
              <th style={{fontWeight: '500'}}>Guruh va Kursi</th>
              <th style={{fontWeight: '500'}}>O'qituvchisi</th>
              <th style={{fontWeight: '500'}}>Holati</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td className="fw-medium text-dark">{student.name}</td>
                <td className="text-primary">{student.phone}</td>
                <td>
                  {student.enrollments ? student.enrollments.map((enr, i) => (
                    <div key={i} className="mb-1"><span className="badge bg-light text-secondary border me-1">{enr.group}</span> {enr.course}</div>
                  )) : <div><span className="badge bg-light text-secondary border me-1">{student.groups}</span></div>}
                </td>
                <td>
                  {student.enrollments ? student.enrollments.map((enr, i) => (
                    <div key={i} className="mb-1">{enr.teacher}</div>
                  )) : student.teacher}
                </td>
                <td><span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">{student.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpandedList;