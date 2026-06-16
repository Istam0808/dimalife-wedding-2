"use client";

import { useInView } from "@/hooks/useInView";
import styles from "./Reveal.module.scss";

export default function Reveal({
  children,
  variant = "fadein",
  delay = 0,
  duration,
  className = "",
  as: Tag = "div",
}) {
  const { ref, inView } = useInView({ threshold: 0.12 });

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${styles[variant]} ${inView ? styles.visible : ""} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        ...(duration != null ? { transitionDuration: `${duration}ms` } : {}),
      }}
    >
      {children}
    </Tag>
  );
}
