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
import "./IshHaqi.css";

const IshHaqi = () => {



  const [hisobUsuli, setHisobUsuli] = useState("");
  const [xarajatQiymati, setXarajatQiymati] = useState("");
  const [xarajatQiymati2, setXarajatQiymati2] = useState("");
  const [xarajatTuri, setXarajatTuri] = useState("O'zgarmas");
  const [xarajatTuri2, setXarajatTuri2] = useState("O'zgarmas");
  const [talaba, setTalaba] = useState("");
  const [guruh, setGuruh] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2025-10");
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  
  // LocalStorage'dan ma'lumotlarni yuklash
  const loadFromStorage = () => {
    try {
      const savedRows = localStorage.getItem('ishHaqiRows');
      if (savedRows) {
        return JSON.parse(savedRows);
      }
    } catch (error) {
      console.error('LocalStorage dan yuklashda xatolik:', error);
    }
    // Agar localStorage'da ma'lumot bo'lmasa, default ma'lumotlarni qaytarish
    return [
      {
        usul: "Soatlik",
        maosh: "Asosiy",
        miqdor: "50 000",
        kurs: "Frontend",
        guruh: "FE-01",
        oqituvchi: "Ali",
        talaba: "-",
      },
      {
        usul: "Oylik",
        maosh: "Bonus",
        miqdor: "1 000 000",
        kurs: "Backend",
        guruh: "BE-02",
        oqituvchi: "Vali",
        talaba: "-",
      },
    ];
  };

  const [rows, setRows] = useState(loadFromStorage);

  // Ma'lumotlar o'zgarganda localStorage'ga saqlash
  useEffect(() => {
    try {
      localStorage.setItem('ishHaqiRows', JSON.stringify(rows));
    } catch (error) {
      console.error('LocalStorage ga saqlashda xatolik:', error);
    }
  }, [rows]);

  const formatNumber = (value) => {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, "");
    // Add dots every 3 digits from right
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleXarajatChange = (e, setter) => {
    const formatted = formatNumber(e.target.value);
    setter(formatted);
  };

  const handleAddRow = (isStandard) => {
    const qiymat = isStandard ? xarajatQiymati : xarajatQiymati2;
    const turi = isStandard ? xarajatTuri : xarajatTuri2;
    
    if (!qiymat) {
      alert("Xarajat qiymatini kiriting!");
      return;
    }

    if (!isStandard && !hisobUsuli) {
      alert("Hisoblash usulini tanlang!");
      return;
    }

    const newRow = {
      usul: isStandard ? "Standart" : hisobUsuli,
      maosh: turi,
      miqdor: qiymat,
      kurs: hisobUsuli === "Talaba" ? "-" : "Frontend",
      guruh: hisobUsuli === "Talaba" ? guruh || "-" : "FE-01",
      oqituvchi: "O'qituvchi",
      talaba: hisobUsuli === "Talaba" ? talaba || "-" : "-",
    };

    setRows([...rows, newRow]);
    
    // Reset forms
    if (isStandard) {
      setXarajatQiymati("");
      setXarajatTuri("O'zgarmas");
    } else {
      setXarajatQiymati2("");
      setXarajatTuri2("O'zgarmas");
      setHisobUsuli("");
      setTalaba("");
      setGuruh("");
    }
  };

  const handleDeleteRow = (index, item) => {
    setSelectedIndex(index);
    setSelectedName(item.oqituvchi || item.talaba || "Bu yozuv");
    setShowModal(true);
  };

  const confirmDelete = () => {
    const newRows = rows.filter((_, i) => i !== selectedIndex);
    setRows(newRows);
    setShowModal(false);
    setSelectedIndex(null);
    setSelectedName("");
  };

  const handleCalculate = () => {
    alert(`${selectedMonth} oy uchun hisoblash amalga oshirildi!`);
  };

  const handlePublish = () => {
    alert("Ma'lumotlar e'lon qilindi!");
  };

  const handleDownload = () => {
    alert("Yuklab olish boshlandi...");
  };

  return (
    <Container fluid className="ish-haqi-page">
      <h4 className="mb-3">Ish haqi</h4>

      <Card className="mb-4">
        <h6 className="mt-3 ms-3">⚙️ Ish haqi kalkulyatorini sozlash</h6>

        <Card.Body>
          <div className="step">
            <h5 className="step-text d-flex justify-content-center align-items-center">
              <span className="nambevan">1️⃣</span>
              Barcha o'qituvchilar uchun standart xarajatlarni belgilash
              parametrlarini ko'rsating
            </h5>
          </div>

          <Row className="align-items-center mt-3">
            <Col md={4}>
              <Form.Label>Xarajat qiymati</Form.Label>
              <Form.Control
                placeholder="0"
                value={xarajatQiymati}
                onChange={(e) => handleXarajatChange(e, setXarajatQiymati)}
              />
            </Col>
            <Col md={1} className="mt-2 ozgarmas">
              <Form.Select
                className="mt-4"
                value={xarajatTuri}
                onChange={(e) => setXarajatTuri(e.target.value)}
              >
                <option>O'zgarmas</option>
                <option>Foiz</option>
              </Form.Select>
            </Col>
            <Col md={2} className="mt-4">
              <Button
                variant="outline-primary"
                className="qoshishkok"
                onClick={() => handleAddRow(true)}
              >
                Qo'shish
              </Button>
            </Col>
          </Row>

          <div className="step mt-3">
            <h5 className="step-text d-flex justify-content-center align-items-center">
              <span className="nambevan">2️⃣</span>
              Siz har qanday o'qituvchilar / kurslar / guruhlar / talabalar
              uchun individual hisob-kitobni belgilashingiz mumkin.
            </h5>
          </div>

          <Row className="mt-3">
            <Col md={2}>
              <Form.Label>Hisoblash usuli</Form.Label>
              <Form.Select
                value={hisobUsuli}
                onChange={(e) => setHisobUsuli(e.target.value)}
              >
                <option value="">Select option</option>
                <option value="Soatlik">Soatlik</option>
                <option value="Oylik">Oylik</option>
                <option value="Filial">Filial</option>
                <option value="Talaba">Talaba</option>
              </Form.Select>
            </Col>

            {hisobUsuli === "Talaba" && (
              <>
                <Col md={2}>
                  <Form.Label>Talaba</Form.Label>
                  <Form.Select
                    value={talaba}
                    onChange={(e) => setTalaba(e.target.value)}
                  >
                    <option value="">Select option</option>
                    <option value="Faxriddin">Faxriddin</option>
                    <option value="Ali">Ali</option>
                    <option value="Vali">Vali</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Label>Guruh</Form.Label>
                  <Form.Select
                    value={guruh}
                    onChange={(e) => setGuruh(e.target.value)}
                  >
                    <option value="">Select option</option>
                    <option value="FrontEnd">FrontEnd</option>
                    <option value="BackEnd">BackEnd</option>
                    <option value="Mobile">Mobile</option>
                  </Form.Select>
                </Col>
              </>
            )}

            <Col md={hisobUsuli === "Talaba" ? 3 : 3}>
              <Form.Label>Xarajat qiymati</Form.Label>
              <Form.Control
                placeholder="0"
                value={xarajatQiymati2}
                onChange={(e) => handleXarajatChange(e, setXarajatQiymati2)}
              />
            </Col>
            <Col md={1} className="mt-2">
              <Form.Select
                className="mt-4 ozgarmas"
                value={xarajatTuri2}
                onChange={(e) => setXarajatTuri2(e.target.value)}
              >
                <option>O'zgarmas</option>
                <option>Foiz</option>
              </Form.Select>
            </Col>
            <Col md={2} className="mt-4">
              <Button
                variant="outline-primary"
                className="qoshishkok"
                onClick={() => handleAddRow(false)}
              >
                Qo'shish
              </Button>
            </Col>
          </Row>

          <div className="table-wrapper mt-4">
            <Table bordered hover size="sm">
              <thead>
                <tr>
                  <th>Hisoblash usuli</th>
                  <th>Maosh turi</th>
                  <th>Miqdori</th>
                  <th>Kurs</th>
                  <th>Guruh</th>
                  <th>O'qituvchi</th>
                  <th>Talaba</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center text-muted">
                      Bo'sh
                    </td>
                  </tr>
                ) : (
                  rows.map((item, index) => (
                    <tr key={index}>
                      <td>{item.usul}</td>
                      <td>{item.maosh}</td>
                      <td>{item.miqdor}</td>
                      <td>{item.kurs}</td>
                      <td>{item.guruh}</td>
                      <td>{item.oqituvchi}</td>
                      <td>{item.talaba}</td>
                      <td>
                        <Button
                          size="md"
                          variant="danger"
                 
                          onClick={() => handleDeleteRow(index, item)}
                        >
                          O'chirish
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          <div className="footer-actions">
            <Form.Control
              className="actions-1"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
            <Button
              className="button001"
              variant="warning"
              onClick={handleCalculate}
            >
              Hisoblang
            </Button>
            <Button
              className="button001"
              variant="success"
              onClick={handlePublish}
            >
              E'lon qilish
            </Button>
          </div>
        </Card.Body>
        <div className="dawnloade d-flex justify-content-end mt-3 mb-3 me-3">
          <i
            className="fa-solid fa-circle-down"
            style={{ cursor: "pointer", fontSize: "24px" }}
            onClick={handleDownload}
          ></i>
        </div>
      </Card>

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
                  <strong>{selectedName}</strong> ma'lumotini rostdan ham
                  o'chirishni xohlaysizmi?
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Bekor qilish
                </button>
                <button className="btn btn-danger" onClick={confirmDelete}>
                  Ha, o'chirish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default IshHaqi;