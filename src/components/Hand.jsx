import { useState, useCallback } from "react";
import { getFanStyle } from "../utils";
import "./Hand.css";

export const Hand = ({
  isGameStarted,
  isOpponent,
  cards,
  socket,
  hoveredIndexFromOpponent,
  overlayOption,
  pickedCards,
  setPickedCards,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const effectiveHoveredIndex = isOpponent
    ? hoveredIndexFromOpponent
    : hoveredIndex;

  const handleMouseEnter = (i) => {
    setHoveredIndex(i);
    if (!isOpponent) socket.emit("hover-card", { index: i });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    if (!isOpponent) socket.emit("hover-card", { index: null });
  };

  const handlePickCards = useCallback(
    (cardId) => {
      if (isOpponent) return; // Prevent picking cards from opponent's hand

      if (pickedCards.length < overlayOption) {
        setPickedCards((prev) => [...prev, cardId]);
      }
    },
    [pickedCards, overlayOption]
  );

  return isGameStarted || (!isGameStarted && !isOpponent) ? (
    <div className={`hand ${isOpponent ? "opponent-hand" : "player-hand"}`}>
      {cards.map((card, i, arr) => {
        const total = arr.length;
        const isHovered = i === effectiveHoveredIndex;
        const style = getFanStyle(i, total, isHovered);
        const showCardDetails = isGameStarted && !isOpponent;

        return (
          <div
            className={`card ${isOpponent ? "back" : "front"} fanned ${
              showCardDetails ? card.color : ""
            }`}
            style={style}
            key={`player-${i}`}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={() => handleMouseLeave(null)}
            onClick={() => handlePickCards(card)}
          >
            {showCardDetails && <div className="number">{card.value}</div>}
          </div>
        );
      })}
    </div>
  ) : (
    <div className="waiting-message">WAITING PLAYER 2...</div>
  );
};
