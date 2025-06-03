export const getFanStyle = (
  index,
  total,
  isSelected,
  maxAngle = 80,
  radius = 100
) => {
  if (total === 1) {
    return {
      transform: `translate(-50%, ${isSelected ? "-15%" : "-5%"})`,
      zIndex: 0,
    };
  }

  if (total === 2) {
    maxAngle = 35;
  }

  const step = maxAngle / (total - 1);
  const angle = -maxAngle / 2 + index * step;
  const rad = (angle * Math.PI) / 180;

  const isOdd = total % 2 === 1;
  const middleIndex = Math.floor(total / 2);

  const selectionOffset = isSelected
    ? isOdd && index === middleIndex
      ? 0
      : index >= total / 2
      ? 30
      : -30
    : 0;

  // Posicionar en círculo
  const x = Math.sin(rad) * radius + selectionOffset;
  const y = Math.cos(rad) * radius;

  return {
    transform: `translate(-50%, ${
      isSelected ? "40%" : "50%"
    }) translate(${x}px, ${-y}px) rotate(${angle}deg)`,
    zIndex: index + 2,
  };
};
