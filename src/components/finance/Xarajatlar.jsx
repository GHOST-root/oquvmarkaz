// Xarajatlar.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
} from "react-bootstrap";
import "./Xarajatlar.css";
import { FaEdit, FaTrash } from "react-icons/fa";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
// import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Xarajatlar() {
  // Barcha saqlangan xarajatlar
  const [allData, setAllData] = useState([]);
  // Hozir jadvalda ko'rsatilayotgan (filterlangan yoki to'liq) ma'lumot
  const [visibleData, setVisibleData] = useState([]);

  // Form (o'ngdagi yangi xarajatlar karti)
  const [form, setForm] = useState({
    nomi: "",
    sana: "",
    turkum: "",
    oluvchi: "",
    sum: "",
    tolovTuri: "",
  });

  // Filterlar
  const [filter, setFilter] = useState({
    from: "",
    to: "",
    nomi: "",
    turkum: "",
    oluvchi: "",
    tolovTuri: "",
  });

  // Lokal saqlovdan yuklash
  useEffect(() => {
    const saved = localStorage.getItem("xarajatlar");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAllData(parsed);
        setVisibleData(parsed);
      } catch (e) {
        console.error("LocalStorage read error:", e);
      }
    }
  }, []);

  // Bar chart ma'lumotlarini hisoblash (oylar bo'yicha)
  const getBarChartData = () => {
    const monthlyData = {};

    visibleData.forEach((item) => {
      if (item.sana) {
        const date = new Date(item.sana);
        const monthYear = date.toLocaleString("uz-UZ", {
          year: "numeric",
          month: "short",
        });

        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = 0;
        }
        monthlyData[monthYear] += Number(item.sum || 0);
      }
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });

    return {
      labels: sortedMonths.length > 0 ? sortedMonths : ["2025 okt"],
      datasets: [
        {
          label: "Xarajatlar",
          data:
            sortedMonths.length > 0
              ? sortedMonths.map((month) => monthlyData[month])
              : [0],
          backgroundColor: "#ff8383",
          borderColor: "#ff8383",
          borderWidth: 0,
          borderRadius: 4,
        },
      ],
    };
  };

  // Pie chart ma'lumotlarini hisoblash (turkum bo'yicha)
  const getPieChartData = () => {
    const categoryData = {};

    visibleData.forEach((item) => {
      const category = item.turkum || "Boshqa";
      if (!categoryData[category]) {
        categoryData[category] = 0;
      }
      categoryData[category] += Number(item.sum || 0);
    });

    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);

    // Agar ma'lumot bo'lmasa, default qiymatlar
    if (labels.length === 0) {
      return {
        labels: ["Oylik", "Svet"],
        datasets: [
          {
            data: [50, 50],
            backgroundColor: ["#5ce1c5", "#4a5759"],
            borderWidth: 0,
          },
        ],
      };
    }

    // Ranglar pallitasi
    const colors = ["#5ce1c5", "#4a5759", "#ff8383", "#ffd166", "#8b5cf6"];

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 0,
        },
      ],
    };
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "start",
        labels: {
          boxWidth: 15,
          boxHeight: 15,
          padding: 15,
          font: {
            size: 13,
          },
          generateLabels: function (chart) {
            return [
              {
                text: "Xarajatlar",
                fillStyle: "#ff8383",
                strokeStyle: "#ff8383",
                lineWidth: 0,
              },
            ];
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.parsed.y.toLocaleString() + " UZS";
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString();
          },
        },
        grid: {
          color: "#f0f0f0",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          boxWidth: 15,
          boxHeight: 15,
          padding: 15,
          font: {
            size: 13,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return (
              label +
              ": " +
              value.toLocaleString() +
              " UZS (" +
              percentage +
              "%)"
            );
          },
        },
      },
    },
  };

  // Yangi xarajat qo'shilganda: localStorage va visibleData ni yangilash
  const handleSave = (e) => {
    e && e.preventDefault();

    // Majburiy maydonlarni tekshirish
    if (
      !form.nomi ||
      !form.sana ||
      !form.sum ||
      !form.tolovTuri ||
      !form.turkum
    ) {
      alert(
        "Iltimos required maydonlarni to'ldiring: Nomi, Sana, Sum, Turkum, To'lov turi"
      );
      return;
    }

    const newItem = {
      id: Date.now(),
      nomi: form.nomi,
      sana: form.sana, // yyyy-mm-dd
      turkum: form.turkum,
      oluvchi: form.oluvchi,
      sum: Number(form.sum),
      tolovTuri: form.tolovTuri,
      xodim: "Hojimurod Nasriddinov",
      time: new Date().toLocaleString(),
    };

    const updatedAll = [...allData, newItem];
    setAllData(updatedAll);
    localStorage.setItem("xarajatlar", JSON.stringify(updatedAll));

    // Agar hozirgi filter yangi itemni qamrab olsa — visibleData ga qo'sh
    const shouldInclude = itemMatchesFilter(newItem, filter);
    if (shouldInclude) setVisibleData((v) => [...v, newItem]);

    // Agar filter bo'sh (ya'ni barcha ko'rsatish kerak bo'lsa) ham qo'shiladi
    if (
      !filter.from &&
      !filter.to &&
      !filter.nomi &&
      !filter.turkum &&
      !filter.oluvchi &&
      !filter.tolovTuri
    ) {
      setVisibleData(updatedAll);
    }

    // Tozalash
    setForm({
      nomi: "",
      sana: "",
      turkum: "",
      oluvchi: "",
      sum: "",
      tolovTuri: "",
    });
  };

  // Edit funksiyasi (placeholder)
  const handleEdit = (item) => {
    // Bu yerda modal oching yoki formni to'ldiring
    console.log("Edit:", item);
    alert("Tahrirlash funksiyasi qo'shilmoqda...");
  };

  // O'chirish
  const handleDelete = (id) => {
    if (!window.confirm("Haqiqatan o'chirmoqchimisiz?")) return;
    const updated = allData.filter((i) => i.id !== id);
    setAllData(updated);
    localStorage.setItem("xarajatlar", JSON.stringify(updated));

    // visibleData-ni ham yangilash
    setVisibleData((v) => v.filter((i) => i.id !== id));
  };

  // Filter shartlarini tekshirish uchun yordamchi
  const itemMatchesFilter = (item, f) => {
    // Sana filteri — agar from yoki to bo'sh bo'lsa, shartlar mos keladi
    if (f.from) {
      const fromDate = new Date(f.from + "T00:00:00");
      const itemDate = new Date(item.sana + "T00:00:00");
      if (itemDate < fromDate) return false;
    }
    if (f.to) {
      const toDate = new Date(f.to + "T23:59:59");
      const itemDate = new Date(item.sana + "T00:00:00");
      if (itemDate > toDate) return false;
    }

    if (f.nomi) {
      if (!item.nomi.toLowerCase().includes(f.nomi.toLowerCase())) return false;
    }

    if (f.turkum) {
      if (item.turkum !== f.turkum) return false;
    }

    if (f.oluvchi) {
      if (!item.oluvchi.toLowerCase().includes(f.oluvchi.toLowerCase()))
        return false;
    }

    if (f.tolovTuri) {
      if (item.tolovTuri !== f.tolovTuri) return false;
    }

    return true;
  };

  // Filtrni qo'llash
  const applyFilter = () => {
    const out = allData.filter((item) => itemMatchesFilter(item, filter));
    setVisibleData(out);
  };

  // Filtrni tozalash
  const clearFilter = () => {
    setFilter({
      from: "",
      to: "",
      nomi: "",
      turkum: "",
      oluvchi: "",
      tolovTuri: "",
    });
    setVisibleData(allData);
  };

  // Jami summa hisoblash
  const totalSum = visibleData.reduce((t, i) => t + Number(i.sum || 0), 0);

  return (
    <Container fluid className="x-container">
      <Row>
        <Col md={8} className="w-75">
          <h2 className="mb-3">Xarajatlar</h2>

          <div>
            <Card className="p-3 mb-4 header-card jami-xarajatlar">
              <div className="d-flex justify-content-between align-items-center">
                <h5>
                  Jami xarajatlar miqdori: {totalSum.toLocaleString()} UZS
                </h5>
                <div className="icon-box">💰</div>
              </div>
            </Card>

            <Row>
              <Col md={6}>
                <div className="card grafik-card p-3 mb-3">
                  <div className="grafik-header mb-3">
                    <span className="grafik-line"></span>
                    <strong>
                      Jami xarajatlar miqdori: {totalSum.toLocaleString()} UZS
                    </strong>
                  </div>

                  <div className="grafik-body">
                    <Bar
                      data={getBarChartData()}
                      options={barChartOptions}
                      height={300}
                    />
                  </div>
                </div>
              </Col>

              <Col md={6}>
                <div className="card grafik-card p-3 mb-3">
                  <div className="grafik-header mb-3">
                    <span className="grafik-line"></span>
                    <strong>Turkumlar bo'yicha</strong>
                  </div>

                  <div className="grafik-body">
                    <Pie
                      data={getPieChartData()}
                      options={pieChartOptions}
                      height={300}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>

        <Col md={4} className="w-25">
          <Card className="p-3 right-card">
            <h5>Yangi xarajatlar</h5>
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-2">
                <Form.Label>Nomi</Form.Label>
                <Form.Control
                  value={form.nomi}
                  onChange={(e) => setForm({ ...form, nomi: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Sana</Form.Label>
                <Form.Control
                  type="date"
                  value={form.sana}
                  onChange={(e) => setForm({ ...form, sana: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Turkum</Form.Label>
                <Form.Select
                  value={form.turkum}
                  onChange={(e) => setForm({ ...form, turkum: e.target.value })}
                >
                  <option value="">Tanlang</option>
                  <option value="Oylik">Oylik</option>
                  <option value="Svet">Svet</option>
                  <option value="ovqat">Ovqat</option>
                  <option value="transport">Transport</option>
                  <option value="kommunal">Kommunal</option>
                  <option value="boshqa">Boshqa</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Oluvchi</Form.Label>
                <Form.Control
                  value={form.oluvchi}
                  onChange={(e) =>
                    setForm({ ...form, oluvchi: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>UZS</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    form.sum ? Number(form.sum).toLocaleString("en-US") : ""
                  }
                  onChange={(e) => {
                    // Faqat raqamlarni olish (nuqta va vergullarni olib tashlash)
                    const rawValue = e.target.value.replace(/[^\d]/g, "");
                    setForm({ ...form, sum: rawValue });
                  }}
                  placeholder="0"
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>To'lov turi *</Form.Label>
                <div className="tolov-grid">
                  {[
                    "Naqd pul",
                    "Plastik karta",
                    "Click",
                    "Bank hisobi",
                    "Payme",
                    "Uzum",
                    "Humo",
                  ].map((v) => (
                    <Form.Check
                      key={v}
                      label={v}
                      name="tolovTuri"
                      type="radio"
                      checked={form.tolovTuri === v}
                      onChange={() => setForm({ ...form, tolovTuri: v })}
                    />
                  ))}
                </div>
              </Form.Group>

              <div className="d-grid mt-3">
                <Button type="submit" className="save-btn">
                  Saqlash
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Filter qismi */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Xarajatlar</h4>
      </div>

      {/* FILTER PANEL */}
      <Card className="p-3 filter-box">
        <Row className="g-2 align-items-end">
          <Col md>
            <Form.Label>Sanadan boshlab</Form.Label>
            <Form.Control
              type="date"
              value={filter.from}
              onChange={(e) => setFilter({ ...filter, from: e.target.value })}
            />
          </Col>

          <Col md>
            <Form.Label>Sana bo'yicha</Form.Label>
            <Form.Control
              type="date"
              value={filter.to}
              onChange={(e) => setFilter({ ...filter, to: e.target.value })}
            />
          </Col>

          <Col md>
            <Form.Label>Nomi</Form.Label>
            <Form.Control
              value={filter.nomi}
              onChange={(e) => setFilter({ ...filter, nomi: e.target.value })}
            />
          </Col>

          <Col md>
            <Form.Label>Kategoriya</Form.Label>
            <Form.Select
              value={filter.turkum}
              onChange={(e) => setFilter({ ...filter, turkum: e.target.value })}
            >
              <option value="">Tanlang</option>
              <option value="Svet">Svet</option>
              <option value="Oylik">Oylik</option>
              <option value="ovqat">Ovqat</option>
              <option value="transport">Transport</option>
            </Form.Select>
          </Col>

          <Col md>
            <Form.Label>Oluvchi</Form.Label>
            <Form.Control
              value={filter.oluvchi}
              onChange={(e) =>
                setFilter({ ...filter, oluvchi: e.target.value })
              }
            />
          </Col>

          <Col md>
            <Form.Label>To'lov turi</Form.Label>
            <Form.Select
              value={filter.tolovTuri}
              onChange={(e) =>
                setFilter({ ...filter, tolovTuri: e.target.value })
              }
            >
              <option value="">Tanlang</option>
              <option value="Naqd pul">Naqd pul</option>
              <option value="Click">Click</option>
              <option value="Plastik karta">Plastik karta</option>
            </Form.Select>
          </Col>

          <Col md="auto" className="d-flex gap-2">
            <Button className="filter-btn" onClick={applyFilter}>
              Filtr
            </Button>

            <Button className="clear-btn" onClick={clearFilter}>
              Tozalash
            </Button>
          </Col>
        </Row>
      </Card>

      {/* JADVAL */}
      <div className="d-flex justify-content-end mt-3">
        <Button variant="outline-secondary" className="top-filter-btn">
          Filtrlar
        </Button>
      </div>

      <Card className="p-3 mt-3">
        <Table hover responsive className="align-middle">
          <thead>
            <tr>
              <th>Sana</th>
              <th>Turkum</th>
              <th>Nomi</th>
              <th>Oluvchi</th>
              <th>To'lov turi</th>
              <th>Sum</th>
              <th>Xodim</th>
              <th className="text-center">Amallar</th>
            </tr>
          </thead>

          <tbody>
            {visibleData.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted">
                  Ma'lumot yo'q
                </td>
              </tr>
            ) : (
              visibleData.map((i) => (
                <tr key={i.id}>
                  <td>{i.sana}</td>
                  <td>{i.turkum}</td>
                  <td>{i.nomi}</td>
                  <td>{i.oluvchi}</td>
                  <td>{i.tolovTuri}</td>
                  <td>{Number(i.sum).toLocaleString()}</td>

                  <td>
                    <div className="fw-semibold">{i.xodim}</div>
                    <small className="text-muted">{i.time}</small>
                  </td>

                  <td className="text-center">
                    <FaEdit
                      className="text-warning me-3 action-icon"
                      role="button"
                      onClick={() => handleEdit(i)}
                    />
                    <FaTrash
                      className="text-danger action-icon"
                      role="button"
                      onClick={() => handleDelete(i.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}
