// Generates the animated SVG art for the profile README.
// No dependencies. Deterministic: same seed, same city, every run.
const W = 1200, H = 440;

const FSANS = '"DejaVu Sans","Segoe UI","Noto Sans",Verdana,system-ui,sans-serif';
const FMONO = 'ui-monospace,"DejaVu Sans Mono","SFMono-Regular",Menlo,Consolas,monospace';

export const THEMES = {
  dark: {
    skyTop:'#05070f', skyMid:'#0b1122', skyLow:'#141a2e', glow:'#3a2438', glowOp:0.55,
    far:'#141c30', mid:'#0a0f1e', near:'#04060c', stars:true,
    moon:'#e9e2cf', moonOp:0.92, moonHaloOp:0.10, crescent:true,
    winWarm:['#f0b23c','#ffd489','#e0913c','#ffc35e'], winCool:'#8fd3ff', winOp:0.92, nearWinOp:0.5,
    text:'#eef1f7', accent:'#f0b23c', muted:'#8b96ad', dim:'#6e7c96', rule:'#232c42', border:'#2a344b',
    beacon:'#ff5a5a', plane:'#0a0f1e', planeOp:0.85, fog:'#1a2338', fogOp:0.5,
    bg1:'#05070f', bg2:'#0d1424'
  },
  light: {
    skyTop:'#c3d1e6', skyMid:'#e2e8f1', skyLow:'#f7e6d2', glow:'#f6c99a', glowOp:0.75,
    far:'#aab6c9', mid:'#77839a', near:'#222a3a', stars:false,
    moon:'#fff3dd', moonOp:0.95, moonHaloOp:0.30, crescent:false,
    winWarm:['#f0a53c','#ffc061','#d98a2e','#ffb44d'], winCool:'#7fc4f0', winOp:0.85, nearWinOp:0.55,
    text:'#161d2b', accent:'#7d3f13', muted:'#5b6678', dim:'#5f6a7c', rule:'#cdd6e2', border:'#b9c3d3',
    beacon:'#d93b3b', plane:'#222a3a', planeOp:0.8, fog:'#ffffff', fogOp:0.35,
    bg1:'#eef2f8', bg2:'#e0e7f1'
  }
};

export const STACK = [
  ['infra',     [['docker','Docker'], ['githubactions','GitHub Actions'], ['linux','Linux'], ['render','Render'], ['cloudflare','Cloudflare'], ['apache','Apache']]],
  ['tools',     [['git','Git'], ['npm','npm'], ['webpack','Webpack'], ['selenium','Selenium'], ['pypi','PyPI'], ['jetbrains','JetBrains IDE']]],
  ['data',      [['postgresql','PostgreSQL'], ['mysql','MySQL'], ['redis','Redis'], ['sqlite','SQLite'], ['typeorm','TypeORM']]],
  ['backend',   [['nodedotjs','Node.js'], ['nestjs','NestJS'], ['express','Express'], ['flask','Flask'], ['fastapi','FastAPI'], ['socketdotio','Socket.IO']]],
  ['frontend',  [['react','React'], ['nextdotjs','Next.js'], ['angular','Angular'], ['reactivex','RxJS'], ['tailwindcss','Tailwind CSS'], ['d3','D3.js']]],
  ['languages', [['python','Python'], ['typescript','TypeScript'], ['javascript','JavaScript'], ['php','PHP'], ['sql','SQL'], ['gnubash','Bash']]]
];

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const r1 = n => Math.round(n*10)/10;

