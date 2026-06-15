const fs = require("fs");
const html = fs.readFileSync("«Гармония».html", "utf8");

const recIds = [...html.matchAll(/id="(rec\d+)"/g)].map((m) => m[1]);
const uniqueRecs = [...new Set(recIds)];
console.log("RECORDS:", uniqueRecs);

for (const rec of uniqueRecs) {
  const idx = html.indexOf(`id="${rec}"`);
  const chunk = html.slice(idx, idx + 8000);
  const type = chunk.match(/data-record-type="(\d+)"/)?.[1];
  const height = chunk.match(/height:(\d+)px/)?.[1];
  console.log(`\n${rec} type=${type} height=${height}`);
}

// All unique text from main artboard
const recStart = html.indexOf('id="rec1648305021"');
const recEnd = html.indexOf('id="rec1648305031"', recStart);
const main = html.slice(recStart, recEnd > 0 ? recEnd : recStart + 800000);

const textRe = /class="tn-atom"[^>]*>([\s\S]*?)<\/div>/g;
const texts = new Set();
let m;
while ((m = textRe.exec(main)) !== null) {
  const t = m[1].replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (t && t.length > 2 && t.length < 200) texts.add(t);
}

console.log("\n=== MAIN ARTBOARD TEXTS ===");
[...texts].sort().forEach((t) => console.log("-", t.slice(0, 100)));

// Other records texts
for (const rec of uniqueRecs.filter((r) => r !== "rec1648305021")) {
  const idx = html.indexOf(`id="${rec}"`);
  const end = html.indexOf(`id="rec`, idx + 10);
  const chunk = html.slice(idx, end > idx ? end : idx + 50000);
  const recTexts = new Set();
  const tr = /class="tn-atom"[^>]*>([\s\S]*?)<\/div>/g;
  while ((m = tr.exec(chunk)) !== null) {
    const t = m[1].replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (t && t.length > 3 && t.length < 150) recTexts.add(t);
  }
  if (recTexts.size) {
    console.log(`\n=== ${rec} ===`);
    [...recTexts].slice(0, 15).forEach((t) => console.log("-", t));
  }
}
