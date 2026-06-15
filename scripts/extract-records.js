const fs = require("fs");
const html = fs.readFileSync("«Гармония».html", "utf8");

function extractRecord(recId) {
  const styleStart = html.indexOf(`#${recId} .t396__artboard`);
  if (styleStart < 0) return null;
  const styleEnd = html.indexOf("</style>", styleStart);
  const css = html.slice(styleStart, styleEnd);
  const mobileCss = css.slice(css.indexOf("@media screen and (max-width:1199px)"));

  function parseChunk(chunk, rec) {
    const ruleRe = new RegExp(
      `#${rec} \\.tn-elem\\[data-elem-id="(\\d+)"\\]\\{([^}]+)\\}`,
      "g",
    );
    const out = {};
    let m;
    while ((m = ruleRe.exec(chunk)) !== null) {
      const body = m[2];
      const top = body.match(/top:([\d.-]+)px/)?.[1];
      const leftM = body.match(/left:calc\(50% - (\d+)px \+ (-?\d+)px\)/);
      const width = body.match(/width:([\d.]+)px/)?.[1];
      const bg = body.match(/background-color:(#[0-9a-fA-F]+)/)?.[1];
      out[m[1]] = {
        top: top ? +top : null,
        left: leftM ? +leftM[2] : null,
        width: width ? +width : null,
        bg,
      };
    }
    return out;
  }

  const recStart = html.indexOf(`id="${recId}"`);
  const nextRec = html.indexOf('class="r t-rec', recStart + 20);
  const chunk = html.slice(recStart, nextRec);

  const textRe = /data-elem-id="(\d+)"[\s\S]{0,2000}?<div[^>]*class="tn-atom"[^>]*>([\s\S]*?)<\/div>/g;
  const texts = {};
  let m;
  while ((m = textRe.exec(chunk)) !== null) {
    const t = m[2].replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (t) texts[m[1]] = t;
  }

  const mobilePos = parseChunk(mobileCss, recId);
  const desktopPos = parseChunk(css.slice(0, css.indexOf("@media")), recId);

  const heightM = css.match(/max-width:1199px\)[^{]*\{[^}]*height:(\d+)px/)?.[1];
  const heightD = css.match(/\.t396__artboard \{height:(\d+)px/)?.[1];

  return { recId, heightM: +heightM, heightD: +heightD, mobile: mobilePos, desktop: desktopPos, texts };
}

for (const rec of ["rec1648305021", "rec1863407831", "rec1864043411", "rec1648305051"]) {
  const data = extractRecord(rec);
  if (!data) continue;
  console.log(`\n======== ${rec} h=${data.heightM}/${data.heightD} ========`);
  const items = Object.keys(data.texts).map((id) => ({
    id,
    text: data.texts[id].slice(0, 60),
    m: data.mobile[id],
    d: data.desktop[id],
  }));
  items.sort((a, b) => (a.m?.top || a.d?.top || 0) - (b.m?.top || b.d?.top || 0));
  for (const it of items) {
    if (!it.m?.top && !it.d?.top) continue;
    console.log(
      `M${it.m?.top ?? "-"} L${it.m?.left ?? "-"} | D${it.d?.top} L${it.d?.left} | ${it.text}`,
    );
  }
  const colors = Object.values(data.mobile).filter((v) => v?.bg);
  if (colors.length) console.log("colors:", [...new Set(colors.map((c) => c.bg))].join(", "));
}
