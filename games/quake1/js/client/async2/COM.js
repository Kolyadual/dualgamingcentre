COM = {};

COM.argv = [];

COM.standard_quake = true;
COM.inAsync = false;
COM.asyncTrace = {};

COM.DefaultExtension = function(path, extension) {
	var i,
		src;
	for (i = path.length - 1; i >= 0; --i) {
		src = path.charCodeAt(i);
		if (src === 47) {
			break;
		}
		if (src === 46) {
			return path;
		}
	}
	return path + extension;
};

COM.Parse = function(data) {
	COM.token = '';
	var i = 0,
		c;
	if (data.length === 0) {
		return;
	}

	var skipwhite = true;
	for (; ;) {
		if (skipwhite !== true) {
			break;
		}
		skipwhite = false;
		for (; ;) {
			if (i >= data.length) {
				return;
			}
			c = data.charCodeAt(i);
			if (c > 32) {
				break;
			}
			++i;
		}
		if ((c === 47) && (data.charCodeAt(i + 1) == 47)) {
			for (; ;) {
				if ((i >= data.length) || (data.charCodeAt(i) === 10)) {
					break;
				}
				++i;
			}
			skipwhite = true;
		}
	}

	if (c === 34) {
		++i;
		for (; ;) {
			c = data.charCodeAt(i);
			++i;
			if ((i >= data.length) || (c === 34)) {
				return data.substring(i);
			}
			COM.token += String.fromCharCode(c);
		}
	}

	for (; ;) {
		if ((i >= data.length) || (c <= 32)) {
			break;
		}
		COM.token += String.fromCharCode(c);
		++i;
		c = data.charCodeAt(i);
	}

	return data.substring(i);
};

COM.CheckParm = function(parm) {
	var i;
	for (i = 1; i < COM.argv.length; ++i) {
		if (COM.argv[i] === parm) {
			return i;
		}
	}
};

COM.CheckRegistered = function() {
	Sys.Print('COM.CheckRegistered()');

	return COM.LoadFile('gfx/pop.lmp').then(function(h) {
		if (h == null) {

			Sys.Print('Playing shareware version.\n');
			Con.Print('Playing shareware version.\n');

			if (COM.modified === true) {
				Sys.Error('You must have the registered version to use modified games');
			}

			return;
		}

		var check = new Uint8Array(h);

		var pop = [
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x66, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x66, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x66, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x67, 0x00, 0x00,
			0x00, 0x00, 0x66, 0x65, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x65, 0x66, 0x00,
			0x00, 0x63, 0x65, 0x61, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x61, 0x65, 0x63,
			0x00, 0x64, 0x65, 0x61, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x61, 0x65, 0x64,
			0x00, 0x64, 0x65, 0x64, 0x00, 0x00, 0x64, 0x69, 0x69, 0x69, 0x64, 0x00, 0x00, 0x64, 0x65, 0x64,
			0x00, 0x63, 0x65, 0x68, 0x62, 0x00, 0x00, 0x64, 0x68, 0x64, 0x00, 0x00, 0x62, 0x68, 0x65, 0x63,
			0x00, 0x00, 0x65, 0x67, 0x69, 0x63, 0x00, 0x64, 0x67, 0x64, 0x00, 0x63, 0x69, 0x67, 0x65, 0x00,
			0x00, 0x00, 0x62, 0x66, 0x67, 0x69, 0x6A, 0x68, 0x67, 0x68, 0x6A, 0x69, 0x67, 0x66, 0x62, 0x00,
			0x00, 0x00, 0x00, 0x62, 0x65, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x66, 0x65, 0x62, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x62, 0x63, 0x64, 0x66, 0x64, 0x63, 0x62, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x62, 0x66, 0x62, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x61, 0x66, 0x61, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x65, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
		];

		var i;

		for (i = 0; i < 256; ++i) {
			if (check[i] !== pop[i]) {
				Sys.Error('Corrupted data file.');
			}
		}

		Cvar.Set('registered', '1');

		Sys.Print('Playing registered version.\n');
		Con.Print('Playing registered version.\n');
	});
};

