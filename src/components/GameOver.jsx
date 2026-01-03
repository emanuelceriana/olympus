import "./GameOver.css";

export const GameOver = ({ winner, onRestart }) => {
  if (!winner) return null;

  return (
    <div className="game-over-overlay">
      <div className="game-over-content">
        <h1>GAME OVER</h1>
        <h2>{winner === "You" ? "VICTORY" : "DEFEAT"}</h2>
        <div className="winner-announcement">
            {winner === "You" ? "You have won the favor of the Gods!" : "Your opponent has claimed Olympus."}
        </div>
        <button className="restart-btn" onClick={() => window.location.reload()}>
          Play Again
        </button>
      </div>
    </div>
  );
};
