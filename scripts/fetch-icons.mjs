// Refreshes scripts/icons.json from simple-icons (CC0 brand marks).
// Only needed when you add a technology to STACK in scripts/art.mjs, or want newer marks.
// Run: node scripts/fetch-icons.mjs
import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('./icons.json', import.meta.url);
const VERSION = 16;

const current = JSON.parse(await readFile(FILE, 'utf8'));
const slugs = Object.keys(current).filter(k => !k.startsWith('_') && !current[k].stroke);

const next = { _source: current._source };
for (const slug of slugs) {
  const res = await fetch(`https://cdn.jsdelivr.net/npm/simple-icons@${VERSION}/icons/${slug}.svg`);
  if (!res.ok) { console.warn(`skipped ${slug}: HTTP ${res.status}`); next[slug] = current[slug]; continue; }
  const d = (await res.text()).match(/\sd="([^"]+)"/);
  if (!d) { console.warn(`skipped ${slug}: no path`); next[slug] = current[slug]; continue; }
  // keep the hand-tuned colours, take the new geometry
  next[slug] = { ...current[slug], d: d[1] };
}
// hand-drawn marks (no official logo) pass through untouched
for (const [slug, mark] of Object.entries(current)) {
  if (mark.stroke) next[slug] = mark;
}

await writeFile(FILE, JSON.stringify(next, null, 2) + '\n');
console.log(`icons.json refreshed (${slugs.length} marks)`);
