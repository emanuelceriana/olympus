import { useCallback } from "react";

export const CompetitionActionResolver = ({ socket, pickedCards, itemImages }) => {
  const handleChooseSet = useCallback(
    (index) => {
      socket.emit("end-competition-action", {
        chosenSetIndex: index,
        pickedCards: pickedCards,
      });
    },
    [socket, pickedCards]
  );

  return (
    <div className="action-container resolver">
      <p className="action-description">
        Your opponent offers you <strong>2 groups</strong> of cards.
        Choose the group you want to keep. The other will go to your opponent.
      </p>

      <p className="instruction-highlight">Click on the group you want</p>

      <div className="competition-sets resolver-sets">
        {pickedCards.map((set, setIndex) => (
          <div
            key={setIndex}
            className="card-set selectable"
            onClick={() => handleChooseSet(setIndex)}
          >
            <h4>Group {setIndex + 1}</h4>
            <div className="set-cards">
              {set.map((card) => {
                 const itemImg = itemImages ? itemImages[card.color] : null;
                 return (
                    <div className={`card ${card.color}`} key={card.id}>
                      {itemImg && <img src={itemImg} className="item-image" alt="" />}
                      <div className="number">{card.value}</div>
                    </div>
                 );
              })}
            </div>
            <div className="select-overlay">
              <span>PICK THIS GROUP</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
