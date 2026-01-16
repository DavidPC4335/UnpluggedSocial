export const id = 'welcomePopover';

export const styles = `
#unplugged-popover-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:2147483647;display:flex;align-items:center;justify-content:center;}
#unplugged-popover-card{background:#fff;color:#000;border-radius:12px;padding:16px 20px;font-family:-apple-system,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:16px;box-shadow:0 10px 30px rgba(0,0,0,0.2);max-width:80vw;text-align:center;}
#unplugged-popover-title{font-weight:600;margin-bottom:8px;font-size:22px;}
#unplugged-popover-link{display:block;margin:4px 0 8px;font-size:12px;color:#1a5fd6;text-decoration:underline;}
#unplugged-popover-close{margin-top:12px;display:inline-block;padding:8px 12px;background:#111;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;}
`;

export function install() {
  try {
    if ((window as any).ReactNativeWebView?.postMessage) {
      (window as any).ReactNativeWebView.postMessage('[IG] welcomePopover: install start');
    }
  } catch {}

  function show(force = false) {
    try {
      if (!force && sessionStorage.getItem('__unplugged_welcome_shown') === '1') return;
    } catch {}
    if (!document.body) return;
    if (document.getElementById('unplugged-popover-backdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.id = 'unplugged-popover-backdrop';
    const card = document.createElement('div');
    card.id = 'unplugged-popover-card';
    const title = document.createElement('div');
    title.id = 'unplugged-popover-title';
    title.textContent = 'Welcome to unplugged';
    const link = document.createElement('a');
    link.id = 'unplugged-popover-link';
    link.textContent = 'Learn more about the project';
    link.href = 'http://unpluggedsocials.com';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const close = document.createElement('button');
    close.id = 'unplugged-popover-close';
    close.textContent = 'Close';
    close.addEventListener('click', () => { try { backdrop.remove(); } catch {} });
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) { try { backdrop.remove(); } catch {} } });
    card.appendChild(title);
    card.appendChild(link);
    card.appendChild(close);
    backdrop.appendChild(card);
    document.body.appendChild(backdrop);
    try { sessionStorage.setItem('__unplugged_welcome_shown', '1'); } catch {}
  }

  if (document.readyState === 'loading') {
    const once = () => { document.removeEventListener('DOMContentLoaded', once); show(false); };
    document.addEventListener('DOMContentLoaded', once);
  } else {
    show(false);
  }

  window.addEventListener('load', () => { try { show(false); } catch {} });
  try {
    const mo = new MutationObserver(() => {
      try {
        if (sessionStorage.getItem('__unplugged_welcome_shown') !== '1') show(false);
      } catch {}
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    const stop = setInterval(() => {
      try {
        if (sessionStorage.getItem('__unplugged_welcome_shown') === '1') {
          mo.disconnect();
          clearInterval(stop);
        }
      } catch {}
    }, 1000);
  } catch {}
}


