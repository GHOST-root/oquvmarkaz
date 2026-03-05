import React, { useState } from "react";


export default function Arxiv() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Behruz",
      phone: "996246382",
      role: "Student",
      reason: "Intizom",
      comment: "Kechikish",
      archivedBy: "Behruz Berdiyev",
      date: "10.05.2025 - 07:10",
    },
    {
      id: 2,
      name: "Tom Rayder",
      phone: "992000002",
      role: "Student",
      reason: "To‘lov",
      comment: "To‘lov qilmagan",
      archivedBy: "Behruz Berdiyev",
      date: "09.05.2025 - 17:10",
    },
  ]);

  const [selectedId, setSelectedId] = useState(null);

  const handleDelete = () => {
    if (!selectedId) return;
    setUsers(users.filter((u) => u.id !== selectedId));
    setSelectedId(null);
  };

  const handleRestore = () => {
    if (!selectedId) return;
    alert("Qayta tiklandi!");
    setSelectedId(null);
  };

  return (
    <div className="container-fluid mt-4">
      <div className="card shadow-sm p-3">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>
            Arxiv <span className="text-muted">Miqdor — {users.length}</span>
          </h5>

          <button className="btn btn-light border">
            Arxivlash sabablari
          </button>
        </div>

        {/* FILTERS */}
        <div className="row g-2 mb-3">
          <div className="col-md-2">
            <input className="form-control" placeholder="Ism yoki Telefon" />
          </div>

          <div className="col-md-2">
            <select className="form-select">
              <option>Rollar bo‘yicha filter</option>
              <option>Student</option>
              <option>Teacher</option>
            </select>
          </div>

          <div className="col-md-2">
            <select className="form-select">
              <option>Sabab bo‘yicha filter</option>
              <option>Intizom</option>
              <option>To‘lov</option>
            </select>
          </div>

          <div className="col-md-2">
            <input type="date" className="form-control" />
          </div>

          <div className="col-md-2">
            <input type="date" className="form-control" />
          </div>

          <div className="col-md-2 d-flex gap-2">
            <button
              className="btn btn-danger w-50"
              disabled={!selectedId}
              onClick={handleDelete}
            >
              O‘chirish
            </button>

            <button
              className="btn btn-success w-50"
              disabled={!selectedId}
              onClick={handleRestore}
            >
              Qayta tiklash
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th></th>
                <th>Ism</th>
                <th>Telefon</th>
                <th>Roli</th>
                <th>O‘chirish sabablari</th>
                <th>Izoh</th>
                <th>Arxivladi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={selectedId === user.id ? "selected-row" : ""}
                >
                  <td>
                  <input
  type="checkbox"
  checked={selectedId === user.id}
  onChange={() =>
    setSelectedId(selectedId === user.id ? null : user.id)
  }
/>
                  </td>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>{user.reason}</td>
                  <td>{user.comment}</td>
                  <td>
                    {user.archivedBy}
                    <br />
                    <small className="text-muted">{user.date}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
