import { YEARS_SLIDER_PAGINATION_EL } from "../constants";
import styles from "./styles.module.scss";

const YearsSliderPagination = ({ radius }: { radius: number }) => {
  return (
    <ul
      id={YEARS_SLIDER_PAGINATION_EL}
      className={styles["years-slider__pagination"]}
      style={
        {
          "--radius": `${radius}px`,
        } as React.CSSProperties
      }
    />
  );
};

export default YearsSliderPagination;
