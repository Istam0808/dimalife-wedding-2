import styles from "./BackgroundCover.module.scss";

export default function BackgroundCover() {
  return (
    <div className={styles.cover} aria-hidden="true">
      <div className={styles.texture} />
    </div>
  );
}
