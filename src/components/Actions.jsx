import "./Actions.css";

export const Actions = ({
  socket,
  discarded,
  secretCard,
  availableActions,
  opponentAvailableActions,
  isMyTurn,
  setOverlayOption,
  deck,
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
        <div className="secret-card">
          {secretCard && (
            <div
              className="content"
              style={{ backgroundColor: secretCard.color }}
            >
              <span>{secretCard.value}</span>
              <span>{secretCard.value}</span>
            </div>
          )}
        </div>
        <div className="discarded-cards"></div>
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
