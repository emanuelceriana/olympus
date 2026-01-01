import { useCallback, useState } from "react";

export const CompetitionAction = ({
  socket,
  overlayOption,
  pickedCards,
  handleRemoveCard,
}) => {
  const [set1Ids, setSet1Ids] = useState([]);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [showSplitPhase, setShowSplitPhase] = useState(false);

  const toggleSet1 = (cardId) => {
    if (waitingForOpponent) return;
    if (set1Ids.includes(cardId)) {
      setSet1Ids((prev) => prev.filter((id) => id !== cardId));
    } else {
      if (set1Ids.length < 2) {
        setSet1Ids((prev) => [...prev, cardId]);
      }
    }
  };

  const triggerCompetitionAction = useCallback(() => {
    const set1 = pickedCards.filter((c) => set1Ids.includes(c.id));
    const set2 = pickedCards.filter((c) => !set1Ids.includes(c.id));

    if (set1.length !== 2 || set2.length !== 2) return;

    socket.emit("trigger-competition-action", {
      pickedCards: [set1, set2],
    });
    setWaitingForOpponent(true);
  }, [pickedCards, set1Ids, socket]);

  const requiredCards = 4;
  const progress = pickedCards.length;

  if (waitingForOpponent) {
    return (
      <div className="action-container waiting">
        <h2>⏳ Esperando al Oponente...</h2>
        <p className="action-description">
          Tu oponente está eligiendo uno de los dos grupos que le ofreciste.
        </p>
        <div className="competition-sets">
          <div className="card-set">
            <h4>Grupo 1</h4>
            <div className="set-cards">
              {pickedCards.filter((c) => set1Ids.includes(c.id)).map((card) => (
                <div className={`card ${card.color}`} key={card.id}>
                  <div className="number">{card.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-set">
            <h4>Grupo 2</h4>
            <div className="set-cards">
              {pickedCards.filter((c) => !set1Ids.includes(c.id)).map((card) => (
                <div className={`card ${card.color}`} key={card.id}>
                  <div className="number">{card.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Split phase
  if (showSplitPhase && pickedCards.length === 4) {
    return (
      <div className="action-container">
        <h2>⚔️ Dividir los Grupos</h2>
        <p className="action-description">
          Haz clic en <strong>2 cartas</strong> para asignarlas al <strong>Grupo 1</strong>.
          Las otras 2 irán automáticamente al Grupo 2.
          Tu oponente elegirá uno de los grupos.
        </p>

        <div className="competition-sets split-mode">
          <div className="card-set">
            <h4>Grupo 1 ({set1Ids.length}/2)</h4>
            <div className="set-cards">
              {pickedCards.filter((c) => set1Ids.includes(c.id)).map((card) => (
                <div
                  className={`card ${card.color} selected-set`}
                  key={card.id}
                  onClick={() => toggleSet1(card.id)}
                >
                  <div className="number">{card.value}</div>
                </div>
              ))}
              {Array(2 - set1Ids.length)
                .fill(null)
                .map((_, i) => (
                  <div className="card-border small" key={`empty-1-${i}`}></div>
                ))}
            </div>
          </div>
          <div className="card-set">
            <h4>Grupo 2 ({2 - (2 - (4 - set1Ids.length - 2))}/2)</h4>
            <div className="set-cards">
              {pickedCards.filter((c) => !set1Ids.includes(c.id)).map((card) => (
                <div
                  className={`card ${card.color}`}
                  key={card.id}
                  onClick={() => toggleSet1(card.id)}
                >
                  <div className="number">{card.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={() => setShowSplitPhase(false)} className="secondary-btn">
            ← Volver
          </button>
          {set1Ids.length === 2 && (
            <button onClick={triggerCompetitionAction} className="action-confirm-btn">
              ⚔️ Ofrecer Grupos
            </button>
          )}
        </div>
      </div>
    );
  }

  // Selection phase
  return (
    <div className="action-container">
      <h2>⚔️ Competencia Olímpica</h2>
      <p className="action-description">
        Elige <strong>4 cartas</strong> de tu mano. Luego las dividirás en 2 grupos de 2.
        Tu oponente elegirá un grupo y el otro será tuyo.
      </p>

      <div className="step-indicator">
        <span className={progress >= 1 ? "completed" : ""}>Carta 1</span>
        <span className={progress >= 2 ? "completed" : ""}>Carta 2</span>
        <span className={progress >= 3 ? "completed" : ""}>Carta 3</span>
        <span className={progress >= 4 ? "completed" : ""}>Carta 4</span>
      </div>

      <div className="cards-list">
        {pickedCards.length > 0 &&
          pickedCards.map((card) => (
            <div className={`card ${card.color}`} key={card.id}>
              <div className="number">{card.value}</div>
              <div className="remove-btn" onClick={() => handleRemoveCard(card)}>
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
        <button
          onClick={() => setShowSplitPhase(true)}
          className="action-confirm-btn"
        >
          Siguiente: Dividir en Grupos →
        </button>
      )}
    </div>
  );
};
