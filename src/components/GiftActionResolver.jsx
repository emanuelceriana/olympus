import { useCallback } from "react";

export const GiftActionResolver = ({ socket, pickedCards, itemImages }) => {
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
        Your opponent offers you these <strong>3 cards</strong>.
        Choose <strong>1</strong> to keep. The other 2 will go to your opponent.
      </p>
      
      <p className="instruction-highlight">Click on the card you want to keep</p>

      <div className="cards-list resolver-cards">
        {pickedCards.map((card) => {
           const itemImg = itemImages ? itemImages[card.color] : null;
           return (
              <div
                className={`card ${card.color} selectable`}
                key={card.id}
                onClick={() => handlePickCard(card)}
              >
                {itemImg && <img src={itemImg} className="item-image" alt="" />}
                <div className="number">{card.value}</div>
                <div className="select-overlay">
                  <span>PICK</span>
                </div>
              </div>
           );
        })}
      </div>
    </div>
  );
};
