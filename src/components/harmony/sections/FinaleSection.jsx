import Image from "next/image";
import Reveal from "../ui/Reveal";
import styles from "./FinaleSection.module.scss";

export default function FinaleSection() {
  return (
    <section className={styles.finale} aria-label="Финал">
      <div className={styles.artboard}>
        <Reveal className={styles.title}>Ждём вас, дорогие!</Reveal>

        <Reveal delay={150} variant="zoomin" className={styles.photoWrap}>
          <Image
            src="/harmony/finale-photo.jpg"
            alt="Дильмурод и Шакира"
            width={900}
            height={700}
            className={styles.photo}
          />
        </Reveal>

        <Image
          src="/harmony/finale-wave.svg"
          alt=""
          width={1200}
          height={40}
          className={styles.wave}
          aria-hidden
        />

        <Image
          src="/harmony/finale-branch.svg"
          alt=""
          width={100}
          height={120}
          className={styles.branch}
          aria-hidden
        />
      </div>
    </section>
  );
}
