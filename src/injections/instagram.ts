export const instagramBefore = `
(function () {
try {
  if (window.__unplugged_instagram_style_injected) return;
  window.__unplugged_instagram_style_injected = true;
  var style = document.createElement('style');
  style.id = 'unplugged-popover-style';
  style.textContent = ''
    + '#unplugged-popover-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:2147483647;display:flex;align-items:center;justify-content:center;}'
    + '#unplugged-popover-card{background:#fff;color:#000;border-radius:12px;padding:16px 20px;font-family:-apple-system,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:16px;box-shadow:0 10px 30px rgba(0,0,0,0.2);max-width:80vw;text-align:center;}'
    + '#unplugged-popover-title{font-weight:600;margin-bottom:8px;}'
    + '#unplugged-popover-close{margin-top:12px;display:inline-block;padding:8px 12px;background:#111;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;}';
  (document.head || document.documentElement).appendChild(style);
} catch (e) {}
})(); true;
`;
export const instagramAfter = `
(function () {
try {
  function dbg(msg){ try { if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) { window.ReactNativeWebView.postMessage('[IG] ' + msg); } } catch (e) {} }
  dbg('after: start');
  function showPopover(force) {
    if (!force && sessionStorage.getItem('__unplugged_welcome_shown') === '1') { dbg('showPopover: already shown'); return; }
    if (!document.body) return;
    if (document.getElementById('unplugged-popover-backdrop')) return;
    dbg('showPopover: creating elements');
    var backdrop = document.createElement('div');
    backdrop.id = 'unplugged-popover-backdrop';
    var card = document.createElement('div');
    card.id = 'unplugged-popover-card';
    var title = document.createElement('div');
    title.id = 'unplugged-popover-title';
    title.textContent = 'Welcome to unplugged';
    var close = document.createElement('button');
    close.id = 'unplugged-popover-close';
    close.textContent = 'Close';
    close.addEventListener('click', function () { try { backdrop.remove(); } catch (e) {} });
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) { try { backdrop.remove(); } catch (err) {} } });
    card.appendChild(title);
    card.appendChild(close);
    backdrop.appendChild(card);
    document.body.appendChild(backdrop);
    sessionStorage.setItem('__unplugged_welcome_shown', '1');
    dbg('showPopover: appended to body');
  }
  function onRouteChange(cb) {
    try {
      var lastUrl = location.href;
      var push = history.pushState;
      var replace = history.replaceState;
      history.pushState = function() { push.apply(this, arguments); if (lastUrl !== location.href) { lastUrl = location.href; try { cb(); } catch (e) {} } };
      history.replaceState = function() { replace.apply(this, arguments); if (lastUrl !== location.href) { lastUrl = location.href; try { cb(); } catch (e) {} } };
      window.addEventListener('popstate', function(){ if (lastUrl !== location.href) { lastUrl = location.href; try { cb(); } catch (e) {} } });
    } catch (e) {}
  }
  function whenReady(fn) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', function once() {
        document.removeEventListener('DOMContentLoaded', once);
        fn();
      });
    }
  }
  function tryUntilBody(timeoutMs) {
    var start = Date.now();
    (function tick() {
      if (document.body) { showPopover(false); return; }
      if (Date.now() - start > timeoutMs) { return; }
      setTimeout(tick, 100);
    })();
  }
  whenReady(function() { tryUntilBody(5000); });
  window.addEventListener('load', function() { try { showPopover(false); } catch (e) {} });
  onRouteChange(function(){ try { showPopover(false); } catch (e) {} });
  // Force fallback: if not shown after a few seconds, try once ignoring session flag
  setTimeout(function(){
    try {
      if (!document.getElementById('unplugged-popover-backdrop') && sessionStorage.getItem('__unplugged_welcome_shown') !== '1') {
        dbg('force fallback show');
        showPopover(true);
      }
    } catch (e) {}
  }, 4000);
  try {
    var mo = new MutationObserver(function(muts) {
      // If new nodes added and popover not shown yet, attempt again
      if (sessionStorage.getItem('__unplugged_welcome_shown') !== '1') {
        try { showPopover(false); } catch (e) {}
      }
    });
    if (document.documentElement) {
      mo.observe(document.documentElement, { childList: true, subtree: true });
      // Stop observing once shown to avoid overhead
      var stopIfShown = setInterval(function(){
        if (sessionStorage.getItem('__unplugged_welcome_shown') === '1') {
          try { mo.disconnect(); } catch (e) {}
          clearInterval(stopIfShown);
        }
      }, 1000);
    }
  } catch (e) {}
} catch (e) {}
})(); true;
`;


