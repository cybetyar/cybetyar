const FSANS="\"DejaVu Sans\",\"Segoe UI\",\"Noto Sans\",Verdana,system-ui,sans-serif";
const FMONO="ui-monospace,\"DejaVu Sans Mono\",\"SFMono-Regular\",Menlo,Consolas,monospace";
const T={"dark":{"bg1":"#05070f","bg2":"#0d1424","glow":"#3a2438","text":"#eef1f7","accent":"#f0b23c","muted":"#8b96ad","dim":"#6e7c96","rule":"#232c42","border":"#2a344b","win":"#f0b23c"},"light":{"bg1":"#eef2f8","bg2":"#e0e7f1","glow":"#f6c99a","text":"#161d2b","accent":"#7d3f13","muted":"#5b6678","dim":"#5f6a7c","rule":"#cdd6e2","border":"#b9c3d3","win":"#e09a34"}};
const CELLS=[['contributions','contributions'],['streak','current streak'],['commits','total commits'],['prs','total PRs'],['contributedTo','contributed to']];
export function renderStats(theme, d){
  const P=theme+'-';
  const t=T[theme], w=1200, h=150;
  const cw=w/5;
  const cells=CELLS.map(([k,label],i)=>{
    const x=Math.round(i*cw+52);
    const v=(d[k]===null||d[k]===undefined)?'–':String(d[k]);
    return (i>0?`<rect x="${Math.round(i*cw)}" y="34" width="1" height="70" fill="${t.rule}"/>`:'')
      +`<text x="${x}" y="66" font-family='${FMONO}' font-size="11" letter-spacing="3.2" fill="${t.dim}">${label.toUpperCase()}</text>`
      +`<text x="${x}" y="102" font-family='${FSANS}' font-size="34" font-weight="700" letter-spacing="-0.5" fill="${v === '–' ? t.dim : t.accent}">${v}</text>`;
  }).join('');
  const foot=`<rect x="52" y="122" width="6" height="6" fill="${t.accent}"><animate attributeName="opacity" values="1;0.15;1" dur="2.4s" repeatCount="indefinite"/></rect>`
    +`<text x="68" y="128" font-family='${FMONO}' font-size="11" letter-spacing="1.6" fill="${t.dim}">rebuilt nightly from the GitHub API · private contributions included</text>`
    +`<text x="1148" y="128" text-anchor="end" font-family='${FMONO}' font-size="11" letter-spacing="1.6" fill="${t.dim}">${d.synced||'–'}</text>`;
  const label='GitHub activity: '+CELLS.map(([k,l])=>l+' '+((d[k]===null||d[k]===undefined)?'unknown':d[k])).join(', ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">
<defs>
<linearGradient id="${P}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.bg1}"/><stop offset="1" stop-color="${t.bg2}"/></linearGradient>
<radialGradient id="${P}gl" cx="0.85" cy="1" r="0.8"><stop offset="0" stop-color="${t.glow}" stop-opacity="0.5"/><stop offset="1" stop-color="${t.glow}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${w}" height="${h}" rx="10" fill="url(#${P}bg)"/>
<rect width="${w}" height="${h}" rx="10" fill="url(#${P}gl)"/>
<text x="52" y="30" font-family='${FMONO}' font-size="12" letter-spacing="5" fill="${t.dim}">THE BOARD</text>
<rect x="52" y="44" width="0" height="0" fill="none"/>
${cells}
${foot}
<rect x="0.5" y="0.5" width="${w-1}" height="${h-1}" rx="10" fill="none" stroke="${t.border}" stroke-opacity="0.7"/>
</svg>`;
}
