// Tolovlar komponenti
import React, { useState, useMemo,useEffect} from "react";
import StudentDashboard from "./StudentDashboard";
import "./Tolovlar.css";
import { Line } from "react-chartjs-2";
import { Outlet } from "react-router-dom";

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

export default function Tolovlar() {

useEffect(() => {
  fetch('')
  .then(res => res.json())
  .then(data => console.log(data))
}, [])




  const chartData = {
    labels: ["Okt 25", "Okt 26", "Okt 27", "Okt 28", "Okt 29"],
    datasets: [
      {
        label: "Yechib olishlar",
        data: [750000, 750030, 750200, 751000, 753000],
        borderColor: "#1d8ff0",
        backgroundColor: "rgba(29, 143, 240, 0.2)",
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: false,
        suggestedMin: 749990,
        suggestedMax: 750010,
      },
    },
  };

  const initialPayments = [
    {
      id: 1,
      date: "2025-10-17",
      student: "Kamoldin",
      sum: 500000,
      currency: "UZS",
      type: "Naqd pul",
      teacher: "First teacher",
      note: "FrontEnd",
      staff: "Hojimurod Nasriddinov",
      time: "2025-10-17 16:05:58",
    },
    {
      id: 2,
      date: "2025-10-17",
      student: "Faxriddin",
      sum: 400000,
      currency: "UZS",
      type: "Naqd pul",
      teacher: "First teacher",
      note: "FrontEnd",
      staff: "Hojimurod Nasriddinov",
      time: "2025-10-17 16:40:00",
    },
  ];

  const [payments] = useState(initialPayments);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 🔥 filters avval e’lon qilinadi → filtered ishlashi uchun
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    name: "",
    group: "",
    course: "",
    teacher: "",
    staff: "",
    createdFrom: "",
    createdTo: "",
    paymentType: "",
    amount: "",
  });

  const updateField = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const resetFields = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      name: "",
      group: "",
      course: "",
      teacher: "",
      staff: "",
      createdFrom: "",
      createdTo: "",
      paymentType: "",
      amount: "",
    });
  };

  // 🔥 FILTERED to‘g‘ri joyga qo‘yildi
  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (filters.fromDate && p.date < filters.fromDate) return false;
      if (filters.toDate && p.date > filters.toDate) return false;

      if (filters.name) {
        const n = filters.name.toLowerCase();
        if (!p.student.toLowerCase().includes(n)) return false;
      }

      if (filters.group && p.note !== filters.group) return false;
      if (filters.teacher && p.teacher !== filters.teacher) return false;
      if (filters.paymentType && p.type !== filters.paymentType) return false;

      if (filters.amount && Number(filters.amount) !== p.sum) return false;

      if (filters.staff && p.staff !== filters.staff) return false;

      if (filters.createdFrom) {
        const created = p.time.split(" ")[0];
        if (created < filters.createdFrom) return false;
      }
      if (filters.createdTo) {
        const created = p.time.split(" ")[0];
        if (created > filters.createdTo) return false;
      }

      return true;
    });
  }, [payments, filters]);

  // 🔥 totals filtered dan keyin turishi shart!
  const totals = useMemo(() => {
    const totalSum = filtered.reduce((s, p) => s + p.sum, 0);
    return { totalSum, profit: totalSum };
  }, [filtered]);

  // Agar talaba tanlansa — dashboard
  if (selectedStudent) {
    return (
      <StudentDashboard
        student={selectedStudent}
        onBack={() => setSelectedStudent(null)}
      />
    );
  }

  const clearFilters = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      name: "",
      group: "",
      teacher: "",
      paymentType: "",
      amount: "",
      staff: "",
      createdFrom: "",
      createdTo: "",
    });
  };

  return (
    <div className="container my-4 tolovlar-page">
      {/* HEADER */}
         
      {/* Top Alert Banner */}

      <h3 className="mb-3">Barcha to'lovlar</h3>

      <div className="row g-3">
        {/* LEFT CARDS */}
        <div className="col-lg-5">
          <div className="card card-stat mb-3">
            <div className="card-body d-flex justify-content-between">
              <div>
                <div className="text-muted small">To'lovlar miqdori:</div>
                <h4 className="fw-bold">
                  {totals.totalSum.toLocaleString()} UZS
                </h4>
                <div className="small text-muted">01.10.2025 — 31.10.2025</div>
              </div>
              <div className="icon-stack">💰</div>
            </div>
          </div>

          <div className="card card-stat mb-3">
            <div className="card-body d-flex justify-content-between">
              <div>
                <div className="text-muted small">Sof foyda miqdori:</div>
                <h4 className="fw-bold">
                  {totals.profit.toLocaleString()} UZS
                </h4>
                <div className="small text-muted">01.10.2025 — 31.10.2025</div>
              </div>
              <div className="icon-stack">💵</div>
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className="col-lg-7">
          <div className="card chart-card">
            <div className="card-body">
              <Line data={chartData} options={chartOptions} height={90} />
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="filter-wrapper container-fluid p-3">
          <div className="row g-3 align-items-end mb-2">
            <div className="col-md-2">
              <label>Sanadan boshlab</label>
              <input
                type="date"
                className="form-control"
                value={filters.fromDate}
                onChange={(e) => updateField("fromDate", e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label>Sana bo‘yicha</label>
              <input
                type="date"
                className="form-control"
                value={filters.toDate}
                onChange={(e) => updateField("toDate", e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label>Ism yoki Telefon</label>
              <input
                type="text"
                className="form-control"
                value={filters.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label>Guruhni tanlang</label>
              <select
                className="form-select"
                value={filters.group}
                onChange={(e) => updateField("group", e.target.value)}
              >
                <option value="">Tanlang</option>
                <option>FrontEnd</option>
              </select>
            </div>

            <div className="col-md-2">
              <label>Kurs</label>
              <select
                className="form-select"
                value={filters.group}
                onChange={(e) => updateField("group", e.target.value)}
              >
                <option value="">Tanlang</option>
                <option>FrontEnd</option>
              </select>
            </div>


            <div className="col-md-2">
              <label>O‘qituvchi</label>
              <select
                className="form-select"
                value={filters.teacher}
                onChange={(e) => updateField("teacher", e.target.value)}
              >
                <option value="">Tanlang</option>
                <option>First teacher</option>
              </select>
            </div>

            <div className="col-md-2">
              <label>To‘lov turi</label>
              <select
                className="form-select"
                value={filters.paymentType}
                onChange={(e) => updateField("paymentType", e.target.value)}
              >
                <option value="">Tanlang</option>
                <option>Naqd pul</option>
              </select>
            </div>

            <div className="col-md-2">
              <label>Sum</label>
              <input
                type="number"
                className="form-control"
                value={filters.amount}
                onChange={(e) => updateField("amount", e.target.value)}
              />
            </div>
          </div>

          <div className="row g-3 align-items-end">
            <div className="col-md-2">
              <label>Xodim</label>
              <select
                className="form-select"
                value={filters.staff}
                onChange={(e) => updateField("staff", e.target.value)}
              >
                <option value="">Tanlang</option>
                <option>Hojimurod Nasriddinov</option>
              </select>
            </div>

            <div className="col-md-2">
              <label>Yaratilgan sanadan</label>
              <input
                type="date"
                className="form-control"
                value={filters.createdFrom}
                onChange={(e) => updateField("createdFrom", e.target.value)}
              />
            </div>

            <div className="col-md-2">
              <label>Yaratilgan sanagacha</label>
              <input
                type="date"
                className="form-control"
                value={filters.createdTo}
                onChange={(e) => updateField("createdTo", e.target.value)}
              />
            </div>

            <div className="col-md-1 d-md-flex">
               <button className="filter-btn">Filter</button>
              <button
                variant="secondary"
                className="ms-2
                btn btn-outline-secondary mt-4"
                onClick={clearFilters}
              >
                Tozalash
              </button>
               


            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="my-4">
<div className="d-flex justify-content-end align-items-center">
          <button className="mb-3  button"><i class="fa-solid fa-gear"></i>Filter</button>
  
</div>
        <div className="table-responsive card">
          <table className="table">
            <thead>
              <tr>
                <th>Sana</th>
                <th>Talaba ismi</th>
                <th>Sum</th>
                <th>To'lov turi</th>
                <th>O'qituvchi</th>
                <th>Izoh</th>
                <th>Xodim</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  onClick={() =>
                    setSelectedStudent({
                      name: p.student,
                      date: p.date,
                      sum: p.sum,
                      group: p.note,
                      teacher: p.teacher,
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td>{p.date}</td>
                  <td>{p.student}</td>
                  <td>
                    {p.sum.toLocaleString()} {p.currency}
                  </td>
                  <td>{p.type}</td>
                  <td>{p.teacher}</td>
                  <td>
                    <span className="badge bg-secondary">{p.note}</span>
                  </td>
                  <td>
                    <div className="small">{p.staff}</div>
                    <div className="small text-muted">{p.time}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