COM.InitArgv = function(argv) {
	COM.cmdline = (argv.join(' ') + ' ').substring(0, 256);
	var i;
	for (i = 0; i < argv.length; ++i) {
		COM.argv[i] = argv[i];
	}
	if (COM.CheckParm('-safe') != null) {
		COM.argv[COM.argv.length] = '-nosound';
		COM.argv[COM.argv.length] = '-nocdaudio';
		COM.argv[COM.argv.length] = '-nomouse';
	}
	if (COM.CheckParm('-rogue') != null) {
		COM.rogue = true;
		COM.standard_quake = false;
	} else if (COM.CheckParm('-hipnotic') != null) {
		COM.hipnotic = true;
		COM.standard_quake = false;
	}
};

COM.Init = function() {
	Sys.Print('COM.Init()');

	var swaptest = new ArrayBuffer(2);
	var swaptestview = new Uint8Array(swaptest);
	swaptestview[0] = 1;
	swaptestview[1] = 0;

	if ((new Uint16Array(swaptest))[0] === 1) {
		COM.LittleLong = (function(l) {
			return l;
		});
	} else {
		COM.LittleLong = (function(l) {
			return (l >>> 24) + ((l & 0xff0000) >>> 8) + (((l & 0xff00) << 8) >>> 0) + ((l << 24) >>> 0);
		});
	}

	COM.registered = Cvar.RegisterVariable('registered', '0');
	Cvar.RegisterVariable('cmdline', COM.cmdline, false, true);
	Cmd.AddCommand('path', COM.Path_f);

	return COM.InitFilesystem().then(COM.CheckRegistered);
};

COM.searchpaths = [];

COM.Path_f = function() {
	Con.Print('Current search path:\n');
	var i = COM.searchpaths.length,
		j,
		s;
	for (i = COM.searchpaths.length - 1; i >= 0; --i) {
		s = COM.searchpaths[i];
		for (j = s.pack.length - 1; j >= 0; --j) {
			Con.Print(s.filename + '/' + 'pak' + j + '.zip (' + s.pack[j].length + ' files)\n');
		}
		Con.Print(s.filename + '\n');
	}
};

COM.WriteFile = function(filename, data, len) {
	filename = filename.toLowerCase();
	var dest = [],
		i;
	for (i = 0; i < len; ++i) {
		dest[i] = String.fromCharCode(data[i]);
	}
	try {
		localStorage.setItem('Quake.' + COM.searchpaths[COM.searchpaths.length - 1].filename + '/' + filename, dest.join(''));
	} catch (e) {
		Sys.Print('COM.WriteFile: failed on ' + filename + '\n');
		return;
	}
	Sys.Print('COM.WriteFile: ' + filename + '\n');
	return true;
};

COM.WriteTextFile = function(filename, data) {
	filename = filename.toLowerCase();
	try {
		localStorage.setItem('Quake.' + COM.searchpaths[COM.searchpaths.length - 1].filename + '/' + filename, data);
	} catch (e) {
		Sys.Print('COM.WriteTextFile: failed on ' + filename + '\n');
		return;
	}
	Sys.Print('COM.WriteTextFile: ' + filename + '\n');
	return true;
};

COM.MaybePromise = function(maybePromiseObj, resolveFn, ctx) {
	if (maybePromiseObj && maybePromiseObj.then) {
		return maybePromiseObj.then(function(ret) {
			return resolveFn.call(ctx, ret);
		});
	} else {
		return resolveFn.call(ctx, maybePromiseObj);
	}
};

