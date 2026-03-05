import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler
} from 'chart.js';

// Chart.js modulini ishga tushirish
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const RevenueChart = () => {
  const chartData = {
    labels: ['авг 24', 'сен 24', 'окт 24', 'ноя 24', 'дек 24', 'фев 25'],
    datasets: [
      {
        fill: true,
        data: [400000, 1600000, 150000, 500000, 0, 1000000],
        borderColor: '#F27A21',
        backgroundColor: 'rgba(242, 122, 33, 0.05)',
        borderWidth: 2,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#F27A21',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4 // Egri (to'lqinsimon) chiziq
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { 
        beginAtZero: true, 
        border: { display: false }, 
        grid: { color: '#f0f0f0' }, 
        ticks: { stepSize: 200000, callback: (val) => val + ' UZS' } 
      },
      x: { grid: { display: false } }
    }
  };

  return (
    <div className="dashboard-card" style={{ height: '350px', maxWidth: '1200px' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default RevenueChart;