import styles from "./styles.module.scss";

const YearsSliderPagination = ({ id, radius }: { id: string; radius: number }) => {
  return (
    <ul
      id={id}
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