COM.LoadFile = function(filename) {
	Sys.Print('COM.LoadFile(' + filename + ')');

	var e = new Error('dummy');
	COM.asyncTrace = e.stack.replace(/^[^\(]+?[\n$]/gm, '').replace(/^\s+at\s+/gm, '').replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@').split('\n');
	filename = filename.toLowerCase();
	var xhr = new XMLHttpRequest();
	xhr.overrideMimeType('text/plain; charset=x-user-defined');
	var searchPathIdx = COM.searchpaths.length - 1, packIdx = 0;

	var i, j, k, netpath, file, data;

	function searchPack(searchProps, pak, packNum) {
		Sys.Print('COM.searchPack()');

		for (k = 0; k < pak.length; ++k) {
			file = pak[k];

			if (file.name !== filename) {
				continue;
			}

			if (file.filelen === 0) {
				Draw.EndDisc();
				return Promise.resolve(new ArrayBuffer(0));
			}

			if (searchProps.location === 'store') {
				return Store.get(name).then(function _success(entry) {
					if (entry && entry.data) {
						return entry.data.slice(file.filepos, file.filepos + file.filelen);
					}
				});
			} else {
				return new Promise(function(resolve, reject) {
					xhr.open('GET', searchProps.filename + '/pak' + packNum + '.zip');
					xhr.setRequestHeader('Range', 'bytes=' + file.filepos + '-' + (file.filepos + file.filelen - 1));

					xhr.onload = function() {
						if ((xhr.status >= 200) && (xhr.status <= 299) && (xhr.responseText.length === file.filelen)) {
							Sys.Print('PackFile: ' + searchProps.filename + '/pak' + packNum + '.zip : ' + filename + '\n');
							Draw.EndDisc();
							resolve(Q.strmem(xhr.responseText));
						}
						COM.inAsync = false;
					};

					xhr.onerror = function() {
						resolve();
						COM.inAsync = false;
					};

					xhr.send();

					COM.inAsync = true;
				});
			}
		}

		// nothing found.
		return Promise.resolve();
	}

	function searchNet(netPath) {
		Sys.Print('COM.searchNet()');

		return new Promise(function(resolve, reject) {
			xhr.open('GET', netpath);

			xhr.onload = function() {
				if ((xhr.status >= 200) && (xhr.status <= 299)) {
					Sys.Print('FindFile: ' + netpath + '\n');
					Draw.EndDisc();
					resolve(Q.strmem(xhr.responseText));
				}

				resolve();
			};

			xhr.onerror = function() {
				resolve();
			};

			xhr.send();
		});
	}

	function searchPath(search) {
		Sys.Print('COM.searchPath()');

		netpath = search.filename + '/' + filename;

		data = localStorage.getItem('Quake.' + netpath);

		if (data != null) {
			Sys.Print('FindFile: ' + netpath + '\n');
			Draw.EndDisc();

			return Promise.resolve(Q.strmem(data));
		} else {
			var packIdx = search.pack.length - 1;

			function runSearchPack() {
				Sys.Print('COM.runSearchPack()');

				return searchPack(search, search.pack[packIdx], packIdx).then(function(data) {
					if (data) {
						return data;
					} else if (--packIdx >= 0) {
						return runSearchPack();
					} else {
						if (search.location === 'store') {
							if (--searchPathIdx >= 0) {
								return searchPath(COM.searchpaths[searchPathIdx]);
							}
						}

						return searchNet(netpath).then(function(data) {
							if (data) {
								return data;
							} else {
								if (--searchPathIdx >= 0) {
									return searchPath(COM.searchpaths[searchPathIdx]);
								}
							}
						});
					}
				});
			}

			return runSearchPack();
		}
	}

	return searchPath(COM.searchpaths[searchPathIdx]);
};

COM.LoadTextFile = function(filename) {
	Sys.Print('COM.LoadTextFile(' + filename + ')');

	return COM.LoadFile(filename).then(function(buf) {
		if (buf == null) {
			return;
		}

		var bufview = new Uint8Array(buf);
		var f = [];
		var i;

		for (i = 0; i < bufview.length; ++i) {
			if (bufview[i] !== 13) {
				f[f.length] = String.fromCharCode(bufview[i]);
			}
		}

		return f.join('');
	});
};

COM.LoadPackFile = function(packfile) {
	Sys.Print('COM.LoadPackFile(' + packfile + ')');

	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();

		xhr.overrideMimeType('text/plain; charset=x-user-defined');
		xhr.open('GET', packfile);
		xhr.setRequestHeader('Range', 'bytes=0-11');

		xhr.onerror = function() {
			resolve();
		};

		xhr.onload = function() {
			if ((xhr.status <= 199) || (xhr.status >= 300) || (xhr.responseText.length !== 12)) {
				resolve();
				return;
			}

			var header = new DataView(Q.strmem(xhr.responseText));

			if (header.getUint32(0, true) !== 0x4b434150) {
				Sys.Error(packfile + ' is not a packfile');
			}

			var dirofs = header.getUint32(4, true);
			var dirlen = header.getUint32(8, true);
			var numpackfiles = dirlen >> 6;

			if (numpackfiles !== 339) {
				COM.modified = true;
			}

			var pack = [];

			if (numpackfiles !== 0) {
				xhr.open('GET', packfile);
				xhr.setRequestHeader('Range', 'bytes=' + dirofs + '-' + (dirofs + dirlen - 1));

				xhr.onerror = function() {
					resolve();
				};
				xhr.onload = function() {
					if ((xhr.status <= 199) || (xhr.status >= 300) || (xhr.responseText.length !== dirlen)) {
						resolve();
						return;
					}
					var info = Q.strmem(xhr.responseText);

					if (CRC.Block(new Uint8Array(info)) !== 32981)
					//COM.modified = true;
					{
						var modified = true;
					}

					var i;

					for (i = 0; i < numpackfiles; ++i) {
						pack[pack.length] = {
							name: Q.memstr(new Uint8Array(info, i << 6, 56)).toLowerCase(),
							filepos: (new DataView(info)).getUint32((i << 6) + 56, true),
							filelen: (new DataView(info)).getUint32((i << 6) + 60, true)
						};
					}

					// Con.Print('Added packfile ' + packfile + ' (' + numpackfiles + ' files)\n');
					Sys.Print('Added packfile ' + packfile + ' (' + numpackfiles + ' files)\n');
					resolve(pack);
				};
				xhr.send();
			}
		};

		xhr.send();
	});
};

