import YearsSliderProgress from "./years-slider-progress";
import YearsSliderNavButton from "./years-slider-nav-button";
import styles from "./styles.module.scss";
import YearsSliderPagination from "./years-slider-pagination";

const YearsSliderControls = ({
  activeIndex,
  itemsCount,
  radius,
}: {
  activeIndex: number;
  itemsCount: number;
  radius: number;
}) => {
  return (
    <div className={styles["years-slider__controls"]}>
      <YearsSliderPagination radius={radius} />

      <YearsSliderProgress
        activeIndex={activeIndex}
        itemsCount={itemsCount}
      />

      <div className={styles["controls__nav"]}>
        <YearsSliderNavButton direction="prev" />
        <YearsSliderNavButton direction="next" />
      </div>
    </div>
  );
};

export default YearsSliderControls;
