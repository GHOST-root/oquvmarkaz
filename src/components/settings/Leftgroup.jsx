import { useState } from "react";


export default function Leftgroup() {
  const [students] = useState([
    {
      id: 1,
      name: "Behruzbek",
      phone: "99 000 00 11",
      course: "Geografiya",
      group: "FA Geografiya #1",
      teacher: "Faxriddin Abroev",
      status: "Sinov darsida",
      reason: "Sababsiz",
      note: "",
      employee: "Behruz Berdiyev",
      time: "08:43 / 10.05.2025",
    },
    {
      id: 2,
      name: "Behruz",
      phone: "99 624 63 82",
      course: "Geografiya",
      group: "FA Geografiya #1",
      teacher: "Faxriddin Abroev",
      status: "Faol",
      reason: "Sababsiz",
      note: "",
      employee: "Behruz Berdiyev",
      time: "07:10 / 10.05.2025",
    },
  ]);

  return (
    <div className="leftgroup-wrapper">
      <div className="container-fluid">

        {/* TITLE */}
        <div className="page-header">
          <h4>Guruhni tark etgan o'quvchilar</h4>
          <span>Miqdor — {students.length}</span>
        </div>

        {/* FILTER PANEL */}
        <div className="filter-box">

          <div className="row g-3">
            <div className="col-lg-2">
              <input className="form-control" placeholder="01.05.2025" />
            </div>

            <div className="col-lg-2">
              <input className="form-control" placeholder="10.05.2025" />
            </div>

            <div className="col-lg-2">
              <input className="form-control" placeholder="Ism yoki telefon orqali qidirish" />
            </div>

            <div className="col-lg-2">
              <select className="form-select">
                <option>Kurs</option>
              </select>
            </div>

            <div className="col-lg-2">
              <select className="form-select">
                <option>Guruh</option>
              </select>
            </div>

            <div className="col-lg-2">
              <select className="form-select">
                <option>O'qituvchi</option>
              </select>
            </div>
          </div>

          <div className="row g-3 mt-2">
            <div className="col-lg-2">
              <select className="form-select">
                <option>Xodim</option>
              </select>
            </div>

            <div className="col-lg-2">
              <select className="form-select">
                <option>Arxivlash sabablari</option>
              </select>
            </div>

            <div className="col-lg-2">
              <select className="form-select">
                <option>Holati</option>
              </select>
            </div>

            <div className="col-lg-2 d-flex gap-2">
              <button className="btn btn-primary w-100">Filtr</button>
              <button className="btn btn-light refresh-btn">↻</button>
            </div>
          </div>

        </div>

        {/* TABLE */}
        <div className="table-box">
          <div className="table-top">
            <button className="btn btn-light btn-sm">Ustunlar</button>
          </div>

          <div className="table-responsive">
            <table className="table custom-table">
              <thead>
                <tr>
                  <th></th>
                  <th>Talaba</th>
                  <th>Telefon</th>
                  <th>Kurs</th>
                  <th>Guruh</th>
                  <th>O'qituvchi</th>
                  <th>Holati</th>
                  <th>Ochirish sabablari</th>
                  <th>Izoh</th>
                  <th>Xodim</th>
                </tr>
              </thead>

              <tbody>
                {students.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td className="link">{item.name}</td>
                    <td className="link">{item.phone}</td>
                    <td className="link">{item.course}</td>
                    <td className="link">{item.group}</td>
                    <td className="link">{item.teacher}</td>
                    <td>{item.status}</td>
                    <td>{item.reason}</td>
                    <td>{item.note}</td>
                    <td>
                      <div className="link">{item.employee}</div>
                      <small className="text-muted">{item.time}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}