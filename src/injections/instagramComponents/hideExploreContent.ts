export const id = 'hideExploreContent';

export const styles = `
#unplugged-explore-replacement{
	width:100%;
	min-height:100vh;
	background:#0b0b0b;
	color:#ffffff;
	display:flex;
	align-items:center;
	justify-content:center;
	text-align:center;
	font-size:32px;
	font-weight:800;
	font-family:-apple-system,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
	padding:24px;
	box-sizing:border-box;
	border-radius:12px;
}
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Resolved by esbuild loader as JSON at build time
import MESSAGES from '../../documents/inspirationalMessages.json';

export function install() {
	function dbg(msg: string) {
		try { (window as any).ReactNativeWebView?.postMessage?.('[IG] hideExploreContent: ' + msg); } catch {}
	}

	function isExplorePath(): boolean {
		try {
			const path = location.pathname || '';
			return path === '/explore/' || path === '/explore' || path.startsWith('/explore/');
		} catch {
			return false;
		}
	}

	function replaceExploreGrid(): boolean {
		if (!isExplorePath()) return false;
		// If we've already replaced it, we're done.
		if (document.getElementById('unplugged-explore-replacement')) return true;

		try {
			// Prefer a presentation container within the main content
			const root = (document.querySelector('main') as HTMLElement) || document.body;
			const pres = root.querySelector('div[role="presentation"]') as HTMLElement | null;
			if (!pres || !pres.parentElement) return false;

			const replacement = document.createElement('div');
			replacement.id = 'unplugged-explore-replacement';
			try {
				const list: string[] = (MESSAGES as any) || [];
				const msg = list && list.length ? list[Math.floor(Math.random() * list.length)] : 'Go outside.';
				replacement.textContent = msg;
			} catch {
				replacement.textContent = 'Go outside.';
			}

			pres.parentElement.replaceChild(replacement, pres);
			dbg('presentation replaced');
			return true;
		} catch {
			return false;
		}
	}

	// Run immediately, on DOM ready, and on load
	replaceExploreGrid();
	if (document.readyState === 'loading') {
		const once = () => { document.removeEventListener('DOMContentLoaded', once); replaceExploreGrid(); };
		document.addEventListener('DOMContentLoaded', once);
	}
	window.addEventListener('load', () => { replaceExploreGrid(); });

	// Observe DOM for SPA updates
	try {
		const mo = new MutationObserver(() => { replaceExploreGrid(); });
		mo.observe(document.documentElement, { childList: true, subtree: true });
	} catch {}

	// Hook into SPA navigations
	try {
		let lastHref = location.href;
		const invoke = () => { replaceExploreGrid(); setTimeout(replaceExploreGrid, 250); setTimeout(replaceExploreGrid, 750); };
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



