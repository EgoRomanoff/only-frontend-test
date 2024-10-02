import { useRef } from "react";
import clsx from "clsx";
import { type Swiper as SwiperType } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import Container from "@components/ui/container";
import type { HistoryDate } from "@/types/history";
import { getCircleAngle } from "@/utils/getCircleAngle";
import { generateArcPath } from "@/utils/generateArcPath";
import { getXCoord } from "@/utils/getXCoord";
import { getYCoord } from "@/utils/getYCoord";

import styles from "./styles.module.scss";

gsap.registerPlugin(MotionPathPlugin);

const HistoryBlock = ({ title, data }: { title: string; data: HistoryDate[] }) => {
  const yearsSliderRef = useRef<SwiperType>();
  const itemsCount = data.length;

  const bulletOffsetAngle = Math.PI / 3; // Угол смещения - 60 градусов
  const radius = 530 / 2; // Радиус круга

  const handlePaginationStyling = ({ pagination }: SwiperType) => {
    const { bullets } = pagination;

    if (bullets) {
      bullets.forEach((bullet, i) => {
        const angle = getCircleAngle(i, 0, itemsCount, bulletOffsetAngle);

        gsap.set(bullet, {
          x: getXCoord(radius, angle),
          y: getYCoord(radius, angle),
        });
      });
    }
  };

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
  };

  return (
    <Container fullHeight>
      <section className={styles.block}>
        <h2 className={styles.title}>{title}</h2>

        <Swiper
          className={styles["years-slider"]}
          style={
            {
              "--items-count": data.length,
              "--radius": radius,
            } as React.CSSProperties
          }
          modules={[Navigation, Pagination]}
          onSwiper={swiper => {
            yearsSliderRef.current = swiper;
          }}
          pagination={{
            bulletClass: styles["pagination-bullet"],
            bulletActiveClass: styles["pagination-bullet-active"],
            renderBullet(i, className) {
              return `<div class="${className}"><span>${data[i].title}</span></div>`;
            },
            clickable: true,
          }}
          onAfterInit={handlePaginationStyling}
          onRealIndexChange={handleRealIndexChange}
          speed={800}
          preventInteractionOnTransition={true}
          allowTouchMove={false}
          mousewheel={false}
        >
          {data.map(({ startYear, endYear }) => (
            <SwiperSlide key={`${startYear}-${endYear}`}>
              <div className={styles["years-slide"]}>
                <span className={clsx(styles.year, styles["start-year"])}>{startYear}</span>
                <span className={clsx(styles.year, styles["end-year"])}>{endYear}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </Container>
  );
};

export default HistoryBlock;
