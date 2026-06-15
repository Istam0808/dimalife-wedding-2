"use client";

import { useEffect, useState } from "react";
import BackgroundCover from "./BackgroundCover";
import HeroSection from "./sections/HeroSection";
import TimelineSection from "./sections/TimelineSection";
import CalendarStrip from "./sections/CalendarStrip";
import VenueSection from "./sections/VenueSection";
import DressCodeSection from "./sections/DressCodeSection";
import WishesSection from "./sections/WishesSection";
import RsvpSection from "./sections/RsvpSection";
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
      <HeroSection />
      <TimelineSection />
      <CalendarStrip />
      <VenueSection />
      <DressCodeSection />
      <WishesSection />
      <RsvpSection />
      <FinaleSection />
    </main>
  );
}
