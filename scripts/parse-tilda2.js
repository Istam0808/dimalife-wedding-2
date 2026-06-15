const fs = require("fs");
const html = fs.readFileSync("«Гармония».html", "utf8");

function extractRules(recordId) {
  const marker = `#${recordId} .tn-elem[data-elem-id="`;
  const parts = html.split(marker).slice(1);
  const rules = {};
  for (const part of parts) {
    const idEnd = part.indexOf('"]');
    const id = part.slice(0, idEnd);
    const cssEnd = part.indexOf("}");
    const css = part.slice(idEnd + 3, cssEnd);
    if (!rules[id]) rules[id] = [];
    rules[id].push(css);
  }
  return rules;
}

function parseRule(css) {
  const top = css.match(/top:([\d.]+)px/)?.[1];
  const leftRaw = css.match(/left:([^;]+);/)?.[1];
  let left = null;
  if (leftRaw) {
    const m = leftRaw.match(/calc\(50%\s*-\s*(\d+)px\s*\+\s*(-?\d+)px\)/);
    if (m) left = +m[2];
    else left = leftRaw;
  }
  const width = css.match(/width:([\d.]+)px/)?.[1];
  return { top: top ? +top : null, left, width: width ? +width : null, leftRaw };
}

const rules = extractRules("rec1648305021");

// texts
const textRe = /data-elem-id="(\d+)"[\s\S]{0,2500}?<div[^>]*class="tn-atom"[^>]*>([\s\S]*?)<\/div>/g;
const texts = {};
let m;
while ((m = textRe.exec(html)) !== null) {
  const t = m[2].replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (t) texts[m[1]] = t;
}

// For each id with multiple rules, first is desktop, rules inside @media are mobile
// Actually all rules are sequential - need to detect media query position
const mediaIdx = html.indexOf("@media screen and (max-width:1199px)");
const beforeMedia = html.slice(0, mediaIdx);
const afterMedia = html.slice(mediaIdx);

const desktopRules = extractRulesFromChunk(beforeMedia, "rec1648305021");
const mobileRules = extractRulesFromChunk(afterMedia, "rec1648305021");

function extractRulesFromChunk(chunk, recordId) {
  const marker = `#${recordId} .tn-elem[data-elem-id="`;
  const parts = chunk.split(marker).slice(1);
  const rules = {};
  for (const part of parts) {
    const idEnd = part.indexOf('"]');
    const id = part.slice(0, idEnd);
    const cssEnd = part.indexOf("}");
    const css = part.slice(idEnd + 3, cssEnd);
    rules[id] = parseRule(css);
  }
  return rules;
}

const ids = Object.keys(texts).filter((id) => desktopRules[id] || mobileRules[id]);

const rows = ids.map((id) => ({
  id,
  text: texts[id].slice(0, 80),
  d: desktopRules[id],
  m: mobileRules[id] || desktopRules[id],
}));

rows.sort((a, b) => (a.m?.top || 0) - (b.m?.top || 0));

for (const r of rows) {
  if (!r.m?.top && !r.d?.top) continue;
  console.log(
    JSON.stringify({
      text: r.text,
      mobile: r.m,
      desktop: r.d,
    }),
  );
}