COM.AddGameDirectory = function(dir) {
	Sys.Print('COM.AddGameDirectory(' + dir + ')');

	var i = 0;
	var search = {
		filename: dir,
		pack: []
	};

	function checkPakFile() {
		Sys.Print('COM.checkPakFile()');
		return COM.LoadPackFile(dir + '/' + 'pak' + i + '.zip').then(function _onFulfill(maybePack) {
			if (maybePack) {
				search.pack.push(maybePack);
				i++;
				return checkPakFile();
			} else {
				COM.searchpaths.push(search);
			}
		});
	}

	return checkPakFile();
};

COM.AddStorePaks = function(storeName) {
	Sys.Print('COM.AddStorePaks(' + storeName + ')');

	//var name = 'pak1.zip';

	function loadPack(pakData) {
		Sys.Print('COM.loadPack(' + pakData + ')');

		var header = new DataView(pakData);

		if (header.getUint32(0, true) !== 0x4b434150) {
			Sys.Error(name + ' is not a packfile');
		}

		var dirofs = header.getUint32(4, true);
		var dirlen = header.getUint32(8, true);

		var numpackfiles = dirlen >> 6;

		if (numpackfiles !== 339) {
			COM.modified = true;
		}

		var pack = [];

		if (numpackfiles !== 0) {
			var info = new DataView(pakData, dirofs, dirlen);

			if (CRC.Block(new Uint8Array(pakData, dirofs, dirlen)) !== 32981)

			//COM.modified = true;
			{
				var modified = true;
			}

			var i;

			for (i = 0; i < numpackfiles; ++i) {
				pack.push({
					name: Q.memstr(new Uint8Array(pakData, dirofs + (i << 6), 56)).toLowerCase(),
					filepos: info.getUint32((i << 6) + 56, true),
					filelen: info.getUint32((i << 6) + 60, true)
				});
			}

			// Con.Print('Added packfile ' + name + ' (' + numpackfiles + ' files)\n');
			Sys.Print('Added packfile ' + name + ' (' + numpackfiles + ' files)\n');

			return pack;
		}
	}

	return Store.get(name).then(function(entry) {
		if (entry && entry.data) {
			var pack = loadPack(entry.data);

			COM.searchpaths.push({
				filename: storeName,
				location: 'store',
				pack: [pack]
			});
		}
	}, function() {
		// do nothing
	});
};

COM.InitFilesystem = function() {
	Sys.Print('COM.InitFilesystem()');

	var i, search, promises = [];

	i = COM.CheckParm('-basedir');

	if (i != null) {
		search = COM.argv[i + 1];
	}

	promises.push(COM.AddGameDirectory(search || 'id1'));

	if (COM.rogue === true) {
		promises.push(COM.AddGameDirectory('rogue'));
	} else if (COM.hipnotic === true) {
		promises.push(COM.AddGameDirectory('hipnotic'));
	}

	promises.push(COM.AddStorePaks('quakeAssets'));

	i = COM.CheckParm('-game');

	if (i != null) {
		search = COM.argv[i + 1];

		if (search) {
			COM.modified = true;
			promises.push(COM.AddGameDirectory(search));
		}
	}

	return Promise.all(promises).then(function() {
		COM.gamedir = [COM.searchpaths[COM.searchpaths.length - 1]];
	});
};