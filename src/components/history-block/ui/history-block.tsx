import { useRef } from "react";
import { type Swiper as SwiperType } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import Container from "@components/ui/container";
import type { HistoryDate } from "@/types/history";

import styles from "./styles.module.scss";

gsap.registerPlugin(MotionPathPlugin);

const getAngle = (i: number, activeIndex: number, itemsCount: number) => {
  const circleIndex = (i - activeIndex + itemsCount) % itemsCount;
  const sectorAngle = (2 * Math.PI) / itemsCount;
  const bulletOffsetAngle = Math.PI / 3; // Угол смещения - 60 градусов

  return circleIndex * sectorAngle - bulletOffsetAngle;
};

const getXCoord = (radius: number, angle: number) => radius * Math.cos(angle);
const getYCoord = (radius: number, angle: number) => radius * Math.sin(angle);

const getCirclePosition = (i: number, activeIndex: number, itemsCount: number, radius: number) => {
  const angle = getAngle(i, activeIndex, itemsCount);
  const x = getXCoord(radius, angle);
  const y = getYCoord(radius, angle);

  return { x, y };
};

// Генерация пути по окружности для анимации
const generateArcPath = (startAngle: number, endAngle: number, radius: number) => {
  const moveTo = `M ${getXCoord(radius, startAngle)} ${getYCoord(radius, startAngle)}`;
  const arc = `A ${radius} ${radius}`;
  const rotation = 0;
  const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
  const sweepFlag = endAngle > startAngle ? 1 : 0;
  const end = `${getXCoord(radius, endAngle)} ${getYCoord(radius, endAngle)}`;

  return `${moveTo} ${arc} ${rotation} ${largeArcFlag} ${sweepFlag} ${end}`;
};

const HistoryBlock = ({ title, data }: { title: string; data: HistoryDate[] }) => {
  const yearsSliderRef = useRef<SwiperType>();
  const itemsCount = data.length;

  const radius = 530 / 2; // Радиус круга

  const handlePaginationStyling = ({ pagination }: SwiperType) => {
    const { bullets } = pagination;

    if (bullets) {
      bullets.forEach((bullet, i) => {
        const coords = getCirclePosition(i, 0, itemsCount, radius);

        gsap.set(bullet, coords);
      });
    }
  };

  const handleRealIndexChange = ({ pagination, realIndex, previousIndex }: SwiperType) => {
    console.log(`previous ${previousIndex} - real ${realIndex}`)
    const { bullets } = pagination;

    bullets.forEach((bullet, i) => {
      const startAngle = getAngle(i, previousIndex, itemsCount);
      const endAngle = getAngle(i, realIndex, itemsCount);

      let adjustedEndAngle = endAngle;

      // Определение направления движения
      const isMovingBackward =
        // (realIndex < previousIndex && !(previousIndex === itemsCount - 1 && realIndex === 0)) ||
        // (realIndex < previousIndex && !(previousIndex === itemsCount - 1)) ||
        (realIndex < previousIndex && !(previousIndex === itemsCount - 1 || previousIndex < itemsCount - 1)) ||
        (realIndex === itemsCount - 1 && previousIndex === 0);

      if (isMovingBackward) {
        // Против часовой стрелки
        adjustedEndAngle = endAngle < startAngle ? endAngle + 2 * Math.PI : endAngle;
      } else {
        // По часовой стрелке
        adjustedEndAngle = endAngle >= startAngle ? endAngle - 2 * Math.PI : endAngle;
      }

      gsap.to(bullet, {
        duration: 0.8,
        // @ts-ignore
        motionPath: {
          path: generateArcPath(startAngle, adjustedEndAngle, radius),
          align: "self",
          alignOrigin: [0.5, 0.5],
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
            clickable: true,
          }}
          onAfterInit={handlePaginationStyling}
          onRealIndexChange={handleRealIndexChange}
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
