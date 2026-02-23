Cvar = {};

Cvar.id = 'Cvar';

Cvar.vars = [];

Cvar.FindVar = function(name) {
	// Sys.DPrint(Cvar.id, 'FindVar', arguments);

	var i;

	for (i = 0; i < Cvar.vars.length; ++i) {
		if (Cvar.vars[i].name === name) {
			return Cvar.vars[i];
		}
	}
};

Cvar.CompleteVariable = function(partial) {
	Sys.DPrint(Cvar.id, 'CompleteVariable', arguments);

	if (partial.length === 0) {
		return;
	}

	var i;

	for (i = 0; i < Cvar.vars.length; ++i) {
		if (Cvar.vars[i].name.substring(0, partial.length) === partial) {
			return Cvar.vars[i].name;
		}
	}
};

Cvar.Set = function(name, value) {
	Sys.DPrint(Cvar.id, 'Set', arguments);

	var i, v, changed;

	for (i = 0; i < Cvar.vars.length; ++i) {
		v = Cvar.vars[i];

		if (v.name !== name) {
			continue;
		}

		if (v.string !== value) {
			changed = true;
		}

		v.string = value;
		v.value = Q.atof(value);

		if ((v.server === true) && (changed === true) && (SV.server.active === true)) {
			Host.BroadcastPrint('"' + v.name + '" changed to "' + v.string + '"\n');
		}

		return;
	}

	Con.Print('Cvar.Set: variable ' + name + ' not found\n');
};

Cvar.SetValue = function(name, value) {
	Sys.DPrint(Cvar.id, 'SetValue', arguments);

	Cvar.Set(name, value.toFixed(6));
};

Cvar.RegisterVariable = function(name, value, archive, server) {
	Sys.DPrint(Cvar.id, 'RegisterVariable', arguments);

	var i;

	for (i = 0; i < Cvar.vars.length; ++i) {
		if (Cvar.vars[i].name === name) {
			Con.Print('Can\'t register variable ' + name + ', already defined\n');

			return;
		}
	}

	Cvar.vars[Cvar.vars.length] = {
		name: name,
		string: value,
		archive: archive,
		server: server,
		value: Q.atof(value)
	};

	return Cvar.vars[Cvar.vars.length - 1];
};

Cvar.Command = function() {
	Sys.DPrint('Cvar.Command()');

	var v = Cvar.FindVar(Cmd.argv[0]);

	if (v == null) {
		return;
	}

	if (Cmd.argv.length <= 1) {
		Con.Print('"' + v.name + '" is "' + v.string + '"\n');

		// noinspection JSConstructorReturnsPrimitive
		return true;
	}

	Cvar.Set(v.name, Cmd.argv[1]);

	// noinspection JSConstructorReturnsPrimitive
	return true;
};

Cvar.WriteVariables = function() {
	Sys.DPrint('Cvar.WriteVariables()');

	var f = [], i, v;

	for (i = 0; i < Cvar.vars.length; ++i) {
		v = Cvar.vars[i];

		if (v.archive === true) {
			f[f.length] = v.name + ' "' + v.string + '"\n';
		}
	}

	// noinspection JSConstructorReturnsPrimitive
	return f.join('');
};