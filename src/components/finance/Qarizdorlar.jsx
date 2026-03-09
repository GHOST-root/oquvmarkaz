import React, { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import axios from "axios";  
import './Qarzdorlar.css'
import { FaCircle } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
function Qarizdorlar() {
  const [qarzidolar, setQarzidolar] = useState([]);
  const [allQarzidolar, setAllQarzidolar] = useState([]);

  const [search, setSearch] = useState("");
  const [groupSelect, setGroupSelect] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  // Balance va davr bo'yicha select va min/max
  const [balansSelect, setBalansSelect] = useState("");
  const [balansMin, setBalansMin] = useState("");
  const [balansMax, setBalansMax] = useState("");
  const [davrSelect, setDavrSelect] = useState("");
  const [davrMin, setDavrMin] = useState("");
  const [davrMax, setDavrMax] = useState("");

  const formatBalance = (amount) => {
    const sign = amount < 0 ? "-" : "";
    const abs = Math.abs(amount);

    if (abs < 1000) return sign + abs;

    const rounded = Math.floor(abs / 1000) * 1000;

    return sign + rounded.toLocaleString("en-US").replace(/,/g, ".");
  };

  // const [iconsIntut, setIconsIntut] = useState([]);
  useEffect(() => {
    axios
      .get("https://xacker007.pythonanywhere.com/accounts/list_create")
      .then((res) => {
        setQarzidolar(res.data);
        setAllQarzidolar(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Unique select values
  const uniqueGroups = Array.from(
    new Set(allQarzidolar.map((q) => q.guruh))
  ).filter(Boolean);
  const uniqueStatuses = Array.from(
    new Set(allQarzidolar.map((q) => q.holati_display))
  ).filter(Boolean);
  const uniqueBalans = Array.from(new Set(allQarzidolar.map((q) => q.balans)))
    .filter((val) => val !== undefined && val !== null)
    .sort((a, b) => a - b);
  const uniqueDavr = Array.from(
    new Set(allQarzidolar.map((q) => q.davr_boyicha_jami))
  )
    .filter((val) => val !== undefined && val !== null)
    .sort((a, b) => a - b);

  const handleFilter = (e) => {
    e && e.preventDefault();

    let filtered = allQarzidolar;

    if (search) {
      const searchValue = search.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          (q.ism && q.ism.toLowerCase().includes(searchValue)) ||
          (q.telefon && q.telefon.includes(searchValue))
      );
    }
    if (groupSelect) {
      filtered = filtered.filter((q) => q.guruh === groupSelect);
    }
    if (groupSearch) {
      const groupValue = groupSearch.toLowerCase();
      filtered = filtered.filter(
        (q) => q.guruh && q.guruh.toLowerCase().includes(groupValue)
      );
    }
    if (status) {
      filtered = filtered.filter((q) => q.holati_display === status);
    }
    if (dateFrom) {
      filtered = filtered.filter((q) => q.created_at >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter((q) => q.created_at <= dateTo);
    }
    // balans select
    if (balansSelect !== "") {
      filtered = filtered.filter(
        (q) => String(q.balans) === String(balansSelect)
      );
    }
    // balans min/max input
    if (balansMin !== "") {
      filtered = filtered.filter((q) => Number(q.balans) >= Number(balansMin));
    }
    if (balansMax !== "") {
      filtered = filtered.filter((q) => Number(q.balans) <= Number(balansMax));
    }
    // davr bo'yicha jami select
    if (davrSelect !== "") {
      filtered = filtered.filter(
        (q) => String(q.davr_boyicha_jami) === String(davrSelect)
      );
    }
    // davr bo'yicha jami min/max input
    if (davrMin !== "") {
      filtered = filtered.filter(
        (q) => Number(q.davr_boyicha_jami) >= Number(davrMin)
      );
    }
    if (davrMax !== "") {
      filtered = filtered.filter(
        (q) => Number(q.davr_boyicha_jami) <= Number(davrMax)
      );
    }

    setQarzidolar(filtered);
  };

  useEffect(() => {
    handleFilter();
    // eslint-disable-next-line
  }, [
    search,
    groupSelect,
    groupSearch,
    status,
    dateFrom,
    dateTo,
    balansSelect,
    balansMin,
    balansMax,
    davrSelect,
    davrMin,
    davrMax,
  ]);

  const getBalanceColor = (balance) => {
    if (balance < 0) return "red";
    if (balance > 0) return "green";
    return "#a0a3a7ff";
  };

  const statusColor = (davr_boyicha_jami) => {
    if (davr_boyicha_jami >0) return "green";
    if (davr_boyicha_jami <0) return "red";
    return "#adb5bd";
  };
  
  const iconsColor = (balance, davr_boyicha_jami)=>{
    if (balance < 0 || davr_boyicha_jami < 0) {
      return "red";
    }

    // ikkalasi ham musbat bo‘lsa
    if (balance > 0 && davr_boyicha_jami > 0) {
      return "green";
    }

    // default
    return "#adb5bd";

  }

  const jamiBalans = qarzidolar.reduce(
    (acc, curr) => acc + (Number(curr.balans) || 0),
    0
  );
  const jamiDavr = qarzidolar.reduce(
    (acc, curr) => acc + (Number(curr.balans) || 0),
    0
  );

  const onClear = () => {
    setSearch("");
    setGroupSelect("");
    setGroupSearch("");
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setBalansSelect("");
    setBalansMin("");
    setBalansMax("");
    setDavrSelect("");
    setDavrMin("");
    setDavrMax("");
    setQarzidolar(allQarzidolar);
  };

  return (
    <Container fluid>
      <Card className="mx-4 p-2 mb-3 mt-4">
        <Row className="align-items-center  justify-content-between ">
          <Col md="auto">
            <div className="d-flex m-4">
              <h2>Qarizdorlar</h2>
              <p className="mx-3 mt-2">Miqdor - {qarzidolar.length}</p>
            </div>
          </Col>
          <Col
            md="auto"
            className="  d-flex    align-items-center  flex-column "
          >
            
          </Col>
        </Row>
      </Card>
      <Card className="mx-4 p-3">
        <Row className="align-items-center justify-content-between">
          <Col md="auto">
            <h5 className="mb-0">
              Jami balans: {formatBalance(jamiBalans)} so'm
            </h5>
          </Col>
        </Row>
      </Card>

      <Card className="mx-4 my-3 p-3">
        <Row className="align-items-center justify-content-between">
          <Col md="auto">
            <h5 className="mb-0">
              Davr bo‘yicha jami: {formatBalance(jamiDavr)} so'm
            </h5>
          </Col>
        </Row>
      </Card>

      <form className="filter-form" onSubmit={handleFilter}>

        <div className="filter-grid">

          <div className="f-item">
            <label>Ism yoki telefon</label>
            <input
              type="text"
              placeholder="Ism yoki telefon"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="f-item">
            <label>Guruh (tanlash)</label>
            <select
              value={groupSelect}
              onChange={(e) => setGroupSelect(e.target.value)}
            >
              <option value="">Barchasi</option>
              {uniqueGroups.map((g, i) => (
                <option key={i} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="f-item">
            <label>Holati</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Barchasi</option>
              {uniqueStatuses.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="f-item">
            <label>Balans (tanlash)</label>
            <select
              value={balansSelect}
              onChange={(e) => setBalansSelect(e.target.value)}
            >
              <option value="">Barchasi</option>
              {uniqueBalans.map((b, i) => (
                <option key={i} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="f-item">
            <label>Davr bo'yicha jami (tanlash)</label>
            <select
              value={davrSelect}
              onChange={(e) => setDavrSelect(e.target.value)}
            >
              <option value="">Barchasi</option>
              {uniqueDavr.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="f-item">
            <label>Boshlanish sana</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="f-item">
            <label>Tugash sana</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

        </div>

        <div className="filter-actions">
          <button className="btn-orange" type="submit">Filter</button>
          <button className="btn-light" type="button" onClick={onClear}>Tozalash</button>
        </div>

      </form>

      <Card className="m-4 p-2">
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Ism</th>
              <th>Telefon</th>
              <th>Balans</th>
              <th>Davr jami</th>
              <th>Guruh</th>
              <th>Sana</th>
              <th>Izoh</th>
              <th>Holati</th>
            </tr>
          </thead>
          <tbody>
            {qarzidolar.length ? (
              qarzidolar.map((q, idx) => (
                <tr key={q.id}>
                  <td>{idx + 1}</td>
                  <td>{q.ism}</td>
                  <td>{q.telefon}</td>
                  <td style={{ color: getBalanceColor(q.balans) }}>
                    {q.balans}
                  </td>
                  <td style={{ color: statusColor(q.davr_boyicha_jami) }}>
                    {q.davr_boyicha_jami}
                  </td>
                  <td>{q.guruh}</td>
                  <td>{q.created_at}</td>
                  <td>{q.izoh}</td>
                  <td>
                    <FaCircle
                      style={{
                        color: iconsColor(q.balans, q.davr_boyicha_jami),
                      }}
                      size={20}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center">
                  Ma'lumot topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
      <Link to="../InputallReports" relative="path">
        <Button variant="secondary" className="m-4">
          Hammasini kiritish
        </Button>
      </Link>
    </Container>
  );
}
export default Qarizdorlar;