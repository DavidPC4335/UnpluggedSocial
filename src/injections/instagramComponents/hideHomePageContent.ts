export const id = 'hideHomePageContent';

export const styles = `
#unplugged-home-replacement{
	width:100%;
	min-height:60vh;
	background:#0b0b0b;
	color:#ffffff;
	display:flex;
	align-items:center;
	justify-content:center;
	text-align:center;
	font-size:28px;
	font-weight:800;
	font-family:-apple-system,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
	box-sizing:border-box;
	padding:24px;
    border:1px solid #ffffff;
}
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Resolved by esbuild loader as JSON at build time
import MESSAGES from '../../documents/inspirationalMessages.json';

export function install() {
	function dbg(msg: string) {
		try { (window as any).ReactNativeWebView?.postMessage?.('[IG] hideHomePageContent: ' + msg); } catch {}
	}

	function isHomePath(): boolean {
		try {
			const path = (location.pathname || '').replace(/\/+$/, '');
			// Home is '' or '/' (normalize)
			return path === '';
		} catch {
			return false;
		}
	}

	function shouldReplaceArticle(article: HTMLElement): boolean {
		try {
			// Avoid reprocessing our own replacements
			if (article.id === 'unplugged-home-replacement' || article.getAttribute('data-unplugged') === '1') return false;
			const text = (article.textContent || '').toLowerCase();
			return text.includes('follow') || text.includes('sponsored');
		} catch {
			return false;
		}
	}

	function replaceArticle(article: HTMLElement) {
		try {
			const replacement = document.createElement('article');
			replacement.id = 'unplugged-home-replacement';
			replacement.setAttribute('data-unplugged', '1');
			try {
				const list: string[] = (MESSAGES as any) || [];
				const msg = list && list.length ? list[Math.floor(Math.random() * list.length)] : 'Go outside.';
				replacement.textContent = msg;
			} catch {
				replacement.textContent = 'Go outside.';
			}
			article.replaceWith(replacement);
		} catch {}
	}

	function scan(): boolean {
		if (!isHomePath()) return false;
		let acted = false;
		try {
			const articles = document.querySelectorAll('article') as NodeListOf<HTMLElement>;
			articles.forEach((a) => {
				if (shouldReplaceArticle(a)) {
					replaceArticle(a);
					acted = true;
				}
			});
		} catch {}
		if (acted) dbg('replaced some recommended/sponsored articles');
		return acted;
	}

	// Run now, on ready/load
	scan();
	if (document.readyState === 'loading') {
		const once = () => { document.removeEventListener('DOMContentLoaded', once); scan(); };
		document.addEventListener('DOMContentLoaded', once);
	}
	window.addEventListener('load', () => { scan(); });

	// Observe DOM changes (new posts injected)
	try {
		const mo = new MutationObserver(() => { scan(); });
		mo.observe(document.documentElement, { childList: true, subtree: true });
	} catch {}

	// Hook SPA navigations to rescan on route changes
	try {
		let lastHref = location.href;
		const invoke = () => { scan(); setTimeout(scan, 250); setTimeout(scan, 750); };
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



