import React, { useEffect, useRef } from "react";
import AddLeadForm from "./AddLeadForm";

function EditLeadDrawer({ open, onClose, lead, onSave }) {
  const ref = useRef(null);

  // tashqarisini bosganda yopiladi
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  if (!open) return null;

  return (
    <>
      {/* ORQA FON */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ background: "rgba(0,0,0,0.3)", zIndex: 1049 }}
      />

      {/* ONG TOMONDAN DRAWER */}
      <div
        ref={ref}
        className="position-fixed top-0 end-0 bg-white h-100 shadow"
        style={{
          width: 360,
          zIndex: 1050,
          animation: "slideInRight .25s ease-out"
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
          <strong>Tahrirlash</strong>
          <button className="btn btn-sm btn-light" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="p-2">
          <AddLeadForm
  initialData={lead}
  onSend={(data) =>
    onSave({
      ...lead,
      title: data.name,
      phone: data.phone,
      source: data.source,
      comment: data.comment
    })
  }
/>

        </div>
      </div>

      {/* ANIMATSIYA */}
     
    </>
  );
}

export default EditLeadDrawer;
