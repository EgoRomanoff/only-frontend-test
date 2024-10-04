import { gsap } from "gsap";

// import { getCircleAngle } from "./getCircleAngle";
// import { getXCoord } from "./getXCoord";
// import { getYCoord } from "./getYCoord";

export const distributeInLine = (
  elementsArray: HTMLElement[],
  // radius: number,
  // offsetAngle: number,
  // activeIndex: number = 0
) => {
  // elementsArray.forEach((element, i, array) => {
  elementsArray.forEach((element) => {
    // const angle = getCircleAngle(i, activeIndex, array.length, offsetAngle);

    gsap.set(element, {
      x: 'auto',
      y: 'auto',
    });
  });
};
