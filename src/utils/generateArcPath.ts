import { getXCoord } from "./getXCoord";
import { getYCoord } from "./getYCoord";

export const generateArcPath = (startAngle: number, endAngle: number, radius: number) => {
  const moveTo = `M ${getXCoord(radius, startAngle)} ${getYCoord(radius, startAngle)}`;
  const arc = `A ${radius} ${radius}`;
  const rotation = 0;
  const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
  const sweepFlag = endAngle > startAngle ? 1 : 0;
  const end = `${getXCoord(radius, endAngle)} ${getYCoord(radius, endAngle)}`;

  return `${moveTo} ${arc} ${rotation} ${largeArcFlag} ${sweepFlag} ${end}`;
};
