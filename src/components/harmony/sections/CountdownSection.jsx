"use client";

import { useEffect, useState } from "react";
import { invite } from "@/data/invite";
import Reveal from "../ui/Reveal";
import styles from "./CountdownSection.module.scss";

const { countdown } = invite;
const TARGET = new Date(countdown.target);

function pluralize(value, [one, few, many]) {
  const mod10 = value % 10;
  const mod100 = value % 100;

  if (mod100 >= 11 && mod100 <= 14) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}

function getTimeLeft() {
  const diff = TARGET.getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    ended: false,
  };
}

function formatValue(value) {
  return String(value).padStart(2, "0");
}

const UNITS = [
  {
    key: "days",
    labels: ["день", "дня", "дней"],
    format: (value) => String(value),
  },
  {
    key: "hours",
    labels: ["час", "часа", "часов"],
    format: formatValue,
  },
  {
    key: "minutes",
    labels: ["минута", "минуты", "минут"],
    format: formatValue,
  },
  {
    key: "seconds",
    labels: ["секунда", "секунды", "секунд"],
    format: formatValue,
  },
];

const PLACEHOLDER = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  ended: false,
};

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft());
    tick();

    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const display = timeLeft ?? PLACEHOLDER;
  const isReady = timeLeft !== null;

  return (
    <section className={styles.countdown} aria-label="Обратный отсчёт до свадьбы">
      <div className={styles.artboard}>
        <Reveal className={styles.inner}>
          <div className={styles.ornament} aria-hidden>
            <span className={styles.ornamentLine} />
            <span className={styles.ornamentDot} />
            <span className={styles.ornamentLine} />
          </div>

          {display.ended ? (
            <div className={styles.endedWrap}>
              <p className={styles.ended}>Сегодня наш день!</p>
              <p className={styles.endedSub}>{countdown.dateLine}</p>
            </div>
          ) : (
            <>
              <header className={styles.header}>
                <p className={styles.eyebrow}>{countdown.eyebrow}</p>
                <h2 className={styles.title}>{countdown.title}</h2>
                <p className={styles.dateLine}>{countdown.dateLine}</p>
              </header>

              <div className={styles.timerFrame} role="timer" aria-live="polite">
                <div className={styles.grid}>
                  {UNITS.map(({ key, labels, format }, index) => {
                    const value = display[key];

                    return (
                      <div key={key} className={styles.unit}>
                        <span
                          className={`${styles.value} ${key === "seconds" && isReady ? styles.valuePulse : ""}`}
                          suppressHydrationWarning
                        >
                          {format(value)}
                        </span>
                        <span className={styles.label} suppressHydrationWarning>
                          {pluralize(value, labels)}
                        </span>
                        {index < UNITS.length - 1 ? (
                          <span className={styles.separator} aria-hidden>
                            :
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}
