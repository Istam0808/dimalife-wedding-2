import Image from "next/image";
import { invite } from "@/data/invite";
import styles from "./CoupleTitle.module.scss";

export default function CoupleTitle() {
  const { couple, hero } = invite;

  return (
    <header className={styles.head} aria-label={couple.full}>
      <p className={styles.eyebrow}>{hero.inviteLabel}</p>

      <Image
        src="/harmony/дш.png"
        alt=""
        width={2400}
        height={911}
        className={styles.initialsImage}
        aria-hidden
        priority
      />
    </header>
  );
}
