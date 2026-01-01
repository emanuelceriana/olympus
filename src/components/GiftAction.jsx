import { useCallback, useState } from "react";

export const GiftAction = ({
  socket,
  overlayOption,
  pickedCards,
  handleRemoveCard,
}) => {
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);

  const triggerGiftAction = useCallback(() => {
    socket.emit("trigger-gift-action", {
      pickedCards,
    });
    setWaitingForOpponent(true);
  }, [pickedCards, socket]);

  const requiredCards = 3;
  const progress = pickedCards.length;

  if (waitingForOpponent) {
    return (
      <div className="action-container waiting">
        <h2>⏳ Esperando al Oponente...</h2>
        <p className="action-description">
          Tu oponente está eligiendo una de las 3 cartas que ofreciste.
          Las 2 restantes serán tuyas.
        </p>
        <div className="cards-list">
          {pickedCards.map((card) => (
            <div className={`card ${card.color}`} key={card.id}>
              <div className="number">{card.value}</div>
            </div>
          ))}
        </div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="action-container">
      <h2>🎁 Regalo Divino</h2>
      <p className="action-description">
        Elige <strong>3 cartas</strong> para ofrecer a tu oponente.
        Él elegirá <strong>1</strong> para quedarse y las otras <strong>2</strong> serán tuyas.
      </p>
      
      <div className="step-indicator">
        <span className={progress >= 1 ? 'completed' : ''}>Paso 1: Primera carta</span>
        <span className={progress >= 2 ? 'completed' : ''}>Paso 2: Segunda carta</span>
        <span className={progress >= 3 ? 'completed' : ''}>Paso 3: Tercera carta</span>
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
        <button onClick={triggerGiftAction} className="action-confirm-btn">
          🎁 Enviar Regalo
        </button>
      )}
    </div>
  );
};
