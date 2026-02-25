// noinspection DuplicatedCode,ThisExpressionReferencesGlobalObjectJS,JSUnusedLocalSymbols
(function(global) {
	console.log('╔═╗╔╦╗╦ ╦╔═╗╔═╗╔╦═╗╦╔═╗\n' +
				'╠═ ║║║║ ║╠═╝╠═  ║ ║║╠═╣\n' +
				'╚═╝╩ ╩╚═╝╩  ╚═╝═╩═╝╩╩ ╩');

	var $document						= null;
	var $window							= null;
	var $html							= null;
	var $body							= null;
	var $container						= null;
	var $canvas							= null;
	var $progress						= null;
	var path							= null;
	var video							= null;
	var multiplayer						= false;

	// noinspection JSFileReferences,JSUnresolvedFunction
	requirejs.config({
		waitSeconds: 300,
		paths: {
			browserfs: 'libraries/browserfs-1.4.3.min',
			simplestorage: 'libraries/simplestorage-0.2.1.min',
			es6promise: 'libraries/promise-4.2.8.min',
			es6fetch: 'libraries/fetch-3.6.2',
			jquery: 'libraries/jquery-3.6.0.min',
			json: 'libraries/requirejs-json-1.0.3',
			text: 'libraries/requirejs-text-2.0.15'
		},
		shim: {
			browserfs: {
				exports: 'BrowserFS',
				deps: ['es6promise'],
				init: function(es6promise) {
					window.Promise = es6promise;
				}
			},
			es6promise: {
				exports: 'Promise'
			}
		}
	});

	// noinspection JSCheckFunctionSignatures,JSUnusedLocalSymbols
	requirejs([
		'jquery',
		'browserfs',
		'es6fetch',
		'simplestorage'
	], function($, BrowserFS, fetch, simplestorage) {
		// noinspection DuplicatedCode
		$(function() {
			$document	= $(document);
			$window		= $(window);
			$html		= $('html');
			$body		= $('body');
			$container	= $('.container');
			$canvas		= $('div.fullscreen');
			$progress	= $body.find('progress').first();
			path		= window.location.hostname !== 'localhost' ? '//' + window.location.hostname + '/dualgamingcentre/games/hl1/' : 'data/';

			(function() {
				if (typeof simplestorage.get('intro') === 'undefined') {
					video = $('<video />', {
						class: 'fullscreen',
						src: path + 'media/sierra.mp4',
						type: 'video/mp4',
						preload: 'auto',
						autoplay: true
					});

					// noinspection DuplicatedCode
					$(video).off('ended').one('ended', function() {
						$(video).attr('src', path + 'media/valve.mp4');
						$(video).off('ended').one('ended', function() {
							$(video).remove();

							video = $('<video />', {
								src: path + 'media/logo.mp4',
								type: 'video/mp4',
								preload: 'auto',
								autoplay: true,
								muted: true,
								loop: true
							});

							simplestorage.set('intro', true);
							$container.find('.logo').append(video);
						});
					}).off('click').one('click', function() {
						$(video).attr('src', path + 'media/valve.mp4');
						$(video).off('click').one('click', function() {
							$(video).remove();

							video = $('<video />', {
								src: path + 'media/logo.mp4',
								type: 'video/mp4',
								preload: 'auto',
								autoplay: true,
								muted: true,
								loop: true
							});

							simplestorage.set('intro', true);
							$container.find('.logo').append(video);
						});
					});

					$container.prepend(video);
				} else {
					video = $('<video />', {
						src: path + 'media/logo.mp4',
						type: 'video/mp4',
						preload: 'auto',
						autoplay: true,
						muted: true,
						loop: true
					});

					$container.find('.logo').append(video);
				}

				var canvas = $('<canvas/>', {
					id: 'canvas',
					oncontextmenu: 'event.preventDefault()'
				});

				$canvas.append(canvas);
				$container.find('.menu button').attr('disabled', 'disabled');
			})();

			var moduleCount = 0;
			var run = null;

			function loadModule(name) {
				var script = document.createElement('script');

				script.onload = function() {
					moduleCount++;

					if (moduleCount === 3) {
						initEvents();
					}
				};

				document.body.appendChild(script);
				script.src = name + '.js';
			}

			function fetchZIP(zip, cb) {
				$progress.css({
					visibility: 'visible'
				});

				var xhr = new XMLHttpRequest();
				xhr.open('GET', path + zip, true);
				xhr.responseType = 'arraybuffer';
				xhr.onprogress = function (event) {
					// noinspection JSUnusedLocalSymbols
					var percentComplete = event.loaded / event.total * 100;
					if (Module['setStatus']) Module['setStatus']('Downloading data... (' + event.loaded + '/' + event.total + ')');
				};
				// noinspection DuplicatedCode,JSUnusedLocalSymbols
				xhr.onload = function (event) {
					if (xhr.status === 200 || xhr.status === 304 || xhr.status === 206 || (xhr.status === 0 && xhr.response)) {
						$progress.css({
							visibility: 'hidden'
						});

						if (typeof cb === 'function') {
							cb(xhr.response);
						}
					} else {
						throw new Error(xhr.statusText + " : " + xhr.responseURL);
					}
				};

				xhr.setRequestHeader('X-File-Name', zip);
				xhr.send(null);
			}

			function init() {
				run = window.Module.run;
				window.run = window.Module.run = function() {};

				window.ENV.XASH3D_GAMEDIR = 'valve';
				window.ENV.XASH3D_RODIR = '/rodir';

				loadModule('js/server');
				loadModule('js/client');
				loadModule('js/menu');
			}

			function initEvents() {
				$container.find('.menu button').removeAttr('disabled');

				$document.off('click', '.menu button').on('click', '.menu button', function() {
					if (!$(this).is('[disabled]')) {
						start($(this).attr('class'));
					}
				});

				window.onerror = function (event) {
					if (('' + event).indexOf('SimulateInfiniteLoop') > 0) {
						if (!multiplayer) {
							window.location = window.location;
						}
					}
				};
			}

			function start(game) {
				try {
					// noinspection JSUnresolvedVariable
					FS.mkdir('/rodir');
					// noinspection JSUnresolvedVariable
					FS.mkdir('/rodir/valve');
					// noinspection JSUnresolvedVariable
					FS.mkdir('/rodir/valve/maps');
					// noinspection JSUnresolvedVariable
					FS.mkdir('/xash');
					// noinspection JSUnresolvedVariable
					FS.chdir('/xash/');
				} catch (e) {}

				switch (game) {
					case 'hc':
						window.Module.arguments = ['-dev', '1', '+sv_cheats', '1', '+map', 't0a0'];
						break;
					case 'uplink':
						window.Module.arguments = ['-dev', '1', '+sv_cheats', '1', '+map', 'hldemo1'];
						break;
					case 'dayone':
						window.Module.arguments = ['-dev', '1', '+sv_cheats', '1', '+map', 'c0a0'];
						break;
					case 'hl':
					case 'hl1':
						window.Module.arguments = ['-dev', '1', '+sv_cheats', '1', '+map', 'c0a0'];
						break;
					case 'hldm':
						multiplayer = true;
						//window.Module.arguments = ['-dev', '1', '+sv_cheats', '0', '+sv_lan', '1', '+map', 'crossfire'];
						break;
				}

				window.Module.run = window.run = run;

				var Buffer = BrowserFS.BFSRequire('buffer').Buffer;

				fetchZIP(game +'.zip', function(data1) {
					BrowserFS.FileSystem.ZipFS.Create({zipData: Buffer.from(data1)}, function(e, fs1) {
						if (e !== null) {
							console.log(e);
						} else {
							if (game !== 'hl1') {
								BrowserFS.FileSystem.MountableFileSystem.Create({
									'/': fs1
								}, function(e, mfs) {
									if (e !== null) {
										console.log(e)
									} else {
										BrowserFS.initialize(mfs);
										// noinspection JSUnresolvedVariable
										FS.mount(new BrowserFS.EmscriptenFS(), {root: '/'}, '/rodir');
										// noinspection JSUnresolvedVariable
										$canvas.show();
										run();
									}
								});
							} else {
								fetchZIP('hl1maps.zip', function(data2) {
									BrowserFS.FileSystem.ZipFS.Create({zipData: Buffer.from(data2)}, function(e, fs2) {
										if (e !== null) {
											console.log(e);
										} else {
											BrowserFS.FileSystem.MountableFileSystem.Create({
												'/': fs1,
												'/valve/maps/': fs2
											}, function(e, mfs) {
												if (e !== null) {
													console.log(e)
												} else {
													BrowserFS.initialize(mfs);
													// noinspection JSUnresolvedVariable
													FS.mount(new BrowserFS.EmscriptenFS(), {root: '/'}, '/rodir');
													// noinspection JSUnresolvedVariable
													$canvas.show();
													run();
												}
											});
										}
									});
								});
							}
						}
					});
				});
			}

			// noinspection JSUnresolvedVariable
			if (SYSTEM_FEATURE_CANVAS && SYSTEM_FEATURE_TYPED_ARRAYS && SYSTEM_FEATURE_ASMJS) {
				// noinspection DuplicatedCode
				if (SYSTEM_FEATURE_SERVICE_WORKERS) {
					navigator.serviceWorker.register('sw.js').then(function(registration) {
						registration.addEventListener('updatefound', function() {
							var installingWorker = registration.installing;
							console.log('A new service worker is being installed:', installingWorker);
						});
					}, function(err) {
						console.log('ServiceWorker registration failed: ', err);
					});
				} else {
					console.log('ServiceWorker not supported');
				}

				// noinspection DuplicatedCode
				window.Module = {
					TOTAL_MEMORY: 150 * 1024 * 1024,
					preInit: [init],
					preRun: [],
					postRun: [],
					print: function() {},
					printErr: function() {},
					canvas: $container.find('canvas').get(0),
					setStatus: function(text) {
						var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
						var progressElement = $progress.get(0);

						if (m) {
							progressElement.value = parseInt(m[2]) * 100;
							progressElement.max = parseInt(m[4]) * 100;
						} else {
							progressElement.value = null;
							progressElement.max = null;
						}
					},
					totalDependencies: 0,
					monitorRunDependencies: function (left) {
						this.totalDependencies = Math.max(this.totalDependencies, left);

						if (left) {
							window.Module.setStatus('Preparing... (' + (this.totalDependencies - left) + '/' + this.totalDependencies + ')');
						}
					},
					websocket: {
						url: 'wsproxy://ws2.emupedia.net:2000/'
					}
				};
				window.ENV = {};
				// noinspection JSUnusedLocalSymbols
				window.showElement = function(id, show) {
					console.log(id);
				};

				var memoryInitializer = 'js/xash.html.mem';

				if (typeof Module['locateFile'] === 'function') {
					memoryInitializer = Module['locateFile'](memoryInitializer);
				} else if (Module['memoryInitializerPrefixURL']) {
					memoryInitializer = Module['memoryInitializerPrefixURL'] + memoryInitializer;
				}

				var xhr = Module['memoryInitializerRequest'] = new XMLHttpRequest();
				xhr.open('GET', memoryInitializer, true);
				xhr.responseType = 'arraybuffer';
				xhr.send(null);

				var script = document.createElement('script');
				script.src = 'js/xash.js';
				document.body.appendChild(script);
			} else {
				alert('Half-Life cannot work because your browser is not supported!')
			}
		});
	});
} (this));
