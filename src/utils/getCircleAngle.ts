export const getCircleAngle = (
  i: number,
  activeIndex: number,
  itemsCount: number,
  angleOffset: number = 0
) => {
  const circleIndex = (i - activeIndex + itemsCount) % itemsCount;
  const sectorAngle = (2 * Math.PI) / itemsCount;

  return circleIndex * sectorAngle - angleOffset;
};
