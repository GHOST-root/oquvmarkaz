import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import '../components/students/students.css';
import '../styles/Students.css'
import AddStudentModal from '../components/students/AddStudentModal';
import EditStudentModal from '../components/students/EditStudentModal';
import PaymentModal from '../components/students/PaymentModal';
import AddGroupModal from '../components/students/AddGroupModal'; 
import SmsModal from '../components/students/SmsModal'; 
import { useNavigate } from "react-router-dom";

const Students = () => {
  // --- Asosiy statelar ---
  const [studentsData, setStudentsData] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // --- Modallar uchun statelar ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, student: null });
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, student: null });
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);

  // --- Filtrlar va Saralash (Sorting) holati ---
  const [filters, setFilters] = useState({
    search: '', course: '', status: '', finance: '', tag: '', extraId: '', startDate: '', endDate: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // YANGI

  const [toast, setToast] = useState({ show: false, message: "" });
  const navigate = useNavigate();

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const currentStudent = studentsData.find(s => s.id === activeDropdown);

  const fetchStudents = () => {
    const localData = localStorage.getItem('studentsList');
    if (localData && JSON.parse(localData).length > 0) {
      setStudentsData(JSON.parse(localData));
    } else {
      const defaultStudents = [
        { id: 1, name: 'Saidahmad', phone: '90 192 01 91', groups: "1-guruh Intensive pro", time: '(09:00)', teacher: "Master Ugvey", date: '01.02.2025', balance: -1000000, coins: 0, note: "who are u", status: 'Faol' },
        { id: 2, name: 'Akbar Ibrohimov', phone: '90 199 19 19', groups: "MY Kimyo #1 Kimyo", time: '(07:00)', teacher: "Master Yoda", date: '01.08.2024', balance: -227691.97, coins: 0, note: "", status: 'Sinov darsida' },
        { id: 3, name: 'Husan Ubaydullayev', phone: '99 670 67 67', groups: "AK Dizayn #22 Dizayn", time: '(13:00)', teacher: "Abror Karimov", date: '01.02.2025', balance: -730769.23, coins: 500, note: "test", status: 'Muzlatilgan' },
        { id: 4, name: 'Bekzod Saydaliyev', phone: '99 826 46 43', groups: "MY Kimyo #1 Kimyo", time: '(07:00)', teacher: "Master Yoda", date: '01.08.2024', balance: 0, coins: 0, note: "offline dars kerak", status: 'Faol' }
      ];
      setStudentsData(defaultStudents);
      localStorage.setItem('studentsList', JSON.stringify(defaultStudents));
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    if (activeDropdown !== null) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeDropdown]);

  // ================= FILTRLASH MANTIQI =================
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredStudents = useMemo(() => {
    return studentsData.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(filters.search.toLowerCase()) || student.phone.includes(filters.search);
      const matchesCourse = filters.course ? student.groups.includes(filters.course) : true;
      const matchesStatus = filters.status ? student.status === filters.status : true;
      
      let matchesFinance = true;
      if (filters.finance === 'Qarzdor') matchesFinance = student.balance < 0;
      if (filters.finance === 'To‘lov amalga oshirilgan') matchesFinance = student.balance >= 0;
      
      const matchesExtraId = filters.extraId ? student.id.toString().includes(filters.extraId) : true;
      const matchesDate = filters.startDate ? student.date.includes(filters.startDate.split('-').reverse().join('.')) : true;

      return matchesSearch && matchesCourse && matchesStatus && matchesFinance && matchesExtraId && matchesDate;
    });
  }, [studentsData, filters]);

  // ================= SARALASH (SORTING) MANTIQI =================
  const sortedStudents = useMemo(() => {
    let sortableItems = [...filteredStudents];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key] ?? '';
        let bVal = b[sortConfig.key] ?? '';

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredStudents, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "fa-solid fa-sort ms-1 text-muted opacity-25";
    return sortConfig.direction === 'asc' ? "fa-solid fa-sort-up ms-1 text-primary" : "fa-solid fa-sort-down ms-1 text-primary";
  };

  // ================= HARAKATLAR =================
  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelectedStudents(sortedStudents.map(s => s.id));
    else setSelectedStudents([]);
  };

  const toggleSelectStudent = (id) => {
    setSelectedStudents(prev => prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]);
  };

  const handleActionClick = (e, id) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({ top: rect.bottom + 4, left: rect.left - 100 });
    setActiveDropdown(prev => prev === id ? null : id);
  };

  // --- Ommaviy harakatlar ---
  const confirmAddToGroup = (groupData) => {
    const updatedStudents = studentsData.map(s => {
      if (selectedStudents.includes(s.id)) {
        return { ...s, groups: groupData.groupName.split('(')[0].trim(), time: `Qo'shildi: ${groupData.joinDate}` };
      }
      return s;
    });
    setStudentsData(updatedStudents);
    localStorage.setItem('studentsList', JSON.stringify(updatedStudents));
    setSelectedStudents([]);
    setIsGroupModalOpen(false);
    showToast(`${selectedStudents.length} ta talaba guruhga qo'shildi!`);
  };

  const confirmSendSms = (message) => {
    console.log("Jo'natildi:", selectedStudents, message);
    setIsSmsModalOpen(false);
    setSelectedStudents([]);
    showToast(`${selectedStudents.length} ta talabaga SMS yuborildi!`);
  };

  const confirmBulkDelete = () => {
    if (window.confirm("Belgilangan talabalarni o'chirishni xohlaysizmi?")) {
      const updatedStudents = studentsData.filter(s => !selectedStudents.includes(s.id));
      setStudentsData(updatedStudents);
      localStorage.setItem('studentsList', JSON.stringify(updatedStudents));
      setSelectedStudents([]);
      showToast("Tanlangan talabalar o'chirildi!");
    }
  };

  // --- Individual harakatlar ---
  const handleEdit = (student) => { setActiveDropdown(null); setStudentToEdit(student); setEditModalOpen(true); };
  const confirmEdit = (updatedStudent) => {
    const updatedStudents = studentsData.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudentsData(updatedStudents); localStorage.setItem('studentsList', JSON.stringify(updatedStudents));
    showToast("Talaba yangilandi!");
  };

  const handlePayment = (student) => { setActiveDropdown(null); setPaymentModal({ isOpen: true, student }); };
  const confirmPayment = (studentId, amount, paymentDetails) => {
    const updatedStudents = studentsData.map(s => {
      if (s.id === studentId) return { ...s, balance: Math.round((Number(s.balance) + amount) * 100) / 100 };
      return s;
    });
    setStudentsData(updatedStudents); localStorage.setItem('studentsList', JSON.stringify(updatedStudents));
    setPaymentModal({ isOpen: false, student: null }); showToast(`To'lov saqlandi`);
  };

  const handleDelete = (student) => { setActiveDropdown(null); setDeleteModal({ isOpen: true, student }); };
  const confirmDelete = () => {
    const filtered = studentsData.filter(s => s.id !== deleteModal.student.id);
    setStudentsData(filtered); localStorage.setItem('studentsList', JSON.stringify(filtered));
    setDeleteModal({ isOpen: false, student: null }); showToast("Talaba o'chirildi!");
  };

  // --- EXCEL (.xlsx) YUKLAB OLISH ---
  const exportToExcel = () => {
    if (sortedStudents.length === 0) {
      alert("Yuklab olish uchun talabalar yo'q!");
      return;
    }

    const excelData = sortedStudents.map((student, index) => ({
      "№": index + 1,
      "Ism va Familiya": student.name,
      "Telefon raqami": student.phone,
      "Holati": student.status,
      "Guruh nomi": student.groups,
      "Moliyaviy holati (Balans)": student.balance + " UZS",
      "Teglar": student.note || "Yo'q", 
      "Yaratilgan sana": student.date.split('—')[0].trim()
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Talabalar ro'yxati");
    XLSX.writeFile(workbook, "Talabalar_Royxati.xlsx");
    
    showToast("Excel fayli muvaffaqiyatli yuklab olindi!");
  };

  return (
    <div className="students-container">
      {/* Yashil xabarnoma */}
      {toast.show && (
        <div className="custom-toast">
          <i className="fa-solid fa-circle-check" style={{marginRight: '8px'}}></i>{toast.message}
        </div>
      )}

      {/* Sarlavha */}
      <div className="page-header">
        <div className="title-section">
          <h1>Talabalar</h1>
          <span>Miqdor — {sortedStudents.length}</span>
        </div>
        <button className="btn-add" onClick={() => setIsAddModalOpen(true)}>
          Yangisini qo'shish
        </button>
      </div>

      {/* 1 & 2. FILTRLAR */}
      <div className="filter-grid-2">

        <input
          type="text"
          placeholder="Ism yoki telefon orqali qidirish"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          className="wide"
        />

        <select name="course" value={filters.course} onChange={handleFilterChange}>
          <option value="">Kurslar</option>
          <option value="Kimyo">Kimyo</option>
          <option value="Dizayn">Dizayn</option>
          <option value="Intensive">Intensive</option>
        </select>

        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">Talaba holati</option>
          <option value="Faol">Aktiv (Faol)</option>
          <option value="Sinov darsida">Sinov darsida</option>
          <option value="Muzlatilgan">Muzlatilgan</option>
          <option value="Arxivlangan">Arxivlangan</option>
          <option value="Guruhlarga biriktirilmagan">Guruhsiz</option>
        </select>

        <select name="finance" value={filters.finance} onChange={handleFilterChange}>
          <option value="">Moliyaviy holati</option>
          <option value="Qarzdor">Qarzdor</option>
          <option value="To‘lov amalga oshirilgan">To‘lov amalga oshirilgan</option>
        </select>

        <select name="tag" value={filters.tag} onChange={handleFilterChange}>
          <option value="">Teglar</option>
          <option value="Yangi">Yangi</option>
        </select>

        <input
          type="text"
          placeholder="ID"
          name="extraId"
          value={filters.extraId}
          onChange={handleFilterChange}
        />

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
        />

      </div>

      <div className="table-actions">
        <button className="btn-columns"><i className="fa-solid fa-gear"></i> Ustunlar</button>
      </div>

      {/* 3. JADVAL VA AMALLAR */}
      <div className="table-container table-responsive">
        <table className="students-table table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th style={{ width: '3%' }}>
                <input 
                  type="checkbox" 
                  checked={sortedStudents.length > 0 && selectedStudents.length === sortedStudents.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th style={{ width: '5%' }}>Foto</th>
              <th style={{ width: '15%', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('name')}>
                Ism <i className={getSortIcon('name')}></i>
              </th>
              <th style={{ width: '10%', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('phone')}>
                Telefon <i className={getSortIcon('phone')}></i>
              </th>
              <th style={{ width: '18%', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('groups')}>
                Guruhlar <i className={getSortIcon('groups')}></i>
              </th>
              <th style={{ width: '12%', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('teacher')}>
                O'qituvchilar <i className={getSortIcon('teacher')}></i>
              </th>
              <th style={{ width: '12%', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('date')}>
                Mashg'ulotlar <i className={getSortIcon('date')}></i>
              </th>
              <th style={{ width: '10%', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('balance')}>
                Balans <i className={getSortIcon('balance')}></i>
              </th>
              <th style={{ width: '5%', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('coins')}>
                Coins <i className={getSortIcon('coins')}></i>
              </th>
              <th style={{ width: '8%', cursor: 'pointer', userSelect: 'none' }} onClick={() => requestSort('note')}>
                Izoh <i className={getSortIcon('note')}></i>
              </th>
              <th style={{ width: '2%' }}>
                {/* Ommaviy harakatlar ikonkalari */}
                <div className="table-head-icons d-flex justify-content-end gap-3">
                  <i className="fa-regular fa-folder" title="Guruhga qo'shish"
                     style={{ cursor: selectedStudents.length > 0 ? 'pointer' : 'default', color: selectedStudents.length > 0 ? '#F27A21' : '#bbb' }}
                     onClick={() => selectedStudents.length > 0 ? setIsGroupModalOpen(true) : alert("Talaba belgilang!")}>
                  </i>
                  <i className="fa-regular fa-envelope" title="SMS yuborish"
                     style={{ cursor: selectedStudents.length > 0 ? 'pointer' : 'default', color: selectedStudents.length > 0 ? '#F27A21' : '#bbb' }}
                     onClick={() => selectedStudents.length > 0 ? setIsSmsModalOpen(true) : alert("SMS yuborish uchun talaba belgilang!")}>
                  </i>
                  <i className="fa-regular fa-trash-can cursor-pointer" title="O'chirish"
                     style={{ cursor: selectedStudents.length > 0 ? 'pointer' : 'default', color: selectedStudents.length > 0 ? '#EF4444' : '#bbb' }}
                     onClick={() => selectedStudents.length > 0 ? confirmBulkDelete() : null}>
                  </i>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.length > 0 ? sortedStudents.map((student, index) => (
              <tr key={student.id} onClick={() => navigate(`/students/${student.id}`)} style={{ cursor: "pointer" }}>
                <td className="text-gray" onClick={(e) => e.stopPropagation()}>
                  {index + 1}. <input type="checkbox" style={{marginLeft: '8px', cursor: 'pointer'}} checked={selectedStudents.includes(student.id)} onChange={() => toggleSelectStudent(student.id)} />
                </td>
                <td><div className="avatar-placeholder"><i className="fa-solid fa-user"></i></div></td>
                <td style={{ fontWeight: '500' }}>
                  {student.name} <br/> <span className="badge bg-light text-secondary border mt-1">{student.status}</span>
                </td>
                <td className="text-blue">{student.phone}</td>
                <td><span className="badge-gray" style={{display: 'inline-block', marginBottom: '4px'}}>{student.groups}</span> <br/> {student.time}</td>
                <td>{student.teacher}</td>
                <td className="text-gray" style={{ whiteSpace: 'pre-line' }}>{student.date}</td>
                <td><span className={student.balance < 0 ? "badge bg-danger text-white rounded-pill" : "badge bg-success text-white rounded-pill"}>{student.balance}</span></td>
                <td><i className="fa-solid fa-coins text-warning me-1"></i> {student.coins}</td>
                <td className="text-gray" style={{fontSize: '12px'}}>{student.note}</td>
                <td className="action-cell" style={{ position: 'relative' }}>
                  <div onClick={(e) => handleActionClick(e, student.id)} style={{ cursor: 'pointer', padding: '5px 15px', fontSize: '22px', fontWeight: 'bold', color: '#F27A21', userSelect: 'none' }}>⋮</div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="11" className="text-center py-5 text-muted">Tanlangan filtrlarga mos talabalar topilmadi.</td></tr>
            )}
          </tbody>
        </table>

        {/* Uchta nuqta menyusi */}
        {activeDropdown && currentStudent && (
          <div style={{position: 'absolute', top: dropdownPosition.top, left: dropdownPosition.left, background: 'white', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '6px', minWidth: '140px', zIndex: 9999}} onClick={(e) => e.stopPropagation()}>
            <button className="dropdown-item" onClick={() => { handleEdit(currentStudent); setActiveDropdown(null); }}><i className="fa-solid fa-pen me-2"></i> Tahrirlash</button>
            <button className="dropdown-item" onClick={() => { handlePayment(currentStudent); setActiveDropdown(null); }}><i className="fa-solid fa-money-bill me-2"></i> To'lov</button>
            <button className="dropdown-item delete text-danger" onClick={() => { handleDelete(currentStudent); setActiveDropdown(null); }}><i className="fa-solid fa-trash me-2"></i> O'chirish</button>
          </div>
        )}
      </div>

      <div className="table-footer mt-4 d-flex justify-content-between">
        <div className="pagination d-flex align-items-center gap-3 text-muted">
          <span style={{cursor:'pointer'}}>|◁</span><span style={{cursor:'pointer'}}>◁</span>
          <div className="page-active border border-warning text-warning rounded-circle d-flex align-items-center justify-content-center" style={{width:'32px', height:'32px'}}>1</div>
          <span style={{cursor:'pointer'}}>▷</span><span style={{cursor:'pointer'}}>▷|</span>
        </div>
        <div className="export-actions d-flex gap-2">
          <button className="circle-btn btn-upload"><i className="fa-solid fa-cloud-arrow-up"></i></button>
          {/* Excel Yuklash */}
          <button className="circle-btn btn-download" onClick={exportToExcel} title="Excel formatida yuklab olish">
            <i className="fa-solid fa-download"></i>
          </button>
        </div>
      </div>

      {/* ================= MODALLAR ================= */}
      <AddStudentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={() => { fetchStudents(); showToast("Yangi talaba qo'shildi!"); }} />
      <EditStudentModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} onSuccess={confirmEdit} student={studentToEdit} />
      <PaymentModal isOpen={paymentModal.isOpen} onClose={() => setPaymentModal({ isOpen: false, student: null })} onSuccess={confirmPayment} student={paymentModal.student} />
      <AddGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} onSuccess={confirmAddToGroup} selectedCount={selectedStudents.length} />
      <SmsModal isOpen={isSmsModalOpen} onClose={() => setIsSmsModalOpen(false)} onSuccess={confirmSendSms} selectedCount={selectedStudents.length} />

      {/* Yakkalik O'chirish Modali */}
      {deleteModal.isOpen && (
        <div className="mini-modal-overlay">
          <div className="mini-modal bg-white p-4 rounded text-center" style={{width: '350px'}}>
            <h4 className="mb-3">Haqiqatan ham o'chirasizmi?</h4>
            <p className="text-muted mb-4">Siz <b>{deleteModal.student?.name}</b> ismli talabani tizimdan o'chirmoqchisiz.</p>
            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-light border" onClick={() => setDeleteModal({ isOpen: false, student: null })}>Bekor qilish</button>
              <button className="btn btn-danger" onClick={confirmDelete}>O'chirish</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Students;