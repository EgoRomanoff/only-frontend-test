import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { type Swiper as SwiperType } from "swiper/types";
import { Navigation } from "swiper/modules";

import ArrowLeft from "@components/ui/svg/arrow-left";
import type { HistoryUnit } from "@/types/history";

import styles from "./styles.module.scss";

const EVENTS_SLIDER_NAV_NEXT_ID = "events-slider-nav-next";
const EVENTS_SLIDER_NAV_PREV_ID = "events-slider-nav-prev";

const EventsSlider = ({ eventsData }: { eventsData: HistoryUnit[] }) => {
  const eventsSliderRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const eventsSwiper = eventsSliderRef.current;

    if (eventsSwiper) {
      eventsSwiper.slideTo(0);
    }
  }, [eventsData]);

  return (
    <div className={styles["events-slider"]}>
      <Swiper
        modules={[Navigation]}
        onSwiper={swiper => {
          eventsSliderRef.current = swiper;
        }}
        navigation={{
          prevEl: `#${EVENTS_SLIDER_NAV_PREV_ID}`,
          nextEl: `#${EVENTS_SLIDER_NAV_NEXT_ID}`,
        }}
        slidesPerView={"auto"}
        grabCursor
        observer
        spaceBetween={80}
      >
        {eventsData.map(({ year, text }) => (
          <SwiperSlide key={year}>
            <div className={styles["event-slide"]}>
              <h4 className={styles["event-title"]}>{year}</h4>
              <p className={styles["event-text"]}>{text}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        id={EVENTS_SLIDER_NAV_PREV_ID}
        className={styles["nav-btn__prev"]}
      >
        <ArrowLeft />
      </button>
      <button
        id={EVENTS_SLIDER_NAV_NEXT_ID}
        className={styles["nav-btn__next"]}
      >
        <ArrowLeft />
      </button>
    </div>
  );
};

export default EventsSlider;
