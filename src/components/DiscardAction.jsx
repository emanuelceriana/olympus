export const DiscardAction = ({
  socket,
  overlayOption,
  pickedCards,
  handleRemoveCard,
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
        Elige <strong>2 cartas</strong> de tu mano.
        Estas cartas serán descartadas en secreto y no contarán para la puntuación final.
      </p>
      
      <div className="step-indicator">
        <span className={progress >= 1 ? 'completed' : ''}>Paso 1: Selecciona la primera carta</span>
        <span className={progress >= 2 ? 'completed' : ''}>Paso 2: Selecciona la segunda carta</span>
      </div>

      <div className="cards-list">
        {pickedCards.length > 0 &&
          pickedCards.map((card) => (
            <div className={`card ${card.color}`} key={card.id}>
              <div className="number">{card.value}</div>
              <div
                className="remove-btn"
                onClick={() => handleRemoveCard(card)}
              >
                ✕
              </div>
            </div>
          ))}
        {Array(requiredCards - pickedCards.length)
          .fill(null)
          .map((_, i) => (
            <div className="card-border" key={i}></div>
          ))}
      </div>

      {pickedCards.length === requiredCards && (
        <button onClick={triggerDiscardAction} className="action-confirm-btn">
          Descartar
        </button>
      )}
    </div>
  );
};
