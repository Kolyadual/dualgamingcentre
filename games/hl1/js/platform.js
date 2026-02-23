// region Browsers

// noinspection DuplicatedCode
var platform								= typeof navigator.platform !== 'undefined' ? navigator.platform : '';
var browser									= typeof navigator.userAgent !== 'undefined' ? navigator.userAgent : '';
var version									= typeof navigator.appVersion !== 'undefined' ? navigator.appVersion : '';
var vendor									= typeof navigator.vendor !== 'undefined' ? navigator.vendor : '';
// noinspection JSUnresolvedVariable,JSUnusedGlobalSymbols
var oscpu									= typeof navigator.oscpu !== 'undefined' ? navigator.oscpu : '';

window.isWindows							= version.indexOf('Win') !== -1;
window.isMacOS								= version.indexOf('Mac') !== -1;
window.isUNIX								= version.indexOf('X11') !== -1;
window.isLinux								= version.indexOf('Linux') !== -1;
window.osName								= window.isWindows ? 'Windows' : (window.isLinux ? 'Linux' : (window.isUNIX ? 'UNIX' : (window.isMacOS ? 'Mac OS' : undefined)));
// noinspection DuplicatedCode
window.osVersion							= (function() {
	var offset, version = undefined;

	if ((offset = browser.indexOf('Windows NT')) !== -1) {
		// noinspection JSValidateTypes
		version = browser.substring(offset + 11);

		if (version.indexOf('5.0') === 0) {
			// noinspection JSValidateTypes
			version = '2000';
		} else if (version.indexOf('5.1') === 0) {
			// noinspection JSValidateTypes
			version = 'XP';
		} else if (version.indexOf('5.2') === 0) {
			// noinspection JSValidateTypes
			version = 'Server';
		} else if (version.indexOf('6.0') === 0) {
			// noinspection JSValidateTypes
			version = 'Vista';
		} else if (version.indexOf('6.1') === 0) {
			// noinspection JSValidateTypes
			version = '7';
		} else if (version.indexOf('6.2') === 0) {
			// noinspection JSValidateTypes
			version = '8';
		} else if (version.indexOf('6.3') === 0) {
			// noinspection JSValidateTypes
			version = '8.1';
		} else if (version.indexOf('10.0') === 0) {
			// noinspection JSValidateTypes
			version = '10';
		}
	}

	if ((offset = browser.indexOf('Win 9x')) !== -1) {
		// noinspection JSValidateTypes
		version = browser.substring(offset + 7);

		if (version.indexOf('4.90') === 0) {
			// noinspection JSValidateTypes
			version = 'Millennium';
		}
	}

	if (version) {
		if ((offset = version.indexOf(';')) !== -1) {
			version = version.substring(0, offset);
		}

		if ((offset = version.indexOf(' ')) !== -1) {
			version = version.substring(0, offset);
		}

		if ((offset = version.indexOf(')')) !== -1) {
			version = version.substring(0, offset);
		}
	}

	return version;
})();

window.isIE									= !window.isEdge && (browser.indexOf('MSIE') !== -1 || browser.indexOf('Trident') !== -1);
window.isNetscape							= browser.indexOf('Navigator') !== -1;
window.isKMeleon							= browser.indexOf('K-Meleon') !== -1;
window.isPaleMoon							= browser.indexOf('PaleMoon') !== -1;
window.isFirefox							= !window.isNetscape && !window.isPaleMoon && browser.indexOf('Firefox') !== -1;
window.isChrome								= browser.indexOf('Chrome') !== -1 || vendor === 'Google Inc.' || !!window.chrome;
window.isEdgeHTML							= browser.indexOf('Edge') !== -1;
window.isEdgeBlink							= window.isChrome && browser.indexOf('Edg/') !== -1;
window.isEdge								= window.isEdgeHTML || window.isEdgeBlink;
window.isChromium							= window.isChrome && !window.chrome;
window.isVivaldi							= window.isChrome && browser.indexOf('Vivaldi') !== -1;
window.isElectron							= window.isChrome && browser.indexOf('Electron') !== -1;
window.isOperaPresto						= browser.indexOf('Opera') !== -1;
window.isOperaBlink							= window.isChrome && browser.indexOf('OPR') !== -1;
window.isOpera								= window.isOperaPresto || window.isOperaBlink;
window.isSafari								= browser.indexOf('Safari') !== -1 || vendor === 'Apple Computer, Inc.';
window.isOther								= !(window.isIE && window.isEdge && window.isFirefox && window.isChrome && window.isOpera && window.isSafari);

