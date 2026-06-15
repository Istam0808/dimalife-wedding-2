"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { invite } from "@/data/invite";
import Reveal from "../ui/Reveal";
import styles from "./TimelineSection.module.scss";

export default function TimelineSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const butterflyX = useTransform(scrollYProgress, [0, 1], [-20, 80]);
  const butterflyY = useTransform(scrollYProgress, [0, 0.5, 1], [40, -20, 60]);
  const butterflyRotate = useTransform(scrollYProgress, [0, 1], [0, 15]);

  return (
    <section className={styles.timeline} ref={sectionRef} aria-label="Программа дня">
      <div className={styles.artboard}>
        <Reveal className={styles.titleImg}>
          <Image
            src="/harmony/timeline-title.svg"
            alt="Программа дня"
            width={400}
            height={80}
          />
        </Reveal>

        <motion.div
          className={styles.butterfly}
          style={{ x: butterflyX, y: butterflyY, rotate: butterflyRotate }}
          aria-hidden
        >
          <Image src="/harmony/butterfly.svg" alt="" width={48} height={48} />
        </motion.div>

        <ul className={styles.events}>
          {invite.timeline.map((event, index) => (
            <Reveal key={event.time} delay={index * 80} as="li" className={styles.event}>
              <span className={styles.time}>{event.time}</span>
              <div className={styles.content}>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventText}>{event.description}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal className={styles.heart}>
          <Image src="/harmony/heart.svg" alt="" width={120} height={120} aria-hidden />
        </Reveal>
      </div>
    </section>
  );
}
