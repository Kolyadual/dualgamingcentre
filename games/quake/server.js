// noinspection JSValidateTypes
Node = {
	dgram: require('dgram'),
	fs: require('fs'),
	http: require('http'),
	https: require('https'),
	os: require('os'),
	url: require('url'),
	websocket: require('websocket')
};

require('./js/server/Cmd.js');
require('./js/server/COM.js');
require('./js/server/Console.js');
require('./js/shared/CRC.js');
require('./js/shared/Cvar.js');
require('./js/shared/Def.js');
require('./js/shared/ED.js');
require('./js/server/Host.js');
require('./js/server/Mod.js');
require('./js/shared/MSG.js');
require('./js/server/NET.js');
require('./js/server/NET_Datagram.js');
require('./js/server/NET_WEBS.js');
require('./js/shared/PF.js');
require('./js/shared/PR.js');
require('./js/shared/Protocol.js');
require('./js/shared/Q.js');
require('./js/shared/SV.js');
require('./js/server/Sys.js');
require('./js/shared/SZ.js');
require('./js/shared/V.js');
require('./js/shared/Vec.js');

Sys.main();