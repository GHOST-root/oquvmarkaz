import React from 'react';

const ExpandedGroupsList = ({ groups, onClose }) => {
  return (
    <div className="dashboard-card mb-4" style={{ animation: 'fadeInDown 0.3s ease' }}>
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
        <div>
          <h5 className="m-0 text-dark fw-semibold">Faol guruhlar ro'yxati</h5>
          <span className="text-muted small">Miqdor: {groups.length} ta guruh</span>
        </div>
        <button className="btn-close" onClick={onClose}></button>
      </div>
      
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0" style={{fontSize: '13px'}}>
          <thead className="bg-light text-muted">
            <tr>
              <th style={{fontWeight: '500', width: '3%'}}>№</th>
              <th style={{fontWeight: '500', width: '15%'}}>Guruh</th>
              <th style={{fontWeight: '500', width: '12%'}}>Kurslar</th>
              <th style={{fontWeight: '500', width: '15%'}}>O'qituvchi</th>
              <th style={{fontWeight: '500', width: '10%'}}>Kunlar</th>
              <th style={{fontWeight: '500', width: '15%'}}>Mashg'ulotlar sanalari</th>
              <th style={{fontWeight: '500', width: '10%'}}>O'tilgan muddat</th>
              <th style={{fontWeight: '500', width: '10%'}}>Xonalar</th>
              <th style={{fontWeight: '500', width: '5%'}} className="text-center">Talabalar</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, index) => (
              <tr key={group.id} style={{ cursor: 'pointer' }}>
                <td className="text-muted">{index + 1}.</td>
                <td className="fw-medium text-dark">{group.name}</td>
                <td>{group.course}</td>
                <td>{group.teacher}</td>
                <td style={{ whiteSpace: 'pre-line' }}>{group.days}</td>
                <td className="text-muted" style={{ whiteSpace: 'pre-line' }}>{group.dates}</td>
                <td style={{ whiteSpace: 'pre-line' }}>{group.duration}</td>
                <td>{group.room}</td>
                <td className="text-center fw-medium">{group.studentsCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpandedGroupsList;