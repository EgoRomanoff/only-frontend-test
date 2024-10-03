import { useEffect, useRef, useState } from "react";
// import clsx from "clsx";
import { type Swiper as SwiperType } from "swiper/types";
// import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper } from "swiper/react";
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

import styles from "./styles.module.scss";

gsap.registerPlugin(MotionPathPlugin);

const HistoryBlock = ({ title, data }: { title: string; data: HistoryDate[] }) => {
  const yearsSliderRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const itemsCount = data.length;
  const YEARS_SLIDER_NAV_NEXT_ID = "years-slider-nav-next";
  const YEARS_SLIDER_NAV_PREV_ID = "years-slider-nav-prev";
  const YEARS_SLIDER_PAGINATION_EL = "years-slider-pagination"

  const bulletOffsetAngle = Math.PI / 3; // Угол смещения - 60 градусов
  const radius = 530 / 2; // Радиус круга

  useEffect(() => {
    const swiperInstance = yearsSliderRef.current;

    if (swiperInstance) {
      swiperInstance.virtual.slides = data;
      swiperInstance.update();
      swiperInstance.pagination.bullets.forEach((bullet, i) => {
        const angle = getCircleAngle(i, 0, itemsCount, bulletOffsetAngle);

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
      const startAngle = getCircleAngle(i, previousIndex, itemsCount, bulletOffsetAngle);
      const endAngle = getCircleAngle(i, realIndex, itemsCount, bulletOffsetAngle);

      let adjustedEndAngle = endAngle;

      const halfCount = Math.floor(itemsCount / 2);
      const fullCircle = 2 * Math.PI;
      const isClockwise =
        (realIndex < previousIndex && previousIndex - realIndex <= halfCount) ||
        (realIndex > previousIndex && realIndex - previousIndex > halfCount);

      if (isClockwise) {
        // По часовой стрелке
        adjustedEndAngle = endAngle < startAngle ? endAngle + fullCircle : endAngle;
      } else {
        // Против часовой стрелки
        adjustedEndAngle = endAngle >= startAngle ? endAngle - fullCircle : endAngle;
      }

      gsap.to(bullet, {
        duration: 0.8,
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

        <p className={styles['years-slide']}>
          <span className={styles.year}>{data[activeIndex].startYear}</span>
          <span className={styles.year}>{data[activeIndex].endYear}</span>
        </p>

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
      </section>
    </Container>
  );
};

export default HistoryBlock;
