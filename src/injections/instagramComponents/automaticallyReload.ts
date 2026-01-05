export const id = 'automaticallyReload';

export const styles = ``;

export function install() {
	function dbg(msg: string) {
		try { (window as any).ReactNativeWebView?.postMessage?.('[IG] automaticallyReload: ' + msg); } catch {}
	}

	function findReloadButton(): HTMLElement | null {
		try {
			const buttons = document.querySelectorAll('div[role="button"]');
			for (let i = 0; i < buttons.length; i++) {
				const button = buttons[i] as HTMLElement;
				const text = (button.textContent || '').trim();
				if (text === 'Reload page' || text.toLowerCase() === 'reload page') {
					return button;
				}
			}
			return null;
		} catch {
			return null;
		}
	}

	function checkAndReload(): boolean {
		try {
			const button = findReloadButton();
			if (button) {
				dbg('Reload page button found, reloading...');
				window.location.reload();
				return true;
			}
			return false;
		} catch {
			return false;
		}
	}

	// Try immediately, on DOM ready, and on load
	checkAndReload();
	if (document.readyState === 'loading') {
		const once = () => { document.removeEventListener('DOMContentLoaded', once); checkAndReload(); };
		document.addEventListener('DOMContentLoaded', once);
	}
	window.addEventListener('load', () => { checkAndReload(); });

	// Observe DOM continuously for SPA/nav changes
	const observer = new MutationObserver(() => {
		checkAndReload();
	});
	try {
		observer.observe(document.documentElement, { childList: true, subtree: true });
	} catch {}

	// Hook into SPA navigation changes
	try {
		let lastHref = location.href;
		const invoke = () => {
			checkAndReload();
			setTimeout(checkAndReload, 250);
			setTimeout(checkAndReload, 750);
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

