import { gsap } from "gsap";

export const updateYear = (elem: HTMLElement, from: number, to: number, duration: number = 1) => {
  gsap.fromTo(
    elem,
    { innerText: from },
    {
      innerText: to,
      duration,
      snap: { innerText: 1 },
      ease: "power2.out",
    }
  );
};
