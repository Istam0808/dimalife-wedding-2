import styles from "./ProgramTitle.module.scss";

export default function ProgramTitle() {
  return (
    <div className={styles.wrap} aria-label="Программа дня">
      <p className={styles.scriptLine}>
        <span className={styles.letter}>П</span>
        <span className={styles.script}>рограмма</span>
      </p>
      <p className={styles.dayLine}>
        <span className={styles.letter}>д</span>
        <span className={styles.script}>ня</span>
      </p>
      <div className={styles.boxes} aria-hidden>
        {["и", "ю", "н", "ь"].map((letter) => (
          <span key={letter} className={styles.box}>
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
}
