// noinspection ThisExpressionReferencesGlobalObjectJS,DuplicatedCode
(function() {
	// region System

	var audio									= document.createElement('audio');
	var canvas2D								= document.createElement('canvas');
	var context2D								= typeof canvas2D !== 'undefined' ? (typeof canvas2D.getContext === 'function' ? canvas2D.getContext('2d') : false) : false;
	var canvasWEBGL								= null;
	var contextWEBGL							= false;
	var canvasWEBGL2							= null;
	var contextWEBGL2							= false;

	if (context2D) {
		try {
			//TODO: try to cache results to prevent Error: WebGL warning: Exceeded 16 live WebGL contexts for this principal, losing the least recently used one.
			canvasWEBGL						= document.createElement('canvas');
			contextWEBGL					= typeof canvasWEBGL !== 'undefined' ? (typeof canvasWEBGL.getContext === 'function' ? (canvasWEBGL.getContext('webgl') || canvasWEBGL.getContext('experimental-webgl')) : false) : false;

			if (contextWEBGL) {
				canvasWEBGL2				= document.createElement('canvas');
				contextWEBGL2				= typeof canvasWEBGL2 !== 'undefined' ? (typeof canvasWEBGL2.getContext === 'function' ? (canvasWEBGL2.getContext('webgl2') || canvasWEBGL2.getContext('experimental-webgl2')) : false) : false;
			}
		} catch (e) {}
	}

	window.SYSTEM_FEATURE_WORKERS				= !!window.Worker;
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_SHARED_WORKERS		= !!window.SharedWorker;
	window.SYSTEM_FEATURE_SERVICE_WORKERS		= 'serviceWorker' in navigator;
	window.SYSTEM_FEATURE_URL_PARSER			= (function() {
		try {
			var root = window.location.protocol + '//' + window.location.host + '/';
			var url = new URL(root);

			return url.href === root;
		} catch (e) {
			return false;
		}
	})();
	window.SYSTEM_FEATURE_URL_BLOB				= SYSTEM_FEATURE_URL_PARSER && 'revokeObjectURL' in URL && 'createObjectURL' in URL;
	window.SYSTEM_FEATURE_DATA_URL				= (function() {
		function testlimit() {
			var datauribig = new Image();

			datauribig.onerror = function() {
				window.SYSTEM_FEATURE_DATA_URL = false;
			};

			datauribig.onload = function() {
				window.SYSTEM_FEATURE_DATA_URL = datauribig.width === 1 && datauribig.height === 1;
			};

			var base64str = 'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

			while (base64str.length < 63000) {
				base64str = '\r\n' + base64str;
			}

			datauribig.src = 'data:image/gif;base64,' + base64str;
		}

		var dataurl = new Image();

		dataurl.onerror = function() {
			window.SYSTEM_FEATURE_DATA_URL = false;
		};

		dataurl.onload = function() {
			if (dataurl.width === 1 && dataurl.height === 1) {
				testlimit();
			} else {
				window.SYSTEM_FEATURE_DATA_URL = false;
			}
		};

		dataurl.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
	})();
	// noinspection DuplicatedCode
	window.SYSTEM_FEATURE_TYPED_ARRAYS			= typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined' ? typeof Int8Array !== 'undefined' && typeof Uint8Array !== 'undefined' && typeof Uint8ClampedArray !== 'undefined' && typeof Int16Array !== 'undefined' && typeof Uint16Array !== 'undefined' && typeof Int32Array !== 'undefined' && typeof Uint32Array !== 'undefined' && typeof Float32Array !== 'undefined' && typeof Float64Array !== 'undefined': false;
	window.SYSTEM_FEATURE_BIGINTS				= typeof BigInt !== 'undefined' ? typeof BigInt64Array !== 'undefined' && typeof BigUint64Array !== 'undefined' : false;
	// noinspection JSUnresolvedVariable,JSUnusedGlobalSymbols,DuplicatedCode
	window.SYSTEM_FEATURE_SIMD					= typeof SIMD !== 'undefined' ? typeof SIMD.Bool16x8 !== 'undefined' && typeof SIMD.Bool32x4 !== 'undefined' && typeof SIMD.Bool8x16 !== 'undefined' && typeof SIMD.Float32x4 !== 'undefined' && typeof SIMD.Int16x8 !== 'undefined' && typeof SIMD.Int32x4 !== 'undefined' && typeof SIMD.Int8x16 !== 'undefined' && typeof SIMD.Uint32x4 !== 'undefined' && typeof SIMD.Uint8x16 !== 'undefined' : false;
	window.SYSTEM_FEATURE_ASMJS					= (function() {
		try {
			(function MyAsmModule() {
				'use asm';

				function dummy(){}

				return {dummy: dummy};
			})();
			return true;
		} catch(e) {}
		return false;
	})();
	window.SYSTEM_FEATURE_WEBASSEMBLY			= (function() {
		try {
			// noinspection JSUnresolvedVariable
			if (typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function") {
				// noinspection JSUnresolvedVariable
				var module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
				// noinspection JSUnresolvedVariable
				if (module instanceof WebAssembly.Module) {
					// noinspection JSUnresolvedVariable,JSUnresolvedFunction
					return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
				}
			}
		} catch (e) {}

		return false;
	})();
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_FULLSCREEN			= !document.documentElement.requestFullscreen ? true : !!document.documentElement.webkitRequestFullScreen || !!document.documentElement.mozRequestFullScreen || !!document.documentElement.msRequestFullscreen;
	window.SYSTEM_FEATURE_POINTER_LOCK			= 'pointerLockElement' in document ? true : 'oPointerLockElement' in document || 'msPointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_ANIMATION_FRAME		= !!window.requestAnimationFrame ? true : !!window.webkitRequestAnimationFrame || !!window.mozRequestAnimationFrame || !!window.msRequestAnimationFrame || !!window.oRequestAnimationFrame;
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_PERFORMANCE			= !!window.performance ? true : !!window.webkitPerformance || !!window.mozPerformance || !!window.msPerformance || !!window.oPerformance;
	window.SYSTEM_FEATURE_TIMERS				= SYSTEM_FEATURE_ANIMATION_FRAME && SYSTEM_FEATURE_PERFORMANCE;

	window.SYSTEM_FEATURE_CUSTOM_ELEMENTS_V0	= 'registerElement' in document;
	window.SYSTEM_FEATURE_CUSTOM_ELEMENTS_V1	= 'customElements' in window;
	window.SYSTEM_FEATURE_CUSTOM_ELEMENTS		= SYSTEM_FEATURE_CUSTOM_ELEMENTS_V0 || SYSTEM_FEATURE_CUSTOM_ELEMENTS_V1;
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_SHADOW_DOM_V0			= 'createShadowRoot' in document.createElement('div') || 'webkitCreateShadowRoot' in document.createElement('div') || 'mozCreateShadowRoot' in document.createElement('div');
	window.SYSTEM_FEATURE_SHADOW_DOM_V1			= 'attachShadow' in document.createElement('div');
	window.SYSTEM_FEATURE_SHADOW_DOM			= SYSTEM_FEATURE_SHADOW_DOM_V0 || SYSTEM_FEATURE_SHADOW_DOM_V1;
	window.SYSTEM_FEATURE_HTML_IMPORTS			= 'import' in document.createElement('link');
	window.SYSTEM_FEATURE_TEMPLATE				= 'content' in document.createElement('template');
	window.SYSTEM_FEATURE_TEMPLATE_SLOT			= 'name' in document.createElement('slot');
	window.SYSTEM_FEATURE_TEMPLATES				= SYSTEM_FEATURE_TEMPLATE && SYSTEM_FEATURE_TEMPLATE_SLOT;
	window.SYSTEM_FEATURE_WEBCOMPONENTS_V0		= SYSTEM_FEATURE_CUSTOM_ELEMENTS_V0 && SYSTEM_FEATURE_SHADOW_DOM_V0 && SYSTEM_FEATURE_HTML_IMPORTS;
	window.SYSTEM_FEATURE_WEBCOMPONENTS_V1		= SYSTEM_FEATURE_CUSTOM_ELEMENTS_V1 && SYSTEM_FEATURE_SHADOW_DOM_V1 && SYSTEM_FEATURE_TEMPLATES;
	window.SYSTEM_FEATURE_WEBCOMPONENTS			= SYSTEM_FEATURE_WEBCOMPONENTS_V0 || SYSTEM_FEATURE_WEBCOMPONENTS_V1;

	window.SYSTEM_FEATURE_SVG					= !!(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect);
	window.SYSTEM_FEATURE_CANVAS				= !!(context2D && context2D instanceof CanvasRenderingContext2D);
	window.SYSTEM_FEATURE_OFFSCREEN_CANVAS		= !!(SYSTEM_FEATURE_CANVAS && 'OffscreenCanvas' in window);
	window.SYSTEM_FEATURE_WEBGL					= !!(contextWEBGL && contextWEBGL instanceof WebGLRenderingContext);
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_WEBGL2				= !!(contextWEBGL2 && contextWEBGL2 instanceof WebGL2RenderingContext);
	window.SYSTEM_FEATURE_WEBVR					= 'getVRDisplays' in navigator ? true : 'mozGetVRDevices' in navigator;
	// noinspection JSUnusedGlobalSymbols
	window.SYSTEM_FEATURE_HTML5AUDIO			= (function() {
		try {
			// noinspection JSUnresolvedVariable
			return !!(audio.canPlayType && audio.canPlayType('audio/mpeg;').replace(/no/, ''));
		} catch(e) {
			return false;
		}
	})();
	// noinspection JSUnusedGlobalSymbols
	window.SYSTEM_FEATURE_WEBAUDIO				= 'AudioContext' in window ? true : 'webkitAudioContext' in window || 'mozAudioContext' in window || 'oAudioContext' in window || 'msAudioContext' in window;
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_WEBMIDI				= !!navigator.requestMIDIAccess;
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_WEBSPEECH_RECOGNITION	= 'SpeechRecognition' in window ? true : 'webkitSpeechRecognition' in window || 'mozSpeechRecognition' in window || 'oSpeechRecognition' in window || 'msSpeechRecognition' in window;
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_WEBSPEECH_SYNTHESIS	= 'speechSynthesis' in window ? true : 'webkitSpeechSynthesis' in window || 'mozSpeechSynthesis' in window || 'oSpeechSynthesis' in window || 'msSpeechSynthesis' in window;
	window.SYSTEM_FEATURE_WEBSPEECH				= SYSTEM_FEATURE_WEBSPEECH_RECOGNITION && SYSTEM_FEATURE_WEBSPEECH_SYNTHESIS;
	// noinspection JSUnusedGlobalSymbols
	// TODO: implement check for keyboard events support assume it's there already for now
	window.SYSTEM_FEATURE_KEYBOARD				= true;
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_POINTER_EVENTS		= !!window.PointerEvent ? true : !!window.webkitPointerEvent || !!window.mozPointerEvent || !!window.msPointerEvent || !!window.oPointerEvent;
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_GAMEPADS				= !!navigator.getGamepads ? true : !!navigator.webkitGetGamepads || !!navigator.mozGetGamepads || !!navigator.msGetGamepads || !!navigator.oGetGamepads;
	// noinspection JSUnresolvedVariable,DuplicatedCode
	window.SYSTEM_FEATURE_WEBSOCKETS			= (function() {
		var protocol = 'https:' === location.protocol ? 'wss' : 'ws';

		if ('WebSocket' in window && window.WebSocket.CLOSING === 2) {
			if ('binaryType' in WebSocket.prototype) {
				return true;
			} else {
				try {
					return !!(new WebSocket(protocol + '://.').binaryType);
				} catch (e) {
					return false;
				}
			}
		}
	})();
	// noinspection DuplicatedCode
	window.SYSTEM_FEATURE_SESSION_STORAGE		= (function() {
		var mod = 'test';

		if (typeof sessionStorage !== 'undefined') {
			if (typeof sessionStorage.setItem === 'function' && typeof sessionStorage.removeItem === 'function') {
				try {
					sessionStorage.setItem(mod, mod);
					sessionStorage.removeItem(mod);
					return true;
				} catch (e) {
					return false;
				}
			}
		}

		return false;
	})();
	// noinspection DuplicatedCode
	window.SYSTEM_FEATURE_LOCAL_STORAGE			= (function() {
		var mod = 'test';

		if (typeof localStorage !== 'undefined') {
			if (typeof localStorage.setItem === 'function' && typeof localStorage.removeItem === 'function') {
				try {
					localStorage.setItem(mod, mod);
					localStorage.removeItem(mod);
					return true;
				} catch (e) {
					return false;
				}
			}
		}

		return false;
	})();
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_INDEXED_DB			= !!window.indexedDB ? true : !!window.webkitIndexedDB || !!window.mozIndexedDB || !!window.moz_indexedDB || !!window.oIndexedDB || !!window.msIndexedDB;
	window.SYSTEM_FEATURE_WEBSQL				= !!window.openDatabase;
	window.SYSTEM_FEATURE_CACHE					= 'caches' in window;
	window.SYSTEM_FEATURE_FETCH					= !!window.fetch;
	window.SYSTEM_FEATURE_PUSH					= 'PushManager' in window;
	// noinspection DuplicatedCode
	window.SYSTEM_FEATURE_ORIENTATION			= !!window.DeviceOrientationEvent;
	window.SYSTEM_FEATURE_GEOLOCATION			= !!navigator.geolocation;
	window.SYSTEM_FEATURE_MOTION				= !!window.DeviceMotionEvent;
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_GYROSCOPE				= !!window.Gyroscope;
	window.SYSTEM_FEATURE_PROXIMITY				= 'ProximitySensor' in window;
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_AMBIENTLIGHT			= !!window.AmbientLightSensor;
	window.SYSTEM_FEATURE_VIBRATION				= 'vibrate' in navigator;
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_BATTERY				= !!navigator.getBattery ? true : !!navigator.battery || !!navigator.mozBattery;
	// TODO: implement check for Generic Sensor API

	window.SYSTEM_FEATURE_CSS_VARIABLES			= window.CSS && CSS.supports('color', 'var(--fake-var)');

	window.SYSTEM_FEATURE_ES3_BASE64			= 'btoa' in window && 'atob' in window;
	window.SYSTEM_FEATURE_ES3					= SYSTEM_FEATURE_ES3_BASE64;

	window.SYSTEM_FEATURE_ES5_STRICT_MODE		= (function() {'use strict'; return !this; })();
	window.SYSTEM_FEATURE_ES5_XHR				= 'XMLHttpRequest' in window && 'prototype' in window.XMLHttpRequest && 'addEventListener' in window.XMLHttpRequest.prototype;
	window.SYSTEM_FEATURE_ES5_JSON				= 'JSON' in window && 'parse' in JSON && 'stringify' in JSON;
	// noinspection DuplicatedCode
	window.SYSTEM_FEATURE_ES5_SYNTAX			= (function() {
		var value, obj, stringAccess, getter, setter, reservedWords;//, zeroWidthChars;

		try {
			stringAccess = eval('"foobar"[3] === "b"');
			getter = eval('({ get x(){ return 1 } }).x === 1');
			eval('({ set x(v){ value = v; } }).x = 1');
			// noinspection JSUnusedAssignment
			setter = value === 1;
			eval('obj = ({ if: 1 })');
			// noinspection JSUnusedAssignment
			reservedWords = obj['if'] === 1;
			// zeroWidthChars = eval('_\u200c\u200d = true');

			return stringAccess && getter && setter && reservedWords; //&& zeroWidthChars;
		} catch (e) {
			return false;
		}
	})();
	window.SYSTEM_FEATURE_ES5_UNDEFINED			= (function() {
		var result, originalUndefined;

		try {
			originalUndefined = undefined;
			// noinspection JSUndeclaredVariable,JSValidateTypes
			undefined = 12345;
			result = typeof undefined === 'undefined';
			// noinspection JSUndeclaredVariable
			undefined = originalUndefined;
		} catch (e) {
			return true;
		}

		return result;
	})();
	window.SYSTEM_FEATURE_ES5_ARRAY				= !!(Array.prototype && Array.prototype.every && Array.prototype.filter && Array.prototype.forEach && Array.prototype.indexOf && Array.prototype.lastIndexOf && Array.prototype.map && Array.prototype.some && Array.prototype.reduce && Array.prototype.reduceRight && Array.isArray);
	window.SYSTEM_FEATURE_ES5_DATE				= (function() {
		var isoDate = '2013-04-12T06:06:37.307Z', canParseISODate = false;

		try {
			canParseISODate = !!Date.parse(isoDate);
		} catch (e) {}

		return !!(Date.now && Date.prototype && Date.prototype.toISOString && Date.prototype.toJSON && canParseISODate);
	})();
	window.SYSTEM_FEATURE_ES5_FUNCTION			= !!(Function.prototype && Function.prototype.bind);
	window.SYSTEM_FEATURE_ES5_OBJECT			= !!(Object.keys && Object.create && Object.getPrototypeOf && Object.getOwnPropertyNames && Object.isSealed && Object.isFrozen && Object.isExtensible && Object.getOwnPropertyDescriptor && Object.defineProperty && Object.defineProperties && Object.seal && Object.freeze && Object.preventExtensions);
	window.SYSTEM_FEATURE_ES5_STRING			= !!(String.prototype && String.prototype.trim);
	window.SYSTEM_FEATURE_ES5_GETSET			= (function() {
		var value, getter, setter;

		try {
			getter = eval('({ get x(){ return 1 } }).x === 1');
			eval('({ set x(v){ value = v; } }).x = 1');
			// noinspection JSUnusedAssignment
			setter = value === 1;

			return getter && setter;
		} catch (e) {
			return false;
		}
	})();
	window.SYSTEM_FEATURE_ES5					= !!(SYSTEM_FEATURE_ES3 && SYSTEM_FEATURE_ES5_STRICT_MODE && SYSTEM_FEATURE_ES5_XHR && SYSTEM_FEATURE_ES5_JSON && SYSTEM_FEATURE_ES5_SYNTAX && SYSTEM_FEATURE_ES5_UNDEFINED && SYSTEM_FEATURE_ES5_ARRAY && SYSTEM_FEATURE_ES5_DATE && SYSTEM_FEATURE_ES5_FUNCTION && SYSTEM_FEATURE_ES5_OBJECT && SYSTEM_FEATURE_ES5_STRING);

	// noinspection JSUnresolvedVariable,DuplicatedCode,JSValidateTypes
	window.SYSTEM_FEATURE_ES6_NUMBER			= !!(Number.isFinite && Number.isInteger && Number.isSafeInteger && Number.isNaN && Number.parseInt && Number.parseFloat && Number.isInteger(Number.MAX_SAFE_INTEGER) && Number.isInteger(Number.MIN_SAFE_INTEGER) && Number.isFinite(Number.EPSILON));
	// noinspection JSUnresolvedVariable,DuplicatedCode
	window.SYSTEM_FEATURE_ES6_MATH				= !!(Math && Math.clz32 && Math.cbrt && Math.imul && Math.sign && Math.log10 && Math.log2 && Math.log1p && Math.expm1 && Math.cosh && Math.sinh && Math.tanh && Math.acosh && Math.asinh && Math.atanh && Math.hypot && Math.trunc && Math.fround);
	window.SYSTEM_FEATURE_ES6_ARRAY				= !!(Array.prototype && Array.prototype.copyWithin && Array.prototype.fill && Array.prototype.find && Array.prototype.findIndex && Array.prototype.keys && Array.prototype.entries && Array.prototype.values && Array.from && Array.of);
	window.SYSTEM_FEATURE_ES6_FUNCTION			= (function() {
		try {
			eval('()=>{}');
		} catch (e) {
			return false;
		}
		return true;
	})();
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_ES6_OBJECT			= !!(Object.assign && Object.is && Object.setPrototypeOf);
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_ES6_CLASS				= (function() {
		try {
			eval('class C{}');
		} catch (e) {
			return false;
		}
		return true;
	})();
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_ES6_STRING			= !!(String.fromCodePoint && String.raw && String.prototype.codePointAt && String.prototype.repeat && String.prototype.startsWith && String.prototype.endsWith && (String.prototype.includes || String.prototype.contains));
	// noinspection JSUnresolvedVariable
	window.SYSTEM_FEATURE_ES6_COLLECTIONS		= !!(window.Map && window.Set && window.WeakMap && window.WeakSet);
	window.SYSTEM_FEATURE_ES6_GENERATORS		= (function() {
		try {
			new Function('function* test() {}')();
		} catch (e) {
			return false;
		}
		return true;
	})();
	// noinspection DuplicatedCode
	window.SYSTEM_FEATURE_ES6_PROMISES			= (function() {
		return 'Promise' in window && 'resolve' in window.Promise && 'reject' in window.Promise && 'all' in window.Promise && 'race' in window.Promise && (function() {
			var resolve;
			// noinspection JSIgnoredPromiseFromCall
			new window.Promise(function(r) { resolve = r; });
			return typeof resolve === 'function';
		}());
	})();
	window.SYSTEM_FEATURE_ES6_STATIC_MODULES	= (function() {
		try {
			new Function('import("")');
			return true;
		} catch (err) {
			return false;
		}
	})();
	window.SYSTEM_FEATURE_ES6_DYNAMIC_MODULES	= 'noModule' in document.createElement('script');
	window.SYSTEM_FEATURE_ES6_MODULES			= SYSTEM_FEATURE_ES6_STATIC_MODULES && SYSTEM_FEATURE_ES6_DYNAMIC_MODULES;
	window.SYSTEM_FEATURE_ES6					= SYSTEM_FEATURE_ES5 && SYSTEM_FEATURE_ES6_NUMBER && SYSTEM_FEATURE_ES6_MATH && SYSTEM_FEATURE_ES6_ARRAY && SYSTEM_FEATURE_ES6_FUNCTION && SYSTEM_FEATURE_ES6_OBJECT && SYSTEM_FEATURE_ES6_CLASS && SYSTEM_FEATURE_ES6_STRING && SYSTEM_FEATURE_ES6_COLLECTIONS && SYSTEM_FEATURE_ES6_GENERATORS && SYSTEM_FEATURE_ES6_PROMISES && (SYSTEM_FEATURE_ES6_STATIC_MODULES || SYSTEM_FEATURE_ES6_DYNAMIC_MODULES);

	window.SYSTEM_FEATURE_ES7_ASYNC_AWAIT		= (function() {
		var isAsync = true;

		try {
			eval('async () => {}');
		} catch (e) {
			if (e instanceof SyntaxError) {
				isAsync = false;
			} else {
				throw e;
			}
		}

		return isAsync;
	})();

	window.SYSTEM_INFO_OS						= window.osName;
	window.SYSTEM_INFO_OS_VERSION				= window.osVersion;
	window.SYSTEM_INFO_ENVIRONMENT				= window.environment;
	window.SYSTEM_INFO_BROWSER					= window.browserName;
	window.SYSTEM_INFO_BROWSER_VERSION			= window.browserVersion;

	window.SYSTEM_INFO_CPU_LITTLE_ENDIAN		= (SYSTEM_FEATURE_TYPED_ARRAYS ? (function() {
		var buffer = new ArrayBuffer(2);
		new DataView(buffer).setUint16(0, 256, true);

		return new Uint16Array(buffer)[0] === 256;
	})() : true);
	// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
	window.SYSTEM_INFO_CPU_BIG_ENDIAN			= typeof SYSTEM_INFO_CPU_LITTLE_ENDIAN !== 'undefined' ? !SYSTEM_INFO_CPU_LITTLE_ENDIAN : false;
	// noinspection JSUnusedGlobalSymbols
	window.SYSTEM_INFO_CPU_ENDIANNESS			= typeof SYSTEM_INFO_CPU_LITTLE_ENDIAN !== 'undefined' ? (SYSTEM_INFO_CPU_LITTLE_ENDIAN ? 'Little-endian' : 'Big-endian') : 'Little-endian';
	// noinspection JSUnusedGlobalSymbols
	window.SYSTEM_INFO_CPU_CORES				= !navigator.hardwareConcurrency ? '≥ 1' : navigator.hardwareConcurrency;
	// noinspection JSUnusedGlobalSymbols
	window.SYSTEM_INFO_CPU_ARCH					= window.is64 ? '64-bit' : '32-bit';
	// noinspection JSUnresolvedVariable
	window.SYSTEM_INFO_RAM						= !navigator.deviceMemory ? '≤ 1GB' : '≥' + navigator.deviceMemory + 'GB';
	// noinspection JSUnusedGlobalSymbols
	window.SYSTEM_INFO_VIDEO_ACCELERATION		= SYSTEM_FEATURE_WEBGL || SYSTEM_FEATURE_WEBGL2 ? '3D' : (SYSTEM_FEATURE_CANVAS ? '2D' : false);
	// noinspection JSUnusedGlobalSymbols,DuplicatedCode
	window.SYSTEM_INFO_GPU						= (function() {
		if (contextWEBGL) {
			if (typeof contextWEBGL.getSupportedExtensions === 'function') {
				if (contextWEBGL.getSupportedExtensions().indexOf('WEBGL_debug_renderer_info') !== -1) {
					var dbgRenderInfo = contextWEBGL.getExtension('WEBGL_debug_renderer_info');

					if (typeof dbgRenderInfo.UNMASKED_RENDERER_WEBGL !== 'undefined') {
						return contextWEBGL.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
					}
				}
			}
		}

		return undefined;
	})();

	// endregion

	// region Functions

	// noinspection JSUnusedLocalSymbols
	window.dumpsystem = function() {
		console.log(typeof navigator.userAgent !== 'undefined' ? navigator.userAgent : '');

		var dump = [{
			Feature: 'SYSTEM_INFO_OS',
			Value: SYSTEM_INFO_OS + ' ' + SYSTEM_INFO_OS_VERSION
		} , {
			Feature: 'SYSTEM_INFO_ENVIRONMENT',
			Value: SYSTEM_INFO_ENVIRONMENT
		} , {
			Feature: 'SYSTEM_INFO_BROWSER',
			Value: SYSTEM_INFO_BROWSER + ' ' + SYSTEM_INFO_BROWSER_VERSION + ' (' + SYSTEM_INFO_CPU_ARCH + ')'
		} , {
			Feature: 'SYSTEM_INFO_CPU_ENDIANNESS',
			Value: SYSTEM_INFO_CPU_ENDIANNESS
		} , {
			Feature: 'SYSTEM_INFO_CPU_CORES',
			Value: SYSTEM_INFO_CPU_CORES
		} , {
			Feature: 'SYSTEM_INFO_CPU_ARCH',
			Value: SYSTEM_INFO_CPU_ARCH
		} , {
			Feature: 'SYSTEM_INFO_RAM',
			Value: SYSTEM_INFO_RAM
		} , {
			Feature: 'SYSTEM_INFO_GPU',
			Value: SYSTEM_INFO_GPU
		} , {
			Feature: 'SYSTEM_INFO_VIDEO_ACCELERATION',
			Value: SYSTEM_INFO_VIDEO_ACCELERATION
		} , {
			Feature: 'SYSTEM_FEATURE_CSS_VARIABLES',
			Value: SYSTEM_FEATURE_CSS_VARIABLES ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES3_BASE64',
			Value: SYSTEM_FEATURE_ES3_BASE64 ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES3',
			Value: SYSTEM_FEATURE_ES3 ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES5_STRICT_MODE',
			Value: SYSTEM_FEATURE_ES5_STRICT_MODE ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES5_XHR',
			Value: SYSTEM_FEATURE_ES5_XHR ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES5_JSON',
			Value: SYSTEM_FEATURE_ES5_JSON ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES5_SYNTAX',
			Value: SYSTEM_FEATURE_ES5_SYNTAX ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES5_UNDEFINED',
			Value: SYSTEM_FEATURE_ES5_UNDEFINED ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES5_ARRAY',
			Value: SYSTEM_FEATURE_ES5_ARRAY ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES5_DATE',
			Value: SYSTEM_FEATURE_ES5_DATE ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES5_FUNCTION',
			Value: SYSTEM_FEATURE_ES5_FUNCTION ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES5_OBJECT',
			Value: SYSTEM_FEATURE_ES5_OBJECT ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES5_STRING',
			Value: SYSTEM_FEATURE_ES5_STRING ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES5_GETSET',
			Value: SYSTEM_FEATURE_ES5_GETSET ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES5',
			Value: SYSTEM_FEATURE_ES5 ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES6_NUMBER',
			Value: SYSTEM_FEATURE_ES6_NUMBER ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES6_MATH',
			Value: SYSTEM_FEATURE_ES6_MATH ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES6_ARRAY',
			Value: SYSTEM_FEATURE_ES6_ARRAY ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES6_FUNCTION',
			Value: SYSTEM_FEATURE_ES6_FUNCTION ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES6_OBJECT',
			Value: SYSTEM_FEATURE_ES6_OBJECT ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES6_STRING',
			Value: SYSTEM_FEATURE_ES6_STRING ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES6_COLLECTIONS',
			Value: SYSTEM_FEATURE_ES6_COLLECTIONS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES6_GENERATORS',
			Value: SYSTEM_FEATURE_ES6_GENERATORS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES6_PROMISES',
			Value: SYSTEM_FEATURE_ES6_PROMISES ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES6_CLASS',
			Value: SYSTEM_FEATURE_ES6_CLASS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES6_STATIC_MODULES',
			Value: SYSTEM_FEATURE_ES6_STATIC_MODULES ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES6_DYNAMIC_MODULES',
			Value: SYSTEM_FEATURE_ES6_DYNAMIC_MODULES ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES6_MODULES',
			Value: SYSTEM_FEATURE_ES6_MODULES ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES6',
			Value: SYSTEM_FEATURE_ES6 ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES7_ASYNC_AWAIT',
			Value: SYSTEM_FEATURE_ES7_ASYNC_AWAIT ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WORKERS',
			Value: SYSTEM_FEATURE_WORKERS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_SHARED_WORKERS',
			Value: SYSTEM_FEATURE_SHARED_WORKERS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_SERVICE_WORKERS',
			Value: SYSTEM_FEATURE_SERVICE_WORKERS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_TYPED_ARRAYS',
			Value: SYSTEM_FEATURE_TYPED_ARRAYS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_URL_PARSER',
			Value: SYSTEM_FEATURE_URL_PARSER ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_URL_BLOB',
			Value: SYSTEM_FEATURE_URL_BLOB ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_DATA_URL',
			Value: SYSTEM_FEATURE_DATA_URL ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_BIGINTS',
			Value: SYSTEM_FEATURE_BIGINTS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_SIMD',
			Value: SYSTEM_FEATURE_SIMD ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ASMJS',
			Value: SYSTEM_FEATURE_ASMJS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WEBASSEMBLY',
			Value: SYSTEM_FEATURE_WEBASSEMBLY ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_FULLSCREEN',
			Value: SYSTEM_FEATURE_FULLSCREEN ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_POINTER_LOCK',
			Value: SYSTEM_FEATURE_POINTER_LOCK ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_TIMERS',
			Value: SYSTEM_FEATURE_TIMERS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WEBCOMPONENTS',
			Value: SYSTEM_FEATURE_WEBCOMPONENTS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_CANVAS',
			Value: SYSTEM_FEATURE_CANVAS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_OFFSCREEN_CANVAS',
			Value: SYSTEM_FEATURE_OFFSCREEN_CANVAS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_SVG',
			Value: SYSTEM_FEATURE_SVG ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WEBGL',
			Value: SYSTEM_FEATURE_WEBGL ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WEBGL2',
			Value: SYSTEM_FEATURE_WEBGL2 ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WEBVR',
			Value: SYSTEM_FEATURE_WEBVR ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_HTML5AUDIO',
			Value: SYSTEM_FEATURE_HTML5AUDIO ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WEBAUDIO',
			Value: SYSTEM_FEATURE_WEBAUDIO ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WEBMIDI',
			Value: SYSTEM_FEATURE_WEBMIDI ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_KEYBOARD',
			Value: SYSTEM_FEATURE_KEYBOARD ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_POINTER_EVENTS',
			Value: SYSTEM_FEATURE_POINTER_EVENTS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_GAMEPADS',
			Value: SYSTEM_FEATURE_GAMEPADS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WEBSOCKETS',
			Value: SYSTEM_FEATURE_WEBSOCKETS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_SESSION_STORAGE',
			Value: SYSTEM_FEATURE_SESSION_STORAGE ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_LOCAL_STORAGE',
			Value: SYSTEM_FEATURE_LOCAL_STORAGE ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_INDEXED_DB',
			Value: SYSTEM_FEATURE_INDEXED_DB ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WEBSQL',
			Value: SYSTEM_FEATURE_WEBSQL ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_CACHE',
			Value: SYSTEM_FEATURE_CACHE ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_FETCH',
			Value: SYSTEM_FEATURE_FETCH ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_PUSH',
			Value: SYSTEM_FEATURE_PUSH ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_GEOLOCATION',
			Value: SYSTEM_FEATURE_GEOLOCATION ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ORIENTATION',
			Value: SYSTEM_FEATURE_ORIENTATION ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_MOTION',
			Value: SYSTEM_FEATURE_MOTION ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_GYROSCOPE',
			Value: SYSTEM_FEATURE_GYROSCOPE ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_PROXIMITY',
			Value: SYSTEM_FEATURE_PROXIMITY ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_AMBIENTLIGHT',
			Value: SYSTEM_FEATURE_AMBIENTLIGHT ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_VIBRATION',
			Value: SYSTEM_FEATURE_VIBRATION ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_BATTERY',
			Value: SYSTEM_FEATURE_BATTERY ? 'TRUE' : 'FALSE'
		}];

		//Microsoft Edge <= 18.18362 (64-bit) cannot list more than 50 items in a table
		// noinspection DuplicatedCode
		if (isEdgeHTML) {
			var chunks = function(array, size) {
				var results = [];

				while (array.length) {
					results.push(array.splice(0, size));
				}

				return results;
			};

			dump = chunks(dump, 50);

			for (var d in dump) {
				// noinspection JSUnfilteredForInLoop
				console.table(dump[d]);
			}
		} else {
			console.table(dump);
		}
	};

	if (window.location.hostname === 'localhost') {
		window.dumpsystem();
	}

	// endregion

	onerror = function(message, url, lineNumber) {
		console.log('Error: ' + message + ' in ' + url + ' at line ' + lineNumber);
	};
}());