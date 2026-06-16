"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, Fragment, useState, useLayoutEffect } from "react";
import { invite } from "@/data/invite";
import { useVinePathMotion } from "@/hooks/useVinePathMotion";
import CoupleTitle from "../ui/CoupleTitle";
import Reveal from "../ui/Reveal";
import ScrollDateMark from "../ui/ScrollDateMark";
import SplitTitle from "../ui/SplitTitle";
import styles from "./HeroTimelineBlock.module.scss";

export default function HeroTimelineBlock() {
  const boardRef = useRef(null);
  const photoRef = useRef(null);
  const vineTrackRef = useRef(null);

  const { scrollYProgress: photoProgress } = useScroll({
    target: photoRef,
    offset: ["start center", "end start"],
  });

  const { scrollYProgress: vineProgress } = useScroll({
    target: vineTrackRef,
    offset: ["start 0.9", "end 0.15"],
  });

  const [baseWidth, setBaseWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  useLayoutEffect(() => {
    const updateViewport = () => {
      setViewportWidth(document.documentElement.clientWidth);
    };

    updateViewport();

    if (photoRef.current) {
      setBaseWidth(photoRef.current.offsetWidth);
    }

    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const photoWidth = useTransform(photoProgress, (progress) => {
    const peak = 0.5;
    const minW = baseWidth || 262;
    const maxW = viewportWidth || minW;

    if (progress <= 0) return minW;
    if (progress >= peak) return maxW;

    return minW + (maxW - minW) * (progress / peak);
  });

  const { x: butterflyX, y: butterflyY, rotate: butterflyRotate } = useVinePathMotion(vineProgress);

  const { date, couple, hero, timeline } = invite;

  return (
    <section className={styles.block} aria-label="Приглашение и программа дня">
      <motion.div className={styles.photoZone} ref={photoRef} style={{ width: photoWidth }}>
        <Image
          src="/harmony/1.jpg"
          alt={`${couple.full}`}
          width={1920}
          height={1280}
          className={styles.photo}
          priority
        />
      </motion.div>

      <div className={styles.artboard} ref={boardRef}>
        <Reveal className={styles.heroHead}>
          <CoupleTitle />
        </Reveal>

        <Reveal className={styles.weddingLabel}>{hero.weddingLabel}</Reveal>

        <Reveal className={styles.dateLine} aria-hidden />
        <Reveal className={styles.dateValue}>{date.display}</Reveal>

        <Reveal className={styles.dateUnderline} delay={80}>
          <Image
            src="/harmony/date-underline.svg"
            alt=""
            width={399}
            height={47}
            aria-hidden
          />
        </Reveal>

        <Reveal className={styles.greeting}>
          <SplitTitle variant="tilda" />
        </Reveal>

        <Reveal className={styles.intro}>
          <p>
            {hero.greetingIntro.map((line, index) => {
              if (line === null) {
                return (
                  <Fragment key={index}>
                    <br />
                    <br />
                  </Fragment>
                );
              }

              return (
                <Fragment key={index}>
                  {index > 0 && hero.greetingIntro[index - 1] !== null && <br />}
                  {line}
                </Fragment>
              );
            })}
          </p>
        </Reveal>

        <Reveal className={styles.signature}>{couple.signature}</Reveal>

        <div className={styles.calendar}>
          <Reveal className={styles.calendarMonth}>{date.monthLabel}</Reveal>
          <Reveal delay={80} className={styles.calendarWeekdays}>
            {date.weekdayLabels.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </Reveal>
          <Reveal delay={160} className={styles.calendarDays}>
            {date.calendarDays.map((day) => (
              <span key={day} aria-hidden={day === date.highlightDay || undefined}>
                {day === date.highlightDay ? "" : day}
              </span>
            ))}
          </Reveal>
        </div>

        <div className={styles.vineTrack} ref={vineTrackRef}>
          <Image
            src="/harmony/timeline-vine.svg"
            alt=""
            width={195}
            height={684}
            className={styles.vine}
            aria-hidden
          />

          <motion.div
            className={styles.scrollButterfly}
            style={{ x: butterflyX, y: butterflyY, rotate: butterflyRotate }}
            aria-hidden
          >
            <ScrollDateMark value={date.highlightDay} />
          </motion.div>
        </div>

        <ul className={styles.timelineEvents}>
          {timeline.map((event, index) => (
            <Reveal
              key={event.time}
              as="li"
              variant="soft"
              duration={3800}
              delay={index * 280}
              className={`${styles.timelineEvent} ${styles[event.side]}`}
            >
              <span className={styles.eventTime}>{event.time}</span>
              <h3 className={styles.eventTitle}>{event.title}</h3>
              <p className={styles.eventText}>{event.description}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal className={styles.heart}>
          <Image src="/harmony/heart.svg" alt="" width={80} height={72} aria-hidden />
        </Reveal>
      </div>
    </section>
  );
}
