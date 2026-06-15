"use client";

import Image from "next/image";
import { invite } from "@/data/invite";
import Reveal from "../ui/Reveal";
import SplitSectionTitle from "../ui/SplitSectionTitle";
import styles from "./HarmonyMidBlock.module.scss";

export default function HarmonyMidBlock() {
  const { venue, dressCode, wishes } = invite;

  return (
    <section className={styles.block} aria-label="Место, дресс-код и пожелания">
      <div className={styles.frame} aria-hidden />
      <div className={styles.artboard}>
        <Reveal className={styles.venueTitle}>
          <SplitSectionTitle
            letter={venue.titleLetter}
            rest={venue.titleRest}
            subLine={venue.titleEnd}
          />
        </Reveal>

        <Reveal delay={80} className={styles.venueText}>
          <p>{venue.text}</p>
        </Reveal>

        <Reveal delay={120} variant="zoomin" className={styles.mapWrap}>
          <Image
            src="/harmony/venue-map.svg"
            alt="Карта места проведения"
            width={800}
            height={500}
            className={styles.map}
          />
        </Reveal>

        <Reveal delay={160} className={styles.mapAction}>
          <a
            href={venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
          >
            {venue.mapButton}
          </a>
        </Reveal>

        <Reveal className={styles.dressTitle}>
          <SplitSectionTitle letter={dressCode.titleLetter} rest={dressCode.titleRest} />
        </Reveal>

        <Reveal delay={80} className={styles.dressText}>
          <p>{dressCode.text}</p>
        </Reveal>

        <Reveal delay={120} className={styles.colorRow}>
          {dressCode.colors.map((color) => (
            <span key={color} className={styles.color} style={{ backgroundColor: color }} />
          ))}
        </Reveal>

        <Reveal className={styles.wishesTitle}>
          <SplitSectionTitle letter={wishes.titleLetter} rest={wishes.titleRest} />
        </Reveal>

        <Reveal delay={80} className={styles.wishCardLeft}>
          <h3 className={styles.cardTitle}>{wishes.gifts.title}</h3>
          <p className={styles.cardText}>{wishes.gifts.text}</p>
        </Reveal>

        <Reveal delay={120} className={styles.wishCardRight}>
          <h3 className={styles.cardTitle}>{wishes.flowers.title}</h3>
          <p className={styles.cardText}>{wishes.flowers.text}</p>
        </Reveal>
      </div>
    </section>
  );
}
