import React, { useState, useMemo } from 'react';

const ExpandedGroupsList = ({ groups, onClose }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedGroups = useMemo(() => {
    let sortableItems = [...groups];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [groups, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "fa-solid fa-sort ms-1 text-muted opacity-25";
    return sortConfig.direction === 'asc' ? "fa-solid fa-sort-up ms-1 text-primary" : "fa-solid fa-sort-down ms-1 text-primary";
  };

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
              <th style={{fontWeight: '500', width: '15%', cursor: 'pointer', userSelect: 'none'}} onClick={() => requestSort('name')}>Guruh <i className={getSortIcon('name')}></i></th>
              <th style={{fontWeight: '500', width: '12%', cursor: 'pointer', userSelect: 'none'}} onClick={() => requestSort('course')}>Kurslar <i className={getSortIcon('course')}></i></th>
              <th style={{fontWeight: '500', width: '15%', cursor: 'pointer', userSelect: 'none'}} onClick={() => requestSort('teacher')}>O'qituvchi <i className={getSortIcon('teacher')}></i></th>
              <th style={{fontWeight: '500', width: '10%'}}>Kunlar</th>
              <th style={{fontWeight: '500', width: '15%'}}>Mashg'ulotlar sanalari</th>
              <th style={{fontWeight: '500', width: '10%'}}>O'tilgan muddat</th>
              <th style={{fontWeight: '500', width: '10%', cursor: 'pointer', userSelect: 'none'}} onClick={() => requestSort('room')}>Xonalar <i className={getSortIcon('room')}></i></th>
              <th style={{fontWeight: '500', width: '5%', cursor: 'pointer', userSelect: 'none'}} onClick={() => requestSort('studentsCount')} className="text-center">Talabalar <i className={getSortIcon('studentsCount')}></i></th>
            </tr>
          </thead>
          <tbody>
            {sortedGroups.map((group, index) => (
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