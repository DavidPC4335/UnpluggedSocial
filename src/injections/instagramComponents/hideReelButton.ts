export const id = 'hideReelButton';

export const styles = `
a[href="/reels/"] {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}
a[href=""] svg {
  width: 24px ;
  height: 24px;
  display: block ;
  vertical-align: middle;
  padding-top: 8px;
}
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Resolved by esbuild loader as text
import PLUG_SVG from '../../../assets/plug.svg';

export function install() {
	function replaceReelButton() {
    try {
      const anchor = document.querySelector('a[href="/reels/"]') as HTMLAnchorElement | null;
      if (!anchor) return false;
			if (anchor.getAttribute('data-unplugged') === '1') return true;
      // Remove existing content
      while (anchor.firstChild) anchor.removeChild(anchor.firstChild);
      // Disable navigation
      anchor.setAttribute('href', '');
      anchor.setAttribute('aria-label', 'Reels disabled');
      anchor.setAttribute('title', 'Reels disabled');
      anchor.addEventListener('click', function (e) {
        try { e.preventDefault(); e.stopPropagation(); } catch {}
      }, { capture: true });
      // Insert SVG
      anchor.insertAdjacentHTML('afterbegin', PLUG_SVG);
			anchor.setAttribute('data-unplugged', '1');
      // Notify native for debugging if available
      try { (window as any).ReactNativeWebView?.postMessage?.('[IG] hideReelButton: replaced'); } catch {}
      return true;
    } catch {
      return false;
    }
  }

  // Try immediately, on DOM ready, and on load
  replaceReelButton();
  if (document.readyState === 'loading') {
    const once = () => { document.removeEventListener('DOMContentLoaded', once); replaceReelButton(); };
    document.addEventListener('DOMContentLoaded', once);
  }
  window.addEventListener('load', () => { replaceReelButton(); });

	// Observe DOM continuously for SPA/nav changes
	const observer = new MutationObserver(() => {
		replaceReelButton();
	});
  try {
    observer.observe(document.documentElement, { childList: true, subtree: true });
  } catch {}

	// Hook into SPA navigation changes
	try {
		let lastHref = location.href;
		const invoke = () => {
			replaceReelButton();
			setTimeout(replaceReelButton, 250);
			setTimeout(replaceReelButton, 750);
		};
		const wrap = <T extends (...args: any[]) => any>(fn: T) => function(this: any, ...args: Parameters<T>) {
			const res = fn.apply(this, args as any);
			if (lastHref !== location.href) { lastHref = location.href; invoke(); }
			return res;
		};
		const ps = history.pushState;
		const rs = history.replaceState;
		history.pushState = wrap(ps) as any;
		history.replaceState = wrap(rs) as any;
		window.addEventListener('popstate', () => {
			if (lastHref !== location.href) { lastHref = location.href; invoke(); }
		});
	} catch {}
}