function layer(rnd, cfg, t) {
  const shapes = [], wins = [], masts = [];
  let x = -70;
  while (x < W + 70) {
    const w = Math.round(cfg.wMin + rnd()*(cfg.wMax-cfg.wMin));
    let topMin = cfg.topMin, topMax = cfg.topMax;
    if (x < 330) { topMin = cfg.lowTop; topMax = cfg.lowTop + 40; }   // keep the left low, behind the name
    const top = Math.round(topMin + rnd()*(topMax-topMin));
    shapes.push('<rect x="'+x+'" y="'+top+'" width="'+w+'" height="'+(cfg.base-top)+'"/>');
    if (rnd() < 0.28 && w > 52) {
      const sw = Math.round(w*(0.32+rnd()*0.24)), sx = x + Math.round((w-sw)/2), sh = Math.round(14+rnd()*30);
      shapes.push('<rect x="'+sx+'" y="'+(top-sh)+'" width="'+sw+'" height="'+sh+'"/>');
    } else if (rnd() < 0.22) {
      const mx = x + Math.round(w*(0.25+rnd()*0.5)), mh = Math.round(22+rnd()*46);
      shapes.push('<rect x="'+mx+'" y="'+(top-mh)+'" width="2" height="'+mh+'"/>');
      if (cfg.beacons) masts.push({ x: mx+1, y: top-mh-2, d:(1.4+rnd()*1.6).toFixed(1), b:(rnd()*2).toFixed(1) });
    }
    if (cfg.p) {
      const cols = Math.max(1, Math.floor((w-10)/13));
      const gx = x + Math.round((w - (cols*13-5))/2);
      for (let c = 0; c < cols; c++) for (let y = top+11; y < cfg.base-8; y += 15) {
        if (rnd() > cfg.p) continue;
        wins.push({
          x: gx + c*13, y,
          c: rnd() < 0.05 ? 'cool' : Math.floor(rnd()*t.winWarm.length),
          f: rnd() < 0.06 ? { d:(2.5+rnd()*7).toFixed(1), b:(rnd()*9).toFixed(1) } : null
        });
      }
    }
    x += w + Math.round(3 + rnd()*11);
  }
  return { shapes: shapes.join(''), wins, masts };
}

