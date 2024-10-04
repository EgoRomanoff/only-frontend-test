import ArrowLeft from "@components/ui/svg/arrow-left";

import styles from "./styles.module.scss";
import { YEARS_SLIDER_NAV_NEXT_ID, YEARS_SLIDER_NAV_PREV_ID } from "../constants";

const YearsSliderNavButton = ({ direction }: { direction: "prev" | "next" }) => {
  const id = direction === "prev" ? YEARS_SLIDER_NAV_PREV_ID : YEARS_SLIDER_NAV_NEXT_ID;
  const className = styles[direction === "prev" ? "nav__btn-prev" : "nav__btn-next"];

  return (
    <button
      id={id}
      className={className}
    >
      <ArrowLeft />
    </button>
  );
};

export default YearsSliderNavButton;
