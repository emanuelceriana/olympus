import { useEffect, useState, useMemo, act } from "react";
import socket from "../socket";

export default function useSocket() {
  const [hand, setHand] = useState([...Array(6)]);
  const [opponentHand, setOpponentHand] = useState([...Array(6)]);
  const [role, setRole] = useState(null);
  const [deck, setDeck] = useState(null);
  const [allCards, setAllCards] = useState([]);
  const [discarded, setDiscarded] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [opponentHoverIndex, setOpponentHoverIndex] = useState(null);
  const [actionResolver, setActionResolver] = useState({});
  const [overlayOption, setOverlayOption] = useState(0);
  const [availableActions, setAvailableActions] = useState([]);
  const [opponentAvailableActions, setOpponentAvailableActions] = useState([]);
  const [scoredCards, setScoredCards] = useState([]);
  const [opponentScoredCards, setOpponentScoredCards] = useState([]);
  const [secretCard, setSecretCard] = useState(null);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on(
      "game-start",
      ({
        availableActions,
        opponentAvailableActions,
        role,
        hand,
        opponentHand,
        discarded,
        deck,
        secretCard,
        config: { allCards },
      }) => {
        setAvailableActions(availableActions);
        setOpponentAvailableActions(opponentAvailableActions);
        setRole(role);
        setHand(hand);
        setDeck(deck);
        setOpponentHand(opponentHand);
        setAllCards(allCards);
        setDiscarded(discarded);
        setIsGameStarted(true);
        setSecretCard(secretCard);
      }
    );

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("game-start");
    };
  }, []);

  useEffect(() => {
    socket.on("drawn-card", ({ cardId, deck }) => {
      console.log("drawn-card", cardId);
      setHand((prev) => [...prev, cardId]);
      setDeck(deck);
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
      socket.off("turn-start");
    };
  }, []);

  useEffect(() => {
    socket.on("oponent-hand-updated", ({ hand, deck }) => {
      setOpponentHand([...hand]);
      setDeck(deck);
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

  useEffect(() => {
    socket.on(
      "update-opponent-available-actions",
      ({ opponentAvailableActions }) => {
        setOpponentAvailableActions(opponentAvailableActions);
      }
    );

    return () => {
      socket.off("resolve-gift-action");
    };
  }, []);

  useEffect(() => {
    socket.on("resolve-gift-action", ({ pickedCards }) => {
      setActionResolver({ pickedCards, action: 3 });
    });

    return () => {
      socket.off("resolve-gift-action");
    };
  }, []);

  useEffect(() => {
    socket.on(
      "gift-action-clean-up",
      ({
        availableActions,
        opponentAvailableActions,
        hand,
        opponentHand,
        scoredCards,
        opponentScoredCards,
      }) => {
        setOverlayOption(null);
        setActionResolver({});
        setScoredCards(scoredCards);
        setOpponentScoredCards(opponentScoredCards);
        setAvailableActions(availableActions);
        setOpponentAvailableActions(opponentAvailableActions);
        setHand(hand);
        setOpponentHand(opponentHand);
        console.log(scoredCards, opponentScoredCards);
      }
    );

    return () => {
      socket.off("gift-action-clean-up");
    };
  }, []);

  useEffect(() => {
    socket.on(
      "secret-action-clean-up",
      ({ availableActions, hand, secretCard }) => {
        setOverlayOption(null);
        setAvailableActions(availableActions);
        setHand(hand);
        setSecretCard(secretCard);
      }
    );

    return () => {
      socket.off("gift-action-clean-up");
    };
  }, []);

  const [favors, setFavors] = useState({});
  const [winner, setWinner] = useState(null);

  useEffect(() => {
      socket.on("round-end", ({ favors, scoredCards }) => {
          setFavors(favors);
          setScoredCards(scoredCards); // Update to show revealed secrets
      });

       socket.on("new-round", ({
           hand,
           opponentHand,
           discarded,
           deck,
           availableActions,
           opponentAvailableActions,
           favors
       })=> {
           setHand(hand);
           setOpponentHand(opponentHand);
           setDiscarded(discarded);
           setDeck(deck);
           setAvailableActions(availableActions);
           setOpponentAvailableActions(opponentAvailableActions);
           setFavors(favors);
           setScoredCards([]);
           setOpponentScoredCards([]);
           setSecretCard(null);
           // Alert new round?
       });

       socket.on("game-over", ({ winner }) => {
           setWinner(winner);
           alert(winner + " Wins!"); // Simple alert for now
       });

       return () => {
           socket.off("round-end");
           socket.off("new-round");
           socket.off("game-over");
       }
  }, []);

  useEffect(() => {
    socket.on("discard-action-clean-up", ({ availableActions, hand, discarded }) => {
      setOverlayOption(null);
      setAvailableActions(availableActions);
      setHand(hand);
      setDiscarded(discarded);
    });

    return () => {
      // socket.off("discard-action-clean-up");
    };
  }, []);

  useEffect(() => {
    socket.on("update-discarded", ({ discarded }) => {
      setDiscarded(discarded);
    });
    return () => {};
  }, []);

  useEffect(() => {
    socket.on("resolve-competition-action", ({ pickedCards }) => {
      // pickedCards is [[c1, c2], [c3, c4]]
      setActionResolver({ pickedCards, action: 4 });
    });
    return () => {};
  }, []);

  useEffect(() => {
    socket.on("competition-action-clean-up", ({
        availableActions,
        opponentAvailableActions,
        hand,
        opponentHand,
        scoredCards,
        opponentScoredCards,
      }) => {
        setOverlayOption(null);
        setActionResolver({});
        setScoredCards(scoredCards);
        setOpponentScoredCards(opponentScoredCards);
        setAvailableActions(availableActions);
        setOpponentAvailableActions(opponentAvailableActions);
        setHand(hand);
        setOpponentHand(opponentHand);
      });
      return () => {};
  }, []);

  const handCards = useMemo(
    () => allCards.filter((card) => hand.find((cardId) => card.id === cardId)),
    [allCards, hand]
  );

  console.log("scoredCards", scoredCards);
  console.log("opponentHand", opponentHand);
  console.log("secretCard", secretCard);

  return {
    socket,
    availableActions,
    opponentAvailableActions,
    hand,
    deck,
    discarded,
    handCards,
    opponentHand,
    opponentHoverIndex,
    isGameStarted,
    role,
    discarded,
    isMyTurn,
    actionResolver,
    overlayOption,
    scoredCards,
    opponentScoredCards,
    secretCard,
    setOverlayOption,
    favors,
    winner
  };
}
