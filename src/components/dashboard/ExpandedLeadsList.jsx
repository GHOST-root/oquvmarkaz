import React from 'react';

const ExpandedLeadsList = ({ leads, onClose, onDelete }) => {
  return (
    <div className="dashboard-card mb-4" style={{ animation: 'fadeInDown 0.3s ease' }}>
      
      {/* Tepa qism: Sarlavha va Yopish tugmasi */}
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
        <div>
          <h5 className="m-0 text-dark fw-semibold">Faol lidlar ro'yxati</h5>
          <span className="text-muted small">Miqdor: {leads.length} ta lid</span>
        </div>
        <button className="btn-close" onClick={onClose}></button>
      </div>
      
      {/* Jadval qismi */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0" style={{fontSize: '14px'}}>
          <thead className="bg-light text-muted">
            <tr>
              <th style={{fontWeight: '500', width: '5%'}}>№</th>
              <th style={{fontWeight: '500', width: '35%'}}>Ism va Familiya</th>
              <th style={{fontWeight: '500', width: '25%'}}>Telefon raqami</th>
              <th style={{fontWeight: '500', width: '25%'}}>Vaqt</th>
              <th style={{fontWeight: '500', width: '10%'}} className="text-center">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? leads.map((lead, index) => (
              <tr key={lead.id}>
                <td className="text-muted">{index + 1}</td>
                <td className="fw-medium text-dark">{lead.name}</td>
                <td className="text-primary">{lead.phone}</td>
                <td className="text-muted">
                  <i className="fa-regular fa-clock me-2"></i>
                  {lead.time}
                </td>
                <td className="text-center">
                  <button 
                    className="btn btn-sm text-danger border-0 bg-transparent" 
                    onClick={() => onDelete(lead.id)}
                    title="Lidni o'chirish"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">Hozircha faol lidlar yo'q.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpandedLeadsList;