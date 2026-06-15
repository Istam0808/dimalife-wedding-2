const fs = require("fs");
const html = fs.readFileSync("«Гармония».html", "utf8");

const REC = "rec1648305021";
const styleStart = html.indexOf(`#${REC} .t396__artboard`);
const styleEnd = html.indexOf("</style>", styleStart);
const css = html.slice(styleStart, styleEnd);

const mediaIdx = css.indexOf("@media screen and (max-width:1199px)");
const desktopCss = css.slice(0, mediaIdx);
const mobileCss = css.slice(mediaIdx);

function parseChunk(chunk, label) {
  const ruleRe = new RegExp(
    `#${REC} \\.tn-elem\\[data-elem-id="(\\d+)"\\]\\{([^}]+)\\}`,
    "g",
  );
  const out = {};
  let m;
  while ((m = ruleRe.exec(chunk)) !== null) {
    const body = m[2];
    const top = body.match(/top:([\d.]+)px/)?.[1];
    const leftM = body.match(/left:calc\(50% - (\d+)px \+ (-?\d+)px\)/);
    const width = body.match(/width:([\d.]+)px/)?.[1];
    out[m[1]] = {
      top: top ? +top : null,
      half: leftM ? +leftM[1] : null,
      left: leftM ? +leftM[2] : null,
      width: width ? +width : null,
    };
  }
  return out;
}

const d = parseChunk(desktopCss, "desktop");
const m = parseChunk(mobileCss, "mobile");

const textRe = /data-elem-id="(\d+)"[\s\S]{0,2000}?<div[^>]*class="tn-atom"[^>]*>([\s\S]*?)<\/div>/g;
const texts = {};
let match;
while ((match = textRe.exec(html)) !== null) {
  const t = match[2].replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (t && t.length < 150) texts[match[1]] = t;
}

const timeline = [
  ["15:00", "ФУРШЕТ", "Встречаемся и ожидаем начала свадебной церемонии"],
  ["16:00", "ЦЕРЕМОНИЯ", "Самый трепетный момент этого дня"],
  ["17:00", "БАНКЕТ", "Танцы, веселье и чудесная атмосфера!"],
  ["23:00", "ЗАВЕРШЕНИЕ ВЕЧЕРА", "Будем благодарны вам за счастливые моменты этого дня"],
];

console.log("=== TIMELINE MOBILE (320px artboard) ===");
for (const [time, title, desc] of timeline) {
  const tid = Object.entries(texts).find(([, t]) => t === time)?.[0];
  const yid = Object.entries(texts).find(([, t]) => t === title)?.[0];
  const did = Object.entries(texts).find(([, t]) => t === desc)?.[0];
  console.log(`\n${time} ${title}`);
  console.log("  time:", m[tid]);
  console.log("  title:", m[yid]);
  console.log("  desc:", m[did]);
  console.log("  event box: top", m[tid]?.top, "left", m[tid]?.left, "align", m[tid]?.left < 100 ? "left" : "right");
}

console.log("\n=== TIMELINE DESKTOP (1200px artboard) ===");
for (const [time, title, desc] of timeline) {
  const tid = Object.entries(texts).find(([, t]) => t === time)?.[0];
  const yid = Object.entries(texts).find(([, t]) => t === title)?.[0];
  const did = Object.entries(texts).find(([, t]) => t === desc)?.[0];
  console.log(`\n${time} ${title}`);
  console.log("  time:", d[tid]);
  console.log("  title:", d[yid]);
  console.log("  desc:", d[did]);
}

// Hero + calendar + images
const heroKeys = [
  "приглашение на свадьбу",
  "мы женимся!",
  "16/05/26",
  "МАЙ 2026",
  "С любовью",
  "Этот день откроет",
];
console.log("\n=== HERO (mobile) ===");
for (const [id, t] of Object.entries(texts)) {
  if (heroKeys.some((k) => t.includes(k))) {
    console.log(t.slice(0, 50), m[id] || d[id]);
  }
}

// Non-text elements - search data-field in HTML elements
const elemRe = /data-elem-id="(\d+)"([^>]*fields="[^"]*")[^>]*>/g;
let count = 0;
while ((match = elemRe.exec(html)) !== null && count < 5) {
  console.log(match[1], match[2].slice(0, 100));
  count++;
}

// Extract image/shape positions from CSS for vine, calendar, heart, butterfly
console.log("\n=== IMAGE ELEMS FROM CSS (search top 1100-2000) ===");
const imgIds = Object.entries({ ...d, ...m })
  .filter(([, v]) => v.top >= 1100 && v.top <= 2000)
  .sort((a, b) => a[1].top - b[1].top);

const seen = new Set();
for (const [id, pos] of imgIds) {
  if (seen.has(id)) continue;
  seen.add(id);
  const label = texts[id] || `img-${id.slice(-4)}`;
  if (!texts[id] || texts[id].length < 20)
    console.log(pos.top, pos.left, pos.width, label.slice(0, 40), "D:", d[id]?.left, "M:", m[id]?.left);
}
