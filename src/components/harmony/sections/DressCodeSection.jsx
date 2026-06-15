import { invite } from "@/data/invite";
import Reveal from "../ui/Reveal";
import styles from "./DressCodeSection.module.scss";

export default function DressCodeSection() {
  return (
    <section className={styles.dressCode} aria-label="Дресс-код">
      <div className={styles.artboard}>
        <Reveal className={styles.title}>Дресс-код</Reveal>

        <Reveal delay={100} className={styles.text}>
          {invite.dressCode.text}
        </Reveal>

        <Reveal delay={200} variant="zoomin" className={styles.palette}>
          {invite.dressCode.colors.map((color) => (
            <span
              key={color}
              className={styles.swatch}
              style={{ backgroundColor: color }}
              aria-label={`Цвет ${color}`}
            />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
