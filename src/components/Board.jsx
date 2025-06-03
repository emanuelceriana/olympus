import { useState } from "react";
import { Hand } from "./Hand";
import { Actions } from "./Actions";
import useSocket from "../hooks/useSocket";
import "./Board.css";
import { ActionOverlay } from "./ActionOverlay";

export default function Board() {
  const [overlayOption, setOverlayOption] = useState(0);
  const [pickedCards, setPickedCards] = useState([]);

  const {
    socket,
    hand,
    handCards,
    opponentHand,
    isGameStarted,
    opponentHoverIndex,
    isMyTurn,
  } = useSocket();

  console.log("picked", pickedCards);

  return (
    <div className="board">
      <ActionOverlay
        overlayOption={overlayOption}
        pickedCards={pickedCards}
        setPickedCards={setPickedCards}
      />
      <Actions
        socket={socket}
        isMyTurn={isMyTurn}
        setOverlayOption={setOverlayOption}
      />
      <Hand
        isGameStarted={isGameStarted}
        isOpponent
        cards={opponentHand}
        socket={socket}
        hoveredIndexFromOpponent={opponentHoverIndex}
      />

      <div className="gods">
        {[2, 2, 2, 3, 3, 4, 5].map((value, i) => (
          <div className={`god god-${i}`} key={i} data-value={value}>
            <div className="content">
              <span>{value}</span>
              <span>{value}</span>
            </div>
          </div>
        ))}
      </div>

      <Hand
        isGameStarted={isGameStarted}
        cards={
          isGameStarted
            ? handCards.filter(
                (card) =>
                  !pickedCards.find((pickedCard) => pickedCard.id === card.id)
              )
            : hand
        }
        socket={socket}
        hoveredIndexFromOpponent={null} // This prop is not used in the player hand, so we pass null
        pickedCards={pickedCards}
        overlayOption={overlayOption}
        setPickedCards={setPickedCards}
      />
    </div>
  );
}
