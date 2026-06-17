"use client";

import { useEffect, useRef } from "react";
import { FINALE_WAVE_PATH, FINALE_WAVE_VIEWBOX } from "./finaleWavePath";
import styles from "./FinaleSection.module.scss";

const HEART_WIDTH = 60;
const HEART_HEIGHT = 51;
const HEART_Y_OFFSET = -8;
const INTERSECTION_THRESHOLD = 0.2;

export default function FinaleWaveTrack() {
  const trackRef = useRef(null);
  const motionRef = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const startAnimation = () => {
      if (startedRef.current) return;

      startedRef.current = true;
      motionRef.current?.beginElement();
    };

    const isVisibleEnough = () => {
      const rect = track.getBoundingClientRect();
      if (rect.height <= 0) return false;

      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      return visible / rect.height >= INTERSECTION_THRESHOLD;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      { threshold: INTERSECTION_THRESHOLD },
    );

    observer.observe(track);

    const checkInitialVisibility = () => {
      if (isVisibleEnough()) {
        startAnimation();
        observer.disconnect();
      }
    };

    checkInitialVisibility();
    const frame = requestAnimationFrame(checkInitialVisibility);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={trackRef} className={styles.waveTrack}>
      <svg
        viewBox={FINALE_WAVE_VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        className={styles.waveSvg}
        aria-hidden
      >
        <path id="finaleWavePath" d={FINALE_WAVE_PATH} className={styles.wavePath} />
        <g className={styles.walkingHeart}>
          <image
            href="/harmony/branch.svg"
            width={HEART_WIDTH}
            height={HEART_HEIGHT}
            x={-HEART_WIDTH / 2}
            y={-HEART_HEIGHT / 2 + HEART_Y_OFFSET}
          >
            <animateMotion
              ref={motionRef}
              begin="indefinite"
              dur="15s"
              fill="freeze"
              rotate="auto"
              calcMode="linear"
            >
              <mpath href="#finaleWavePath" />
            </animateMotion>
          </image>
        </g>
      </svg>
    </div>
  );
}
