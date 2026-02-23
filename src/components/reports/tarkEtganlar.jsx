import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// ChartJS komponentlarini ro'yxatdan o'tkazish
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Grafiklar uchun umumiy sozlamalar (Options)
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }, // Rasmdagidek legend shart emas
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 2, // Rasmdagi kabi max qiymat
      ticks: { stepSize: 1 }
    },
    x: {
      grid: { display: false }
    }
  }
};

const Tarketganhisob = () => {
  
  // 1. Ustoz kesimida ma'lumotlar
  const teacherData = {
    labels: ['First teacher'],
    datasets: [{
      data: [1],
      backgroundColor: '#4bc085', // Yashil rang
      barThickness: 250, // Rasmdagidek kengroq bo'lishi uchun
    }]
  };

  // 2. Kurs kesimida ma'lumotlar
  const courseData = {
    labels: ['First Course'],
    datasets: [{
      data: [1],
      backgroundColor: '#ee6b51', // Qizg'ish rang
      barThickness: 250,
    }]
  };

  // 3. Oylik kesimida ma'lumotlar
  const monthlyData = {
    labels: ['October 2025'],
    datasets: [{
      data: [1],
      backgroundColor: '#22d3ee', // Och ko'k rang
      barThickness: 250,
    }]
  };

  // 4. Sabab kesimida ma'lumotlar
  const reasonData = {
    labels: ['Sababsiz'],
    datasets: [{
      data: [1],
      backgroundColor: '#8b5cf6', // Binafsha rang
      barThickness: 250,
    }]
  };

  return (
    <div style={{ backgroundColor: '#f4f4f4', padding: '20px', minHeight: '100vh' }}>
      
      {/* Yuqori litsenziya paneli */}
      <div className="py-2 cr-notification d-flex justify-content-between">
          <p className="ps-3">
            <i className="fa-regular fa-calendar"></i> Litefsianiyaning platformaga amal qilish muddati:
            <span className="text-danger"> 17.10.2025 - 23:59 1 kundan kam vaqt qoldi</span>
          </p>
          <button className="cr-exit-button rounded-5 me-3">To'lash</button>
        </div>

      {/* Sarlavha va Miqdor */}
      <div className="mb-4">
        <h2 className="h4 fw-bold">Guruhni tark etgan o'quvchilar <span className="text-muted fw-normal fs-6 ms-3">Miqdor — 1</span></h2>
      </div>

      {/* Filtrlar paneli (Statik ko'rinish) */}
      <div className="bg-white">
      <div className="  p-3 rounded mb-4  gap-3 bg-white">
       <div className="  p-3 rounded     d-flex gap-3">
         <input type="date" className="form-control w-auto" defaultValue="2025-10-01" />
         <input type="date" className="form-control w-auto" defaultValue="2025-10-18" />
         <select className="form-select w-auto"><option>Kurs</option></select>
         <select className="form-select w-auto"><option>O'qituvchi</option></select>
         <select className="form-select w-auto"><option>Arxivlash sabablari</option></select>
       </div>
       <div className=" ps-3 rounded    d-flex gap-3 p-0 m-0">
         <button className="btn btn-primary px-4 ">Filtr</button>
         <button className="btn btn-outline-secondary"><i className="fa-solid fa-rotate-right"></i></button>
       </div>
      </div>

      {/* Grafiklar To'plami */}
      <div className="row g-4">
        {/* Ustoz kesimida */}
        <div className="col-md-6">
          <div className="bg-white p-3 rounded shadow-sm" style={{ height: '350px' }}>
            <h6 className="fw-bold mb-4">Ustoz kesimida</h6>
            <div style={{ height: '250px' }}>
              <Bar data={teacherData} options={commonOptions} />
            </div>
          </div>
        </div>


{/* Kurs kesimida */}
        <div className="col-md-6">
          <div className="bg-white p-3 rounded shadow-sm" style={{ height: '350px' }}>
            <h6 className="fw-bold mb-4">Kurs kesimida</h6>
            <div style={{ height: '250px' }}>
              <Bar data={courseData} options={commonOptions} />
            </div>
          </div>
        </div>

        {/* Oylik kesimida */}
        <div className="col-md-6">
          <div className="bg-white p-3 rounded shadow-sm" style={{ height: '350px' }}>
            <h6 className="fw-bold mb-4">Oylik kesimida</h6>
            <div style={{ height: '250px' }}>
              <Bar data={monthlyData} options={commonOptions} />
            </div>
          </div>
        </div>

        {/* Sabab kesimida */}
        <div className="col-md-6">
          <div className="bg-white p-3 rounded shadow-sm" style={{ height: '350px' }}>
            <h6 className="fw-bold mb-4">Sabab kesimida</h6>
            <div style={{ height: '250px' }}>
              <Bar data={reasonData} options={commonOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
  );
};

export default Tarketganhisob;