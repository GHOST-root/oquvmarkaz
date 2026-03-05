import React from 'react';

const ExpandedLeftTrialList = ({ students, onClose }) => {
  return (
    <div className="dashboard-card mb-4" style={{ animation: 'fadeInDown 0.3s ease' }}>
      
      {/* Tepa qism: Sarlavha va Yopish tugmasi */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="m-0 text-dark fw-semibold">
            Sinov muddatidan keyin ketganlar <span className="text-muted fs-6 ms-2">Miqdor — {students.length}</span>
          </h5>
        </div>
        <button className="btn-close" onClick={onClose}></button>
      </div>

      {/* Filtrlar qatori */}
      <div className="row g-2 mb-4 align-items-center">
        <div className="col-md-2 d-flex gap-2">
          <input type="date" className="form-control form-control-sm text-muted" defaultValue="2025-05-01" />
          <input type="date" className="form-control form-control-sm text-muted" defaultValue="2025-05-10" />
        </div>
        <div className="col-md-2">
          {/* Status filtri "Sinov darsida" turibdi */}
          <select className="form-select form-select-sm text-muted">
            <option>Sinov darsida</option>
          </select>
        </div>
        <div className="col-md-2">
          <input type="text" className="form-control form-control-sm" placeholder="Ism yoki telefon orqali qidi..." />
        </div>
        <div className="col-md-1">
          <select className="form-select form-select-sm text-muted"><option>Kurs</option></select>
        </div>
        <div className="col-md-1">
          <select className="form-select form-select-sm text-muted"><option>Guruh</option></select>
        </div>
        <div className="col-md-1">
          <select className="form-select form-select-sm text-muted"><option>O'qituvchi</option></select>
        </div>
        <div className="col-md-1">
          <select className="form-select form-select-sm text-muted"><option>Xodim</option></select>
        </div>
        <div className="col-md-2 d-flex gap-2">
          <select className="form-select form-select-sm text-muted"><option>Arxivlash sabablari</option></select>
        </div>
        <div className="col-12 mt-2 d-flex gap-2">
          <button className="btn btn-primary btn-sm text-white px-4" style={{backgroundColor: '#3B82F6', border: 'none'}}>Filtr</button>
          <button className="btn btn-light btn-sm border px-3"><i className="fa-solid fa-rotate-right"></i></button>
        </div>
      </div>
      
      {/* Jadval qismi */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0" style={{fontSize: '13px'}}>
          <thead className="bg-light text-muted">
            <tr>
              <th style={{fontWeight: '500', width: '3%'}}>№</th>
              <th style={{fontWeight: '500', width: '12%'}}>Talaba</th>
              <th style={{fontWeight: '500', width: '12%'}}>Telefon</th>
              <th style={{fontWeight: '500', width: '12%'}}>Kurs</th>
              <th style={{fontWeight: '500', width: '12%'}}>Guruh</th>
              <th style={{fontWeight: '500', width: '12%'}}>O'qituvchi</th>
              <th style={{fontWeight: '500', width: '8%'}}>Holati</th>
              <th style={{fontWeight: '500', width: '12%'}}>O'chirib tashlash sabablari</th>
              <th style={{fontWeight: '500', width: '7%'}}>Izoh</th>
              <th style={{fontWeight: '500', width: '10%'}}>Xodim</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? students.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td className="fw-medium" style={{color: '#0EA5E9', cursor: 'pointer'}}>{student.name}</td>
                <td className="fw-medium text-primary">{student.phone}</td>
                <td style={{color: '#0EA5E9', cursor: 'pointer'}}>
                  {student.enrollments && student.enrollments.length > 0 ? student.enrollments[0].course : 'Geografiya'}
                </td>
                <td style={{color: '#0EA5E9', cursor: 'pointer'}}>
                  {student.enrollments && student.enrollments.length > 0 ? student.enrollments[0].group : student.groups}
                </td>
                <td style={{color: '#0EA5E9', cursor: 'pointer'}}>
                  {student.enrollments && student.enrollments.length > 0 ? student.enrollments[0].teacher : student.teacher}
                </td>
                
                {/* Asosiy o'zgarish: Holati "Sinov darsida" deb chiqadi */}
                <td>Sinov darsida</td>
                
                <td className="text-muted">{student.leaveReason || 'Sababsiz'}</td>
                <td className="text-muted">{student.note}</td>
                <td>
                  <div style={{color: '#0EA5E9', cursor: 'pointer'}}>{student.archivedBy || 'Behruz Berdiyev'}</div>
                  <div className="text-muted" style={{fontSize: '11px'}}>{student.archivedDate || '08:43 / 10.05.2025'}</div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="10" className="text-center py-5 text-muted">Sinov muddatidan keyin ketgan o'quvchilar yo'q.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpandedLeftTrialList;