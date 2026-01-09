// noinspection DuplicatedCode
IN = {};
// noinspection DuplicatedCode
IN.mouse_x = 0.0;
// noinspection DuplicatedCode
IN.mouse_y = 0.0;
// noinspection DuplicatedCode
IN.old_mouse_x = 0.0;
// noinspection DuplicatedCode
IN.old_mouse_y = 0.0;

// noinspection DuplicatedCode
IN.StartupMouse = () => {
	IN.m_filter = Cvar.RegisterVariable('m_filter', '1');

	if (COM.CheckParm('-nomouse') != null) {
		return;
	}

	if (VID.mainwindow.requestPointerLock != null) {
		IN.movementX = 'movementX';
		IN.movementY = 'movementY';
		IN.pointerLockElement = 'pointerLockElement';
		IN.requestPointerLock = 'requestPointerLock';
		IN.pointerlockchange = 'onpointerlockchange';
	} else {
		// noinspection JSUnresolvedVariable
		if (VID.mainwindow.webkitRequestPointerLock != null) {
			IN.movementX = 'webkitMovementX';
			IN.movementY = 'webkitMovementY';
			IN.pointerLockElement = 'webkitPointerLockElement';
			IN.requestPointerLock = 'webkitRequestPointerLock';
			IN.pointerlockchange = 'onwebkitpointerlockchange';
		} else {
			// noinspection JSUnresolvedVariable
			if (VID.mainwindow.mozRequestPointerLock != null) {
				IN.movementX = 'mozMovementX';
				IN.movementY = 'mozMovementY';
				IN.pointerLockElement = 'mozPointerLockElement';
				IN.requestPointerLock = 'mozRequestPointerLock';
				IN.pointerlockchange = 'onmozpointerlockchange';
			} else {
				return;
			}
		}
	}

	VID.mainwindow.onclick = IN.onclick;
	document.onmousemove = IN.onmousemove;
	document[IN.pointerlockchange] = IN.onpointerlockchange;
	IN.mouse_avail = true;
};

// noinspection DuplicatedCode
IN.Init = () => {
	IN.StartupMouse();
};

// noinspection DuplicatedCode
IN.Shutdown = () => {
	if (IN.mouse_avail === true) {
		VID.mainwindow.onclick = null;
		document.onmousemove = null;
		document[IN.pointerlockchange] = null;
	}
};

// noinspection DuplicatedCode
IN.MouseMove = () => {
	if (IN.mouse_avail !== true) {
		return;
	}

	var mouse_x, mouse_y;

	if (IN.m_filter.value !== 0) {
		mouse_x = (IN.mouse_x + IN.old_mouse_x) * 0.5;
		mouse_y = (IN.mouse_y + IN.old_mouse_y) * 0.5;
	}  else {
		mouse_x = IN.mouse_x;
		mouse_y = IN.mouse_y;
	}

	IN.old_mouse_x = IN.mouse_x;
	IN.old_mouse_y = IN.mouse_y;
	mouse_x *= CL.sensitivity.value;
	mouse_y *= CL.sensitivity.value;

	var strafe = CL.kbuttons[CL.kbutton.strafe].state & 1;
	var mlook = CL.kbuttons[CL.kbutton.mlook].state & 1;
	var angles = CL.state.viewangles;

	if ((strafe !== 0) || ((CL.lookstrafe.value !== 0) && (mlook !== 0))) {
		CL.state.cmd.sidemove += CL.m_side.value * mouse_x;
	} else {
		angles[1] -= CL.m_yaw.value * mouse_x;
	}

	if (mlook !== 0) {
		V.StopPitchDrift();
	}

	if ((mlook !== 0) && (strafe === 0)) {
		angles[0] += CL.m_pitch.value * mouse_y;

		if (angles[0] > 80.0) {
			angles[0] = 80.0;
		} else if (angles[0] < -70.0) {
			angles[0] = -70.0;
		}
	} else {
		if ((strafe !== 0) && (Host.noclip_anglehack === true)) {
			CL.state.cmd.upmove -= CL.m_forward.value * mouse_y;
		} else {
			CL.state.cmd.forwardmove -= CL.m_forward.value * mouse_y;
		}
	}

	IN.mouse_x = IN.mouse_y = 0;
};

// noinspection DuplicatedCode
IN.Move = () => {
	IN.MouseMove();
};

// noinspection DuplicatedCode
IN.onclick = () => {
	VID.mainwindow.focus();

	if (document[IN.pointerLockElement] !== this) {
		// this[IN.requestPointerLock]();
		VID.mainwindow[IN.requestPointerLock]();
	}

	// noinspection JSUnresolvedVariable, DuplicatedCode
	/*if (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) {
		if (VID.container.requestFullscreen) {
			VID.container.requestFullscreen();
		} else {
			// noinspection JSUnresolvedVariable
			if (VID.container.webkitRequestFullscreen) {
				VID.container.webkitRequestFullscreen();
			} else {
				// noinspection JSUnresolvedVariable
				if (VID.container.mozRequestFullScreen) {
					VID.container.mozRequestFullScreen();
				} else {
					// noinspection JSUnresolvedVariable
					if (VID.container.msRequestFullscreen) {
						VID.container.msRequestFullscreen();
					}
				}
			}
		}
	}*/
};

// noinspection DuplicatedCode
IN.onmousemove = (e) => {
	if (document[IN.pointerLockElement] !== VID.mainwindow) {
		return;
	}

	IN.mouse_x += e[IN.movementX];
	IN.mouse_y += e[IN.movementY];
};

// noinspection DuplicatedCode
IN.onpointerlockchange = async () => {
	if (document[IN.pointerLockElement] === VID.mainwindow) {
		// noinspection UnnecessaryReturnStatementJS
		return;
	}

	// await Key.Event(Key.k.escape, true);
	// await Key.Event(Key.k.escape);
};