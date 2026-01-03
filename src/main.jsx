import { createRoot } from "react-dom/client";
import { useState } from "react";
import "./index.css";
import Board from "./components/Board";
import Lobby from "./components/Lobby";

function App() {
  const [gameData, setGameData] = useState(null);

  const handleGameStart = (data) => {
    setGameData(data);
  };

  const handleReturnToLobby = () => {
    setGameData(null);
  };

  if (gameData) {
    return <Board initialData={gameData} onReturnToLobby={handleReturnToLobby} />;
  }

  return <Lobby onGameStart={handleGameStart} />;
}

createRoot(document.getElementById("root")).render(<App />);
