Sys = {};

Sys.debug = false;

Sys.Quit = function() {
	process.exit(0);
};

Sys.Print = function(text) {
	process.stdout.write(text);
};

// noinspection DuplicatedCode
Sys.DPrint = function(id, name, args) {
	if (Sys.debug) {
		if (typeof args === 'object') {
			Sys.Print(id + '.' + name + '(' + [].slice.apply(args) + ')');
		} else {
			Sys.Print(id);
		}
	}
};

Sys.Error = function(text) {
	console.log(text);

	throw new Error(text);
};

Sys.FloatTime = function() {
	var time = process.hrtime(Sys.oldtime);

	return time[0] + (time[1] / 1000000000.0);
};

Sys.cmd = '';

Sys.ConsoleInput = function() {
	var text = Sys.cmd;

	if (text.length === 0) {
		return;
	}

	Sys.cmd = '';

	return text;
};

Sys.main = function() {
	COM.InitArgv(process.argv.slice(1));
	Sys.oldtime = process.hrtime();
	//Sys.Print('Host.Init\n');
	Host.Init();
	process.stdin.resume();
	process.stdin.on('data', Sys.StdinOnData);
	process.nextTick(Host.Frame);
};

Sys.StdinOnData = function(data) {
	Sys.cmd += Q.memstr(data);
};