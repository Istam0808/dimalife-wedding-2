import styles from "./SplitTitle.module.scss";

export default function SplitTitle({
  variant = "default",
  letter = "Д",
  firstRest = "орогие",
  lines = ["родные", "и близкие!"],
  subtitle = "родные и близкие!",
  className = "",
  letterClassName = "",
  firstLineClassName = "",
  lineClassName = "",
}) {
  if (variant === "tilda") {
    return (
      <div className={`${styles.tilda} ${className}`.trim()}>
        <p className={`${styles.tildaFirst} ${firstLineClassName}`.trim()}>
          <span className={`${styles.tildaLetter} ${letterClassName}`.trim()}>{letter}</span>
          <span className={styles.tildaRest}>{firstRest}</span>
        </p>
        {lines.map((line) => (
          <p key={line} className={`${styles.tildaLine} ${lineClassName}`.trim()}>
            {line}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>
        <span className={styles.letter}>{letter}</span>
        <span className={styles.rest}>{firstRest}</span>
      </h2>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}
