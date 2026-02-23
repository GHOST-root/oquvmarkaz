import React, { useState, useRef, useEffect } from "react";
import CardMenu from "./CardMenu";

function LeadCard({ card, onDelete, onEdit, onDragStart }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div
      className="card mb-2 shadow-sm position-relative"
      draggable
      onDragStart={onDragStart}
      ref={ref}
    >
      <div className="card-body d-flex justify-content-between p-2">
        <div>
          <div className="fw-semibold">{card.title}</div>
          <div className="text-muted small">0 / {card.count}</div>
        </div>

        <button
          className="btn btn-sm btn-light"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          ⋮
        </button>
      </div>

      {open && (
        <CardMenu
          onEdit={() => {
            onEdit(card);
            setOpen(false);
          }}
          onDelete={() => onDelete(card.id)}
        />
      )}
    </div>
  );
}

export default LeadCard;