export function skyline(theme) {
  const P = theme + '-';
  const t = THEMES[theme], rnd = mulberry32(theme === 'dark' ? 20260828 : 77123);
  const far  = layer(rnd, { wMin:34, wMax:92,  topMin:206, topMax:272, lowTop:252, base:344, p:0 }, t);
  const mid  = layer(rnd, { wMin:44, wMax:112, topMin:192, topMax:296, lowTop:262, base:392, p:0.34, beacons:true }, t);
  const near = layer(rnd, { wMin:56, wMax:130, topMin:266, topMax:344, lowTop:314, base:H,   p:0.16 }, t);

  const windows = (list, op) => {
    const byColour = {};
    list.forEach(w => { (byColour[w.c] || (byColour[w.c] = [])).push(w); });
    return Object.entries(byColour).map(([k, arr]) => {
      const fill = k === 'cool' ? t.winCool : t.winWarm[+k];
      const body = arr.map(w => w.f
        ? '<rect x="'+w.x+'" y="'+w.y+'" width="6" height="8"><animate attributeName="opacity" values="1;1;0.15;1;1" dur="'+w.f.d+'s" begin="'+w.f.b+'s" repeatCount="indefinite"/></rect>'
        : '<rect x="'+w.x+'" y="'+w.y+'" width="6" height="8"/>').join('');
      return '<g fill="'+fill+'" opacity="'+op+'">'+body+'</g>';
    }).join('');
  };

  const beacons = mid.masts.slice(0, 5).map(b =>
    '<circle cx="'+b.x+'" cy="'+b.y+'" r="2" fill="'+t.beacon+'"><animate attributeName="opacity" values="1;0.05;1" dur="'+b.d+'s" begin="'+b.b+'s" repeatCount="indefinite"/></circle>').join('');

  const stars = t.stars ? Array.from({ length: 46 }, (_, i) => {
    const rn = mulberry32(900+i), sx = r1(rn()*W), sy = r1(20+rn()*210), rr = (0.6+rn()*1.1).toFixed(1);
    return '<circle cx="'+sx+'" cy="'+sy+'" r="'+rr+'"><animate attributeName="opacity" values="0.15;0.85;0.15" dur="'+(3+rn()*7).toFixed(1)+'s" begin="'+(rn()*8).toFixed(1)+'s" repeatCount="indefinite"/></circle>';
  }).join('') : '';

  // one tower runs a build: its floors light bottom to top, hold, then go dark
  const dx = 742, dTop = 178, dBase = 392;
  const deployFloors = Array.from({ length: 13 }, (_, i) =>
    '<rect x="'+(dx+9)+'" y="'+(dBase-22-i*15)+'" width="36" height="7" fill="'+t.winWarm[1]+'" opacity="0"><animate attributeName="opacity" values="0;0.95;0.95;0.2;0" keyTimes="0;0.04;0.72;0.86;1" dur="9s" begin="'+(i*0.34).toFixed(2)+'s" repeatCount="indefinite"/></rect>').join('');
  const deploy = '<g><rect x="'+dx+'" y="'+dTop+'" width="54" height="'+(dBase-dTop)+'" fill="'+t.mid+'"/><rect x="'+(dx+25)+'" y="'+(dTop-44)+'" width="3" height="44" fill="'+t.mid+'"/><circle cx="'+(dx+26.5)+'" cy="'+(dTop-46)+'" r="2.2" fill="'+t.beacon+'"><animate attributeName="opacity" values="1;0.05;1" dur="1.9s" repeatCount="indefinite"/></circle>'+deployFloors+'</g>';

  const plane = '<g opacity="'+t.planeOp+'"><g transform="translate(1330,-10)"><animateTransform attributeName="transform" type="translate" values="1330,-10;-120,14" dur="46s" repeatCount="indefinite"/>'
    + '<path d="M0 0 L17 0 L23 -5 L26 -5 L23 0 L30 0 L33 -3 L35.5 -3 L34 0 L36 0.9 L34 1.8 L35.5 1.8 L33 4.8 L30 4.8 L26.5 1.8 L23 1.8 L26 6.6 L23 6.6 L17 1.8 L0 1.8 Z" fill="'+t.plane+'"/>'
    + '<circle cx="34" cy="-3" r="1.5" fill="#6ef0a8"><animate attributeName="opacity" values="1;0.1;1" dur="1.1s" repeatCount="indefinite"/></circle>'
    + '<circle cx="34" cy="4.8" r="1.5" fill="'+t.beacon+'"><animate attributeName="opacity" values="1;0.1;1" dur="1.1s" begin="0.55s" repeatCount="indefinite"/></circle>'
    + '<circle cx="1" cy="0.9" r="1.6" fill="#ffffff" opacity="0"><animate attributeName="opacity" values="0;0;1;0;0" dur="2.4s" repeatCount="indefinite"/></circle></g></g>';

  const moon = t.crescent
    ? '<g><circle cx="1046" cy="98" r="58" fill="'+t.moon+'" opacity="'+t.moonHaloOp+'"/><mask id="'+P+'crescent"><circle cx="1046" cy="98" r="27" fill="#ffffff"/><circle cx="1059" cy="86" r="24" fill="#000000"/></mask><circle cx="1046" cy="98" r="27" fill="'+t.moon+'" opacity="'+t.moonOp+'" mask="url(#'+P+'crescent)"/></g>'
    : '<g><circle cx="1046" cy="98" r="58" fill="#ffca8a" opacity="'+t.moonHaloOp+'"/><circle cx="1046" cy="98" r="27" fill="'+t.moon+'" opacity="'+t.moonOp+'"/></g>';

  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" role="img" aria-label="Night skyline banner for cybetyar, full-stack developer">\n'
+ '<title>ß€₪¢€ ß · cybetyar</title>\n'
+ '<defs>\n'
+ '<linearGradient id="'+P+'sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+t.skyTop+'"/><stop offset="0.55" stop-color="'+t.skyMid+'"/><stop offset="1" stop-color="'+t.skyLow+'"/></linearGradient>\n'
+ '<radialGradient id="'+P+'glow" cx="0.62" cy="0.86" r="0.72"><stop offset="0" stop-color="'+t.glow+'" stop-opacity="'+t.glowOp+'"/><stop offset="1" stop-color="'+t.glow+'" stop-opacity="0"/></radialGradient>\n'
+ '<linearGradient id="'+P+'fog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+t.fog+'" stop-opacity="0"/><stop offset="1" stop-color="'+t.fog+'" stop-opacity="'+t.fogOp+'"/></linearGradient>\n'
+ '<clipPath id="'+P+'frame"><rect x="0" y="0" width="'+W+'" height="'+H+'" rx="10"/></clipPath>\n'
+ '</defs>\n'
+ '<g clip-path="url(#'+P+'frame)">\n'
+ '<rect width="'+W+'" height="'+H+'" fill="url(#'+P+'sky)"/>\n'
+ '<rect width="'+W+'" height="'+H+'" fill="url(#'+P+'glow)"/>\n'
+ '<g fill="'+t.moon+'" opacity="0.8">'+stars+'</g>\n'
+ moon + '\n' + plane + '\n'
+ '<g fill="'+t.far+'" opacity="0.95"><animateTransform attributeName="transform" type="translate" values="-9,0;9,0;-9,0" dur="120s" repeatCount="indefinite"/>'+far.shapes+'</g>\n'
+ '<rect x="0" y="286" width="'+W+'" height="106" fill="url(#'+P+'fog)"/>\n'
+ '<g fill="'+t.mid+'"><animateTransform attributeName="transform" type="translate" values="5,0;-5,0;5,0" dur="90s" repeatCount="indefinite"/>'+mid.shapes+'</g>\n'
+ windows(mid.wins, t.winOp) + '\n' + deploy + '\n' + beacons + '\n'
+ '<g fill="'+t.near+'">'+near.shapes+'</g>\n'
+ windows(near.wins, t.nearWinOp) + '\n'
+ '<text x="70" y="122" font-family=\'' + FSANS + '\' font-size="60" font-weight="700" letter-spacing="4" fill="'+t.text+'">ß€₪¢€ ß</text>\n'
+ '<text x="72" y="156" font-family=\'' + FMONO + '\' font-size="16" letter-spacing="5.5" fill="'+t.accent+'">cybetyar</text>\n'
+ '<rect x="72" y="176" width="196" height="1" fill="'+t.rule+'"/>\n'
+ '<text x="72" y="203" font-family=\'' + FMONO + '\' font-size="15" letter-spacing="1.2" fill="'+t.muted+'">full-stack developer</text>\n'
+ '<rect x="288" y="192" width="8" height="14" fill="'+t.accent+'"><animate attributeName="opacity" values="1;1;0;0" dur="1.15s" repeatCount="indefinite"/></rect>\n'
+ '<rect x="0.5" y="0.5" width="'+(W-1)+'" height="'+(H-1)+'" rx="10" fill="none" stroke="'+t.border+'" stroke-opacity="0.7"/>\n'
+ '</g>\n</svg>\n';
}

