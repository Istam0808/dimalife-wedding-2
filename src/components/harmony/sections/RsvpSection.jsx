"use client";

import { useState } from "react";
import { invite } from "@/data/invite";
import Reveal from "../ui/Reveal";
import SplitSectionTitle from "../ui/SplitSectionTitle";
import styles from "./RsvpSection.module.scss";

export default function RsvpSection() {
  const { rsvp } = invite;
  const [drinks, setDrinks] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  function toggleDrink(drink) {
    setDrinks((prev) =>
      prev.includes(drink) ? prev.filter((item) => item !== drink) : [...prev, drink],
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className={styles.rsvp} aria-label="Анкета гостя">
      <div className={styles.frame} aria-hidden />
      <div className={styles.artboard}>
        <Reveal className={styles.title}>
          <span className={styles.titleLetter}>{rsvp.titleLetter}</span>
          <span className={styles.titleWord}>{rsvp.titleWord}</span>
          <p className={styles.titleRest}>{rsvp.titleRest}</p>
        </Reveal>

        <Reveal delay={80} className={styles.prompt}>
          <span className={styles.promptLetter}>{rsvp.promptLetter}</span>
          <span className={styles.promptRest}>{rsvp.promptRest}</span>
          <p className={styles.promptAction}>{rsvp.promptAction}</p>
        </Reveal>

        <Reveal delay={120} className={styles.intro}>
          <p>{rsvp.intro}</p>
        </Reveal>

        {submitted ? (
          <Reveal className={styles.success}>Спасибо! Мы получили ваш ответ.</Reveal>
        ) : (
          <Reveal delay={160} className={styles.formWrap}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.label} htmlFor="rsvp-name">
                Ваше имя и фамилия
              </label>
              <input
                id="rsvp-name"
                name="name"
                type="text"
                className={styles.input}
                required
              />

              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>Предпочитаемые напитки</legend>
                {rsvp.drinks.map((drink) => (
                  <label key={drink} className={styles.check}>
                    <input
                      type="checkbox"
                      checked={drinks.includes(drink)}
                      onChange={() => toggleDrink(drink)}
                    />
                    <span>{drink}</span>
                  </label>
                ))}
              </fieldset>

              <label className={styles.label} htmlFor="rsvp-allergy">
                Аллергии и особые пожелания
              </label>
              <textarea id="rsvp-allergy" name="allergy" className={styles.textarea} rows={3} />

              <button type="submit" className={styles.submit}>
                Отправить
              </button>
            </form>
          </Reveal>
        )}

        <Reveal delay={200} className={styles.organizer}>
          <p>{rsvp.organizerIntro}</p>
          <a
            href={rsvp.organizerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.organizerButton}
          >
            {rsvp.organizerButton}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
