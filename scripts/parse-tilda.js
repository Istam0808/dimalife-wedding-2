const fs = require("fs");
const html = fs.readFileSync("«Гармония».html", "utf8");

function parseLeft(expr) {
  if (!expr) return null;
  const m = expr.match(/calc\(50%\s*-\s*(\d+)px\s*\+\s*(-?\d+)px\)/);
  if (m) {
    const half = +m[1];
    const offset = +m[2];
    return { half, offset, px: half + offset }; // from left of centered artboard: 50% - half + offset
  }
  if (expr.includes("calc(50%")) return expr;
  return +expr.replace("px", "") || expr;
}

function parseTop(expr) {
  if (!expr) return null;
  return +expr.replace("px", "") || expr;
}

// All tn-atom texts with elem ids
const blocks = [...html.matchAll(/data-elem-id="(\d+)"[\s\S]{0,3000}?<div[^>]*class="tn-atom"[^>]*>([\s\S]*?)<\/div>/g)];
const texts = {};
for (const m of blocks) {
  const text = m[2].replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (text) texts[m[1]] = text;
}

function getStyles(chunk, id) {
  const re = new RegExp(
    `#rec1648305021 \\.tn-elem\\[data-elem-id="${id}"\\]\\{([^}]+)\\}`,
    "g",
  );
  const styles = [];
  let m;
  while ((m = re.exec(chunk)) !== null) styles.push(m[1]);
  return styles;
}

const desktopChunk = html.split("@media screen and (max-width:1199px)")[0];
const mobileChunk = html.split("@media screen and (max-width:1199px)")[1] || "";

const allIds = [...new Set([...html.matchAll(/data-elem-id="(\d+)"/g)].map((m) => m[1]))];

const items = [];
for (const id of allIds) {
  const text = texts[id];
  if (!text) continue;

  const dStyles = getStyles(desktopChunk, id);
  const mStyles = getStyles(mobileChunk, id);

  function pick(styles) {
    const s = styles[0];
    if (!s) return null;
    return {
      top: parseTop(s.match(/top:([^;]+);/)?.[1]),
      left: parseLeft(s.match(/left:([^;]+);/)?.[1]),
      width: s.match(/width:([^;]+);/)?.[1],
    };
  }

  items.push({
    id,
    text: text.slice(0, 100),
    desktop: pick(dStyles),
    mobile: pick(mStyles),
  });
}

items.sort((a, b) => (a.mobile?.top || a.desktop?.top || 0) - (b.mobile?.top || b.desktop?.top || 0));

console.log("=== ALL TEXT ELEMENTS rec1648305021 ===\n");
for (const item of items) {
  const d = item.desktop;
  const m = item.mobile;
  const dLeft = typeof d?.left === "object" ? d.left.px : d?.left;
  const mLeft = typeof m?.left === "object" ? m.left.px : m?.left;
  console.log(
    [
      `top D:${d?.top} M:${m?.top}`,
      `left D:${dLeft} M:${mLeft}`,
      `w:${m?.width || d?.width}`,
      `"${item.text.replace(/\n/g, " | ")}"`,
    ].join(" | "),
  );
}

// Also parse other records
const recIds = [...new Set([...html.matchAll(/id="(rec\d+)"/g)].map((m) => m[1]))];
console.log("\n=== RECORDS ===", recIds.join(", "));
