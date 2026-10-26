import { readdir, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const ignored = new Set(['.git', 'node_modules']);
const htmlFiles = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.isFile() && extname(entry.name).toLowerCase() === '.html') htmlFiles.push(path);
  }
}

await walk(root);
const missing = [];
const attrPattern = /\b(?:href|src|poster|action)\s*=\s*(["'])(.*?)\1/gi;

for (const htmlFile of htmlFiles) {
  // This Vite entry is only for local React development. The published page is dist/index.html;
  // its absolute /src/main.tsx module path is resolved by Vite and is not a site asset.
  if (htmlFile === join(root, 'demos/intent-forms-heroui/index.html')) continue;
  const html = await (await import('node:fs/promises')).readFile(htmlFile, 'utf8');
  for (const match of html.matchAll(attrPattern)) {
    const value = match[2].trim();
    if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)) continue;
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(value, `https://site.invalid/${htmlFile.slice(root.length + 1)}`).pathname);
    } catch {
      missing.push(`${htmlFile.slice(root.length + 1)} → invalid URL ${value}`);
      continue;
    }

    const target = resolve(root, `.${pathname}`);
    if (target !== root && !target.startsWith(`${root}${sep}`)) {
      missing.push(`${htmlFile.slice(root.length + 1)} → path escapes site root: ${value}`);
      continue;
    }
    try {
      const info = await stat(target);
      if (!info.isFile() && !info.isDirectory()) throw new Error('missing');
      if (info.isDirectory() && !(await stat(join(target, 'index.html'))).isFile()) throw new Error('missing index');
    } catch {
      missing.push(`${htmlFile.slice(root.length + 1)} → ${value}`);
    }
  }
}

if (missing.length) {
  console.error(`Found ${missing.length} missing local link(s):`);
  for (const item of missing) console.error(`- ${item}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${htmlFiles.length} HTML pages; all local file links resolve.`);
}
