import React from "react";

export const ActionOverlay = ({
  overlayOption,
  pickedCards,
  setPickedCards,
}) => {
  if (!overlayOption) return null;

  const handleRemoveCard = (card) => {
    setPickedCards((prev) => prev.filter((c) => c.id !== card.id));
  };

  if (overlayOption) {
    return (
      <div className="overlay">
        <h2>Reserve Card</h2>
        <p>Select a card to reserve.</p>
        <div className="cards-list">
          {pickedCards.length > 0 &&
            pickedCards.map((card) => (
              <div className={`card ${card.color}`}>
                <div className="number">{card.value}</div>
                <div
                  className="remove-btn"
                  onClick={() => handleRemoveCard(card)}
                >
                  X
                </div>
              </div>
            ))}
          {Array(overlayOption - pickedCards.length)
            .fill(null)
            .map((_) => (
              <div className="card-border"></div>
            ))}
        </div>
      </div>
    );
  }
};
