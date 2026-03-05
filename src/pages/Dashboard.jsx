import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

import StatCards from '../components/dashboard/StatCards';
import ExpandedList from '../components/dashboard/ExpandedList';
import ExpandedGroupsList from '../components/dashboard/ExpandedGroupList'; // Fayl nomiga e'tibor bering: ExpandedGroupList yoki ExpandedGroupsList
import RevenueChart from '../components/dashboard/RevuneChart';
import Timetable from '../components/dashboard/Timetable'; // Izohdan chiqarildi
import ExpandedDebtorsList from '../components/dashboard/ExpandedDebtorsList';
import ExpandedTrialList from '../components/dashboard/ExpandedTrialsList'; // Fayl nomi: ExpandedTrialList yoki ExpandedTrialsList
import ExpandedPaidList from '../components/dashboard/ExpandedPaidList';
import ExpandedLeftActiveList from '../components/dashboard/ExpandedLeftActiveList';
import ExpandedLeftTrialList from '../components/dashboard/ExpandedLeftTrialList';
import ExpandedLeadsList from '../components/dashboard/ExpandedLeadsList';
import ConfirmDeleteModal from '../components/dashboard/ConfirmDeleteModal'; // Yo'lini tekshiring, odatda 'components/ConfirmDeleteModal' bo'lishi mumkin

