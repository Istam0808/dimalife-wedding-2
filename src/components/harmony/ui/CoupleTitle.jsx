import { invite } from "@/data/invite";
import styles from "./CoupleTitle.module.scss";

export default function CoupleTitle() {
  const { couple, hero } = invite;

  return (
    <header className={styles.head} aria-label={couple.full}>
      <p className={styles.eyebrow}>{hero.inviteLabel}</p>

      <div className={styles.initialsBlock} aria-hidden="true">
        <span className={styles.initial}>{couple.name1[0]}</span>
        <span className={styles.initialAmp}>&</span>
        <span className={styles.initial}>{couple.name2[0]}</span>
      </div>

      <div className={styles.namesRow}>
        <span className={styles.nameLabel}>{couple.name1}</span>
        <span className={styles.nameAmp}>&</span>
        <span className={styles.nameLabel}>{couple.name2}</span>
      </div>
    </header>
  );
}
