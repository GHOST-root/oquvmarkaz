import React, { useRef } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// ===================
// PIE CHART DATA
// ===================
const pieChartData = {
  labels: ["Boshqalar", "Instagramdan", "Telegram"],
  datasets: [
    {
      label: "Lidlar",
      data: [1, 4, 8],
      backgroundColor: ["#3f2a63", "#a7a81c", "#ff6b6b"]
    }
  ]
};

const pieConfig = {
  responsive: true,
  plugins: {
    legend: { position: "top" }
  }
};

// ===================
// FLOATING BAR – OYLAR
// ===================
const months = ["Oktyabr"];
// keyin xohlasang:
// const months = ["Oktyabr", "Noyabr", "Dekabr"];

const createRandomRange = () => {
  const min = Math.floor(Math.random() * 50);
  const max = min + Math.floor(Math.random() * 100);
  return [min, max];
};

const floatingBarData = {
  labels: months,
  datasets: [
    {
      label: "Lidlar oralig‘i",
      data: months.map(() => createRandomRange()),
      backgroundColor: "#ff6b6b",
      borderRadius: 6
    }
  ]
};

const floatingBarConfig = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: {
      display: true,
      text: "Lidlar (oy bo‘yicha)"
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

// ===================
// COMPONENT
// ===================
const Lidlarhisob = () => {
  const pieRef = useRef(null);
  const barRef = useRef(null);

  const totalLidlar = pieChartData.datasets[0].data.reduce(
    (a, b) => a + b,
    0
  );

  // ===================
  // OYLIK RANDOMIZE (TO‘G‘RI USUL)
  // ===================
  const randomizeBarData = () => {
    if (!barRef.current) return;

    const chart = barRef.current.chart;

    chart.data.datasets[0].data = months.map(() =>
      createRandomRange()
    );

    chart.update();
  };

  return (
    <div className="report-main-container">
      {/* Yuqori panel */}
      <div className="py-2 cr-notification d-flex justify-content-between mb-3 top-bar">
        <p className="ps-3 license-info">
          <i className="fa-regular fa-calendar"></i>{" "}
          Litsenziya muddati:
          <span className="text-danger"> 17.10.2025 - 23:59</span>
        </p>
        <button className="cr-exit-button rounded-5 me-3">
          To'lash
        </button>
      </div>

      <div className="bg-white p-4">
        <h3 className="fw-normal">Lidlar hisobotlari</h3>

        {/* Statistik blok */}
        <div className="stats-header-line">
          <div className="lid-count-box bg-white w-50 py-4 shadow d-flex justify-content-between pe-3">
            <p className="lid-count-text">
              Lidlar soni: <span>{totalLidlar}</span>
            </p>
            <i className="fa-solid fa-coins fs-3 text-info"></i>
          </div>
        </div>

        <div className="content-grid-area">
          {/* CHAP PANEL */}
          <div className="left-panel">
            <div className="chart-box pie-chart-wrapper oyboyi">
              <Pie ref={pieRef} data={pieChartData} options={pieConfig} />
            </div>
          </div>

          {/* O‘NG PANEL */}
          {/* <div className="right-panel mt-4 pt-3">
            <div className="chart-box bar-chart-box oboyi">
              <Bar
                ref={barRef}
                data={floatingBarData}
                options={floatingBarConfig}
              />

              <button
                className="cr-exit-button rounded-5 mt-3"
                onClick={randomizeBarData}
              >
                Randomize
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Lidlarhisob;