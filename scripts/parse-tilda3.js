const fs = require("fs");
const html = fs.readFileSync("«Гармония».html", "utf8");

const REC = "rec1648305021";
const styleStart = html.indexOf(`#${REC} .t396__artboard`);
const styleEnd = html.indexOf("</style>", styleStart);
const css = html.slice(styleStart, styleEnd);

const ruleRe = new RegExp(
  `#${REC} \\.tn-elem\\[data-elem-id="(\\d+)"\\]\\{([^}]+)\\}`,
  "g",
);

const rules = [];
let m;
while ((m = ruleRe.exec(css)) !== null) {
  const id = m[1];
  const body = m[2];
  const inMedia = css.lastIndexOf("@media", m.index) > css.lastIndexOf("}", m.index - 500);
  const top = body.match(/top:([\d.]+)px/)?.[1];
  const leftM = body.match(/left:calc\(50% - (\d+)px \+ (-?\d+)px\)/);
  const width = body.match(/width:([\d.]+)px/)?.[1];
  rules.push({
    id,
    top: top ? +top : null,
    half: leftM ? +leftM[1] : null,
    left: leftM ? +leftM[2] : null,
    width: width ? +width : null,
    media: inMedia ? "mobile" : "desktop",
  });
}

// merge by id
const byId = {};
for (const r of rules) {
  byId[r.id] = byId[r.id] || { id: r.id };
  const key = r.media === "mobile" ? "m" : "d";
  byId[r.id][key] = r;
}

const textRe = /data-elem-id="(\d+)"[\s\S]{0,2000}?<div[^>]*class="tn-atom"[^>]*>([\s\S]*?)<\/div>/g;
const texts = {};
while ((m = textRe.exec(html)) !== null) {
  const t = m[2].replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (t && t.length < 120) texts[m[1]] = t;
}

const keywords =
  /^(15:00|16:00|17:00|23:00|ФУРШЕТ|ЦЕРЕМОНИЯ|БАНКЕТ|ЗАВЕРШЕНИЕ|приглашение|мы женимся|16\/05|26\/06|МАЙ|ИЮНЬ|ПН|Встречаемся|Самый|Танцы|Будем благодарны|Дильмурод|Даниил)/;

const rows = Object.values(byId)
  .filter((x) => texts[x.id] && keywords.test(texts[x.id]))
  .sort((a, b) => (a.m?.top || a.d?.top || 0) - (b.m?.top || b.d?.top || 0));

for (const r of rows) {
  console.log(
    `${String(r.m?.top ?? r.d?.top).padStart(5)} | L${String(r.m?.left ?? r.d?.left).padStart(4)} / D${String(r.d?.left).padStart(4)} | ${texts[r.id]}`,
  );
}

// Group events
console.log("\n=== EVENT GROUPS (mobile) ===");
const events = [
  { time: "15:00", title: "ФУРШЕТ" },
  { time: "16:00", title: "ЦЕРЕМОНИЯ" },
  { time: "17:00", title: "БАНКЕТ" },
  { time: "23:00", title: "ЗАВЕРШЕНИЕ ВЕЧЕРА" },
];
for (const ev of events) {
  const timeId = Object.entries(texts).find(([, t]) => t === ev.time)?.[0];
  const titleId = Object.entries(texts).find(([, t]) => t === ev.title)?.[0];
  const descId = Object.entries(texts).find(
    ([id, t]) =>
      t.length > 20 &&
      byId[id]?.m?.top > (byId[timeId]?.m?.top || 0) &&
      byId[id]?.m?.top < (byId[timeId]?.m?.top || 0) + 120,
  );
  console.log(ev.time, {
    time: byId[timeId]?.m,
    title: byId[titleId]?.m,
    timeD: byId[timeId]?.d,
    titleD: byId[titleId]?.d,
  });
}

// Other key layout elems
console.log("\n=== LAYOUT ELEMS ===");
for (const [id, t] of Object.entries(texts)) {
  if (!byId[id]?.m?.top) continue;
  if (/vine|calendar|heart|butterfly/i.test(t)) continue;
  if (byId[id].m.top >= 1100 && byId[id].m.top <= 2000) {
    if (
      ["15:00", "16:00", "17:00", "23:00", "ФУРШЕТ", "ЦЕРЕМОНИЯ", "БАНКЕТ", "ЗАВЕРШЕНИЕ ВЕЧЕРА"].includes(t) ||
      t.length > 30
    ) {
      /* already */
    }
  }
}

// vine, calendar, scroll butterfly from non-text elems - grep field values in HTML
const fieldRe = /data-elem-id="(\d+)"[^>]*data-field-topvalue="(\d+)"[^>]*data-field-leftvalue="(\d+)"[^>]*data-field-widthvalue="(\d+)"/g;
const fields = [];
while ((m = fieldRe.exec(html)) !== null) {
  fields.push({ id: m[1], top: +m[2], left: +m[3], width: +m[4] });
}
console.log("\nField attrs count:", fields.length);
