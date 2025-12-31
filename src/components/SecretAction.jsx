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
  }, [pickedCards]);

  return (
    <>
      <h2>Secret</h2>
      <p>Select a card to reserve.</p>
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
      {pickedCards.length === 1 && (
        <button onClick={triggerSecretAction}>Accept</button>
      )}
    </>
  );
};
