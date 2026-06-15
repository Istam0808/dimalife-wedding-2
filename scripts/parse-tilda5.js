const fs = require("fs");
const html = fs.readFileSync("«Гармония».html", "utf8");

const recStart = html.indexOf('id="rec1648305021"');
const recEnd = html.indexOf('id="rec1648305031"', recStart);
const chunk = html.slice(recStart, recEnd > 0 ? recEnd : recStart + 500000);

const elemRe =
  /data-elem-id="(\d+)"([^>]*data-field-top-value="(-?\d+)"[^>]*data-field-left-value="(-?\d+)"[^>]*data-field-width-value="(\d+)"[^>]*)/g;

const elems = [];
let m;
while ((m = elemRe.exec(chunk)) !== null) {
  elems.push({
    id: m[1],
    top: +m[3],
    left: +m[4],
    width: +m[5],
    type: m[2].match(/data-elem-type="([^"]+)"/)?.[1],
  });
}

const textRe = /data-elem-id="(\d+)"[\s\S]{0,2000}?<div[^>]*class="tn-atom"[^>]*>([\s\S]*?)<\/div>/g;
const texts = {};
while ((m = textRe.exec(chunk)) !== null) {
  const t = m[2].replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (t) texts[m[1]] = t.slice(0, 100);
}

// mobile res attrs
const mobRe =
  /data-elem-id="(\d+)"[^>]*data-field-top-value-res-320="(\d+)"[^>]*data-field-left-value-res-320="(-?\d+)"[^>]*data-field-width-value-res-320="(\d+)"/g;
const mobile = {};
while ((m = mobRe.exec(chunk)) !== null) {
  mobile[m[1]] = { top: +m[2], left: +m[3], width: +m[4] };
}

elems.sort((a, b) => (mobile[a.id]?.top || a.top) - (mobile[b.id]?.top || b.top));

console.log("=== ELEMENTS WITH FIELD VALUES ===\n");
for (const e of elems) {
  const mob = mobile[e.id];
  const text = texts[e.id] || "";
  if (e.top < 50 && !mob) continue;
  if (e.top > 2600 && !mob) continue;
  console.log(
    JSON.stringify({
      type: e.type,
      text: text.slice(0, 60),
      desktop: { top: e.top, left: e.left, width: e.width },
      mobile: mob,
    }),
  );
}
