const fs = require("fs");
const html = fs.readFileSync("«Гармония».html", "utf8");

const REC = "rec1648305021";
const styleStart = html.indexOf(`#${REC} .t396__artboard`);
const styleEnd = html.indexOf("</style>", styleStart);
const css = html.slice(styleStart, styleEnd);
const mobileCss = css.slice(css.indexOf("@media screen and (max-width:1199px)"));

function parseChunk(chunk) {
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
      left: leftM ? +leftM[2] : null,
      width: width ? +width : null,
    };
  }
  return out;
}

const m = parseChunk(mobileCss);

const recStart = html.indexOf('id="rec1648305021"');
const recEnd = html.indexOf('id="rec1648305031"', recStart);
const chunk = html.slice(recStart, recEnd);

const fieldRe =
  /data-elem-id="(\d+)"[^>]*data-field-top-value="(-?\d+)"[^>]*data-field-left-value="(-?\d+)"[^>]*data-field-width-value="(\d+)"/g;
const desktop = {};
while ((m2 = fieldRe.exec(chunk)) !== null) {
  desktop[m2[1]] = { top: +m2[2], left: +m2[3], width: +m2[4] };
}

const textRe = /data-elem-id="(\d+)"[\s\S]{0,2000}?<div[^>]*class="tn-atom"[^>]*>([\s\S]*?)<\/div>/g;
const texts = {};
let match;
while ((match = textRe.exec(chunk)) !== null) {
  const t = match[2].replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (t) texts[match[1]] = t.slice(0, 80);
}

const PAD = 40; // our artboard horizontal padding on 400px frame

const layout = {
  mobilePad: PAD,
  artboard: { mobile: { width: 400, height: 2035, pad: 40 }, desktop: { width: 1200, height: 2690 } },
  hero: {},
  timeline: [],
  decor: {},
};

const heroMap = {
  "приглашение на свадьбу": "inviteLabel",
  "мы женимся!": "weddingLabel",
  "16/05/26": "dateValue",
  "орогие": "greetingRest",
  "Д": "greetingLetter",
  "родные и близкие!": "greetingSub",
  "Этот день откроет": "intro",
  "С любовью": "signature",
};

for (const [id, text] of Object.entries(texts)) {
  for (const [key, name] of Object.entries(heroMap)) {
    if (text.includes(key) && m[id]) {
      layout.hero[name] = {
        mobile: { top: m[id].top, left: m[id].left + PAD, width: m[id].width },
        desktop: desktop[id],
      };
    }
  }
}

const events = [
  ["15:00", "ФУРШЕТ", "left"],
  ["16:00", "ЦЕРЕМОНИЯ", "right"],
  ["17:00", "БАНКЕТ", "left"],
  ["23:00", "ЗАВЕРШЕНИЕ ВЕЧЕРА", "center"],
];

for (const [time, title, align] of events) {
  const tid = Object.entries(texts).find(([, t]) => t === time)?.[0];
  const yid = Object.entries(texts).find(([, t]) => t === title)?.[0];
  layout.timeline.push({
    time,
    title,
    align,
    mobile: {
      top: m[tid]?.top,
      left: (m[tid]?.left ?? 0) + PAD,
      width: m[tid]?.width || 134,
    },
    desktop: {
      top: desktop[tid]?.top,
      left: desktop[tid]?.left,
      width: desktop[tid]?.width || 134,
    },
  });
}

// decor by type from field + mobile css
const typeRe = /data-elem-id="(\d+)"[^>]*data-elem-type="(image|vector|shape)"[^>]*data-field-top-value="(-?\d+)"[^>]*data-field-left-value="(-?\d+)"/g;
while ((match = typeRe.exec(chunk)) !== null) {
  const id = match[1];
  const type = match[2];
  const mob = m[id];
  if (!mob) continue;
  const key = `${type}-${mob.top}`;
  if (mob.top >= 1100 && mob.top <= 2000) {
    if (type === "vector" && mob.top === 1201) layout.decor.vine = { mobile: { ...mob, left: mob.left + PAD }, desktop: desktop[id] };
    if (type === "image" && mob.top === 1170) layout.decor.scrollMark = { mobile: { ...mob, left: mob.left + PAD }, desktop: desktop[id] };
    if (type === "image" && mob.top === 1107) layout.decor.programTitle = { mobile: { ...mob, left: mob.left + PAD }, desktop: desktop[id] };
    if (type === "image" && mob.top === 1960) layout.decor.heart = { mobile: { ...mob, left: mob.left + PAD }, desktop: desktop[id] };
  }
}

console.log(JSON.stringify(layout, null, 2));

// calendar + heart scan
const rows = Object.entries(m).map(([id, v]) => ({ id, ...v, text: texts[id] }));
rows.sort((a, b) => a.top - b.top);
console.log("\n=== 700-1300 ===");
for (const r of rows.filter((r) => r.top >= 700 && r.top <= 1300)) {
  console.log(r.top, r.left, r.width, r.text || r.id.slice(-4));
}
console.log("\n=== 1900+ ===");
for (const r of rows.filter((r) => r.top >= 1900)) {
  console.log(r.top, r.left, r.width, r.text || "img");
}

