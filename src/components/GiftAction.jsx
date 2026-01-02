import { useCallback, useState } from "react";

export const GiftAction = ({
  socket,
  overlayOption,
  pickedCards,
  handleRemoveCard,
  setCanClose,
  itemImages,
}) => {
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);

  const triggerGiftAction = useCallback(() => {
    socket.emit("trigger-gift-action", {
      pickedCards,
    });
    setWaitingForOpponent(true);
    setCanClose(false);
  }, [pickedCards, socket, setCanClose]);

  const requiredCards = 3;
  const progress = pickedCards.length;

  if (waitingForOpponent) {
    return (
      <div className="action-container waiting">
        <h2>Waiting for Opponent...</h2>
        <p className="action-description">
          Your opponent is choosing one of the 3 cards you offered.
          The remaining 2 will be yours.
        </p>
        <div className="cards-list">
          {pickedCards.map((card) => {
             const itemImg = itemImages ? itemImages[card.color] : null;
             return (
                <div className={`card ${card.color}`} key={card.id}>
                  {itemImg && <img src={itemImg} className="item-image" alt="" />}
                  <div className="number">{card.value}</div>
                </div>
             );
          })}
        </div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="action-container">
      <p className="action-description">
        Choose <strong>3 cards</strong> to offer to your opponent.
        They will choose <strong>1</strong> to keep and the other <strong>2</strong> will be yours.
      </p>
      
      <div className="step-indicator">
        <span className={progress >= 1 ? 'completed' : ''}>Step 1: First card</span>
        <span className={progress >= 2 ? 'completed' : ''}>Step 2: Second card</span>
        <span className={progress >= 3 ? 'completed' : ''}>Step 3: Third card</span>
      </div>

      <div className="cards-list">
        {pickedCards.length > 0 &&
          pickedCards.map((card) => {
             const itemImg = itemImages ? itemImages[card.color] : null;
             return (
                <div className={`card ${card.color}`} key={card.id}>
                  {itemImg && <img src={itemImg} className="item-image" alt="" />}
                  <div className="number">{card.value}</div>
                  <div
                    className="remove-btn"
                    onClick={() => handleRemoveCard(card)}
                  >
                    ✕
                  </div>
                </div>
            );
          })}
        {Array(requiredCards - pickedCards.length)
          .fill(null)
          .map((_, i) => (
            <div className="card-border" key={i}></div>
          ))}
      </div>

      {pickedCards.length === requiredCards && (
        <button onClick={triggerGiftAction} className="action-confirm-btn">
          Offer
        </button>
      )}
    </div>
  );
};
