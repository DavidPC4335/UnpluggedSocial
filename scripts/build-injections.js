/* eslint-disable @typescript-eslint/no-var-requires */
const { build } = require('esbuild');
const { readdirSync, writeFileSync, mkdirSync, existsSync } = require('fs');
const { join, resolve } = require('path');

const COMPONENTS_DIR = resolve('src', 'injections', 'instagramComponents');
const GENERATED_DIR = resolve('src', 'injections', 'generated');
const OUTPUT_FILE = join(GENERATED_DIR, 'instagram.ts');

function getComponentFiles() {
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
  if (window.__unplugged) return;
  var u = {};
  u.ready = function(fn){
    if (document.readyState === 'loading') {
      var once = function(){ document.removeEventListener('DOMContentLoaded', once); try { fn(); } catch(e){} };
      document.addEventListener('DOMContentLoaded', once);
    } else { try { fn(); } catch(e){} }
  };
  u.css = function(id, cssText){
    if (document.getElementById(id)) return;
    var s = document.createElement('style'); s.id = id; s.textContent = cssText;
    (document.head || document.documentElement).appendChild(s);
  };
  window.__unplugged = u;
})();`;
}

async function bundleBefore(entries) {
  const importLines = entries.map((e, i) => `import * as C${i} from ${JSON.stringify(e)};`).join('\n');
  const body = `
${makeRuntime()}
(function(){
  var u = window.__unplugged;
  ${entries.map((_, i) => `
  try { if (C${i}.styles) { u.css('unplugged-style-' + (C${i}.id || 'c${i}'), C${i}.styles); } } catch(e) {}
  `.trim()).join('\n')}
})();`;

  const result = await build({
    stdin: { contents: importLines + '\n' + body, resolveDir: process.cwd(), sourcefile: 'before.entry.ts', loader: 'ts' },
    bundle: true,
    minify: true,
    platform: 'browser',
    write: false,
    format: 'iife',
    loader: { '.ts': 'ts', '.tsx': 'tsx', '.js': 'js', '.svg': 'text', '.json': 'json' },
  });
  return result.outputFiles[0].text.trim();
}

async function bundleAfter(entries) {
  const importLines = entries.map((e, i) => `import * as C${i} from ${JSON.stringify(e)};`).join('\n');
  const body = `
(function(){
  try { window.ReactNativeWebView && window.ReactNativeWebView.postMessage && window.ReactNativeWebView.postMessage('[IG] components: after start'); } catch(e){}
  ${entries.map((_, i) => `
  try { if (C${i}.install) { C${i}.install(); } } catch(e) {}
  `.trim()).join('\n')}
})();`;

  const result = await build({
    stdin: { contents: importLines + '\n' + body, resolveDir: process.cwd(), sourcefile: 'after.entry.ts', loader: 'ts' },
    bundle: true,
    minify: true,
    platform: 'browser',
    write: false,
    format: 'iife',
    loader: { '.ts': 'ts', '.tsx': 'tsx', '.js': 'js', '.svg': 'text', '.json': 'json' },
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
  console.log('Generated', OUTPUT_FILE);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


