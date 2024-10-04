import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { type Swiper as SwiperType } from "swiper/types";
import { Navigation } from "swiper/modules";
import { gsap } from "gsap";

import ArrowLeft from "@components/ui/svg/arrow-left";
import type { HistoryUnit } from "@/types/history";

import styles from "./styles.module.scss";
import { ANIMATION_DURATION } from "@components/constants";

const EVENTS_SLIDER_NAV_NEXT_ID = "events-slider-nav-next";
const EVENTS_SLIDER_NAV_PREV_ID = "events-slider-nav-prev";
const FADE_OUT_VARS = { opacity: 0, y: 5 };
const FADE_IN_VARS = { opacity: 1, y: 0 };
const FADE_DURATION = { duration: 0.3 };

const EventsSlider = ({ eventsData }: { eventsData: HistoryUnit[] }) => {
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const eventsSliderRef = useRef<SwiperType | null>(null);
  const [currentEvents, setCurrentEvents] = useState<HistoryUnit[]>(() => eventsData);

  const updateEvents = (swiper: SwiperType) => {
    swiper.slideTo(0, 0); // slide to first slide without duration
    setCurrentEvents(eventsData);
  };

  useEffect(() => {
    const sliderContainer = sliderContainerRef.current;

    if (sliderContainer) {
      gsap.fromTo(sliderContainer, FADE_OUT_VARS, { ...FADE_IN_VARS, ...FADE_DURATION });
    }
  }, []);

  useEffect(() => {
    const sliderContainer = sliderContainerRef.current;
    const eventsSwiper = eventsSliderRef.current;

    if (sliderContainer && eventsSwiper) {
      const timeline = gsap.timeline();

      timeline.to(sliderContainer, {
        ...FADE_OUT_VARS,
        ...FADE_DURATION,
        // update events ONLY when slider is invisible
        onComplete: () => updateEvents(eventsSwiper),
      }); // slider fade out
      timeline.add(() => {}, `+=${ANIMATION_DURATION - FADE_DURATION.duration}`); // pause
      timeline.to(sliderContainer, { ...FADE_IN_VARS, ...FADE_DURATION }); // slider fade in

      tl.current = timeline;

      return () => {
        timeline.kill();
      };
    }

    return;
  }, [eventsData]);

  return (
    <div
      ref={sliderContainerRef}
      className={styles["events-slider"]}
    >
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
        {currentEvents.map(({ year, text }) => (
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
