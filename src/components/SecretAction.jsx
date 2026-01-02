import { useCallback } from "react";

export const SecretAction = ({
  socket,
  overlayOption,
  pickedCards,
  handleRemoveCard,
  itemImages,
}) => {
  const triggerSecretAction = useCallback(() => {
    socket.emit("trigger-secret-action", {
      pickedCard: pickedCards[0],
    });
  }, [pickedCards, socket]);

  const requiredCards = 1;
  const progress = pickedCards.length;

  return (
    <div className="action-container">
      <p className="action-description">
        Choose <strong>1 card</strong> from your hand to keep secret. 
        This card will be revealed at the end of the round to determine God Favors.
      </p>
      
      <div className="step-indicator">
        <span className={progress >= 1 ? 'completed' : ''}>Step 1: Select a card from your hand</span>
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
            )
          })}
        {Array(requiredCards - pickedCards.length)
          .fill(null)
          .map((_, i) => (
            <div className="card-border" key={i}></div>
          ))}
      </div>

      {pickedCards.length === requiredCards && (
        <button onClick={triggerSecretAction} className="action-confirm-btn">
          Confirm Secret
        </button>
      )}
    </div>
  );
};
