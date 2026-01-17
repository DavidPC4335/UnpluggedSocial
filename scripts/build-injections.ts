import { build } from 'esbuild';
import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const SHARED_COMPONENTS_DIR = resolve('src', 'injections', 'sharedComponents');
const INSTAGRAM_COMPONENTS_DIR = resolve('src', 'injections', 'instagramComponents');
const FACEBOOK_COMPONENTS_DIR = resolve('src', 'injections', 'facebookComponents');
const GENERATED_DIR = resolve('src', 'injections', 'generated');
const INSTAGRAM_OUTPUT_FILE = join(GENERATED_DIR, 'instagram.ts');
const FACEBOOK_OUTPUT_FILE = join(GENERATED_DIR, 'facebook.ts');

function getComponentFiles(componentsDir: string): string[] {
  try {
    const all = readdirSync(componentsDir, { withFileTypes: true });
    return all
      .filter((d) => d.isFile() && (d.name.endsWith('.ts') || d.name.endsWith('.tsx') || d.name.endsWith('.js')))
      .map((d) => join(componentsDir, d.name));
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

async function bundleBefore(entries: string[], platform: string): Promise<string> {
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
    stdin: { contents: importLines + '\n' + body, resolveDir: process.cwd(), sourcefile: `before.${platform}.entry.ts`, loader: 'ts' },
    bundle: true,
    minify: true,
    platform: 'browser',
    write: false,
    format: 'iife',
  });
  return result.outputFiles[0].text.trim();
}

async function bundleAfter(entries: string[], platform: string): Promise<string> {
  const platformTag = platform.toUpperCase().substring(0, 2);
  const importLines = entries.map((e, i) => `import * as C${i} from ${JSON.stringify(e)};`).join('\n');
  const body = `
(function(){
  try { (window as any).ReactNativeWebView?.postMessage('[${platformTag}] components: after start'); } catch {}
  ${entries.map((_, i) => `
  try { if ((C${i} as any).install) { (C${i} as any).install(); } } catch {}
  `.trim()).join('\n')}
})();`;

  const result = await build({
    stdin: { contents: importLines + '\n' + body, resolveDir: process.cwd(), sourcefile: `after.${platform}.entry.ts`, loader: 'ts' },
    bundle: true,
    minify: true,
    platform: 'browser',
    write: false,
    format: 'iife',
  });
  return result.outputFiles[0].text.trim();
}

async function buildPlatform(componentsDirs: string[], outputFile: string, platform: string, exportPrefix: string) {
  const files = componentsDirs.flatMap((dir) => getComponentFiles(dir));
  const before = await bundleBefore(files, platform);
  const after = await bundleAfter(files, platform);
  const out = `
export const ${exportPrefix}Before = ${JSON.stringify(before + ';true;')};
export const ${exportPrefix}After = ${JSON.stringify(after + ';true;')};
`.trim() + '\n';
  writeFileSync(outputFile, out, 'utf8');
  // eslint-disable-next-line no-console
  console.log('Generated', outputFile);
}

async function main() {
  if (!existsSync(GENERATED_DIR)) mkdirSync(GENERATED_DIR, { recursive: true });
  await buildPlatform([SHARED_COMPONENTS_DIR, INSTAGRAM_COMPONENTS_DIR], INSTAGRAM_OUTPUT_FILE, 'instagram', 'instagram');
  await buildPlatform([SHARED_COMPONENTS_DIR, FACEBOOK_COMPONENTS_DIR], FACEBOOK_OUTPUT_FILE, 'facebook', 'facebook');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


