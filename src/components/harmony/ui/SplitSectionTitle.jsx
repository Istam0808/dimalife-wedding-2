import styles from "./SplitSectionTitle.module.scss";

export default function SplitSectionTitle({
  letter,
  rest,
  subLine,
  align = "left",
  className = "",
}) {
  return (
    <div className={`${styles.wrap} ${styles[align]} ${className}`}>
      <div className={styles.row}>
        <span className={styles.letter}>{letter}</span>
        <span className={styles.rest}>{rest}</span>
      </div>
      {subLine ? <p className={styles.sub}>{subLine}</p> : null}
    </div>
  );
}
