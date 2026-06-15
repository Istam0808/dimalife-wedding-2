"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./BackgroundMusic.module.scss";

const AUDIO_SRC = "/audio/music.mp3";

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;

    const syncPlaying = () => setPlaying(!audio.paused);
    const onCanPlay = () => setReady(true);

    audio.addEventListener("play", syncPlaying);
    audio.addEventListener("pause", syncPlaying);
    audio.addEventListener("canplaythrough", onCanPlay);

    const tryPlay = () =>
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));

    tryPlay();

    const onInteraction = () => {
      if (audio.paused) tryPlay();
    };

    document.addEventListener("pointerdown", onInteraction, { once: true });

    return () => {
      audio.removeEventListener("play", syncPlaying);
      audio.removeEventListener("pause", syncPlaying);
      audio.removeEventListener("canplaythrough", onCanPlay);
      document.removeEventListener("pointerdown", onInteraction);
    };
  }, []);

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const toggleButton =
    ready && mounted ? (
      <div className={styles.dock}>
        <button
          type="button"
          className={`${styles.toggleButton} ${playing ? styles.playing : styles.paused}`}
          onClick={handleToggle}
          aria-label={playing ? "Пауза" : "Включить музыку"}
        >
          {playing ? (
            <span className={styles.equalizer} aria-hidden>
              <span className={styles.bar} />
              <span className={styles.bar} />
              <span className={styles.bar} />
              <span className={styles.bar} />
            </span>
          ) : (
            <span className={styles.playIcon} aria-hidden />
          )}
        </button>
      </div>
    ) : null;

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />
      {mounted && toggleButton ? createPortal(toggleButton, document.body) : null}
    </>
  );
}
