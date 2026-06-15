import styles from "./SplitTitle.module.scss";

export default function SplitTitle({ letter = "Д", rest = "орогие", subtitle }) {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>
        <span className={styles.letter}>{letter}</span>
        <span className={styles.rest}>{rest}</span>
      </h2>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
    </div>
  );
}