// the intro line, set on the same 1200-unit canvas as the cards so it renders
// at exactly their width. textLength pins the first line to the full span
// regardless of which system font the viewer has.
export function intro(theme) {
  const t = THEMES[theme];
  const l1 = 'Full-stack developer. Python and TypeScript by day, AI pipelines after dark.';
  const l2 = 'Somewhere in the city, a build is always running.';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 104" width="1200" height="104" role="img" aria-label="' + l1 + ' ' + l2 + '">\n'
+ '<text x="0" y="30" font-family=\'' + FSANS + '\' font-size="29" fill="' + t.text + '" textLength="1200" lengthAdjust="spacingAndGlyphs">' + l1 + '</text>\n'
+ '<text x="0" y="82" font-family=\'' + FSANS + '\' font-size="29" fill="' + t.muted + '">' + l2 + '</text>\n'
+ '</svg>\n';
}

// icons: the parsed scripts/icons.json (official brand marks). Pass {} to omit them.
export function directory(theme, icons) {
  const P = theme + '-';
  const t = THEMES[theme], w = 1200, h = 414;
  const ic = icons || {};
  const ys = [112, 166, 220, 274, 328, 382];
  const CH = 9, GLYPH = 18;   // monospace advance at 15px, and the icon box

  const rows = STACK.map(([label, items], i) => {
    const y = ys[i];
    let x = 196;
    const cells = items.map(([slug, name]) => {
      const mark = ic[slug];
      let glyph = '';
      if (mark) {
        const col = mark[theme] || mark.hex;
        glyph = '<g transform="translate(' + x + ',' + (y - 14.4) + ') scale(0.75)">'
          + (mark.stroke
              ? '<path d="' + mark.d + '" fill="none" stroke="' + col + '" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>'
              : '<path d="' + mark.d + '" fill="' + col + '"/>')
          + '</g>';
      }
      const cell = glyph
        + '<text x="' + (x + GLYPH + 9) + '" y="' + y + '" font-family=\'' + FMONO + '\' font-size="15" fill="' + t.text + '">' + name + '</text>';
      x += GLYPH + 9 + name.length * CH + 26;
      return cell;
    }).join('');
    return '<text x="64" y="' + y + '" font-family=\'' + FMONO + '\' font-size="13" letter-spacing="2.5" fill="' + t.muted + '">' + label + '</text>'
      + cells
      + (i < STACK.length - 1 ? '<rect x="64" y="' + (y + 20) + '" width="1000" height="1" fill="' + t.rule + '"/>' : '');
  }).join('\n');

  const stops = ys.map(y => y - 6);
  const seq = [stops[5], stops[2], stops[0], stops[3], stops[5]];
  const lift = '<g><rect x="1100" y="88" width="1" height="' + (stops[stops.length - 1] + 14 - 88) + '" fill="' + t.rule + '"/>'
    + ys.map(y => '<rect x="1096" y="' + (y - 6) + '" width="9" height="1" fill="' + t.rule + '"/>').join('')
    + '<g transform="translate(0,' + seq[0] + ')"><animateTransform attributeName="transform" type="translate" values="' + seq.map(v => '0,' + v).join(';') + '" keyTimes="0;0.25;0.5;0.75;1" dur="18s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" repeatCount="indefinite"/>'
    + '<rect x="1096.5" y="-5" width="8" height="10" fill="' + t.accent + '"/></g></g>';

  const head = '<text x="64" y="58" font-family=\'' + FMONO + '\' font-size="12" letter-spacing="5" fill="' + t.dim + '">DIRECTORY</text>'
    + '<rect x="64" y="76" width="1000" height="1" fill="' + t.rule + '"/>'
    + '<text x="1064" y="58" text-anchor="end" font-family=\'' + FMONO + '\' font-size="12" letter-spacing="2" fill="' + t.dim + '">what I build with</text>';

  const alt = STACK.map(([l, items]) => l + ': ' + items.map(([, n]) => n).join(', ')).join('. ');

  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" role="img" aria-label="Stack directory. ' + alt + '">\n'
+ '<defs>\n<linearGradient id="' + P + 'bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + t.bg1 + '"/><stop offset="1" stop-color="' + t.bg2 + '"/></linearGradient>\n'
+ '<radialGradient id="' + P + 'gl" cx="0.85" cy="1" r="0.8"><stop offset="0" stop-color="' + t.glow + '" stop-opacity="0.5"/><stop offset="1" stop-color="' + t.glow + '" stop-opacity="0"/></radialGradient>\n</defs>\n'
+ '<rect width="' + w + '" height="' + h + '" rx="10" fill="url(#' + P + 'bg)"/>\n<rect width="' + w + '" height="' + h + '" rx="10" fill="url(#' + P + 'gl)"/>\n'
+ head + '\n' + rows + '\n' + lift + '\n'
+ '<rect x="0.5" y="0.5" width="' + (w - 1) + '" height="' + (h - 1) + '" rx="10" fill="none" stroke="' + t.border + '" stroke-opacity="0.7"/>\n</svg>\n';
}
