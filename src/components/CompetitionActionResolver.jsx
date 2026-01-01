import { useCallback } from "react";

export const CompetitionActionResolver = ({ socket, pickedCards }) => {
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
      <h2>⚔️ Oferta de Competencia</h2>
      <p className="action-description">
        Tu oponente te ofrece <strong>2 grupos</strong> de cartas.
        Elige el grupo que deseas quedarte. El otro será para tu oponente.
      </p>

      <p className="instruction-highlight">👆 Haz clic en el grupo que deseas</p>

      <div className="competition-sets resolver-sets">
        {pickedCards.map((set, setIndex) => (
          <div
            key={setIndex}
            className="card-set selectable"
            onClick={() => handleChooseSet(setIndex)}
          >
            <h4>Grupo {setIndex + 1}</h4>
            <div className="set-cards">
              {set.map((card) => (
                <div className={`card ${card.color}`} key={card.id}>
                  <div className="number">{card.value}</div>
                </div>
              ))}
            </div>
            <div className="select-overlay">
              <span>ELEGIR ESTE GRUPO</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
