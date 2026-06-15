import Image from "next/image";
import { invite } from "@/data/invite";
import Reveal from "../ui/Reveal";
import styles from "./VenueSection.module.scss";

export default function VenueSection() {
  return (
    <section className={styles.venue} aria-label="Место проведения">
      <div className={styles.artboard}>
        <Reveal className={styles.title}>Где всё случится</Reveal>

        <Reveal delay={100} className={styles.name}>
          {invite.venue.name}
        </Reveal>

        <Reveal delay={200} variant="zoomin" className={styles.mapWrap}>
          <Image
            src="/harmony/venue-map.svg"
            alt={`Карта — ${invite.venue.name}`}
            width={800}
            height={500}
            className={styles.map}
          />
        </Reveal>

        <Reveal delay={300} className={styles.actions}>
          <a
            href={invite.venue.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
          >
            {invite.venue.mapButton}
          </a>
        </Reveal>

        <Image
          src="/harmony/vine.svg"
          alt=""
          width={120}
          height={200}
          className={styles.vine}
          aria-hidden
        />
      </div>
    </section>
  );
}
