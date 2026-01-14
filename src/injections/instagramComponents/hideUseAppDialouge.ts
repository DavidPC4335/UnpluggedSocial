export const id = 'hideUseAppDialouge';

export const styles = ``;

export function install() {
	function dbg(msg: string) {
		try { (window as any).ReactNativeWebView?.postMessage?.('[IG] hideUseAppDialouge: ' + msg); } catch {}
	}

	function findElementsWithText(root: ParentNode, text: string): HTMLElement[] {
		const lc = text.toLowerCase();
		const matches: HTMLElement[] = [];
		const candidates = root.querySelectorAll<HTMLElement>('button, [role="button"], div, span');
		candidates.forEach((el) => {
			try {
				const t = (el.textContent || '').trim().toLowerCase();
				if (t === lc) matches.push(el);
			} catch {}
		});
		return matches;
	}

	function clickCloseNear(node: Element): boolean {
		try {
			const container = (node.closest('div') || document.body) as HTMLElement;
			const closeIcon = container.querySelector('svg[aria-label="Close"], svg title, svg[aria-label="close"]');
			if (closeIcon) {
				const clickable = (closeIcon.closest('[role="button"], button, [tabindex]') as HTMLElement) || (closeIcon.parentElement as HTMLElement);
				if (clickable) {
					clickable.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
					dbg('clicked close button');
					return true;
				}
			}
		} catch {}
		return false;
	}

	function removeOverlay(node: Element): boolean {
		let cur: HTMLElement | null = node as HTMLElement;
		let steps = 0;
		while (cur && steps < 10) {
			try {
				const style = cur.getAttribute('style') || '';
				if (style.indexOf('--x-width') !== -1 || style.indexOf('position: fixed') !== -1) {
					cur.remove();
					dbg('removed overlay container');
					return true;
				}
				if (cur.classList?.contains('html-div')) {
					cur.remove();
					dbg('removed html-div container');
					return true;
				}
			} catch {}
			cur = cur.parentElement;
			steps++;
		}
		return false;
	}

	function closeUseApp(): boolean {
		try {
			const buttons = findElementsWithText(document, 'Use the app');
			if (buttons.length === 0) return false;
			let acted = false;
			for (const b of buttons) {
				if (clickCloseNear(b)) { acted = true; continue; }
				if (removeOverlay(b)) { acted = true; continue; }
			}
			return acted;
		} catch {
			return false;
		}
	}

	// Try immediately and on readiness states
	closeUseApp();
	if (document.readyState === 'loading') {
		const once = () => { document.removeEventListener('DOMContentLoaded', once); closeUseApp(); };
		document.addEventListener('DOMContentLoaded', once);
	}
	window.addEventListener('load', () => { closeUseApp(); });

	// Observe DOM changes continuously
	try {
		const mo = new MutationObserver(() => { closeUseApp(); });
		mo.observe(document.documentElement, { childList: true, subtree: true });
	} catch {}

	// Hook SPA navigations
	try {
		let lastHref = location.href;
		const invoke = () => { closeUseApp(); setTimeout(closeUseApp, 250); setTimeout(closeUseApp, 750); };
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




