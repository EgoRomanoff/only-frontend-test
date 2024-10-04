import { useEffect, useRef, useState } from "react";
import { type Swiper as SwiperType } from "swiper/types";
import { Swiper } from "swiper/react";
import { Navigation, Pagination, Virtual } from "swiper/modules";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import Container from "@components/ui/container";
import type { HistoryDate } from "@/types/history";
import { getCircleAngle } from "@/utils/getCircleAngle";
import { generateArcPath } from "@/utils/generateArcPath";
import YearsBanner from "@components/years-banner";
import EventsSlider from "@components/events-slider";
import { ANIMATION_DURATION } from "@components/constants";
import { distributeInCircle } from "@/utils/distributeInCircle";
import { getNavButtonID } from "@/utils/getNavButtonID";

import { RADIUS_MAP } from "../constants";
import YearsSliderControls from "./years-slider-controls";
import { distributeInLine } from "@/utils/distributeInLine";
import { getPaginationID } from "../utils/getPaginationID";
import styles from "./styles.module.scss";

gsap.registerPlugin(MotionPathPlugin);

const BULLET_OFFSET_ANGLE = Math.PI / 3;

const getCircleRadius = () => {
  const width = window.innerWidth;

  for (const [minWidth, radius] of RADIUS_MAP) {
    if (width >= minWidth) {
      return radius;
    }
  }

  return 0;
};

const HistoryBlock = ({ title, data }: { title: string; data: HistoryDate[] }) => {
  const yearsSliderRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [radius, setRadius] = useState<number>(0);

  const itemsCount = data.length;
  const NAV_NEXT_ID = getNavButtonID("years", "next");
  const NAV_PREV_ID = getNavButtonID("years", "prev");
  const PAGINATION_ID = getPaginationID();

  const handleResize = () => setRadius(getCircleRadius());

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // set array of data as virtual slides
  useEffect(() => {
    const yearsSwiper = yearsSliderRef.current;

    if (yearsSwiper) {
      yearsSwiper.virtual.slides = data;
      yearsSwiper.update();
    }
  }, [data]);

  useEffect(() => {
    const bullets = yearsSliderRef.current?.pagination.bullets;

    if (bullets) {
      if (radius) {
        distributeInCircle(bullets, radius, BULLET_OFFSET_ANGLE, activeIndex);
      } else {
        distributeInLine(bullets);
      }
    }
  }, [yearsSliderRef.current, radius]);

  const handleRealIndexChange = ({ pagination, realIndex, previousIndex }: SwiperType) => {
    if (radius) {
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
    }

    setActiveIndex(realIndex);
  };

  return (
    <Container fullHeight>
      <section className={styles.block}>
        <div className={styles.inner}>
          <h2 className={styles.title}>{title}</h2>

          <YearsBanner
            startYear={data[activeIndex].startYear}
            endYear={data[activeIndex].endYear}
          />

          <Swiper
            modules={[Navigation, Pagination, Virtual]}
            onSwiper={swiper => {
              yearsSliderRef.current = swiper;
            }}
            className={styles["years-slider"]}
            navigation={{
              disabledClass: styles["nav__btn--disabled"],
              nextEl: `#${NAV_NEXT_ID}`,
              prevEl: `#${NAV_PREV_ID}`,
            }}
            pagination={{
              el: `#${PAGINATION_ID}`,
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

          <YearsSliderControls
            activeIndex={activeIndex}
            itemsCount={itemsCount}
            radius={radius}
            navPrevID={NAV_PREV_ID}
            navNextID={NAV_NEXT_ID}
            paginationID={PAGINATION_ID}
          />

          <EventsSlider data={data[activeIndex]} />
        </div>
      </section>
    </Container>
  );
};

export default HistoryBlock;
