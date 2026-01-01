import { useCallback } from "react";

export const GiftActionResolver = ({ socket, pickedCards }) => {
  const handlePickCard = useCallback(
    (card) => {
      socket.emit("end-gift-action", {
        cardsToPick: pickedCards,
        pickedCard: card,
      });
    },
    [socket, pickedCards]
  );

  return (
    <div className="action-container resolver">
      <p className="action-description">
        Tu oponente te ofrece estas <strong>3 cartas</strong>.
        Elige <strong>1</strong> para quedártela. Las otras 2 serán para tu oponente.
      </p>
      
      <p className="instruction-highlight">Haz clic en la carta que deseas quedarte</p>

      <div className="cards-list resolver-cards">
        {pickedCards.map((card) => (
          <div
            className={`card ${card.color} selectable`}
            key={card.id}
            onClick={() => handlePickCard(card)}
          >
            <div className="number">{card.value}</div>
            <div className="select-overlay">
              <span>ELEGIR</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
