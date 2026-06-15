"use client";

import { useEffect, useState } from "react";
import BackgroundCover from "./BackgroundCover";
import HeroTimelineBlock from "./sections/HeroTimelineBlock";
import VenueSection from "./sections/VenueSection";
import WishesSection from "./sections/WishesSection";
import FinaleSection from "./sections/FinaleSection";
import styles from "./HarmonyInvite.module.scss";

export default function HarmonyInvite() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <main className={`${styles.invite} ${visible ? styles.visible : ""}`}>
      <BackgroundCover />
      <HeroTimelineBlock />
      <VenueSection />
      <WishesSection />
      <FinaleSection />
    </main>
  );
}
