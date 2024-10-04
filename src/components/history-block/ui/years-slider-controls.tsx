import YearsSliderProgress from "./years-slider-progress";
import YearsSliderNavButton from "./years-slider-nav-button";
import styles from "./styles.module.scss";
import YearsSliderPagination from "./years-slider-pagination";

const YearsSliderControls = ({
  activeIndex,
  itemsCount,
  radius,
  navNextID,
  navPrevID,
  paginationID,
}: {
  activeIndex: number;
  itemsCount: number;
  radius: number;
  navPrevID: string;
  navNextID: string;
  paginationID: string
}) => {
  return (
    <div className={styles["years-slider__controls"]}>
      <YearsSliderPagination id={paginationID} radius={radius} />

      <YearsSliderProgress
        activeIndex={activeIndex}
        itemsCount={itemsCount}
      />

      <div className={styles["controls__nav"]}>
        <YearsSliderNavButton
          id={navPrevID}
          direction="prev"
        />
        <YearsSliderNavButton
          id={navNextID}
          direction="next"
        />
      </div>
    </div>
  );
};

export default YearsSliderControls;
