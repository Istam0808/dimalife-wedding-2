"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./BackgroundMusic.module.scss";

const AUDIO_SRC = "/audio/music2.mp3";

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const userPausedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;

    const syncPlaying = () => setPlaying(!audio.paused);

    const tryPlay = () => {
      if (userPausedRef.current) return Promise.resolve();

      return audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    };

    const onInteraction = () => {
      if (userPausedRef.current || !audio.paused) return;
      tryPlay();
    };

    syncPlaying();
    tryPlay();

    audio.addEventListener("play", syncPlaying);
    audio.addEventListener("pause", syncPlaying);
    audio.addEventListener("playing", syncPlaying);

    document.addEventListener("pointerdown", onInteraction);
    document.addEventListener("keydown", onInteraction);

    return () => {
      audio.removeEventListener("play", syncPlaying);
      audio.removeEventListener("pause", syncPlaying);
      audio.removeEventListener("playing", syncPlaying);
      document.removeEventListener("pointerdown", onInteraction);
      document.removeEventListener("keydown", onInteraction);
    };
  }, []);

  const handleToggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      userPausedRef.current = false;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      userPausedRef.current = true;
      audio.pause();
      setPlaying(false);
    }
  };

  const toggleButton = (
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
  );

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />
      {mounted ? createPortal(toggleButton, document.body) : null}
    </>
  );
}
