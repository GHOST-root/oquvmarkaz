import React, { useState, useMemo } from 'react';

const ExpandedLeadsList = ({ leads, onClose, onDelete }) => {
  // 1. Saralash holatini saqlash uchun State
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // 2. Ma'lumotlarni saralash mantig'i (Faqat sortConfig yoki leads o'zgarganda ishlaydi)
  const sortedLeads = useMemo(() => {
    let sortableItems = [...leads];
    
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [leads, sortConfig]);

  // 3. Ustun bosilganda saralash yo'nalishini o'zgartirish
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // 4. Ikonkalarni dinamik ko'rsatish uchun yordamchi funksiya
  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return "fa-solid fa-sort ms-2 text-muted opacity-25";
    return sortConfig.direction === 'asc' 
      ? "fa-solid fa-sort-up ms-2 text-primary" 
      : "fa-solid fa-sort-down ms-2 text-primary";
  };

  return (
    <div className="dashboard-card mb-4" style={{ animation: 'fadeInDown 0.3s ease' }}>
      
      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
        <div>
          <h5 className="m-0 text-dark fw-semibold">Faol lidlar ro'yxati</h5>
          <span className="text-muted small">Miqdor: {leads.length} ta lid</span>
        </div>
        <button className="btn-close" onClick={onClose}></button>
      </div>
      
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0" style={{fontSize: '14px'}}>
          <thead className="bg-light text-muted">
            <tr>
              <th style={{fontWeight: '500', width: '5%'}}>№</th>
              
              {/* Ustunlarga cursor-pointer va onClick qo'shildi */}
              <th 
                style={{fontWeight: '500', width: '35%', cursor: 'pointer', userSelect: 'none'}} 
                onClick={() => requestSort('name')}
              >
                Ism va Familiya <i className={getSortIcon('name')}></i>
              </th>
              
              <th 
                style={{fontWeight: '500', width: '25%', cursor: 'pointer', userSelect: 'none'}} 
                onClick={() => requestSort('phone')}
              >
                Telefon raqami <i className={getSortIcon('phone')}></i>
              </th>
              
              <th 
                style={{fontWeight: '500', width: '25%', cursor: 'pointer', userSelect: 'none'}} 
                onClick={() => requestSort('time')}
              >
                Vaqt <i className={getSortIcon('time')}></i>
              </th>
              
              <th style={{fontWeight: '500', width: '10%'}} className="text-center">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {/* Endi oddiy leads emas, sortedLeads aylanadi */}
            {sortedLeads.length > 0 ? sortedLeads.map((lead, index) => (
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