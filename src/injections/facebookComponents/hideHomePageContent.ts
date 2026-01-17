export const id = 'hideHomePageContent';

export const styles = `
#unplugged-fb-replacement{
	width:100%;
	min-height:50vh;
	background:#18191a;
	color:#e4e6eb;
	display:flex;
	align-items:center;
	justify-content:center;
	text-align:center;
	font-size:24px;
	font-weight:700;
	font-family:-apple-system,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
	box-sizing:border-box;
	padding:24px;
	border:1px solid #3e4042;
	border-radius:8px;
	margin:8px;
}
`;

// Keywords used to identify content to replace
const FILTER_KEYWORDS = ['sponsored', 'follow','join'];

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Resolved by esbuild loader as JSON at build time
import MESSAGES from '../../documents/inspirationalMessages.json';

export function install() {
	function dbg(msg: string) {
		try { (window as any).ReactNativeWebView?.postMessage?.('[FB] hideHomePageContent: ' + msg); } catch {}
	}

	function shouldReplacePost(post: HTMLElement): boolean {
		try {
			// Avoid reprocessing our own replacements
			if (post.id === 'unplugged-fb-replacement' || post.getAttribute('data-unplugged') === '1') return false;
			
			const text = (post.textContent || '').toLowerCase();
			return FILTER_KEYWORDS.some(keyword => text.includes(keyword));
		} catch {
			return false;
		}
	}

	function replacePost(post: HTMLElement) {
		try {
			const replacement = document.createElement('div');
			replacement.id = 'unplugged-fb-replacement';
			replacement.setAttribute('data-unplugged', '1');
			replacement.setAttribute('data-mcomponent', 'MContainer');
			replacement.setAttribute('data-type', 'container');
			
			try {
				const list: string[] = (MESSAGES as any) || [];
				const msg = list && list.length ? list[Math.floor(Math.random() * list.length)] : 'Go outside.';
				replacement.textContent = msg;
			} catch {
				replacement.textContent = 'Go outside.';
			}
			
			post.replaceWith(replacement);
		} catch {}
	}

	function scan(): boolean {
		let acted = false;
		try {
			// Target the main post containers (feed posts with data-dcm-id)
			const feedPosts = document.querySelectorAll('div[data-mcomponent="MContainer"][data-dcm-id]') as NodeListOf<HTMLElement>;
			
			feedPosts.forEach((post) => {
				if (shouldReplacePost(post)) {
					replacePost(post);
					acted = true;
				}
			});
			
			// Also target marketplace posts (with data-tracking-duration-id)
			const marketplacePosts = document.querySelectorAll('div[data-mcomponent="MContainer"][data-tracking-duration-id]') as NodeListOf<HTMLElement>;
			
			marketplacePosts.forEach((post) => {
				if (shouldReplacePost(post)) {
					replacePost(post);
					acted = true;
				}
			});
		} catch {}
		
		if (acted) dbg('replaced some sponsored/follow/marketplace posts');
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
