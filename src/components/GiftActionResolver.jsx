import { useState } from "react";

export const GiftActionResolver = ({ socket, pickedCards }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const selectCard = (card) => {
    setSelectedCard(card);
  };

  const handleEndGiftAction = () => {
    if (selectedCard) {
      socket.emit("end-gift-action", {
        cardsToPick: pickedCards,
        pickedCard: selectedCard,
      });
    }
  };

  return (
    <>
      <h2>Gift</h2>
      <p>Pick one card from the three selected by your opponent.</p>
      <div className="cards-list">
        {pickedCards.length > 0 &&
          pickedCards.map((card) => (
            <div
              className={`card ${card.color}`}
              onClick={() => selectCard(card)}
              key={card.id}
            >
              <div className="number">{card.value}</div>
              {selectedCard?.id === card.id && (
                <div className="selected-btn">✔</div>
              )}
            </div>
          ))}
      </div>
      {selectedCard && <button onClick={handleEndGiftAction}>Accept</button>}
    </>
  );
};
