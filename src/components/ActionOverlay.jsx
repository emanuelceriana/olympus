import { useCallback, useEffect } from "react";
import { SecretAction } from "./SecretAction";
import { DiscardAction } from "./DiscardAction";
import { GiftAction } from "./GiftAction";
import { GiftActionResolver } from "./GiftActionResolver";

export const ActionOverlay = ({
  socket,
  overlayOption,
  pickedCards,
  setPickedCards,
  actionResolver,
}) => {
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
      if (actionResolver) {
        switch (actionResolver.action) {
          case 3:
            return (
              <GiftActionResolver
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
            />
          );
        case 2:
          return (
            <DiscardAction
              overlayOption={overlayOption}
              pickedCards={pickedCards}
              handleRemoveCard={handleRemoveCard}
            />
          );
        case 3:
          return (
            <GiftAction
              socket={socket}
              overlayOption={overlayOption}
              pickedCards={pickedCards}
              handleRemoveCard={handleRemoveCard}
            />
          );
        case 4:
          return "End Turn";
        default:
          return "";
      }
    },
    [pickedCards, handleRemoveCard]
  );

  return (
    <div className="overlay">
      {renderActionOption(overlayOption, actionResolver)}
    </div>
  );
};
