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
    const top = body.match(/top:([\d.-]+)px/)?.[1];
    const leftM = body.match(/left:calc\(50% - (\d+)px \+ (-?\d+)px\)/);
    const width = body.match(/width:([\d.]+)px/)?.[1];
    const height = body.match(/height:([\d.]+)px/)?.[1];
    const bg = body.match(/background-color:([^;]+)/)?.[1];
    out[m[1]] = {
      top: top ? +top : null,
      left: leftM ? +leftM[2] : null,
      width: width ? +width : null,
      height: height ? +height : null,
      bg,
    };
  }
  return out;
}

const dCss = parseChunk(css.slice(0, css.indexOf("@media")));
const mCss = parseChunk(mobileCss);

const recStart = html.indexOf('id="rec1648305021"');
const recEnd = html.indexOf('id="rec1648305031"', recStart);
const chunk = html.slice(recStart, recEnd);

const fieldRe =
  /data-elem-id="(\d+)"[^>]*data-field-top-value="(-?\d+)"[^>]*data-field-left-value="(-?\d+)"[^>]*data-field-width-value="(\d+)"/g;
const desktop = {};
while ((m = fieldRe.exec(chunk)) !== null) {
  desktop[m[1]] = { top: +m[2], left: +m[3], width: +m[4] };
}

const typeRe =
  /data-elem-id="(\d+)"[^>]*data-elem-type="([^"]+)"[^>]*data-field-top-value="(-?\d+)"[^>]*data-field-left-value="(-?\d+)"/g;
const elems = [];
while ((m = typeRe.exec(chunk)) !== null) {
  elems.push({ id: m[1], type: m[2], top: +m[3], left: +m[4] });
}

const textRe = /data-elem-id="(\d+)"[\s\S]{0,2500}?<div[^>]*class="tn-atom"[^>]*>([\s\S]*?)<\/div>/g;
const texts = {};
while ((m = textRe.exec(chunk)) !== null) {
  const t = m[2].replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (t) texts[m[1]] = t;
}

const PAD = 40;
const all = Object.keys({ ...mCss, ...texts }).map((id) => ({
  id,
  text: texts[id] || null,
  type: elems.find((e) => e.id === id)?.type,
  mobile: mCss[id] ? { ...mCss[id], left: (mCss[id].left ?? 0) + PAD } : null,
  desktop: desktop[id] || null,
}));

all.sort((a, b) => (a.mobile?.top || a.desktop?.top || 9999) - (b.mobile?.top || b.desktop?.top || 9999));

for (const item of all) {
  if (!item.mobile?.top && !item.desktop?.top) continue;
  const top = item.mobile?.top ?? item.desktop?.top;
  if (top < 1050 || top > 2100) continue;
  console.log(
    JSON.stringify({
      top,
      left: item.mobile?.left,
      dTop: item.desktop?.top,
      dLeft: item.desktop?.left,
      w: item.mobile?.width,
      bg: item.mobile?.bg,
      type: item.type,
      text: item.text?.slice(0, 70),
    }),
  );
}

// dress code color shapes
console.log("\n=== COLOR SHAPES ===");
for (const item of all) {
  if (item.mobile?.bg && item.mobile.bg.includes("#")) {
    console.log(item.mobile.bg, item.mobile);
  }
}
