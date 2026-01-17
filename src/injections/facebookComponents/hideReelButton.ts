export const id = 'hideReelButton';

export const styles = `
div[data-unplugged-reel-disabled] {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}
div[data-unplugged-reel-disabled] svg {
  width: 24px;
  height: 24px;
  display: block;
  vertical-align: middle;
  padding-top: 8px;
}
.unplugged-reel-message {
  background: #18191a;
  color: #e4e6eb;
  padding: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  font-family: -apple-system, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
  border: 1px solid #3e4042;
  border-radius: 6px;
  margin: 4px;
}
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Resolved by esbuild loader as text
import PLUG_SVG from '../../../assets/plug.svg';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Resolved by esbuild loader as JSON at build time
import MESSAGES from '../../documents/inspirationalMessages.json';

export function install() {
	function dbg(msg: string) {
		try { (window as any).ReactNativeWebView?.postMessage?.('[FB] hideReelButton: ' + msg); } catch {}
	}

	function removeReelJewels() {
		try {
			// Find the jewel container - it's a div with data-actual-height="34" that contains jewel elements
			const jewelContainers = document.querySelectorAll('div[data-mcomponent="MContainer"][data-actual-height="34"]') as NodeListOf<HTMLElement>;
			
			Array.from(jewelContainers).forEach((container) => {
				// Check if this container has jewel-related content
				const hasJewelContent = container.querySelector('[data-hidden-ref-key*="reels.pill.jewel"], [data-markup-text-ref-key*="reels.pill.jewel"]');
				
				if (hasJewelContent) {
					try {
						container.remove();
					} catch {}
				}
			});
		} catch {}
	}

	function replaceReelButton() {
		let replaced = false;
		try {
			// Type 1: Find containers with the reel icon character "󲀠"
			const containers48 = document.querySelectorAll('div[data-mcomponent="MContainer"][data-actual-height="48"]') as NodeListOf<HTMLElement>;
			
			Array.from(containers48).forEach((container) => {
				// Skip if already replaced
				if (container.getAttribute('data-unplugged-reel-disabled') === '1') return;
				
				// Check if this container has the characteristic reel icon "󲀠"
				const text = (container.textContent || '').trim();
				if (text.includes('󲀠')) {
					// Clear the content
					while (container.firstChild) {
						container.removeChild(container.firstChild);
					}
					
					// Insert plug SVG
					container.insertAdjacentHTML('afterbegin', PLUG_SVG);
					
					// Mark as replaced
					container.setAttribute('data-unplugged-reel-disabled', '1');
					container.setAttribute('aria-label', 'Reels disabled');
					container.setAttribute('title', 'Reels disabled');
					
					// Disable any click events
					container.addEventListener('click', function (e: Event) {
						try { 
							e.preventDefault(); 
							e.stopPropagation(); 
						} catch {}
					}, { capture: true });
					
					// Also try to disable on parent elements that might handle the click
					const parent = container.parentElement;
					if (parent && !parent.getAttribute('data-unplugged-click-disabled')) {
						parent.setAttribute('data-unplugged-click-disabled', '1');
						parent.addEventListener('click', function (e: Event) {
							try { 
								e.preventDefault(); 
								e.stopPropagation(); 
							} catch {}
						}, { capture: true });
                        //get parent of parent
                        const parentOfParent = parent.parentElement;
                        if (parentOfParent && !parentOfParent.getAttribute('data-unplugged-reel-replaced')) {
                           // Check if there are images to remove
                           const images = parentOfParent.querySelectorAll('img');
                           
                           if (images.length > 0) {
                               parentOfParent.setAttribute('data-unplugged-reel-replaced', '1');
                               
                               // Clear existing content
                               while (parentOfParent.firstChild) {
                                   parentOfParent.removeChild(parentOfParent.firstChild);
                               }
                               
                               // Create message element
                               const messageDiv = document.createElement('div');
                               messageDiv.className = 'unplugged-reel-message';
                               messageDiv.setAttribute('data-unplugged', '1');
                               
                               try {
                                   const list: string[] = (MESSAGES as any) || [];
                                   const msg = list && list.length ? list[Math.floor(Math.random() * list.length)] : 'Reels disabled.';
                                   messageDiv.textContent = msg;
                               } catch {
                                   messageDiv.textContent = 'Reels disabled.';
                               }
                               
                               parentOfParent.appendChild(messageDiv);
                           }
                        }
					}
					
					dbg('replaced reel button (type 1)');
					replaced = true;
				}
			});
			
			// Type 2: Find buttons with aria-label="Reels" or containing "Reels" text
			const reelButtons = document.querySelectorAll('div[role="button"][aria-label="Reels"], div[role="button"][data-mcomponent="MContainer"]') as NodeListOf<HTMLElement>;
			
			Array.from(reelButtons).forEach((button) => {
				// Skip if already replaced
				if (button.getAttribute('data-unplugged-reel-disabled') === '1') return;
				
				// Check if this is a Reels button
				const ariaLabel = button.getAttribute('aria-label') || '';
				const text = (button.textContent || '').trim();
				
				if (ariaLabel.toLowerCase() === 'reels' || text === 'Reels') {
					// Clear the content
					while (button.firstChild) {
						button.removeChild(button.firstChild);
					}
					
					// Insert plug SVG
					button.insertAdjacentHTML('afterbegin', PLUG_SVG);
					
					// Mark as replaced
					button.setAttribute('data-unplugged-reel-disabled', '1');
					button.setAttribute('aria-label', 'Reels disabled');
					button.setAttribute('title', 'Reels disabled');
					
					// Disable any click events
					button.addEventListener('click', function (e: Event) {
						try { 
							e.preventDefault(); 
							e.stopPropagation(); 
						} catch {}
					}, { capture: true });
					

                  
					dbg('replaced reel button (type 2)');
					replaced = true;
				}
			});
			
			return replaced;
		} catch {
			return false;
		}
	}

	// Try immediately, on DOM ready, and on load
	replaceReelButton();
	removeReelJewels();
	if (document.readyState === 'loading') {
		const once = () => { 
			document.removeEventListener('DOMContentLoaded', once); 
			replaceReelButton();
			removeReelJewels();
		};
		document.addEventListener('DOMContentLoaded', once);
	}
	window.addEventListener('load', () => { 
		replaceReelButton();
		removeReelJewels();
	});

	// Observe DOM continuously for SPA/nav changes
	try {
		const observer = new MutationObserver(() => {
			replaceReelButton();
			removeReelJewels();
		});
		observer.observe(document.documentElement, { childList: true, subtree: true });
	} catch {}

	// Hook into SPA navigation changes
	try {
		let lastHref = location.href;
		const invoke = () => {
			replaceReelButton();
			removeReelJewels();
			setTimeout(() => {
				replaceReelButton();
				removeReelJewels();
			}, 250);
			setTimeout(() => {
				replaceReelButton();
				removeReelJewels();
			}, 750);
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
