/* eslint-disable @typescript-eslint/no-var-requires */
const { build } = require('esbuild');
const { readdirSync, writeFileSync, mkdirSync, existsSync } = require('fs');
const { join, resolve } = require('path');

const SHARED_COMPONENTS_DIR = resolve('src', 'injections', 'sharedComponents');
const INSTAGRAM_COMPONENTS_DIR = resolve('src', 'injections', 'instagramComponents');
const FACEBOOK_COMPONENTS_DIR = resolve('src', 'injections', 'facebookComponents');
const GENERATED_DIR = resolve('src', 'injections', 'generated');
const INSTAGRAM_OUTPUT_FILE = join(GENERATED_DIR, 'instagram.ts');
const FACEBOOK_OUTPUT_FILE = join(GENERATED_DIR, 'facebook.ts');

function getComponentFiles(componentsDir) {
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

async function bundleBefore(entries, platform) {
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
    stdin: { contents: importLines + '\n' + body, resolveDir: process.cwd(), sourcefile: `before.${platform}.entry.ts`, loader: 'ts' },
    bundle: true,
    minify: true,
    platform: 'browser',
    write: false,
    format: 'iife',
    loader: { '.ts': 'ts', '.tsx': 'tsx', '.js': 'js', '.svg': 'text', '.json': 'json' },
  });
  return result.outputFiles[0].text.trim();
}

async function bundleAfter(entries, platform) {
  const platformTag = platform.toUpperCase().substring(0, 2);
  const importLines = entries.map((e, i) => `import * as C${i} from ${JSON.stringify(e)};`).join('\n');
  const body = `
(function(){
  try { window.ReactNativeWebView && window.ReactNativeWebView.postMessage && window.ReactNativeWebView.postMessage('[${platformTag}] components: after start'); } catch(e){}
  ${entries.map((_, i) => `
  try { if (C${i}.install) { C${i}.install(); } } catch(e) {}
  `.trim()).join('\n')}
})();`;

  const result = await build({
    stdin: { contents: importLines + '\n' + body, resolveDir: process.cwd(), sourcefile: `after.${platform}.entry.ts`, loader: 'ts' },
    bundle: true,
    minify: true,
    platform: 'browser',
    write: false,
    format: 'iife',
    loader: { '.ts': 'ts', '.tsx': 'tsx', '.js': 'js', '.svg': 'text', '.json': 'json' },
  });
  return result.outputFiles[0].text.trim();
}

async function buildPlatform(componentsDirs, outputFile, platform, exportPrefix) {
  const files = componentsDirs.flatMap((dir) => getComponentFiles(dir));
  const before = await bundleBefore(files, platform);
  const after = await bundleAfter(files, platform);
  const out = `
export const ${exportPrefix}Before = ${JSON.stringify(before + ';true;')};
export const ${exportPrefix}After = ${JSON.stringify(after + ';true;')};
`.trim() + '\n';
  writeFileSync(outputFile, out, 'utf8');
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