window.isBrowser							= !!(typeof window === 'object' && typeof navigator === 'object' && document);
window.isWorker								= typeof importScripts === 'function' && typeof postMessage === 'function' && !window.isBrowser;
window.isNode								= typeof process === 'object' && typeof require === 'function' && !window.isBrowser && !window.isWorker;
window.isShell								= !(window.isBrowser && window.isWorker && window.isNode);
window.environment							= window.isBrowser ? 'Browser' : (window.isWorker ? 'Worker' : (window.isNode ? 'Node' : 'Shell'));
window.browserName							= window.isEdge ? 'Microsoft Edge' : (window.isIE ? 'Microsoft Internet Explorer' : (window.isNetscape ? 'Netscape Navigator' : (window.isKMeleon ? 'K-Meleon' : (window.isPaleMoon ? 'PaleMoon' : (window.isFirefox ? 'Mozilla Firefox' : (window.isOpera ? 'Opera' : (window.isElectron ? 'Electron' : (window.isVivaldi ? 'Vivaldi' : (window.isChromium ? 'Chromium' : (window.isChrome ? 'Google Chrome' : (window.isSafari ? 'Apple Safari' : undefined)))))))))));
// noinspection DuplicatedCode
window.browserVersion						= (function() {
	var offset, version = undefined;

	if ((offset = browser.indexOf('Opera')) !== -1) {
		// noinspection JSValidateTypes
		version = browser.substring(offset + 6);

		if ((offset = browser.indexOf('Version')) !== -1) {
			// noinspection JSValidateTypes
			version = browser.substring(offset + 8);
		}
	} else if ((offset = browser.indexOf('OPR')) !== -1) {
		// noinspection JSValidateTypes
		version = browser.substring(offset + 4);
	} else if ((offset = browser.indexOf('Edg/')) !== -1) {
		// noinspection JSValidateTypes
		version = browser.substring(offset + 4);
	} else if ((offset = browser.indexOf('Edge')) !== -1) {
		// noinspection JSValidateTypes
		version = browser.substring(offset + 5);
	} else if ((offset = browser.indexOf('MSIE')) !== -1) {
		// noinspection JSValidateTypes
		version = browser.substring(offset + 5);
	} else if ((offset = browser.indexOf('Trident') !== -1)) {
		// noinspection JSValidateTypes
		version = browser.substring(offset + 5);

		if ((offset = browser.indexOf('rv:')) !== -1) {
			// noinspection JSValidateTypes
			version = browser.substring(offset + 3);
		}
	} else if ((offset = browser.indexOf('Vivaldi')) !== -1) {
		// noinspection JSValidateTypes
		version = browser.substring(offset + 8);
	} else if ((offset = browser.indexOf('Chrome')) !== -1) {
		// noinspection JSValidateTypes
		version = browser.substring(offset + 7);
	} else if ((offset = browser.indexOf('Safari')) !== -1) {
		// noinspection JSValidateTypes
		version = browser.substring(offset + 7);

		if ((offset = browser.indexOf('Version')) !== -1) {
			// noinspection JSValidateTypes
			version = browser.substring(offset + 8);
		}
	} else if ((offset = browser.indexOf('K-Meleon')) !== -1) {
		// noinspection JSValidateTypes
		version = browser.substring(offset + 9);
	} else if ((offset = browser.indexOf('Navigator')) !== -1) {
		// noinspection JSValidateTypes
		version = browser.substring(offset + 10);
	} else if ((offset = browser.indexOf('PaleMoon')) !== -1) {
		// noinspection JSValidateTypes
		version = browser.substring(offset + 9);
	} else if ((offset = browser.indexOf('Firefox')) !== -1) {
		// noinspection JSValidateTypes
		version = browser.substring(offset + 8);
	} else if ((browser.lastIndexOf(' ') + 1) < (offset = browser.lastIndexOf('/'))) {
		// noinspection JSValidateTypes
		version = browser.substring(offset + 1);
	}

	if (version) {
		if ((offset = version.indexOf(';')) !== -1) {
			version = version.substring(0, offset);
		}

		if ((offset = version.indexOf(' ')) !== -1) {
			version = version.substring(0, offset);
		}

		if ((offset = version.indexOf(')')) !== -1) {
			version = version.substring(0, offset);
		}
	}

	return version;
})();

window.isMobile								= browser.indexOf('Mobi') !== -1;
window.isDesktop							= !window.isMobile;

window.is64									= browser.indexOf('WOW64') !== -1 || browser.indexOf('Win64') !== -1 || browser.indexOf('amd64') !== -1 || browser.indexOf('x86_64') !== -1;
window.is32									= !window.is64 ? (browser.indexOf('WOW32') !== -1 || browser.indexOf('Win32') !== -1 || browser.indexOf('i386') !== -1 || browser.indexOf('i686') !== -1) : true;

// endregion