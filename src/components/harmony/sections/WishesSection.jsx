import Image from "next/image";
import { invite } from "@/data/invite";
import Reveal from "../ui/Reveal";
import styles from "./WishesSection.module.scss";

export default function WishesSection() {
  const { gifts, flowers } = invite.wishes;

  return (
    <section className={styles.wishes} aria-label="Пожелания">
      <div className={styles.artboard}>
        <Image
          src="/harmony/wishes-deco.svg"
          alt=""
          width={80}
          height={80}
          className={styles.deco}
          aria-hidden
        />

        <div className={styles.cards}>
          <Reveal className={styles.card}>
            <h3 className={styles.cardTitle}>{gifts.title}</h3>
            <p className={styles.cardText}>{gifts.text}</p>
          </Reveal>

          <Reveal delay={120} className={styles.card}>
            <h3 className={styles.cardTitle}>{flowers.title}</h3>
            <p className={styles.cardText}>{flowers.text}</p>
          </Reveal>
        </div>

        <Image
          src="/harmony/branch.svg"
          alt=""
          width={140}
          height={200}
          className={styles.branch}
          aria-hidden
        />
      </div>
    </section>
  );
}
