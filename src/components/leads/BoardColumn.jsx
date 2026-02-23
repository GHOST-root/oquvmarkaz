import React from "react";
import LeadCard from "./LeadCard";
import AddLeadToggleButton from "./AddLeadToggleButton";
import AddLeadForm from "./AddLeadForm";

function BoardColumn({
  title,
  columnKey,
  cards,
  showAddButton,
  openAdd,
  onToggleAdd,
  onAddLead,
  onEditLead,
  editCard,
  setEditCard,
  onDragStart,
  onDropCard,
  onDelete
}) {
  return (
    <div
      className="col-12 col-md-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDropCard(columnKey)}
    >
      <div className="p-2 rounded bg-light h-100">
        <div className="fw-semibold mb-2">
          {title} <span className="text-muted">({cards.length})</span>
        </div>

        {showAddButton && (
          <>
            <AddLeadToggleButton
              onToggle={() => {
                setEditCard(null); // 👈 MUHIM
                onToggleAdd();
              }}
            />

            {openAdd && (
              <AddLeadForm
                onSend={editCard ? onEditLead : onAddLead}
                editData={editCard}
              />
            )}
          </>
        )}

        {cards.map((card) => (
          <LeadCard
            key={card.id}
            card={card}
            onDragStart={() => onDragStart(card, columnKey)}
            onDelete={onDelete}
            onEdit={(c) => {
              setEditCard(c);
              onToggleAdd();
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default BoardColumn;
