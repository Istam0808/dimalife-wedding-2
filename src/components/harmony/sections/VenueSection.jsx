import Image from "next/image";
import { invite } from "@/data/invite";
import Reveal from "../ui/Reveal";
import SplitTitle from "../ui/SplitTitle";
import styles from "./VenueSection.module.scss";

export default function VenueSection() {
  return (
    <section className={styles.venue} aria-label="Место проведения">
      <div className={styles.artboard}>
        <div className={styles.title}>
          <SplitTitle
            variant="tilda"
            letter="Г"
            firstRest="де всё"
            lines={["случится"]}
            letterClassName={styles.venueLetter}
            firstLineClassName={styles.venueFirstLine}
          />
        </div>

        <Reveal delay={100} variant="zoomin" className={styles.mapWrap}>
          <Image
            src="/harmony/restaurant.png"
            alt={invite.venue.name}
            width={1719}
            height={915}
            className={styles.map}
          />
        </Reveal>

        <div className={styles.details}>
          {invite.venue.detailsIntro.map((line) => (
            <p key={line} className={styles.detailsLine}>
              {line}
            </p>
          ))}
        </div>

        <div className={styles.detailsAddress}>
          {invite.venue.addressLines.map((line) => (
            <p key={line} className={styles.detailsLine}>
              {line}
            </p>
          ))}
        </div>

        <div className={styles.actions}>
          <a
            href={invite.venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
          >
            {invite.venue.mapButton}
          </a>
        </div>
      </div>
    </section>
  );
}
