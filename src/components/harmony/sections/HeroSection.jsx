"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { invite } from "@/data/invite";
import Reveal from "../ui/Reveal";
import SplitTitle from "../ui/SplitTitle";
import styles from "./HeroSection.module.scss";

export default function HeroSection() {
  const photoRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.12, 1.05]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section className={styles.hero} aria-label="Приветствие">
      <div className={styles.artboard}>
        <Reveal className={styles.logoWrap}>
          <Image
            src="/harmony/logo.svg"
            alt="Дильмурод и Шакира"
            width={280}
            height={120}
            className={styles.logo}
            priority
          />
        </Reveal>

        <Reveal delay={100} className={styles.date}>
          {invite.date.display}
        </Reveal>

        <Reveal delay={200} className={styles.names}>
          {invite.couple.full}
        </Reveal>

        <Reveal delay={300}>
          <SplitTitle subtitle="родные и близкие!" />
        </Reveal>

        <Reveal delay={400} className={styles.intro}>
          <p>
            С радостью приглашаем вас разделить с нами один из самых важных дней
            в нашей жизни!
          </p>
        </Reveal>

        <div className={styles.photoBlock} ref={photoRef}>
          <motion.div className={styles.photoInner} style={{ scale, y }}>
            <Image
              src="/harmony/hero-photo.jpg"
              alt="Дильмурод и Шакира"
              width={900}
              height={1100}
              className={styles.photo}
              priority
            />
          </motion.div>
          <Image
            src="/harmony/opening.png"
            alt=""
            width={200}
            height={200}
            className={styles.opening}
            aria-hidden
          />
        </div>

        <Reveal className={styles.divider}>
          <Image src="/harmony/divider.svg" alt="" width={320} height={24} aria-hidden />
        </Reveal>
      </div>
    </section>
  );
}
