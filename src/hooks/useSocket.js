import { useEffect, useState, useMemo, act } from "react";
import socket from "../socket";

export default function useSocket(initialData = null) {
  const [hand, setHand] = useState(initialData?.hand || [...Array(6)]);
  const [opponentHand, setOpponentHand] = useState(initialData?.opponentHand || [...Array(6)]);
  const [role, setRole] = useState(initialData?.role || null);
  const [deck, setDeck] = useState(initialData?.deck || null);
  const [allCards, setAllCards] = useState(initialData?.config?.allCards || []);
  const [myDiscarded, setMyDiscarded] = useState(initialData?.myDiscarded || []);
  const [discarded, setDiscarded] = useState(initialData?.discarded || null);

  // Initialize game state from Lobby data if available
  const [isGameStarted, setIsGameStarted] = useState(!!initialData);
  const [availableActions, setAvailableActions] = useState(initialData?.availableActions || []);
  const [opponentAvailableActions, setOpponentAvailableActions] = useState(initialData?.opponentAvailableActions || []);
  const [secretCard, setSecretCard] = useState(initialData?.secretCard || null);
  const [scoredCards, setScoredCards] = useState(initialData?.scoredCards || []);
  const [opponentScoredCards, setOpponentScoredCards] = useState(initialData?.opponentScoredCards || []);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    // Only listen for game-start if we don't have initial data
    if (!initialData) {
      socket.on(
        "game-start",
        ({
          availableActions,
          opponentAvailableActions,
          role,
          hand,
          opponentHand,
          discarded,
          myDiscarded,
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
          setMyDiscarded(myDiscarded || []);
          setIsGameStarted(true);
          setSecretCard(secretCard);
        }
      );
    }

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("game-start");
    };
  }, [initialData]);

  // ... (draw-card, turn-start, oponent-hand-updated hooks remain unchanged)

  useEffect(() => {
       socket.on("new-round", ({
           hand,
           opponentHand,
           discarded,
           myDiscarded,
           deck,
           availableActions,
           opponentAvailableActions,
           favors
       })=> {
           setHand(hand);
           setOpponentHand(opponentHand);
           setDiscarded(discarded);
           setMyDiscarded(myDiscarded || []);
           setDeck(deck);
           setAvailableActions(availableActions);
           setOpponentAvailableActions(opponentAvailableActions);
           setFavors(favors);
           setScoredCards([]);
           setOpponentScoredCards([]);
           setSecretCard(null);
       });
       // ... game-over handler
  }, []); // Reusing the existing useEffect block for new-round might be cleaner by merging edits but let's see.

  useEffect(() => {
    socket.on("discard-action-clean-up", ({ availableActions, hand, discarded, myDiscarded }) => {
      setOverlayOption(null);
      setAvailableActions(availableActions);
      setHand(hand);
      setDiscarded(discarded);
      setMyDiscarded(myDiscarded);
    });
    // ...
  }, []);

  // Additional state not from game-start
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [opponentHoverIndex, setOpponentHoverIndex] = useState(null);
  const [actionResolver, setActionResolver] = useState({});
  const [overlayOption, setOverlayOption] = useState(0);

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

  const [roundMessage, setRoundMessage] = useState(null);

  useEffect(() => {
      socket.on("round-end", ({ favors, scoredCards, opponentScoredCards, isGameOver }) => {
          setFavors(favors);
          setScoredCards(scoredCards); 
          setOpponentScoredCards(opponentScoredCards);
          // Show different message based on whether game is ending
          if (isGameOver) {
              setRoundMessage("Finishing Game...");
          } else {
              setRoundMessage("Round Finished! Preparing Next Round...");
          }
      });

       socket.on("new-round", ({
           hand,
           opponentHand,
           discarded,
           myDiscarded,
           deck,
           availableActions,
           opponentAvailableActions,
           favors
       })=> {
           setRoundMessage(null);
           setHand(hand);
           setOpponentHand(opponentHand);
           setDiscarded(discarded);
           setMyDiscarded(myDiscarded || []);
           setDeck(deck);
           setAvailableActions(availableActions);
           setOpponentAvailableActions(opponentAvailableActions);
           setFavors(favors);
           setScoredCards([]);
           setOpponentScoredCards([]);
           setSecretCard(null);
           setActionResolver({});
           setOverlayOption(null);
       });

       socket.on("game-over", ({ winner }) => {
           // Client-side delay before showing game over screen
           setTimeout(() => {
               setRoundMessage(null);
               setWinner(winner);
           }, 3000); // 3 second delay
       });

       return () => {
           socket.off("round-end");
           socket.off("new-round");
           socket.off("game-over");
       }
  }, []);

  useEffect(() => {
    socket.on("discard-action-clean-up", ({ availableActions, hand, discarded, myDiscarded }) => {
      setOverlayOption(null);
      setAvailableActions(availableActions);
      setHand(hand);
      setDiscarded(discarded);
      setMyDiscarded(myDiscarded);
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

  const discardedCards = useMemo(
    () =>
      discarded
        ? discarded.map((cardId) => allCards.find((c) => c.id === cardId)).filter(Boolean)
        : [],
    [allCards, discarded]
  );

  const myDiscardedCards = useMemo(
    () =>
      myDiscarded
        ? myDiscarded.map((cardId) => allCards.find((c) => c.id === cardId)).filter(Boolean)
        : [],
    [allCards, myDiscarded]
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
    discardedCards,
    myDiscardedCards,
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
  };
}
