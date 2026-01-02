import { useCallback, useState } from "react";

export const CompetitionAction = ({
  socket,
  overlayOption,
  pickedCards,

  handleRemoveCard,
  setCanClose,
  itemImages,
}) => {
  const [set1Ids, setSet1Ids] = useState([]);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [showSplitPhase, setShowSplitPhase] = useState(false);

  const toggleSet1 = (cardId) => {
    if (waitingForOpponent) return;
    if (set1Ids.includes(cardId)) {
      setSet1Ids((prev) => prev.filter((id) => id !== cardId));
    } else {
      setSet1Ids((prev) => [...prev, cardId]);
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
    setCanClose(false);
  }, [pickedCards, set1Ids, socket, setCanClose]);

  const requiredCards = 4;
  const progress = pickedCards.length;

  if (waitingForOpponent) {
    return (
      <div className="action-container waiting">
        <h2>Waiting for Opponent...</h2>
        <p className="action-description">
          Your opponent is choosing one of the two groups you offered.
        </p>
        <div className="competition-sets">
          <div className="card-set">
            <h4>Group 1</h4>
            <div className="set-cards">
              {pickedCards.filter((c) => set1Ids.includes(c.id)).map((card) => {
                 const itemImg = itemImages ? itemImages[card.color] : null;
                 return (
                    <div className={`card ${card.color}`} key={card.id}>
                      {itemImg && <img src={itemImg} className="item-image" alt="" />}
                      <div className="number">{card.value}</div>
                    </div>
                 );
              })}
            </div>
          </div>
          <div className="card-set">
            <h4>Group 2</h4>
            <div className="set-cards">
              {pickedCards.filter((c) => !set1Ids.includes(c.id)).map((card) => {
                 const itemImg = itemImages ? itemImages[card.color] : null;
                 return (
                    <div className={`card ${card.color}`} key={card.id}>
                      {itemImg && <img src={itemImg} className="item-image" alt="" />}
                      <div className="number">{card.value}</div>
                    </div>
                 );
              })}
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
        <p className="action-description">
          Click on <strong>2 cards</strong> to assign them to <strong>Group 1</strong>.
          The other 2 will automatically go to Group 2.
          Your opponent will choose one of the groups.
        </p>

        <div className="competition-sets split-mode">
          <div className="card-set">
            <h4 style={{ color: set1Ids.length !== 2 ? '#ff4d4d' : 'inherit' }}>
              Group 1 ({set1Ids.length}/2)
            </h4>
            <div className="set-cards">
              {pickedCards.filter((c) => set1Ids.includes(c.id)).map((card) => {
                 const itemImg = itemImages ? itemImages[card.color] : null;
                 return (
                    <div
                      className={`card ${card.color} selected-set`}
                      key={card.id}
                      onClick={() => toggleSet1(card.id)}
                    >
                      {itemImg && <img src={itemImg} className="item-image" alt="" />}
                      <div className="number">{card.value}</div>
                    </div>
                 );
              })}
              {Array(Math.max(0, 2 - set1Ids.length))
                .fill(null)
                .map((_, i) => (
                  <div className="card-border small" key={`empty-1-${i}`}></div>
                ))}
            </div>
          </div>
          <div className="card-set">
            <h4 style={{ color: (4 - set1Ids.length) !== 2 ? '#ff4d4d' : 'inherit' }}>
              Group 2 ({4 - set1Ids.length}/2)
            </h4>
            <div className="set-cards">
              {pickedCards.filter((c) => !set1Ids.includes(c.id)).map((card) => {
                 const itemImg = itemImages ? itemImages[card.color] : null;
                 return (
                    <div
                      className={`card ${card.color}`}
                      key={card.id}
                      onClick={() => toggleSet1(card.id)}
                    >
                      {itemImg && <img src={itemImg} className="item-image" alt="" />}
                      <div className="number">{card.value}</div>
                    </div>
                 );
              })}
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={() => setShowSplitPhase(false)} className="secondary-btn">
            ← Back
          </button>
          {set1Ids.length === 2 && (
            <button onClick={triggerCompetitionAction} className="action-confirm-btn">
             Offer Groups
            </button>
          )}
        </div>
      </div>
    );
  }

  // Selection phase
  return (
    <div className="action-container">
      <p className="action-description">
        Choose <strong>4 cards</strong> from your hand. Then you will split them into 2 groups of 2.
        Your opponent will choose a group and the other will be yours.
      </p>

      <div className="step-indicator">
        <span className={progress >= 1 ? "completed" : ""}>Card 1</span>
        <span className={progress >= 2 ? "completed" : ""}>Card 2</span>
        <span className={progress >= 3 ? "completed" : ""}>Card 3</span>
        <span className={progress >= 4 ? "completed" : ""}>Card 4</span>
      </div>

      <div className="cards-list">
        {pickedCards.length > 0 &&
          pickedCards.map((card) => {
             const itemImg = itemImages ? itemImages[card.color] : null;
             return (
                <div className={`card ${card.color}`} key={card.id}>
                  {itemImg && <img src={itemImg} className="item-image" alt="" />}
                  <div className="number">{card.value}</div>
                  <div className="remove-btn" onClick={() => handleRemoveCard(card)}>
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
        <button
          onClick={() => setShowSplitPhase(true)}
          className="action-confirm-btn"
        >
          Split into Groups
        </button>
      )}
    </div>
  );
};
