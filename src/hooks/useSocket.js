import { useEffect, useState, useMemo } from "react";
import socket from "../socket";

export default function useSocket() {
  const [hand, setHand] = useState([...Array(6)]);
  const [opponentHand, setOpponentHand] = useState([...Array(6)]);
  const [role, setRole] = useState(null);
  const [allCards, setAllCards] = useState([]);
  const [discarded, setDiscarded] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [opponentHoverIndex, setOpponentHoverIndex] = useState(null);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on(
      "game-start",
      ({ role, hand, opponentHand, discarded, config: { allCards } }) => {
        setRole(role);
        setHand(hand);
        setOpponentHand(opponentHand);
        setAllCards(allCards);
        setDiscarded(discarded);
        setIsGameStarted(true);
      }
    );

    socket.on("disconnect", () => {
      console.log("Socket desconectado");
    });

    return () => {
      socket.off("game-start");
    };
  }, []);

  useEffect(() => {
    socket.on("drawn-card", ({ cardId }) => {
      console.log("drawn-card", cardId);
      setHand((prev) => [...prev, cardId]);
    });

    return () => {
      socket.off("draw-card");
    };
  }, []);

  useEffect(() => {
    socket.on("turn-start", ({ myTurn }) => {
      setIsMyTurn(myTurn);
    });

    return () => {
      socket.off("draw-card");
    };
  }, []);

  useEffect(() => {
    socket.on("oponent-hand-updated", ({ hand }) => {
      setOpponentHand([...hand]);
    });

    return () => {
      socket.off("oponent-hand-updated");
    };
  }, []);

  useEffect(() => {
    socket.on("opponent-hover", ({ index }) => {
      setOpponentHoverIndex(index);
    });

    return () => {
      socket.off("opponent-hover");
    };
  }, []);

  const handCards = useMemo(
    () => allCards.filter((card) => hand.find((cardId) => card.id === cardId)),
    [allCards, hand]
  );

  console.log("myTurn", isMyTurn);
  console.log("handCards", handCards);

  return {
    socket,
    hand,
    handCards,
    opponentHand,
    opponentHoverIndex,
    isGameStarted,
    role,
    discarded,
    isMyTurn,
  };
}
