import { useEffect, useRef, useState } from "react";
import { type Swiper as SwiperType } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Virtual } from "swiper/modules";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import Container from "@components/ui/container";
import type { HistoryDate } from "@/types/history";
import { getCircleAngle } from "@/utils/getCircleAngle";
import { generateArcPath } from "@/utils/generateArcPath";
import { getXCoord } from "@/utils/getXCoord";
import { getYCoord } from "@/utils/getYCoord";
import ArrowLeft from "@components/ui/svg/arrow-left";
import YearsBanner from "@components/years-banner";
import { ANIMATION_DURATION } from "@components/constants";

import styles from "./styles.module.scss";

gsap.registerPlugin(MotionPathPlugin);

const YEARS_SLIDER_NAV_NEXT_ID = "years-slider-nav-next";
const YEARS_SLIDER_NAV_PREV_ID = "years-slider-nav-prev";
const YEARS_SLIDER_PAGINATION_EL = "years-slider-pagination";

const EVENTS_SLIDER_NAV_NEXT_ID = "events-slider-nav-next";
const EVENTS_SLIDER_NAV_PREV_ID = "events-slider-nav-prev";

const BULLET_OFFSET_ANGLE = Math.PI / 3;

const HistoryBlock = ({ title, data }: { title: string; data: HistoryDate[] }) => {
  const yearsSliderRef = useRef<SwiperType | null>(null);
  const eventsSliderRef = useRef<SwiperType | null>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const itemsCount = data.length;

  const radius = 530 / 2; // Радиус круга

  // set array of data as virtual slides and styling pagination bullets
  useEffect(() => {
    const swiperInstance = yearsSliderRef.current;

    if (swiperInstance) {
      swiperInstance.virtual.slides = data;
      swiperInstance.update();
      swiperInstance.pagination.bullets.forEach((bullet, i) => {
        const angle = getCircleAngle(i, 0, itemsCount, BULLET_OFFSET_ANGLE);

        gsap.set(bullet, {
          x: getXCoord(radius, angle),
          y: getYCoord(radius, angle),
        });
      });
    }
  }, [data]);

  const handleRealIndexChange = ({ pagination, realIndex, previousIndex }: SwiperType) => {
    const { bullets } = pagination;

    bullets.forEach((bullet, i) => {
      const halfCount = Math.floor(itemsCount / 2);
      const fullCircle = 2 * Math.PI;
      const startAngle = getCircleAngle(i, previousIndex, itemsCount, BULLET_OFFSET_ANGLE);
      const endAngle = getCircleAngle(i, realIndex, itemsCount, BULLET_OFFSET_ANGLE);

      // check pagination bullets animation direction
      const isClockwise =
        (realIndex < previousIndex && previousIndex - realIndex <= halfCount) ||
        (realIndex > previousIndex && realIndex - previousIndex > halfCount);

      let adjustedEndAngle = null;
      // change end angle for pagination bullets
      if (isClockwise) {
        adjustedEndAngle = endAngle < startAngle ? endAngle + fullCircle : endAngle;
      } else {
        adjustedEndAngle = endAngle >= startAngle ? endAngle - fullCircle : endAngle;
      }

      gsap.to(bullet, {
        duration: ANIMATION_DURATION,
        motionPath: {
          path: generateArcPath(startAngle, adjustedEndAngle, radius),
          autoRotate: false,
        },
        ease: "power1.inOut",
      });
    });

    setActiveIndex(realIndex);
  };

  return (
    <Container fullHeight>
      <section className={styles.block}>
        <h2 className={styles.title}>{title}</h2>

        <Swiper
          modules={[Navigation, Pagination, Virtual]}
          onSwiper={swiper => {
            yearsSliderRef.current = swiper;
          }}
          className={styles["years-slider"]}
          navigation={{
            disabledClass: styles["nav__btn--disabled"],
            nextEl: `#${YEARS_SLIDER_NAV_NEXT_ID}`,
            prevEl: `#${YEARS_SLIDER_NAV_PREV_ID}`,
          }}
          pagination={{
            el: `#${YEARS_SLIDER_PAGINATION_EL}`,
            bulletClass: styles["pagination-bullet"],
            bulletActiveClass: styles["pagination-bullet-active"],
            type: "bullets",
            clickable: true,
            renderBullet(i, className) {
              return `<li class="${className}"><span>${data[i].title}</span></li>`;
            },
          }}
          onRealIndexChange={handleRealIndexChange}
          speed={600}
          preventInteractionOnTransition={true}
          allowTouchMove={false}
          mousewheel={false}
          slidesPerView={1}
          virtual
        />

        <YearsBanner
          startYear={data[activeIndex].startYear}
          endYear={data[activeIndex].endYear}
        />

        <ul
          id="years-slider-pagination"
          className={styles["years-slider__pagination"]}
        />

        <div className={styles["years-slides__controls"]}>
          <span className={styles["controls__progress"]}>
            {String(activeIndex + 1).padStart(2, "0")}/{String(itemsCount).padStart(2, "0")}
          </span>

          <div className={styles["controls__nav"]}>
            <button
              id={YEARS_SLIDER_NAV_PREV_ID}
              className={styles["nav__btn-prev"]}
            >
              <ArrowLeft />
            </button>
            <button
              id={YEARS_SLIDER_NAV_NEXT_ID}
              className={styles["nav__btn-next"]}
            >
              <ArrowLeft />
            </button>
          </div>
        </div>

        <div className={styles['events-slider']}>
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
            {data[activeIndex].events.map(({ year, text }) => (
              <SwiperSlide key={`${activeIndex}-${year}`}>
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
      </section>
    </Container>
  );
};

export default HistoryBlock;
