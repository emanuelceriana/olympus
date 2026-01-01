import { useCallback } from "react";

export const SecretAction = ({
  socket,
  overlayOption,
  pickedCards,
  handleRemoveCard,
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
        Elige <strong>1 carta</strong> de tu mano para guardar en secreto. 
        Esta carta se revelará al final de la ronda para determinar el favor de los dioses.
      </p>
      
      <div className="step-indicator">
        <span className={progress >= 1 ? 'completed' : ''}>Paso 1: Selecciona una carta de tu mano</span>
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
        <button onClick={triggerSecretAction} className="action-confirm-btn">
          Guardar
        </button>
      )}
    </div>
  );
};
