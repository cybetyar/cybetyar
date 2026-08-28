// Writes every SVG in assets/. Run: node scripts/build.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { skyline, directory, intro } from './art.mjs';

const icons = JSON.parse(await readFile(new URL('./icons.json', import.meta.url), 'utf8'));

await mkdir('assets', { recursive: true });
for (const theme of ['dark', 'light']) {
  await writeFile(`assets/skyline-${theme}.svg`, skyline(theme));
  await writeFile(`assets/intro-${theme}.svg`, intro(theme));
  await writeFile(`assets/directory-${theme}.svg`, directory(theme, icons));
}
console.log('art rebuilt');
