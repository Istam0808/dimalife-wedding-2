import styles from "./SplitTitle.module.scss";

export default function SplitTitle({ variant = "default" }) {
  if (variant === "tilda") {
    return (
      <div className={styles.tilda}>
        <div className={styles.tildaRow}>
          <span className={styles.tildaLetter}>Д</span>
          <span className={styles.tildaRest}>орогие</span>
        </div>
        <p className={styles.tildaLine}>родные</p>
        <p className={styles.tildaLine}>и близкие!</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>
        <span className={styles.letter}>Д</span>
        <span className={styles.rest}>орогие</span>
      </h2>
      <p className={styles.subtitle}>родные и близкие!</p>
    </div>
  );
}
