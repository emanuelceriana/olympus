import { useCallback, useState } from "react";
import shortid from "shortid";

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
  }, [pickedCards]);

  return (
    <>
      <h2>Gift</h2>
      <p>
        {waitingForOpponent
          ? "Waiting for your opponent to choose"
          : "Select three cards, then your opponent will choose one of the three"}
      </p>
      <div className="cards-list">
        {pickedCards.length > 0 &&
          pickedCards.map((card) => (
            <div className={`card ${card.color}`} key={card.id}>
              <div className="number">{card.value}</div>
              {!waitingForOpponent && (
                <div
                  className="remove-btn"
                  onClick={() => handleRemoveCard(card)}
                >
                  X
                </div>
              )}
            </div>
          ))}
        {Array(overlayOption - pickedCards.length)
          .fill()
          .map((_, idx) => (
            <div className="card-border" key={idx}></div>
          ))}
      </div>
      {!waitingForOpponent && pickedCards.length === 3 && (
        <button onClick={triggerGiftAction}>Accept</button>
      )}
    </>
  );
};
