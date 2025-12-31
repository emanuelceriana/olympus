export const DiscardAction = ({
  overlayOption,
  pickedCards,
  handleRemoveCard,
}) => {
  return (
    <>
      <h2>Trade-off</h2>
      <p>Select two cards to discard.</p>
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
    </>
  );
};
