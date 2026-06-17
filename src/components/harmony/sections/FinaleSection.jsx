import Image from "next/image";
import Reveal from "../ui/Reveal";
import SplitTitle from "../ui/SplitTitle";
import FinaleWaveTrack from "./FinaleWaveTrack";
import styles from "./FinaleSection.module.scss";

export default function FinaleSection() {
  return (
    <section className={styles.finale} aria-label="Финал">
      <div className={styles.artboard}>
        <Reveal className={styles.title}>
          <SplitTitle
            variant="tilda"
            letter="Ж"
            firstRest="дём вас,"
            lines={["дорогие!"]}
            className={styles.finaleTitle}
            firstLineClassName={styles.finaleFirstLine}
            lineClassName={styles.finaleSubLine}
          />
        </Reveal>

        <Reveal delay={150} variant="zoomin" className={styles.photoWrap}>
          <Image
            src="/harmony/2.jpg"
            alt="Дильмурод и Шакира"
            width={1200}
            height={1600}
            className={styles.photo}
          />
        </Reveal>

        <FinaleWaveTrack />

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
