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
  itemImages,
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
                itemImages={itemImages}
              />
            );
          case 4:
            return (
              <CompetitionActionResolver
                socket={socket}
                pickedCards={actionResolver.pickedCards}
                itemImages={itemImages}
              />
            );
        }
      }

      const commonProps = {
          socket,
          overlayOption,
          pickedCards,
          handleRemoveCard,
          setCanClose,
          itemImages
      };

      switch (overlayOption) {
        case 1:
          return <SecretAction {...commonProps} />;
        case 2:
          return <DiscardAction {...commonProps} />;
        case 3:
          return <GiftAction {...commonProps} />;
        case 4:
          return <CompetitionAction {...commonProps} />;
        default:
          return "";
      }
    },
    [pickedCards, handleRemoveCard, itemImages]
  );

  // Don't show close button when resolving opponent's action (must complete it)
  const isResolving = actionResolver && actionResolver.action;

  return (
    <div className="overlay">
      {!isResolving && onClose && canClose && (
        <button className="overlay-close-btn" onClick={onClose} title="Cancel">
          ✕
        </button>
      )}
      {renderActionOption(overlayOption, actionResolver)}
    </div>
  );
};
