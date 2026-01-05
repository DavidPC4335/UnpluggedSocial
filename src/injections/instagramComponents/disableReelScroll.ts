export const id = 'disableReelScroll';

export const styles = `
#unplugged-reels-scroll-blocker {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 999999;
	background: transparent;
	pointer-events: none;
	touch-action: none;
	overflow: hidden;
}
#unplugged-scroll-message {
	position: fixed;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%) translateY(100%);
	background: #0b0b0b;
	color: #ffffff;
	padding: 16px 24px;
	border-radius: 12px 12px 0 0;
	font-size: 18px;
	font-weight: 600;
	font-family: -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
	z-index: 1000000;
	box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3);
	transition: transform 0.3s ease-out;
	pointer-events: none;
	border-top: 2px solid #ffffff;
}
#unplugged-scroll-message.show {
	transform: translateX(-50%) translateY(0);
}
`;

export function install() {
	function dbg(msg: string) {
		try { (window as any).ReactNativeWebView?.postMessage?.('[IG] disableReelScroll: ' + msg); } catch {}
	}

	function isHomePath(): boolean {
		try {
			const path = (location.pathname || '').replace(/\/+$/, '');
			// Home is '' or '/' (normalize)
			return path === '' || path === '/';
		} catch {
			return false;
		}
	}

	function isReelsPath(): boolean {
		try {
			const path = location.pathname || '';
			return path === '/reels/' || path === '/reels' || path.startsWith('/reels/');
		} catch {
			return false;
		}
	}

	function hasReelVideoTags(): boolean {
		try {
			const videos = document.querySelectorAll('video[playsinline][preload="none"]');
			for (let i = 0; i < videos.length; i++) {
				const video = videos[i] as HTMLVideoElement;
				const src = video.getAttribute('src') || '';
				// Check if it's an Instagram CDN video
				if (src.includes('cdninstagram.com') || src.includes('instagram.com')) {
					return true;
				}
			}
			return false;
		} catch {
			return false;
		}
	}

	function shouldDisableScroll(): boolean {
		// Don't disable scroll on homepage
		if (isHomePath()) return false;
		return isReelsPath() || hasReelVideoTags();
	}

	let scrollPreventHandlers: Array<{ event: string; handler: (e: Event) => void; options?: boolean | AddEventListenerOptions }> = [];
	let scrollMessageTimeout: number | null = null;

	function createScrollMessage(): HTMLElement {
		let message = document.getElementById('unplugged-scroll-message');
		if (!message) {
			message = document.createElement('div');
			message.id = 'unplugged-scroll-message';
			message.textContent = 'Naughty Naughty!';
			message.setAttribute('data-unplugged', '1');
			document.body.appendChild(message);
		}
		return message;
	}

	function showScrollMessage(): void {
		try {
			const message = createScrollMessage();
			message.classList.add('show');
			
			// Clear existing timeout if any
			if (scrollMessageTimeout !== null) {
				clearTimeout(scrollMessageTimeout);
			}
			
			// Hide message after 3 seconds
			scrollMessageTimeout = window.setTimeout(() => {
				if (message) {
					message.classList.remove('show');
				}
			}, 3000);
		} catch {}
	}

	function preventScroll(e: Event): void {
		e.preventDefault();
		e.stopPropagation();
		showScrollMessage();
	}

	function createScrollBlocker(): HTMLElement {
		const blocker = document.createElement('div');
		blocker.id = 'unplugged-reels-scroll-blocker';
		blocker.setAttribute('data-unplugged', '1');
		return blocker;
	}

	function disableScroll(): boolean {
		if (!shouldDisableScroll()) return false;
		// If blocker already exists, we're done
		if (document.getElementById('unplugged-reels-scroll-blocker')) return true;

		try {
			const blocker = createScrollBlocker();
			document.body.appendChild(blocker);
			// Also prevent scroll on body/html
			document.body.style.overflow = 'hidden';
			document.documentElement.style.overflow = 'hidden';
			
			// Add event listeners to prevent scroll while allowing clicks
			const events = ['wheel', 'touchmove', 'scroll'];
			const options = { passive: false, capture: true };
			
			for (const eventType of events) {
				const handler = (e: Event) => {
					if (shouldDisableScroll()) {
						preventScroll(e);
					}
				};
				document.addEventListener(eventType, handler, options);
				window.addEventListener(eventType, handler, options);
				scrollPreventHandlers.push({ event: eventType, handler, options: options as AddEventListenerOptions });
			}
			
			dbg('scroll blocker added');
			return true;
		} catch {
			return false;
		}
	}

	function enableScroll(): boolean {
		if (shouldDisableScroll()) return false;
		let acted = false;
		try {
			const blocker = document.getElementById('unplugged-reels-scroll-blocker');
			if (blocker) {
				blocker.remove();
				acted = true;
			}
			
			// Remove scroll message if it exists
			const message = document.getElementById('unplugged-scroll-message');
			if (message) {
				message.remove();
			}
			if (scrollMessageTimeout !== null) {
				clearTimeout(scrollMessageTimeout);
				scrollMessageTimeout = null;
			}
			
			// Remove scroll prevention event listeners
			for (const { event, handler, options } of scrollPreventHandlers) {
				try {
					document.removeEventListener(event, handler, options);
					window.removeEventListener(event, handler, options);
				} catch {}
			}
			scrollPreventHandlers = [];
			
			// Restore scroll on body/html
			document.body.style.overflow = '';
			document.documentElement.style.overflow = '';
			if (acted) dbg('scroll blocker removed');
			return acted;
		} catch {
			return false;
		}
	}

	function updateScrollState(): void {
		if (shouldDisableScroll()) {
			disableScroll();
		} else {
			enableScroll();
		}
	}

	// Run immediately, on DOM ready, and on load
	updateScrollState();
	if (document.readyState === 'loading') {
		const once = () => { document.removeEventListener('DOMContentLoaded', once); updateScrollState(); };
		document.addEventListener('DOMContentLoaded', once);
	}
	window.addEventListener('load', () => { updateScrollState(); });

	// Observe DOM for SPA updates
	try {
		const mo = new MutationObserver(() => { updateScrollState(); });
		mo.observe(document.documentElement, { childList: true, subtree: true });
	} catch {}

	// Hook into SPA navigations
	try {
		let lastHref = location.href;
		const invoke = () => { updateScrollState(); setTimeout(updateScrollState, 250); setTimeout(updateScrollState, 750); };
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
