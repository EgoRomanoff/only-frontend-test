import ArrowLeft from "@components/ui/svg/arrow-left";

import styles from "./styles.module.scss";

const YearsSliderNavButton = ({ id, direction }: { id: string; direction: "prev" | "next" }) => {
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
