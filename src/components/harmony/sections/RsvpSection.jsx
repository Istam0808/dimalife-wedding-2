"use client";

import { useState } from "react";
import { invite } from "@/data/invite";
import Reveal from "../ui/Reveal";
import styles from "./RsvpSection.module.scss";

const initialForm = {
  attendance: "",
  name: "",
  drinks: [],
  allergy: "",
};

export default function RsvpSection() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const next = {};

    if (!form.attendance) {
      next.attendance = "Пожалуйста, укажите, сможете ли вы присутствовать";
    }

    if (!form.name.trim()) {
      next.name = "Введите имя и фамилию";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const toggleDrink = (drink) => {
    setForm((prev) => ({
      ...prev,
      drinks: prev.drinks.includes(drink)
        ? prev.drinks.filter((item) => item !== drink)
        : [...prev.drinks, drink],
    }));
  };

  return (
    <section className={styles.rsvp} aria-label="Анкета гостя">
      <div className={styles.artboard}>
        <Reveal className={styles.header}>
          <h2 className={styles.title}>С заботой о вас</h2>
          <p className={styles.subtitle}>
            Пожалуйста, заполните анкету до {invite.rsvp.deadline}
          </p>
        </Reveal>

        <Reveal delay={100} variant="zoomin">
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Сможете ли вы присутствовать?</legend>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="attendance"
                  value="yes"
                  checked={form.attendance === "yes"}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, attendance: e.target.value }))
                  }
                />
                <span>Буду с радостью!</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="attendance"
                  value="no"
                  checked={form.attendance === "no"}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, attendance: e.target.value }))
                  }
                />
                <span>К сожалению, не смогу</span>
              </label>
              {errors.attendance ? (
                <p className={styles.error} role="alert">
                  {errors.attendance}
                </p>
              ) : null}
            </fieldset>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="rsvp-name">
                Имя и фамилия
              </label>
              <input
                id="rsvp-name"
                type="text"
                className={styles.input}
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                autoComplete="name"
              />
              {errors.name ? (
                <p className={styles.error} role="alert">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Предпочтения по напиткам</legend>
              <div className={styles.checkboxes}>
                {invite.rsvp.drinks.map((drink) => (
                  <label key={drink} className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={form.drinks.includes(drink)}
                      onChange={() => toggleDrink(drink)}
                    />
                    <span>{drink}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="rsvp-allergy">
                Аллергия или особые пожелания
              </label>
              <input
                id="rsvp-allergy"
                type="text"
                className={styles.input}
                value={form.allergy}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, allergy: e.target.value }))
                }
              />
            </div>

            <button type="submit" className={styles.submit}>
              Отправить
            </button>

            {submitted ? (
              <p className={styles.success} role="status">
                Спасибо! Ваш ответ сохранён локально. Отправка на сервер будет
                добавлена позже.
              </p>
            ) : null}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
