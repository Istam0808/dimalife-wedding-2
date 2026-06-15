"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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
    offset: ["start 0.9", "end 0.1"],
  });

  const photoScale = useTransform(photoProgress, [0, 0.45, 1], [1, 1.5, 1.35]);
  const { x: butterflyX, y: butterflyY, rotate: butterflyRotate } = useVinePathMotion(vineProgress);

  const { date, couple, hero } = invite;

  return (
    <section className={styles.block} aria-label="Приглашение и программа дня">
      <div className={styles.artboard} ref={boardRef}>
        <Reveal className={styles.heroHead}>
          <CoupleTitle />
        </Reveal>

        <div className={styles.photoZone} ref={photoRef}>
          <motion.div className={styles.photoWrap} style={{ scale: photoScale }}>
            <Image
              src="/harmony/1.jpg"
              alt={`${couple.full}`}
              width={1920}
              height={1280}
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

        <Reveal className={styles.heart}>
          <Image src="/harmony/heart.svg" alt="" width={80} height={72} aria-hidden />
        </Reveal>
      </div>
    </section>
  );
}
