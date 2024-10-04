import { gsap } from "gsap";

import { getCircleAngle } from "./getCircleAngle";
import { getXCoord } from "./getXCoord";
import { getYCoord } from "./getYCoord";

export const distributeInCircle = (
  elementsArray: HTMLElement[],
  radius: number,
  offsetAngle: number,
  activeIndex: number = 0
) => {
  elementsArray.forEach((element, i, array) => {
    const angle = getCircleAngle(i, activeIndex, array.length, offsetAngle);

    gsap.set(element, {
      x: getXCoord(radius, angle),
      y: getYCoord(radius, angle),
    });
  });
};
