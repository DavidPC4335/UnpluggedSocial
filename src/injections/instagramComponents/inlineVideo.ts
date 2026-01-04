export const id = 'inlineVideo';

export const styles = ``;

export function install() {
	function dbg(msg: string) {
		try { (window as any).ReactNativeWebView?.postMessage?.('[IG] inlineVideo: ' + msg); } catch {}
	}

	function ensureInline(video: HTMLVideoElement) {
		try {
			video.setAttribute('playsinline', 'true');
			(video as any).playsInline = true;
			video.setAttribute('webkit-playsinline', 'true');
			// Some UIs rely on controls for gestures; leave controls as-is.
		} catch {}
	}

	function scan() {
		try {
			const vids = document.querySelectorAll('video') as NodeListOf<HTMLVideoElement>;
			vids.forEach(ensureInline);
		} catch {}
	}

	// Patch fullscreen APIs to no-op
	try {
		const E = (Element as any).prototype;
		if (E.requestFullscreen) {
			const orig = E.requestFullscreen;
			E.requestFullscreen = function () { dbg('blocked requestFullscreen'); return Promise.resolve(); };
			(E.requestFullscreen as any)._unpluggedPatched = true;
		}
	} catch {}
	try {
		const HV = (HTMLVideoElement as any).prototype;
		if (HV.webkitEnterFullscreen) {
			HV.webkitEnterFullscreen = function () { dbg('blocked webkitEnterFullscreen'); };
		}
		if (HV.enterFullscreen) {
			HV.enterFullscreen = function () { dbg('blocked enterFullscreen'); };
		}
	} catch {}

	// If fullscreen is somehow triggered, try to exit immediately
	try {
		document.addEventListener('fullscreenchange', () => {
			try {
				if (document.fullscreenElement && document.exitFullscreen) {
					document.exitFullscreen().catch(() => {});
					dbg('exited fullscreen');
				}
			} catch {}
		});
	} catch {}

	// Run now, on ready, and observe DOM
	sanitize();
	if (document.readyState === 'loading') {
		const once = () => { document.removeEventListener('DOMContentLoaded', once); scan(); };
		document.addEventListener('DOMContentLoaded', once);
	}
	window.addEventListener('load', () => { scan(); });

	const mo = new MutationObserver(() => { scan(); });
	try {
		mo.observe(document.documentElement, { childList: true, subtree: true });
	} catch {}
}


