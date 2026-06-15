"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import { invite } from "@/data/invite";
import { butterflyPathMobile, timelineLayout } from "@/data/timelineLayout";
import CoupleTitle from "../ui/CoupleTitle";
import ProgramTitle from "../ui/ProgramTitle";
import Reveal from "../ui/Reveal";
import ScrollDateMark from "../ui/ScrollDateMark";
import SplitTitle from "../ui/SplitTitle";
import styles from "./HeroTimelineBlock.module.scss";

function useButterflyMotion(scrollYProgress) {
  const steps = butterflyPathMobile.length - 1;
  const inputs = useMemo(
    () => Array.from({ length: steps + 1 }, (_, i) => i / steps),
    [steps],
  );
  const xs = useMemo(() => butterflyPathMobile.map((p) => p.x), []);
  const ys = useMemo(() => butterflyPathMobile.map((p) => p.y), []);

  const x = useTransform(scrollYProgress, inputs, xs);
  const y = useTransform(scrollYProgress, inputs, ys);

  return { x, y };
}

export default function HeroTimelineBlock() {
  const boardRef = useRef(null);
  const photoRef = useRef(null);

  const { scrollYProgress: boardProgress } = useScroll({
    target: boardRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: photoProgress } = useScroll({
    target: photoRef,
    offset: ["start center", "end start"],
  });

  const photoScale = useTransform(photoProgress, [0, 0.45, 1], [1, 1.5, 1.35]);
  const { x: butterflyX, y: butterflyY } = useButterflyMotion(boardProgress);

  const { date, couple, hero, timeline } = invite;

  return (
    <section className={styles.block} aria-label="Приглашение и программа дня">
      <div className={styles.frame} aria-hidden />
      <div className={styles.artboard} ref={boardRef}>
        <Reveal className={styles.inviteLabel}>{hero.inviteLabel}</Reveal>

        <Reveal className={styles.coupleTitle}>
          <CoupleTitle />
        </Reveal>

        <div className={styles.photoZone} ref={photoRef}>
          <motion.div className={styles.photoWrap} style={{ scale: photoScale }}>
            <Image
              src="/harmony/hero-photo.jpg"
              alt={`${couple.full}`}
              width={1044}
              height={752}
              className={styles.photo}
              priority
            />
          </motion.div>
        </div>

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
          <p>{hero.greetingIntro}</p>
        </Reveal>

        <Reveal className={styles.signature}>{couple.signature}</Reveal>

        <Reveal className={styles.programTitle}>
          <ProgramTitle />
        </Reveal>

        <div className={styles.calendar}>
          <Reveal className={styles.calendarMonth}>{date.monthLabel}</Reveal>
          <Reveal delay={80} className={styles.calendarWeekdays}>
            {date.weekdayLabels.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </Reveal>
          <Reveal delay={160} className={styles.calendarDays}>
            {date.calendarDays.map((day) => (
              <span
                key={day}
                className={day === date.highlightDay ? styles.calendarHighlight : undefined}
              >
                {day}
              </span>
            ))}
          </Reveal>
        </div>

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
          style={{ x: butterflyX, y: butterflyY }}
          aria-hidden
        >
          <ScrollDateMark value={date.highlightDay} />
        </motion.div>

        {timeline.map((event, index) => {
          const layout = timelineLayout[index];
          return (
            <Reveal
              key={event.time}
              variant="zoomin"
              delay={index * 60}
              className={`${styles.event} ${styles[`event_${layout.align}`]}`}
              data-index={index}
            >
              <span className={styles.eventTime}>{event.time}</span>
              <span className={styles.eventTitle}>{event.title}</span>
              <p className={styles.eventDesc}>{event.description}</p>
            </Reveal>
          );
        })}

        <Reveal className={styles.heart}>
          <Image src="/harmony/heart.svg" alt="" width={80} height={72} aria-hidden />
        </Reveal>
      </div>
    </section>
  );
}
