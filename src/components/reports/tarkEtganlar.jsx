import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./Tarketganhisob.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, max: 2, ticks: { stepSize: 1 } },
    x: { grid: { display: false } },
  },
};

const Tarketganhisob = () => {

  const teacherData = {
    labels: ["First teacher"],
    datasets: [{ data: [1], backgroundColor: "#4bc085", barThickness: 80 }],
  };

  const courseData = {
    labels: ["First Course"],
    datasets: [{ data: [1], backgroundColor: "#ee6b51", barThickness: 80 }],
  };

  const monthlyData = {
    labels: ["October 2025"],
    datasets: [{ data: [1], backgroundColor: "#22d3ee", barThickness: 80 }],
  };

  const reasonData = {
    labels: ["Sababsiz"],
    datasets: [{ data: [1], backgroundColor: "#8b5cf6", barThickness: 80 }],
  };

  return (
    <div className="tarket-page">

      {/* HEADER */}
      <div className="tarket-header">
        <h2>Guruhni tark etgan o'quvchilar</h2>
        <span>Miqdor — 1</span>
      </div>

      {/* FILTER */}
      <div className="tarket-filter">
        <div className="filter-row">
          <input type="date" defaultValue="2025-10-01" />
          <input type="date" defaultValue="2025-10-18" />
          <select><option>Kurs</option></select>
          <select><option>O‘qituvchi</option></select>
          <select><option>Arxivlash sabablari</option></select>
        </div>

        <div className="filter-actions">
          <button className="btn-main">Filtr</button>
          <button className="btn-reset">⟳</button>
        </div>
      </div>

      {/* CHARTS */}
      <div className="chart-grid">

        <div className="chart-card">
          <h6>Ustoz kesimida</h6>
          <div className="chart-box"><Bar data={teacherData} options={commonOptions} /></div>
        </div>

        <div className="chart-card">
          <h6>Kurs kesimida</h6>
          <div className="chart-box"><Bar data={courseData} options={commonOptions} /></div>
        </div>

        <div className="chart-card">
          <h6>Oylik kesimida</h6>
          <div className="chart-box"><Bar data={monthlyData} options={commonOptions} /></div>
        </div>

        <div className="chart-card">
          <h6>Sabab kesimida</h6>
          <div className="chart-box"><Bar data={reasonData} options={commonOptions} /></div>
        </div>

      </div>

    </div>
  );
};

export default Tarketganhisob;