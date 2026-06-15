import { invite } from "@/data/invite";
import Reveal from "../ui/Reveal";
import styles from "./CalendarStrip.module.scss";

export default function CalendarStrip() {
  const { monthLabel, weekdayLabels, calendarDays, highlightDay } = invite.date;

  return (
    <section className={styles.calendar} aria-label="Календарь">
      <div className={styles.artboard}>
        <Reveal className={styles.month}>{monthLabel}</Reveal>
        <Reveal delay={80} className={styles.weekdays}>
          {weekdayLabels.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </Reveal>
        <Reveal delay={160} className={styles.days}>
          {calendarDays.map((day) => (
            <span
              key={day}
              className={day === highlightDay ? styles.highlight : undefined}
            >
              {day}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
