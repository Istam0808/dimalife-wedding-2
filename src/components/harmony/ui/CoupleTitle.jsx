import styles from "./CoupleTitle.module.scss";

export default function CoupleTitle() {
  return (
    <h1 className={styles.title} aria-label="Дильмурод и Шакира">
      <span className={styles.group}>
        <span className={styles.letter}>Д</span>
        <span className={styles.rest}>ильмурод</span>
      </span>
      <span className={styles.amp}>&</span>
      <span className={styles.group}>
        <span className={styles.letter}>Ш</span>
        <span className={styles.rest}>акира</span>
      </span>
    </h1>
  );
}
