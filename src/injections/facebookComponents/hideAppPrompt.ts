export const id = 'hideAppPrompt';

export const styles = ``;

// Keywords to identify app download prompts
// Add or remove keywords here to customize what gets removed
const APP_PROMPT_KEYWORDS = [
	'facebook is better on the app',
	'get the latest updates',
	'get app',
	'open app',
	'not now'
];

export function install() {
	function dbg(msg: string) {
		try { (window as any).ReactNativeWebView?.postMessage?.('[FB] hideAppPrompt: ' + msg); } catch {}
	}

	function shouldRemoveElement(element: HTMLElement): boolean {
		try {
			// Check if this is the app prompt modal
			// Look for the fixed-container bottom class and specific content
			if (element.classList.contains('fixed-container') && element.classList.contains('bottom')) {
				const text = (element.textContent || '').toLowerCase();
				// Check if the element contains any of our keywords
				const hasKeyword = APP_PROMPT_KEYWORDS.some(keyword => text.includes(keyword));
				if (hasKeyword) {
					return true;
				}
			}
			
			// Also check for divs with data-mcomponent that contain the prompt text
			if (element.hasAttribute('data-mcomponent')) {
				const text = (element.textContent || '').toLowerCase();
				const hasKeyword = APP_PROMPT_KEYWORDS.some(keyword => text.includes(keyword));
				if (hasKeyword) {
					return true;
				}
			}
			
			return false;
		} catch {
			return false;
		}
	}

	function removeAppPrompts(): boolean {
		let removed = false;
		try {
			// Find all potential app prompt containers
			const candidates = document.querySelectorAll('div[class*="fixed-container"]') as NodeListOf<HTMLElement>;
			candidates.forEach((element) => {
				if (shouldRemoveElement(element)) {
					element.remove();
					removed = true;
				}
			});
			
			// Also scan for any divs with data-mcomponent that might be the prompt
			const mComponents = document.querySelectorAll('div[data-mcomponent]') as NodeListOf<HTMLElement>;
			mComponents.forEach((element) => {
				if (shouldRemoveElement(element)) {
					element.remove();
					removed = true;
				}
			});
		} catch {}
		
		if (removed) dbg('removed app download prompt');
		return removed;
	}

	// Run immediately
	removeAppPrompts();
	
	// Run on DOM ready
	if (document.readyState === 'loading') {
		const once = () => { 
			document.removeEventListener('DOMContentLoaded', once); 
			removeAppPrompts(); 
		};
		document.addEventListener('DOMContentLoaded', once);
	}
	
	// Run on window load
	window.addEventListener('load', () => { removeAppPrompts(); });

	// Watch for DOM changes (prompts can appear dynamically)
	try {
		const mo = new MutationObserver(() => { 
			removeAppPrompts(); 
		});
		mo.observe(document.documentElement, { childList: true, subtree: true });
	} catch {}

	// Also check periodically as a fallback (some sites inject modals in tricky ways)
	setInterval(() => { removeAppPrompts(); }, 2000);
}
