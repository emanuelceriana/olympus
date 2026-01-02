import coinImg from "../assets/coin.png";
import { useState, useEffect } from "react";
import { Hand } from "./Hand";
import { GameOver } from "./GameOver";
import { Actions } from "./Actions";
import useSocket from "../hooks/useSocket";
import "./Board.css";
import "./Board.css";
import "./StackCounter.css";
import "./WaitingScreen.css";
import { ActionOverlay } from "./ActionOverlay";
import cn from "classnames";

// God Images (Full Art)
import aphroditeImg from "../assets/gods/aphrodite.jpg";
import zeusImg from "../assets/gods/zeus.jpg";
import artemisImg from "../assets/gods/artemis.jpg";
import athenaImg from "../assets/gods/athena.jpg";
import aresImg from "../assets/gods/ares.jpg";
import dionysusImg from "../assets/gods/dionysus.jpg";
import hadesImg from "../assets/gods/hades.jpg";

// Item Images (Objects for Cards)
import aphroditeItem from "../assets/god-objects/aphrodite.png";
import zeusItem from "../assets/god-objects/zeus.png";
import artemisItem from "../assets/god-objects/artemis.png";
import athenaItem from "../assets/god-objects/athena.png";
import aresItem from "../assets/god-objects/ares.png";
import dionysusItem from "../assets/god-objects/dionysus.png";
import hadesItem from "../assets/god-objects/hades.png";

const godImages = {
  pink: aphroditeImg,
  lightblue: artemisImg,
  green: dionysusImg,
  red: aresImg,
  gold: athenaImg,
  purple: hadesImg,
  yellow: zeusImg,
};

const itemImages = {
  pink: aphroditeItem,
  lightblue: artemisItem,
  green: dionysusItem,
  red: aresItem,
  gold: athenaItem,
  purple: hadesItem,
  yellow: zeusItem,
};

// God data configuration - ordered by importance (value)
// Lower value = less important, Higher value = more important
const GODS_CONFIG = [
  { val: 2, col: 'pink', name: 'Afrodita' },      // Love - least combat
  { val: 2, col: 'lightblue', name: 'Artemisa' }, // Hunt
  { val: 2, col: 'green', name: 'Dionisio' },     // Wine
  { val: 3, col: 'red', name: 'Ares' },           // War
  { val: 3, col: 'gold', name: 'Atenea' },        // Wisdom
  { val: 4, col: 'purple', name: 'Hades' },       // Underworld
  { val: 5, col: 'yellow', name: 'Zeus' },        // King of Gods - most important
];

export default function Board() {
  const {
    socket,
    availableActions,
    opponentAvailableActions,
    hand,
    deck,
    handCards,
    opponentHand,
    discarded,
    discardedCards,
    myDiscardedCards,
    isGameStarted,
    opponentHoverIndex,
    isMyTurn,
    actionResolver,
    overlayOption,
    scoredCards,
    opponentScoredCards,
    secretCard,
    setOverlayOption,
    favors,
    winner,
    roundMessage
  } = useSocket();

  const [pickedCards, setPickedCards] = useState([]);
  // Removed delayed notification logic as per user request (show immediately)


  return (
    <div className="board">
      {(overlayOption || actionResolver.action) && (
        <ActionOverlay
          socket={socket}
          overlayOption={overlayOption}
          pickedCards={pickedCards}
          setPickedCards={setPickedCards}
          actionResolver={actionResolver}
          itemImages={itemImages}
          onClose={() => {
            setOverlayOption(null);
            setPickedCards([]);
          }}
        />
      )}
      <Actions
        socket={socket}
        isMyTurn={isMyTurn}
        setOverlayOption={setOverlayOption}
        deck={deck}
        discarded={discarded}
        discardedCards={discardedCards}
        myDiscardedCards={myDiscardedCards}
        secretCard={secretCard}
        availableActions={availableActions}
        opponentAvailableActions={opponentAvailableActions}
        itemImages={itemImages}
      />
      <Hand
        isGameStarted={isGameStarted}
        isOpponent
        cards={opponentHand}
        socket={socket}
        hoveredIndexFromOpponent={opponentHoverIndex}
        itemImages={itemImages}
      />

      <div className="gods">
        {GODS_CONFIG.map((item, i) => {
          const godImg = godImages[item.col];
          const owner = favors[item.col];
          const isMyFavor = owner === socket.id;
          const isOpponentFavor = owner && owner !== socket.id;
          
          // Check scored cards using the god's color and value
          const playerScoreCount = scoredCards.filter(c => c.value === item.val && c.color === item.col).length;
          const oppScoreCount = opponentScoredCards.filter(c => c.value === item.val && c.color === item.col).length;

          return (
            <div className="god-column" key={i}>
              {/* Opponent Scored Marker */}
              <div className={cn("scored-marker", { visible: oppScoreCount > 0 })}>
                 {oppScoreCount > 0 && (
                   <div className="content">
                     <span>{item.val}</span>
                     {oppScoreCount > 0 && <span className="stack-count">x{oppScoreCount}</span>}
                   </div>
                 )}
              </div>

              {/* God Card */}
              <div 
              className={cn("god", item.col, {
                  'favor-me': isMyFavor,
                  'favor-opponent': isOpponentFavor
              })} 
                data-value={item.val}
              >
                <img 
                  className="god-img"
                  src={godImg || ""}
                  alt={item.name}
                />
                
                {/* Favor Token */}
                <img 
                  src={coinImg} 
                  className={cn("god-token", {
                      "token-center": !owner,
                      "token-player": isMyFavor,
                      "token-opponent": isOpponentFavor
                  })}
                  alt="token"
                />
                <div className="content">
                  <span>{item.val}</span>
                  <span>{item.val}</span>
                </div>
              </div>

              {/* Player Scored Marker */}
              <div className={cn("scored-marker", { visible: playerScoreCount > 0 })}>
                 {playerScoreCount > 0 && (
                   <div className="content">
                     <span>{item.val}</span>
                     {playerScoreCount > 0 && <span className="stack-count">x{playerScoreCount}</span>}
                   </div>
                 )}
              </div>
            </div>
        )})}
      </div>

      {!actionResolver.action && (
        <Hand
          isGameStarted={isGameStarted}
          cards={
            isGameStarted
              ? handCards.filter(
                  (card) =>
                    !pickedCards.find((pickedCard) => pickedCard.id === card.id)
                )
              : []
          }
          socket={socket}
          hoveredIndexFromOpponent={null} 
          pickedCards={pickedCards}
          overlayOption={overlayOption}
          setPickedCards={setPickedCards}
          itemImages={itemImages}
        />
      )}


      <GameOver winner={winner === socket.id ? "You" : (winner ? "Opponent" : null)} />
      
      {roundMessage && !winner && (
        <div className="round-notification">
            <div className="round-notification-content">
                <h2>{roundMessage}</h2>
                <div className="olympus-loader"></div>
            </div>
        </div>
      )}
    </div>
  );
};

