import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import InputAllReports from "./InputAllReports";
function InputSearch() {
  // Barcha inputlar uchun state
  const [ism, setIsm] = useState("");
  const [telefon, setTelefon] = useState("");
  const [davr_boyicha_jami, setDavrBoyichaJami] = useState("");
  const [guruh, setGuruh] = useState("");
  const [balans, setBalans] = useState(""); // <-- BALANS YANGI!
  const [izoh, setIzoh] = useState("");
  const [holati, setHolati] = useState("");
  const [holati_display, setHolatiDisplay] = useState("");
  const [created_at, setCreatedAt] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // QIDIRUV
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://xacker007.pythonanywhere.com/accounts/list_create",
        {
          ism,
          telefon,
          davr_boyicha_jami,
          guruh,
          balans, // <-- BALANS YUBORAMIZ!
          izoh,
          holati,
          holati_display,
          created_at,
        }
      );
      setResults(data);
    } catch (error) {
      setResults([]);
      alert("Ma'lumot topilmadi yoki xatolik yuz berdi.");
    }
    setLoading(false);
  };

  // TOZALASH

  useEffect(() => {
    axios
      .get("https://xacker007.pythonanywhere.com/accounts/list_create")
      .then(({ data }) => setResults(data));
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };
  return (
    <>
      <Container style={{ maxWidth: 1000, margin: "24px auto" }}>
        <Link to={`/`}>
          <Button variant="secondary" className="mb-3">
            Orqaga
          </Button>
        </Link>
        <Link to={`/InputAllReports`}>
          <Button variant="secondary" className="mb-3">
            oldinga
          </Button>
        </Link>

        <Card className="my-4 shadow">
          <h3 className="text-center">Yangi Xodim Qo'shish</h3>
          <Card.Body>
            <Form onSubmit={handleSearch} autoComplete="off">
              <Row className="mb-3 g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Ism</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ism"
                      value={ism}
                      onChange={(e) => setIsm(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Telefon</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Telefon"
                      value={telefon}
                      onChange={(e) => setTelefon(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Guruh</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Guruh"
                      value={guruh}
                      onChange={(e) => setGuruh(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3 g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Davr bo'yicha jami</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Davr bo'yicha jami"
                      value={davr_boyicha_jami}
                      onChange={(e) => setDavrBoyichaJami(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Balans</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Balans"
                      value={balans}
                      onChange={(e) => setBalans(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Izoh</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Izoh"
                      value={izoh}
                      onChange={(e) => setIzoh(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3 g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Holati</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Holati"
                      value={holati}
                      onChange={(e) => setHolati(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Holati Display</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Holati Display"
                      value={holati_display}
                      onChange={(e) => setHolatiDisplay(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Yaratilgan sana</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Yaratilgan sana"
                      value={created_at}
                      onChange={(e) => setCreatedAt(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="my-3">
                <Col md={3} className="d-grid">
                  <Button type="submit" variant="success" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : "Qoshish"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <InputAllReports />
    </>
  );
}
export default InputSearch;