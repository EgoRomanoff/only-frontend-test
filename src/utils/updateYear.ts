import { gsap } from "gsap";

export const updateYear = (elem: HTMLElement, to: number, duration: number = 1) => {
  gsap.fromTo(
    elem,
    { innerText: elem.innerText },
    {
      innerText: to,
      duration,
      snap: { innerText: 1 },
      ease: "power2.out",
    }
  );
};
