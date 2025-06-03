import React from "react";
import "./Actions.css";

export const Actions = ({ socket, isMyTurn, setOverlayOption }) => {
  const handleEndTurn = () => {
    // if (isMyTurn) socket.emit("end-turn");
  };

  const handleReserveCard = () => {
    isMyTurn && setOverlayOption(1);
  };

  const handlePickThreeCards = () => {
    isMyTurn && setOverlayOption(3);
  };

  return (
    <div className="actions">
      <div className="action-icons">
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
      </div>
      <div className="profile-card"></div>
      <div className="action-icons">
        <button onClick={handleReserveCard}>1</button>
        <button>2</button>
        <button onClick={handlePickThreeCards}>3</button>
        <button>4</button>
      </div>
    </div>
  );
};
