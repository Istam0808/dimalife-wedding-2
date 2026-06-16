"use client";

import { useTransform } from "framer-motion";
import { useLayoutEffect, useState } from "react";
import { SCROLL_MARK_ANCHOR, VINE_PATH_D } from "@/data/vinePath";

const SAMPLE_COUNT = 100;
const END_LENGTH_STEPS = 200;
const SCROLL_MARK_ROTATE = 0;

function findEndLength(path) {
  const totalLength = path.getTotalLength();
  let maxY = -Infinity;
  let endLength = totalLength;

  for (let index = 0; index <= END_LENGTH_STEPS; index++) {
    const length = (totalLength * index) / END_LENGTH_STEPS;
    const { y } = path.getPointAtLength(length);

    if (y >= maxY) {
      maxY = y;
      endLength = length;
    }
  }

  return endLength;
}

function samplePath(d) {
  if (typeof document === "undefined") {
    return [];
  }

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  const endLength = findEndLength(path);

  return Array.from({ length: SAMPLE_COUNT + 1 }, (_, index) => {
    const point = path.getPointAtLength((endLength * index) / SAMPLE_COUNT);
    return { x: point.x, y: point.y };
  });
}

function interpolatePoint(points, progress) {
  if (!points.length) {
    return { x: 0, y: 0 };
  }

  const t = Math.max(0, Math.min(1, progress));
  const scaled = t * (points.length - 1);
  const index = Math.floor(scaled);
  const fraction = scaled - index;
  const current = points[index];
  const next = points[Math.min(index + 1, points.length - 1)];

  return {
    x: current.x + (next.x - current.x) * fraction,
    y: current.y + (next.y - current.y) * fraction,
  };
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

  const rotate = useTransform(scrollYProgress, () => SCROLL_MARK_ROTATE);

  return { x, y, rotate, ready: points.length > 0 };
}
