import { useRef } from "react";
import { type Swiper as SwiperType } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import Container from "@components/ui/container";
import type { HistoryDate } from "@/types/history";

import styles from "./styles.module.scss";

const HistoryBlock = ({ title, data }: { title: string; data: HistoryDate[] }) => {
  const yearsSliderRef = useRef<SwiperType>();

  return (
    <Container fullHeight>
      <section className={styles.block}>
        <h2 className={styles.title}>{title}</h2>

        <Swiper
          className={styles["years-slider"]}
          style={{
            "--items-count": data.length,
          } as React.CSSProperties}
          modules={[Navigation, Pagination]}
          onSwiper={swiper => {
            yearsSliderRef.current = swiper;
          }}
          pagination={{
            bulletClass: styles["pagination-bullet"],
            bulletActiveClass: styles['pagination-bullet-active'],
            clickable: true,
          }}
        >
          {data.map(({ startYear, endYear }) => (
            <SwiperSlide key={`${startYear}-${endYear}`}>
              <div className={styles["years-slide"]}>
                <span className={styles["start-year"]}>{startYear}</span>
                <span className={styles["end-year"]}>{endYear}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </Container>
  );
};

export default HistoryBlock;
