import { formatToTwoDigits } from "@/utils/formatToTwoDigits";

import styles from './styles.module.scss'

const YearsSliderProgress = ({
  activeIndex,
  itemsCount,
}: {
  activeIndex: number;
  itemsCount: number;
}) => {
  return (
    <span className={styles["controls__progress"]}>
      {formatToTwoDigits(activeIndex + 1)}/{formatToTwoDigits(itemsCount)}
    </span>
  );
};

export default YearsSliderProgress;
