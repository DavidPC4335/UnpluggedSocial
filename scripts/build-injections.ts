import { build } from 'esbuild';
import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const COMPONENTS_DIR = resolve('src', 'injections', 'instagramComponents');
const GENERATED_DIR = resolve('src', 'injections', 'generated');
const OUTPUT_FILE = join(GENERATED_DIR, 'instagram.ts');

function getComponentFiles(): string[] {
  try {
    const all = readdirSync(COMPONENTS_DIR, { withFileTypes: true });
    return all
      .filter((d) => d.isFile() && (d.name.endsWith('.ts') || d.name.endsWith('.tsx') || d.name.endsWith('.js')))
      .map((d) => join(COMPONENTS_DIR, d.name));
  } catch {
    return [];
  }
}

function makeRuntime() {
  return `
(function(){
  if ((window as any).__unplugged) return;
  const u: any = {};
  u.ready = (fn: () => void) => {
    if (document.readyState === 'loading') {
      const once = () => { document.removeEventListener('DOMContentLoaded', once); try { fn(); } catch {} };
      document.addEventListener('DOMContentLoaded', once);
    } else { try { fn(); } catch {} }
  };
  u.css = (id: string, cssText: string) => {
    if (document.getElementById(id)) return;
    const s = document.createElement('style'); s.id = id; s.textContent = cssText;
    (document.head || document.documentElement).appendChild(s);
  };
  (window as any).__unplugged = u;
})();`;
}

async function bundleBefore(entries: string[]): Promise<string> {
  const importLines = entries.map((e, i) => `import * as C${i} from ${JSON.stringify(e)};`).join('\n');
  const body = `
${makeRuntime()}
(function(){
  const u: any = (window as any).__unplugged;
  ${entries.map((_, i) => `
  try { if ((C${i} as any).styles) { u.css('unplugged-style-' + (C${i} as any).id, (C${i} as any).styles); } } catch {}
  `.trim()).join('\n')}
})();`;

  const result = await build({
    stdin: { contents: importLines + '\n' + body, resolveDir: process.cwd(), sourcefile: 'before.entry.ts', loader: 'ts' },
    bundle: true,
    minify: true,
    platform: 'browser',
    write: false,
    format: 'iife',
  });
  return result.outputFiles[0].text.trim();
}

async function bundleAfter(entries: string[]): Promise<string> {
  const importLines = entries.map((e, i) => `import * as C${i} from ${JSON.stringify(e)};`).join('\n');
  const body = `
(function(){
  try { (window as any).ReactNativeWebView?.postMessage('[IG] components: after start'); } catch {}
  ${entries.map((_, i) => `
  try { if ((C${i} as any).install) { (C${i} as any).install(); } } catch {}
  `.trim()).join('\n')}
})();`;

  const result = await build({
    stdin: { contents: importLines + '\n' + body, resolveDir: process.cwd(), sourcefile: 'after.entry.ts', loader: 'ts' },
    bundle: true,
    minify: true,
    platform: 'browser',
    write: false,
    format: 'iife',
  });
  return result.outputFiles[0].text.trim();
}

async function main() {
  const files = getComponentFiles();
  if (!existsSync(GENERATED_DIR)) mkdirSync(GENERATED_DIR, { recursive: true });
  const before = await bundleBefore(files);
  const after = await bundleAfter(files);
  const out = `
export const instagramBefore = ${JSON.stringify(before + ';true;')};
export const instagramAfter = ${JSON.stringify(after + ';true;')};
`.trim() + '\n';
  writeFileSync(OUTPUT_FILE, out, 'utf8');
  // eslint-disable-next-line no-console
  console.log('Generated', OUTPUT_FILE);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


