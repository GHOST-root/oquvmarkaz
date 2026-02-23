import React, { useState, useEffect } from "react";
import TopFilters from "./TopFilters";
import BoardColumn from "./BoardColumn";

function LeadsBoard() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("leads-board");
    return saved
      ? JSON.parse(saved)
      : { leads: [], expectation: [], set: [] };
  });

  const [dragItem, setDragItem] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [editCard, setEditCard] = useState(null);

  useEffect(() => {
    localStorage.setItem("leads-board", JSON.stringify(data));
  }, [data]);

  /* ===== DRAG ===== */
  const handleDragStart = (card, fromColumn) => {
    setDragItem({ card, fromColumn });
  };

  const handleDropCard = (toColumn) => {
    if (!dragItem) return;
    const { card, fromColumn } = dragItem;
    if (fromColumn === toColumn) return;

    setData((prev) => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter((c) => c.id !== card.id),
      [toColumn]: [...prev[toColumn], card]
    }));

    setDragItem(null);
  };

  /* ===== ADD ===== */
  const handleAddLead = (formData) => {
    setData((prev) => ({
      ...prev,
      leads: [
        ...prev.leads,
        {
          id: Date.now(),
          title: formData.name,
          phone: formData.phone,
          source: formData.source,
          comment: formData.comment,
          count: 0
        }
      ]
    }));
    setOpenAdd(false);
  };

  /* ===== EDIT ===== */
 const handleEditLead = (formData) => {
  setData((prev) => {
    const update = (arr) =>
      arr.map((c) =>
        c.id === formData.id
          ? {
              ...c,
              title: formData.name,
              phone: formData.phone,
              source: formData.source,
              comment: formData.comment
            }
          : c
      );

    return {
      leads: update(prev.leads),
      expectation: update(prev.expectation),
      set: update(prev.set)
    };
  });

  setEditCard(null);
  setOpenAdd(false);
};

  /* ===== DELETE ===== */
  const handleDelete = (id) => {
    setData((prev) => ({
      ...prev,
      leads: prev.leads.filter((c) => c.id !== id),
      expectation: prev.expectation.filter((c) => c.id !== id),
      set: prev.set.filter((c) => c.id !== id)
    }));
  };

  return (
    <div className="container-fluid">
      <TopFilters />

      <div className="row g-3 mt-1">
        <BoardColumn
          title="LEADS"
          columnKey="leads"
          cards={data.leads}
          showAddButton
          openAdd={openAdd}
          onToggleAdd={() => setOpenAdd((p) => !p)}
          onAddLead={handleAddLead}
          onEditLead={handleEditLead}
          editCard={editCard}
          setEditCard={setEditCard}
          onDelete={handleDelete}
          onDragStart={handleDragStart}
          onDropCard={handleDropCard}
        />

        <BoardColumn
          title="EXPECTATION"
          columnKey="expectation"
          cards={data.expectation}
          onDelete={handleDelete}
          onDragStart={handleDragStart}
          onDropCard={handleDropCard}
        />

        <BoardColumn
          title="SET"
          columnKey="set"
          cards={data.set}
          onDelete={handleDelete}
          onDragStart={handleDragStart}
          onDropCard={handleDropCard}
        />
      </div>
    </div>
  );
}

export default LeadsBoard;
