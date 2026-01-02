export const DiscardAction = ({
  socket,
  overlayOption,
  pickedCards,
  handleRemoveCard,
  itemImages,
}) => {
  const triggerDiscardAction = () => {
    socket.emit("trigger-discard-action", {
      pickedCards,
    });
  };

  const requiredCards = 2;
  const progress = pickedCards.length;

  return (
    <div className="action-container">
      <p className="action-description">
        Choose <strong>2 cards</strong> from your hand.
        These cards will be discarded secretly and will not count towards the final score.
      </p>
      
      <div className="step-indicator">
        <span className={progress >= 1 ? 'completed' : ''}>Step 1: Select the first card</span>
        <span className={progress >= 2 ? 'completed' : ''}>Step 2: Select the second card</span>
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
        <button onClick={triggerDiscardAction} className="action-confirm-btn">
          Discard
        </button>
      )}
    </div>
  );
};
