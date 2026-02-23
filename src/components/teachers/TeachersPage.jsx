import { useState, useRef, useEffect } from "react";
import TeacherCard from "./TeacherCard";
import EditTeacherDrawer from "./EditTeacherDrawer";
import SmsDrawer from "./SmsDrawer";
import AddTeacherDrawer from "./AddTeacherDrawer";
import TeacherProfilePage from "./TeacherProfilePage";
import TeacherEmptyPage from "./TeacherEmptyPage";

/* ================= PAGE ================= */
function TeachersPage() {
  const [editOpen, setEditOpen] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [viewTeacher, setViewTeacher] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // 🔹 BOSHLANG‘ICH — BO‘SH
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem("teachers");
    return saved ? JSON.parse(saved) : [];
  });

  const nextId = useRef(
    teachers.length > 0 ? Math.max(...teachers.map(t => t.id)) + 1 : 1
  );

  // 💾 SAQLASH
  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }, [teachers]);

  // show empty view or profile inside it
  if (viewOpen) {
    return (
      <TeacherEmptyPage onBack={() => setViewOpen(false)}>
        <TeacherProfilePage
          teacher={viewTeacher}
          onBack={() => {
            setViewOpen(false);
            setViewTeacher(null);
          }}
        />
      </TeacherEmptyPage>
    );
  }

  const handleDelete = (id) => {
    setTeachers(teachers.filter((t) => t.id !== id));
  };

  const handleAdd = (newTeacher) => {
    setTeachers([
      ...teachers,
      { ...newTeacher, id: nextId.current++ }
    ]);
  };

  const handleUpdate = (updatedTeacher) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t))
    );
    setEditOpen(false);
  };

  const handleEditSave = (updatedTeacher) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t))
    );
    setEditOpen(false);
  };

  // ❗ Yangi tasdiqlash funksiyalari (handleDelete o'zgarmadi)
  const askDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId == null) return;
    setTeachers((prev) => prev.filter((t) => t.id !== deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setDeleteId(null);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="page-header d-flex justify-content-between align-items-center">
          <h3>
            O‘qituvchilar{" "}
            <span className="text-muted fs-6">
              Miqdor — {teachers.length}
            </span>
          </h3>

          <div className="d-flex gap-2">
            <button
              className="btn btn-warning rounded-pill px-4 text-white"
              onClick={() => setAddOpen(true)}
            >
              Yangisini qo‘shish
            </button>
            <button
              className="btn btn-outline-warning rounded-pill px-4"
              onClick={() => setImportOpen(true)}
            >
              Import
            </button>
          </div>
        </div>

        <div className="alert alert-success d-flex gap-2 mt-3">
          <span>✅</span>
          <span>
            CEO profili orqali o‘qituvchini boshqa (bir-necha) filialga
            biriktirishingiz mumkin.
          </span>
        </div>

        <div className="teachers-list">
          {teachers.map((t) => (
            <TeacherCard
              key={t.id}
              teacher={t}
              onEdit={() => {
                setSelectedTeacher(t);
                setEditOpen(true);
              }}
              onSms={() => {
                setSelectedTeacher(t);
                setSmsOpen(true);
              }}
              onDelete={() => askDelete(t.id)}
              onView={() => {
                setViewTeacher(t);
                setViewOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {editOpen && (
        <EditTeacherDrawer
          teacher={selectedTeacher}
          onSave={handleUpdate}
          onClose={() => setEditOpen(false)}
        />
      )}

      {smsOpen && (
        <SmsDrawer
          teacher={selectedTeacher}
          onClose={() => setSmsOpen(false)}
        />
      )}

      {addOpen && (
        <AddTeacherDrawer
          onClose={() => setAddOpen(false)}
          onAdd={handleAdd}
        />
      )}

      {confirmOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
          onClick={cancelDelete}
        >
          <div
            className="bg-white rounded p-4 text-center"
            style={{ width: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="mb-3">Ogohlantirish</h5>
            <p>Bu cardni rostdan ham o‘chirasizmi?</p>

            <div className="d-flex justify-content-center gap-3 mt-3">
              <button
                className="btn btn-secondary"
                onClick={cancelDelete}
              >
                YO‘Q
              </button>
              <button
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                HA
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TeachersPage;