const Dashboard = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [activeView, setActiveView] = useState(null); 
  const [dashboardStats, setDashboardStats] = useState({ 
    activeStudentsCount: 0, debtorsCount: 0, trialCount: 0, paidCount: 0, leftActiveCount: 0, leftTrialCount: 0, groupsCount: 6 
  });

  // --- MOCK GURUHLAR BAZASI (Backend ulanmaguncha) ---
  const mockGroups = [
    { id: 1, name: "1-guruh", course: "Intensive pro", teacher: "Master Ugvey", days: "Juft kunlar\n09:00", dates: "01.02.2025 —\n17.07.2026", duration: "3 oy\n1 hafta", room: "MIT xonasi", studentsCount: 1 },
    { id: 2, name: "AK Dizayn #22", course: "Dizayn", teacher: "Abror Karimov", days: "Toq kunlar\n13:00", dates: "01.02.2025 —\n01.08.2025", duration: "3 oy\n1 hafta", room: "Yale xonasi", studentsCount: 2 },
    { id: 3, name: "BA Front-end #2", course: "Front-end", teacher: "Bekzod Akbararov", days: "Juft kunlar\n08:00", dates: "01.02.2025 —\n01.08.2025", duration: "3 oy\n1 hafta", room: "Harward xonasi", studentsCount: 1 },
    { id: 4, name: "FA Geografiya #1", course: "Geografiya", teacher: "Faxriddin Abrorov", days: "Juft kunlar\n08:00", dates: "01.08.2024 —\n01.08.2025", duration: "9 oy\n1 hafta", room: "Cambridge xonasi", studentsCount: 1 },
    { id: 5, name: "MY Kimyo #1", course: "Kimyo", teacher: "Master Yoda", days: "Toq kunlar\n07:00", dates: "01.08.2024 —\n01.08.2025", duration: "9 oy\n1 hafta", room: "Oxford xonasi", studentsCount: 3 },
    { id: 6, name: "Roboto texnika #1 SJ", course: "Geografiya", teacher: "Steve Jobs", days: "Juft kunlar\n10:00", dates: "01.11.2024 —\n01.11.2025", duration: "6 oy\n1 hafta", room: "Robototexnika", studentsCount: 2 }
  ];

  useEffect(() => {
    const fetchStats = () => {
      const localData = localStorage.getItem('studentsList');
      
      if (localData) {
        const students = JSON.parse(localData);
        setAllStudents(students);

        // Barcha hisoblagichlarni bitta joyda ochamiz
        let totalActiveEnrollments = 0;
        let totalDebtors = 0;
        let totalTrial = 0;
        let totalPaid = 0;
        let totalLeftActive = 0; 
        let totalLeftTrial = 0; 

        students.forEach(student => {
          if (student.balance < 0) totalDebtors++;
          if (student.balance >= 0) totalPaid++; 
          if (student.status === 'Arxivlangan') totalLeftActive++;
          if (student.status === 'Sinovdan ketgan') totalLeftTrial++;

          if (student.status === 'Sinov darsida') {
            totalTrial += (student.enrollments && Array.isArray(student.enrollments)) ? student.enrollments.length : 1;
          }

          if (student.status === 'Faol') {
            totalActiveEnrollments += (student.enrollments && Array.isArray(student.enrollments)) ? student.enrollments.length : 1;
          }
        });

        // Barcha topilgan sonlarni BITTA obyekt qilib state'ga uzatamiz
        setDashboardStats({ 
          activeStudentsCount: totalActiveEnrollments, 
          debtorsCount: totalDebtors, 
          trialCount: totalTrial,
          paidCount: totalPaid,
          leftActiveCount: totalLeftActive,
          leftTrialCount: totalLeftTrial,
          groupsCount: mockGroups.length 
        });
      }
    };

    fetchStats();
  }, []); 

  // --- LIDLAR VA O'CHIRISH MANTIG'I ---
  const [leads, setLeads] = useState([
    { id: 1, name: 'Sardor Ibrohimov', phone: '+998 90 123 45 67', time: '14:30 / 02.03.2026' },
    { id: 2, name: 'Malika Karimova', phone: '+998 99 765 43 21', time: '10:15 / 02.03.2026' },
    { id: 3, name: 'Javohir Toirov', phone: '+998 93 111 22 33', time: '09:00 / 01.03.2026' }
  ]);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== itemToDelete));
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      setToastMessage("Lid muvaffaqiyatli o'chirildi!");
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  return (
    <div className="dashboard-container">
      
      {/* 1. KARTALAR DOIM KO'RINIB TURADI */}
      <StatCards dashboardStats={dashboardStats} activeView={activeView} setActiveView={setActiveView} />

      {/* 2. OCHILADIGAN RO'YXATLAR (Faqat mos karta bosilsa ochiladi) */}
      {activeView === 'leads' && <ExpandedLeadsList leads={leads} onClose={() => setActiveView(null)} onDelete={handleDeleteClick} />}
      {activeView === 'active_students' && <ExpandedList students={allStudents.filter(s => s.status === 'Faol')} onClose={() => setActiveView(null)} title="Faol talabalar ro'yxati" />}
      {activeView === 'groups' && <ExpandedGroupsList groups={mockGroups} onClose={() => setActiveView(null)} />}
      {activeView === 'debtors' && <ExpandedDebtorsList debtors={allStudents.filter(s => s.balance < 0)} onClose={() => setActiveView(null)} />}
      {activeView === 'trial' && <ExpandedTrialList students={allStudents.filter(s => s.status === 'Sinov darsida')} onClose={() => setActiveView(null)} />}
      {activeView === 'paid' && <ExpandedPaidList students={allStudents.filter(s => s.balance >= 0)} onClose={() => setActiveView(null)} />}
      {activeView === 'left_active' && <ExpandedLeftActiveList students={allStudents.filter(s => s.status === 'Arxivlangan')} onClose={() => setActiveView(null)} />}
      {activeView === 'left_trial' && <ExpandedLeftTrialList students={allStudents.filter(s => s.status === 'Sinovdan ketgan')} onClose={() => setActiveView(null)} />}

      {/* 3. HECH QAYSI KARTA BOSILMAGAN BO'LSA (Boshlang'ich holatda) GRAFIK VA JADVAL CHIQADI */}
      {activeView === null && (
        <div style={{ animation: 'fadeInUp 0.3s ease' }}>
          <RevenueChart />       
          <Timetable />
        </div>
      )}

      {/* 4. MODALLAR VA TOAST (O'chirish xabarlari uchun) */}
      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={confirmDelete} 
      />

      {toastMessage && (
        <div 
          className="position-fixed top-0 start-50 translate-middle-x mt-4 badge bg-success px-4 py-3 shadow border" 
          style={{ zIndex: 9999, fontSize: '14px', animation: 'fadeInDown 0.3s ease' }}
        >
          <i className="fa-solid fa-circle-check me-2"></i>
          {toastMessage}
        </div>
      )}

    </div>
  );
};

export default Dashboard;