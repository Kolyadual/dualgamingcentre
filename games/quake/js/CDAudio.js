CDAudio = {};

CDAudio.id = 'CDAudio';

CDAudio.known = [];

CDAudio.Play = function(track, looping) {
	Sys.DPrint(CDAudio.id, 'Play', arguments);

	if ((CDAudio.initialized !== true) || (CDAudio.enabled !== true)) {
		return;
	}

	track -= 1;

	if (CDAudio.playTrack === track) {
		if (CDAudio.cd != null) {
			CDAudio.cd.loop = looping;

			if ((looping === true) && (CDAudio.cd.paused === true)) {
				// noinspection JSIgnoredPromiseFromCall
				CDAudio.cd.play();
			}
		}

		return;
	}

	if ((track < 0) || (track >= CDAudio.known.length)) {
		Con.DPrint('CDAudio.Play: Bad track number ' + (track + 1) + '.\n');

		return;
	}

	CDAudio.Stop();
	CDAudio.playTrack = track;
	CDAudio.cd = new Audio(CDAudio.known[track]);
	CDAudio.cd.loop = looping;
	CDAudio.cd.volume = CDAudio.cdvolume;
	// noinspection JSIgnoredPromiseFromCall
	CDAudio.cd.play();
};

CDAudio.Stop = function() {
	Sys.DPrint('CDAudio.Stop()');

	if ((CDAudio.initialized !== true) || (CDAudio.enabled !== true)) {
		return;
	}

	if (CDAudio.cd != null) {
		CDAudio.cd.pause();
	}

	CDAudio.playTrack = null;
	CDAudio.cd = null;
};

CDAudio.Pause = function() {
	Sys.DPrint('CDAudio.Pause()');

	if ((CDAudio.initialized !== true) || (CDAudio.enabled !== true)) {
		return;
	}

	if (CDAudio.cd != null) {
		CDAudio.cd.pause();
	}
};

CDAudio.Resume = function() {
	Sys.DPrint('CDAudio.Resume()');

	if ((CDAudio.initialized !== true) || (CDAudio.enabled !== true)) {
		return;
	}

	if (CDAudio.cd != null) {
		// noinspection JSIgnoredPromiseFromCall
		CDAudio.cd.play();
	}
};

CDAudio.CD_f = function() {
	Sys.DPrint('CDAudio.CD_f()');

	if ((CDAudio.initialized !== true) || (Cmd.argv.length <= 1)) {
		return;
	}

	var command = Cmd.argv[1].toLowerCase();

	switch (command) {
		case 'on':
			CDAudio.enabled = true;
			return;
		case 'off':
			CDAudio.Stop();
			CDAudio.enabled = false;
			return;
		case 'play':
			CDAudio.Play(Q.atoi(Cmd.argv[2]), false);
			return;
		case 'loop':
			CDAudio.Play(Q.atoi(Cmd.argv[2]), true);
			return;
		case 'stop':
			CDAudio.Stop();
			return;
		case 'pause':
			CDAudio.Pause();
			return;
		case 'resume':
			CDAudio.Resume();
			return;
		case 'info':
			Con.Print(CDAudio.known.length + ' tracks\n');

			if (CDAudio.cd != null) {
				if (CDAudio.cd.paused !== true) {
					Con.Print('Currently ' + (CDAudio.cd.loop === true ? 'looping' : 'playing') + ' track ' + (CDAudio.playTrack + 2) + '\n');
				}
			}

			Con.Print('Volume is ' + CDAudio.cdvolume + '\n');
			return;
	}
};

CDAudio.Update = function() {
	// Sys.DPrint('CDAudio.Update()');

	if ((CDAudio.initialized !== true) || (CDAudio.enabled !== true)) {
		return;
	}

	if (S.bgmvolume.value === CDAudio.cdvolume) {
		return;
	}

	if (S.bgmvolume.value < 0.0) {
		Cvar.SetValue('bgmvolume', 0.0);
	} else if (S.bgmvolume.value > 1.0) {
		Cvar.SetValue('bgmvolume', 1.0);
	}

	CDAudio.cdvolume = S.bgmvolume.value;

	if (CDAudio.cd != null) {
		CDAudio.cd.volume = CDAudio.cdvolume;
	}
};

CDAudio.Init = function() {
	Sys.DPrint('CDAudio.Init()');

	Cmd.AddCommand('cd', CDAudio.CD_f);

	if (COM.CheckParm('-nocdaudio') != null) {
		return;
	}

	var i, j, track;
	var xhr = new XMLHttpRequest();

	for (i = 2; i <= 99; ++i) {
		track = '/music/track' + (i <= 9 ? '0' : '') + i + '.ogg';

		for (j = COM.searchpaths.length - 1; j >= 0; --j) {
			xhr.open('HEAD', Def.basedir + COM.searchpaths[j].filename + track, false);
			xhr.send();

			if ((xhr.status >= 200) && (xhr.status <= 299)) {
				CDAudio.known[i - 1] = Def.basedir + COM.searchpaths[j].filename + track;
				break;
			}
		}

		if (j < 0) {
			break;
		}
	}

	if (CDAudio.known.length === 0) {
		return;
	}

	CDAudio.initialized = CDAudio.enabled = true;
	CDAudio.Update();
	Con.Print('CD Audio Initialized\n');
};