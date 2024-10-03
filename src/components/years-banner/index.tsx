import { useEffect, useRef, useState } from "react";

import { updateYear } from "@/utils/updateYear";
import { ANIMATION_DURATION } from "@components/constants";

import styles from "./styles.module.scss";

const YearsBanner = ({ startYear, endYear }: { startYear: number; endYear: number }) => {
  const startYearRef = useRef<HTMLSpanElement | null>(null);
  const endYearRef = useRef<HTMLSpanElement | null>(null);
  const [startYearValue, setStartYearValue] = useState<number | null>(() => startYear);
  const [endYearValue, setEndYearValue] = useState<number | null>(() => endYear);

  // Update years values when active index change
  useEffect(() => {
    const startYearElem = startYearRef.current;
    const endYearElem = endYearRef.current;

    if (startYearElem && endYearElem) {
      updateYear(startYearElem, startYear, ANIMATION_DURATION);
      updateYear(endYearElem, endYear, ANIMATION_DURATION);
    }

    setStartYearValue(startYear);
    setEndYearValue(endYear);
  }, [startYear, endYear]);

  return (
    <p className={styles["years-banner"]}>
      <span
        ref={startYearRef}
        className={styles.year}
      >
        {startYearValue}
      </span>
      <span
        ref={endYearRef}
        className={styles.year}
      >
        {endYearValue}
      </span>
    </p>
  );
};

export default YearsBanner;
