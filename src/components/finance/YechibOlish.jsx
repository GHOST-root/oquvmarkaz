import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./YechibOlish.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function YechibOlish() {
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    search: "",
    sum: "",
    kurs: "",
  });

  const [data, setData] = useState([
    {
      sana: "17.10.2025",
      name: "Jumaqozi",
      sum: 250000,
      izoh: "FrontEnd 7 dars (17.10 — 31.10)",
      xodim: "Hojimurod Nasriddinov 16:04",
    },
    {
      sana: "17.10.2025",
      name: "Kamoldin",
      sum: 250000,
      izoh: "FrontEnd 7 dars (17.10 — 31.10)",
      xodim: "Hojimurod Nasriddinov 16:05",
    },
    {
      sana: "17.10.2025",
      name: "Faxriddin",
      sum: 250000,
      izoh: "FrontEnd 7 dars (17.10 — 31.10)",
      xodim: "Hojimurod Nasriddinov 16:40",
    },
  ]);

  // 🔴 MODAL STATES
  const [showModal, setShowModal] = useState(false);
  const [selectedName, setSelectedName] = useState(null);

  const handleFilter = () => {
    return data.filter((item) => {
      const matchFrom = filters.from
        ? new Date(item.sana) >= new Date(filters.from)
        : true;
      const matchTo = filters.to
        ? new Date(item.sana) <= new Date(filters.to)
        : true;

      const matchSearch = item.name
        .toLowerCase()
        .includes(filters.search.toLowerCase());

      const matchSum = filters.sum ? item.sum == filters.sum : true;

      return matchFrom && matchTo && matchSearch && matchSum;
    });
  };

  // ✅ HA bosilganda o‘chadi
  const confirmDelete = () => {
    setData(data.filter((x) => x.name !== selectedName));
    setShowModal(false);
    setSelectedName(null);
  };

  const filtered = handleFilter();
  const totalSum = filtered.reduce((a, b) => a + b.sum, 0);

  const chartData = {
    labels: ["Okt 25", "Okt 26", "Okt 27", "Okt 28", "Okt 29"],
    datasets: [
      {
        label: "Yechib olishlar",
        data: [1150100, 950001, 850000, 839999, 750000],
        borderColor: "#1d8ff0",
        backgroundColor: "rgba(29, 143, 240, 0.2)",
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: false,
        suggestedMin: 749990,
        suggestedMax: 750010,
      },
    },
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-3">Yechib olish</h2>

      {/* SUMMARY */}
      <div className="row">
        <div className="col-5">
          <div className="card shadow-sm p-3 mb-4">
            <h5>
              Jami yechib olishlar:{" "}
              <span className="text-primary fw-bold">
                {totalSum.toLocaleString()} UZS
              </span>
            </h5>
          </div>
        </div>

        <div className="col-7">
          <div className="card p-3 shadow-sm mb-4">
            {/* <Line data={chartData} options={chartOptions} height={90} /> */}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <Link to="XarajatToifalari">
        <button>XarajatToifalari</button>
      </Link>
      <div className="card p-3 shadow-sm">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Sana</th>
              <th>Talaba</th>
              <th>Sum</th>
              <th>Izoh</th>
              <th>Xodim</th>
              <th>Harakat</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={i}>
                <td>{item.sana}</td>
                <td>{item.name}</td>
                <td>{item.sum.toLocaleString()} UZS</td>
                <td>{item.izoh}</td>
                <td>{item.xodim}</td>
                <td>
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setSelectedName(item.name);
                      setShowModal(true);
                    }}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  Maʼlumot topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="dawnloade d-flex justify-content-end mt-3">
          {" "}
          <i className="fa-solid fa-circle-down"></i>{" "}
        </div>
      </div>

      {/* 🔴 TASDIQLASH MODALI */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tasdiqlash</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <p>
                  <strong>{selectedName}</strong> maʼlumotini rostdan ham
                  o‘chirishni xohlaysizmi?
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Bekor qilish
                </button>
                <button className="btn ochirish" onClick={confirmDelete}>
                  Ha, o‘chirish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
