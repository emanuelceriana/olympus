import "./Actions.css";

export const Actions = ({
  socket,
  discarded,
  discardedCards,
  myDiscardedCards,
  secretCard,
  availableActions,
  opponentAvailableActions,
  isMyTurn,
  setOverlayOption,
  deck,
  itemImages,
}) => {
  const handleOpenAction = (actionOption) => {
    isMyTurn && setOverlayOption(actionOption);
  };

  return (
    <div className="actions">
      <div className="action-icons opponent-actions">
        <button disabled={!opponentAvailableActions.includes(1)}>1</button>
        <button disabled={!opponentAvailableActions.includes(2)}>2</button>
        <button disabled={!opponentAvailableActions.includes(3)}>3</button>
        <button disabled={!opponentAvailableActions.includes(4)}>4</button>
      </div>
      <div className="deck-box">
        <div className="deck" data-count={deck?.length}>
          {deck?.length}
        </div>
        <div className="deck discard" data-count={discarded?.length}>
          {discarded?.length}
        </div>
      </div>
      <div className="player-cards">
        {/* Secret Card Section */}
        <div className="slot-group">
            <span className="slot-label">SECRET</span>
            <div className="card-slot secret-card">
            {secretCard && (
                <div
                className={`content ${secretCard.color}`}
                >
                {itemImages[secretCard.color] && (
                    <img src={itemImages[secretCard.color]} className="god-object-icon" alt="" />
                )}
                <span className="card-value">{secretCard.value}</span>
                </div>
            )}
            </div>
        </div>
        
        {/* Spacer */}
        <div className="card-slot spacer"></div>

        {/* Discarded Cards Section */}
        <div className="slot-group">
            <span className="slot-label">DISCARD</span>
            <div className="discard-slots-row">
                {[0, 1].map(offset => {
                    // We want to show only the cards discarded by the player (myDiscardedCards).
                    // We take the last 2 of them.
                    const cardsToShow = myDiscardedCards ? myDiscardedCards.slice(-2) : [];
                    
                    // Let's use flexible rendering for the discard slots.
                    const card = cardsToShow[offset];
                    return (
                        <div key={`discard-slot-${offset}`} className="card-slot discarded-slot">
                            {card && (
                                <div className={`discarded-preview ${card.color}`}>
                                    {itemImages[card.color] && (
                                    <img src={itemImages[card.color]} className="god-object-icon" alt="" />
                                    )}
                                    <span className="card-value">{card.value}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
      <div className="action-icons player-actions">
        {" "}
        <button
          onClick={() => handleOpenAction(1)}
          disabled={!availableActions.includes(1)}
        >
          1
        </button>
        <button
          onClick={() => handleOpenAction(2)}
          disabled={!availableActions.includes(2)}
        >
          2
        </button>
        <button
          onClick={() => handleOpenAction(3)}
          disabled={!availableActions.includes(3)}
        >
          3
        </button>
        <button
          onClick={() => handleOpenAction(4)}
          disabled={!availableActions.includes(4)}
        >
          4
        </button>
      </div>
    </div>
  );
};
