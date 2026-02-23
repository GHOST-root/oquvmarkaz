import { useState, useEffect } from "react";
// import "bootstrap";
import "./XarajatToifalari.css";
import { LineElement } from "chart.js";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Outlet } from "react-router-dom";

export default function XarajatToifalari() {
  // LOCALSTORAGE DAN O‘QISH
  const loadData = () => {
    try {
      const saved = localStorage.getItem("xarajat_data");
      return saved ? JSON.parse(saved) : [{ id: 4762, name: "Oylik" }];
    } catch {
      return [{ id: 4762, name: "Oylik" }];
    }
  };

  const [data, setData] = useState(loadData);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: "", name: "" });
  const [editIndex, setEditIndex] = useState(null);

  // DATA O‘ZGARSA LOCALSTORAGE GA YOZILADI
  useEffect(() => {
    localStorage.setItem("xarajat_data", JSON.stringify(data));
  }, [data]);

  const openPanel = () => {
    setForm({ id: "", name: "" });
    setEditIndex(null);
    setOpen(true);
  };

  const save = () => {
    if (!form.id || !form.name) return alert("Id va Ism to‘ldirilsin!");

    let updated = [...data];

    if (editIndex !== null) {
      updated[editIndex] = form; // Tahrirlash
    } else {
      updated.push(form); // Yangi qo‘shish
    }

    setData(updated);
    setOpen(false);
  };

  const edit = (index) => {
    setForm(data[index]);
    setEditIndex(index);
    setOpen(true);
  };

  const remove = (index) => {
    const updated = data.filter((_, i) => i !== index);
    setData(updated);
  };

  return (
    <div className="container-fluid page-bg p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Xarajat toifalari</h3>
        <button className="btn add-btn px-4" onClick={openPanel}>
          Yangisini qo'shish
        </button>
      </div>

      <div className="row">
        <div className="col-12 col-lg-4">
          <table className="table table-bordered custom-table">
            <thead>
              <tr>
                <th>id</th>
                <th>Ism</th>
                <th>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>
                    <span
                      className="action delete"
                      onClick={() => remove(index)}
                    >
                      🗑️
                    </span>
                    <span className="action edit" onClick={() => edit(index)}>
                      ✏️
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="Tolovlar">
            <button>Tolovlar</button>
          </Link>
        </div>

        {open && (
          <div className="right-panel p-4">
            <button
              className="btn btn-sm btn-light mb-3"
              style={{ position: "absolute", right: "15px", top: "15px" }}
              onClick={() => setOpen(false)}
            >
              ✖
            </button>
            <h5 className="mb-3">Yangisini qo'shish</h5>

            <label>Id</label>
            <input
              type="text"
              className="form-control mb-3"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
            />

            <label>Ism</label>
            <input
              type="text"
              className="form-control mb-3"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <button className="btn btn-success" onClick={save}>
              Saqlash
            </button>
          </div>
        )}
      </div>
      <Outlet />
    </div>
  );
}
