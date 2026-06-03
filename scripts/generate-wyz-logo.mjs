import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const width = 940;
const height = 260;

const outputDir = path.resolve("public/assets/home");
const pngOutput = path.join(outputDir, "wyz-logo.png");
const webpOutput = path.join(outputDir, "wyz-logo.webp");

const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="outline" x1="90" y1="50" x2="620" y2="206" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#CFF8FF"/>
      <stop offset="0.42" stop-color="#63D1FF"/>
      <stop offset="0.82" stop-color="#2A84EB"/>
      <stop offset="1" stop-color="#A6F1FF"/>
    </linearGradient>
    <linearGradient id="fill" x1="132" y1="54" x2="484" y2="206" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#415361"/>
      <stop offset="0.18" stop-color="#121820"/>
      <stop offset="0.58" stop-color="#18212B"/>
      <stop offset="1" stop-color="#0E1318"/>
    </linearGradient>
    <linearGradient id="shine" x1="148" y1="44" x2="276" y2="196" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.9"/>
      <stop offset="0.28" stop-color="#B8F1FF" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#B8F1FF" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="orbit" x1="58" y1="186" x2="698" y2="120" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#2D80EA"/>
      <stop offset="0.52" stop-color="#83EEFF"/>
      <stop offset="0.76" stop-color="#E6BE6D"/>
      <stop offset="1" stop-color="#71E0FF"/>
    </linearGradient>
    <radialGradient id="flare" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(650 98) rotate(0) scale(34 34)">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.95"/>
      <stop offset="0.32" stop-color="#E9FCFF" stop-opacity="0.88"/>
      <stop offset="0.72" stop-color="#8EEFFF" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#8EEFFF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="kana" x1="438" y1="96" x2="492" y2="164" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#D7FBFF"/>
      <stop offset="0.46" stop-color="#88E7FF"/>
      <stop offset="1" stop-color="#4CA8F2"/>
    </linearGradient>
    <linearGradient id="subOutline" x1="468" y1="88" x2="744" y2="170" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#DDFBFF"/>
      <stop offset="0.38" stop-color="#9AEFFF"/>
      <stop offset="0.82" stop-color="#55B3F8"/>
      <stop offset="1" stop-color="#D2F9FF"/>
    </linearGradient>
    <linearGradient id="subFill" x1="476" y1="90" x2="722" y2="166" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#4A6170"/>
      <stop offset="0.24" stop-color="#101822"/>
      <stop offset="0.64" stop-color="#1A2838"/>
      <stop offset="1" stop-color="#0F151B"/>
    </linearGradient>
    <linearGradient id="subShine" x1="494" y1="84" x2="584" y2="150" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.9"/>
      <stop offset="0.34" stop-color="#D9FBFF" stop-opacity="0.38"/>
      <stop offset="1" stop-color="#C8F6FF" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bookmarkFill" x1="592" y1="102" x2="640" y2="154" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#E0FBFF"/>
      <stop offset="0.46" stop-color="#8EE8FF"/>
      <stop offset="1" stop-color="#5EAFFF"/>
    </linearGradient>
    <linearGradient id="bookmarkStroke" x1="590" y1="100" x2="640" y2="154" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#DFFBFF"/>
      <stop offset="0.54" stop-color="#78DCFF"/>
      <stop offset="1" stop-color="#3E93ED"/>
    </linearGradient>
    <linearGradient id="bookmarkShine" x1="600" y1="104" x2="618" y2="142" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.92"/>
      <stop offset="0.38" stop-color="#D8FBFF" stop-opacity="0.38"/>
      <stop offset="1" stop-color="#D8FBFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="bookmarkGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(618 123) rotate(0) scale(18 18)">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.96"/>
      <stop offset="0.46" stop-color="#DDF9FF" stop-opacity="0.48"/>
      <stop offset="1" stop-color="#DDF9FF" stop-opacity="0"/>
    </radialGradient>
    <filter id="bookmarkShadow" x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.4" flood-color="#203448" flood-opacity="0.65"/>
      <feDropShadow dx="0" dy="0" stdDeviation="1.2" flood-color="#7DDFFF" flood-opacity="0.22"/>
    </filter>
    <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4.5"/>
    </filter>
    <filter id="orbitGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2.8"/>
    </filter>
    <filter id="subTextShadow" x="-20%" y="-20%" width="150%" height="150%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1.8" flood-color="#172636" flood-opacity="0.72"/>
      <feDropShadow dx="0" dy="0" stdDeviation="1.1" flood-color="#8EEBFF" flood-opacity="0.22"/>
    </filter>
  </defs>

  <g opacity="0.24" filter="url(#textGlow)">
    <text x="76" y="188" font-size="170" font-family="Impact, Arial Black, sans-serif" font-style="italic" letter-spacing="2" fill="#54D3FF">WYZ</text>
  </g>

  <g>
    <text x="76" y="188" font-size="170" font-family="Impact, Arial Black, sans-serif" font-style="italic" letter-spacing="2" fill="url(#fill)" stroke="url(#outline)" stroke-width="6.5" paint-order="stroke fill">WYZ</text>
    <text x="86" y="174" font-size="170" font-family="Impact, Arial Black, sans-serif" font-style="italic" letter-spacing="2" fill="url(#shine)" fill-opacity="0.84">WYZ</text>
  </g>

  <path d="M54 186C130 226 308 232 490 216C592 208 676 195 788 138" stroke="url(#orbit)" stroke-width="9" stroke-linecap="round" fill="none" filter="url(#orbitGlow)" opacity="0.72"/>
  <path d="M58 188C132 228 307 234 488 218C588 210 670 198 780 142" stroke="#132334" stroke-width="4.2" stroke-linecap="round" fill="none" opacity="0.86"/>
  <path d="M700 88C754 92 806 114 860 150" stroke="#73DEFF" stroke-width="5.2" stroke-linecap="round" fill="none" opacity="0.74"/>
  <circle cx="866" cy="154" r="4.1" fill="#A6F2FF" opacity="0.82"/>
  <ellipse cx="840" cy="110" rx="26" ry="26" fill="url(#flare)" opacity="0.58"/>

  <g fill="#D6FBFF" opacity="0.72">
    <circle cx="86" cy="70" r="1.8"/>
    <circle cx="144" cy="58" r="1.35"/>
    <circle cx="620" cy="72" r="1.55"/>
    <circle cx="798" cy="92" r="1.35"/>
    <circle cx="826" cy="156" r="1.15"/>
  </g>

  <g opacity="0.18" filter="url(#textGlow)">
    <text x="436" y="164" font-size="66" font-weight="700" font-family="Yu Gothic UI, Microsoft YaHei UI, Microsoft YaHei, sans-serif" fill="#92EEFF">の</text>
    <text x="490" y="166" font-size="72" font-weight="700" font-family="Microsoft YaHei UI, Microsoft YaHei, PingFang SC, sans-serif" fill="#86EAFF">拾</text>
    <text x="680" y="166" font-size="72" font-weight="700" font-family="Microsoft YaHei UI, Microsoft YaHei, PingFang SC, sans-serif" fill="#86EAFF">忆</text>
  </g>

  <g filter="url(#subTextShadow)">
    <text x="436" y="164" font-size="66" font-weight="700" font-family="Yu Gothic UI, Microsoft YaHei UI, Microsoft YaHei, sans-serif" fill="url(#kana)">の</text>
    <text x="490" y="168" font-size="76" font-weight="700" font-family="Microsoft YaHei UI, Microsoft YaHei, PingFang SC, sans-serif" fill="url(#subFill)" stroke="url(#subOutline)" stroke-width="2.7" paint-order="stroke fill">拾</text>
    <text x="499" y="152" font-size="76" font-weight="700" font-family="Microsoft YaHei UI, Microsoft YaHei, PingFang SC, sans-serif" fill="url(#subShine)" fill-opacity="0.84">拾</text>
  </g>

  <g filter="url(#bookmarkShadow)">
    <ellipse cx="618" cy="123" rx="18" ry="18" fill="url(#bookmarkGlow)" opacity="0.84"/>
    <path d="M604 101H632C635.5 101 638 103.5 638 107V147L618 135L598 147V107C598 103.5 600.5 101 604 101Z" fill="url(#bookmarkFill)" stroke="url(#bookmarkStroke)" stroke-width="2.3" stroke-linejoin="round"/>
    <path d="M607 107H629V139L618 131L607 139Z" fill="url(#bookmarkShine)" opacity="0.82"/>
    <path d="M621 111L623.4 116.2L628.6 118.6L623.4 121L621 126.2L618.6 121L613.4 118.6L618.6 116.2Z" fill="#FFE6A8"/>
    <path d="M642 112C648 114 654 118 657 123" stroke="#8FEAFF" stroke-width="2.3" stroke-linecap="round" opacity="0.88"/>
    <circle cx="660" cy="126" r="2.8" fill="#DFFBFF"/>
  </g>

  <g filter="url(#subTextShadow)">
    <text x="658" y="168" font-size="76" font-weight="700" font-family="Microsoft YaHei UI, Microsoft YaHei, PingFang SC, sans-serif" fill="url(#subFill)" stroke="url(#subOutline)" stroke-width="2.7" paint-order="stroke fill">忆</text>
    <text x="667" y="152" font-size="76" font-weight="700" font-family="Microsoft YaHei UI, Microsoft YaHei, PingFang SC, sans-serif" fill="url(#subShine)" fill-opacity="0.84">忆</text>
  </g>
</svg>
`;

await fs.mkdir(outputDir, { recursive: true });

const buffer = await sharp(Buffer.from(svg))
  .png()
  .toBuffer();

await sharp(buffer).png().toFile(pngOutput);
await sharp(buffer).webp({ quality: 94 }).toFile(webpOutput);

console.log(`Generated ${pngOutput}`);
console.log(`Generated ${webpOutput}`);
