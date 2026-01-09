Store = (function() {
	var dbName = 'quakeAssets',
		storeName = 'pak',
		dbVersion = 3;

	// noinspection JSUnresolvedVariable
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

	function verifyOpen() {
		Sys.Print('Store.verifyOpen()');

		return new Promise(function(resolve, reject) {
			var openReq = indexedDB.open(dbName, dbVersion);
			openReq.onupgradeneeded = function(event) {
				// noinspection JSUnresolvedVariable
				var db = event.target.result;

				try {
					// Create an objectStore for this database
					db.createObjectStore(storeName, {keyPath: 'pakName'});
				} catch (e) {
					console.log('on Creating object store: ' + e);
				}
			};
			openReq.onerror = function() {
				alert('Please allow the use of IndexedDB');
				reject();
			};
			openReq.onsuccess = function(event) {
				// noinspection JSUnresolvedVariable
				resolve(event.target.result);
			};
		});
	}

	function getPak(name) {
		Sys.Print('Store.getPak(' + name + ')');

		return function(db) {
			return new Promise(function(resolve, reject) {
				try {
					var store = db.transaction([storeName], 'readwrite').objectStore(storeName);

					var request = store.get(name);

					request.onerror = function(e) {
						console.log(e);
						reject(e);
					};

					request.onsuccess = function() {
						// console.log('Successfully retrieved blob');
						resolve(request.result);
					};
				} catch (e) {
					console.log(e);
					reject(e);
				}
			});
		};
	}

	function savePak(name, blob) {
		Sys.Print('Store.savePak(' + name + ', ' + blob + ')');

		return function(db) {
			return new Promise(function(resolve, reject) {
				try {
					var store = db.transaction(['pak'], 'readwrite').objectStore('pak');

					var request = store.add({
						pakName: name,
						data: blob
					});

					request.onerror = function(e) {
						console.log(e);
						reject(e);
					};

					request.onsuccess = function() {
						// console.log('Successfully saved blob');
						resolve();
					};
				} catch (e) {
					console.log(e);
					reject(e);
				}
			});
		};
	}

	return {
		get: function(pakName) {
			return verifyOpen().then(getPak(pakName));
		},
		set: function(pakName, blob) {
			return verifyOpen().then(savePak(pakName, blob));
		}
	};
}());