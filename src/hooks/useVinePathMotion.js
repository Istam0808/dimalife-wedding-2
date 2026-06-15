"use client";

import { useTransform } from "framer-motion";
import { useLayoutEffect, useState } from "react";
import { SCROLL_MARK_ANCHOR, VINE_PATH_D } from "@/data/vinePath";

const SAMPLE_COUNT = 100;

function samplePath(d) {
  if (typeof document === "undefined") {
    return [];
  }

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  const length = path.getTotalLength();

  return Array.from({ length: SAMPLE_COUNT + 1 }, (_, index) => {
    const point = path.getPointAtLength((length * index) / SAMPLE_COUNT);
    return { x: point.x, y: point.y };
  });
}

function interpolatePoint(points, progress) {
  if (!points.length) {
    return { x: 0, y: 0, rotate: 0 };
  }

  const t = Math.max(0, Math.min(1, progress));
  const scaled = t * (points.length - 1);
  const index = Math.floor(scaled);
  const fraction = scaled - index;
  const current = points[index];
  const next = points[Math.min(index + 1, points.length - 1)];

  const x = current.x + (next.x - current.x) * fraction;
  const y = current.y + (next.y - current.y) * fraction;
  const rotate = (Math.atan2(next.y - current.y, next.x - current.x) * 180) / Math.PI;

  return { x, y, rotate };
}

export function useVinePathMotion(scrollYProgress) {
  const [points, setPoints] = useState([]);

  useLayoutEffect(() => {
    setPoints(samplePath(VINE_PATH_D));
  }, []);

  const x = useTransform(scrollYProgress, (progress) => {
    const point = interpolatePoint(points, progress);
    return point.x - SCROLL_MARK_ANCHOR.x;
  });

  const y = useTransform(scrollYProgress, (progress) => {
    const point = interpolatePoint(points, progress);
    return point.y - SCROLL_MARK_ANCHOR.y;
  });

  const rotate = useTransform(scrollYProgress, (progress) => {
    return interpolatePoint(points, progress).rotate;
  });

  return { x, y, rotate, ready: points.length > 0 };
}
