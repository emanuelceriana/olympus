import { useCallback, useEffect, useState } from "react";
import { SecretAction } from "./SecretAction";
import { DiscardAction } from "./DiscardAction";
import { GiftAction } from "./GiftAction";
import { GiftActionResolver } from "./GiftActionResolver";
import { CompetitionAction } from "./CompetitionAction";
import { CompetitionActionResolver } from "./CompetitionActionResolver";
import "./ActionOverlay.css";

export const ActionOverlay = ({
  socket,
  overlayOption,
  pickedCards,
  setPickedCards,
  actionResolver,
  onClose,
}) => {
  const [canClose, setCanClose] = useState(true);

  useEffect(() => {
    return () => {
      setPickedCards([]);
    };
  }, []);

  const handleRemoveCard = (card) => {
    setPickedCards((prev) => prev.filter((c) => c.id !== card.id));
  };

  const renderActionOption = useCallback(
    (overlayOption, actionResolver) => {
      if (actionResolver && actionResolver.action) {
        switch (actionResolver.action) {
          case 3:
            return (
              <GiftActionResolver
                socket={socket}
                pickedCards={actionResolver.pickedCards}
              />
            );
          case 4:
            return (
              <CompetitionActionResolver
                socket={socket}
                pickedCards={actionResolver.pickedCards}
              />
            );
        }
      }

      switch (overlayOption) {
        case 1:
          return (
            <SecretAction
              socket={socket}
              overlayOption={overlayOption}
              pickedCards={pickedCards}
              handleRemoveCard={handleRemoveCard}
              setCanClose={setCanClose}
            />
          );
        case 2:
          return (
            <DiscardAction
              socket={socket}
              overlayOption={overlayOption}
              pickedCards={pickedCards}
              handleRemoveCard={handleRemoveCard}
              setCanClose={setCanClose}
            />
          );
        case 3:
          return (
            <GiftAction
              socket={socket}
              overlayOption={overlayOption}
              pickedCards={pickedCards}
              handleRemoveCard={handleRemoveCard}
              setCanClose={setCanClose}
            />
          );
        case 4:
          return (
            <CompetitionAction
              socket={socket}
              overlayOption={overlayOption}
              pickedCards={pickedCards}
              handleRemoveCard={handleRemoveCard}
              setCanClose={setCanClose}
            />
          );
        default:
          return "";
      }
    },
    [pickedCards, handleRemoveCard]
  );

  // Don't show close button when resolving opponent's action (must complete it)
  const isResolving = actionResolver && actionResolver.action;

  return (
    <div className="overlay">
      {!isResolving && onClose && canClose && (
        <button className="overlay-close-btn" onClick={onClose} title="Cancelar acción">
          ✕
        </button>
      )}
      {renderActionOption(overlayOption, actionResolver)}
    </div>
  );
};
