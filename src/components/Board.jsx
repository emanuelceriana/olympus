import { useState } from "react";
import { Hand } from "./Hand";
import { Actions } from "./Actions";
import useSocket from "../hooks/useSocket";
import "./Board.css";
import { ActionOverlay } from "./ActionOverlay";
import cn from "classnames";

export default function Board() {
  const {
    socket,
    availableActions,
    opponentAvailableActions,
    hand,
    deck,
    discarded,
    handCards,
    opponentHand,
    isGameStarted,
    opponentHoverIndex,
    isMyTurn,
    actionResolver,
    overlayOption,
    scoredCards,
    opponentScoredCards,
    secretCard,
    setOverlayOption,
  } = useSocket();

  const [pickedCards, setPickedCards] = useState([]);

  return (
    <div className="board">
      {(overlayOption || actionResolver.action) && (
        <ActionOverlay
          socket={socket}
          overlayOption={overlayOption}
          pickedCards={pickedCards}
          setPickedCards={setPickedCards}
          actionResolver={actionResolver}
        />
      )}
      <Actions
        socket={socket}
        isMyTurn={isMyTurn}
        setOverlayOption={setOverlayOption}
        deck={deck}
        discarded={discarded}
        secretCard={secretCard}
        availableActions={availableActions}
        opponentAvailableActions={opponentAvailableActions}
      />
      <Hand
        isGameStarted={isGameStarted}
        isOpponent
        cards={opponentHand}
        socket={socket}
        hoveredIndexFromOpponent={opponentHoverIndex}
      />

      <div className="opponent-scored-cards">
        {[
          "2:pink",
          "2:yellow",
          "2:lightblue",
          "3:blue",
          "3:red",
          "4:green",
          "5:purple",
        ].map((value, i) => (
          <div
            className={cn(`god god-${i}`, {
              hidden: !opponentScoredCards.find(
                (card) => `${card.value}:${card.color}` === value
              ),
            })}
            key={i}
            data-value={+value[0]}
            data-count={
              opponentScoredCards.filter(
                (card) => `${card.value}:${card.color}` === value
              ).length
            }
          >
            <div className="content">
              <span>{+value[0]}</span>
              <span>{+value[0]}</span>
            </div>
          </div>
        ))}
      </div>
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
      <div className="player-scored-cards">
        {[
          "2:pink",
          "2:yellow",
          "2:lightblue",
          "3:blue",
          "3:red",
          "4:green",
          "5:purple",
        ].map((value, i) => (
          <div
            className={cn(`god god-${i}`, {
              hidden: !scoredCards.find(
                (card) => `${card.value}:${card.color}` === value
              ),
            })}
            key={i}
            data-value={+value[0]}
            data-count={
              scoredCards.filter(
                (card) => `${card.value}:${card.color}` === value
              ).length
            }
          >
            <div className="content">
              <span>{+value[0]}</span>
              <span>{+value[0]}</span>
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
