import React, { useState, useMemo } from 'react';

const ExpandedLeftTrialList = ({ students, onClose }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedStudents = useMemo(() => {
    let sortableItems = [...students];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key] || '';
        let bVal = b[sortConfig.key] || '';

        // Ichki obyektlarni o'qish uchun maxsus shartlar
        if (sortConfig.key === 'course') {
          aVal = a.enrollments && a.enrollments.length > 0 ? a.enrollments[0].course : 'Geografiya';
          bVal = b.enrollments && b.enrollments.length > 0 ? b.enrollments[0].course : 'Geografiya';
        } else if (sortConfig.key === 'group') {
          aVal = a.enrollments && a.enrollments.length > 0 ? a.enrollments[0].group : (a.groups || '');
          bVal = b.enrollments && b.enrollments.length > 0 ? b.enrollments[0].group : (b.groups || '');
        } else if (sortConfig.key === 'teacher') {
          aVal = a.enrollments && a.enrollments.length > 0 ? a.enrollments[0].teacher : (a.teacher || '');
          bVal = b.enrollments && b.enrollments.length > 0 ? b.enrollments[0].teacher : (b.teacher || '');
        } else if (sortConfig.key === 'archivedBy') {
          aVal = a.archivedBy || 'Behruz Berdiyev';
          bVal = b.archivedBy || 'Behruz Berdiyev';
        } else if (sortConfig.key === 'leaveReason') {
          aVal = a.leaveReason || 'Sababsiz';
          bVal = b.leaveReason || 'Sababsiz';
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [students, sortConfig]);

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
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="m-0 text-dark fw-semibold">Sinov muddatidan keyin ketganlar <span className="text-muted fs-6 ms-2">Miqdor — {students.length}</span></h5>
        </div>
        <button className="btn-close" onClick={onClose}></button>
      </div>

      <div className="filter-grid">

        <input className='date' type="date" defaultValue="2025-05-01" />
        <input className='date' type="date" defaultValue="2025-05-10" />

        <select><option>Sinov darsida</option></select>

        <input className="wide" type="text" placeholder="Ism yoki telefon orqali qidir..." />

        <select><option>Kurs</option></select>
        <select><option>Guruh</option></select>
        <select><option>O‘qituvchi</option></select>
        <select><option>Xodim</option></select>

        <select><option>Arxivlash sabablari</option></select>

        <div className="actions">
          <button className="btn-primary">Filtr</button>
          <button className="btn-light">⟳</button>
        </div>

      </div>
      
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0" style={{fontSize: '13px'}}>
          <thead className="bg-light text-muted">
            <tr>
              <th style={{fontWeight: '500', width: '3%'}}>№</th>
              <th style={{fontWeight: '500', width: '12%', cursor: 'pointer', userSelect: 'none'}} onClick={() => requestSort('name')}>Talaba <i className={getSortIcon('name')}></i></th>
              <th style={{fontWeight: '500', width: '12%', cursor: 'pointer', userSelect: 'none'}} onClick={() => requestSort('phone')}>Telefon <i className={getSortIcon('phone')}></i></th>
              <th style={{fontWeight: '500', width: '12%', cursor: 'pointer', userSelect: 'none'}} onClick={() => requestSort('course')}>Kurs <i className={getSortIcon('course')}></i></th>
              <th style={{fontWeight: '500', width: '12%', cursor: 'pointer', userSelect: 'none'}} onClick={() => requestSort('group')}>Guruh <i className={getSortIcon('group')}></i></th>
              <th style={{fontWeight: '500', width: '12%', cursor: 'pointer', userSelect: 'none'}} onClick={() => requestSort('teacher')}>O'qituvchi <i className={getSortIcon('teacher')}></i></th>
              <th style={{fontWeight: '500', width: '8%'}}>Holati</th>
              <th style={{fontWeight: '500', width: '12%', cursor: 'pointer', userSelect: 'none'}} onClick={() => requestSort('leaveReason')}>O'chirish sababi <i className={getSortIcon('leaveReason')}></i></th>
              <th style={{fontWeight: '500', width: '7%', cursor: 'pointer', userSelect: 'none'}} onClick={() => requestSort('note')}>Izoh <i className={getSortIcon('note')}></i></th>
              <th style={{fontWeight: '500', width: '10%', cursor: 'pointer', userSelect: 'none'}} onClick={() => requestSort('archivedBy')}>Xodim <i className={getSortIcon('archivedBy')}></i></th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.length > 0 ? sortedStudents.map((student, index) => (
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
                <td>Sinov darsida</td>
                <td className="text-muted">{student.leaveReason || 'Sababsiz'}</td>
                <td className="text-muted">{student.note}</td>
                <td>
                  <div style={{color: '#0EA5E9', cursor: 'pointer'}}>{student.archivedBy || 'Behruz Berdiyev'}</div>
                  <div className="text-muted" style={{fontSize: '11px'}}>{student.archivedDate || '08:43 / 10.05.2025'}</div>
                </td>
              </tr>
            )) : <tr><td colSpan="10" className="text-center py-5 text-muted">Sinov muddatidan keyin ketgan o'quvchilar yo'q.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpandedLeftTrialList;