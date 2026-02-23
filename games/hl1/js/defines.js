// region Base64

if (typeof atob === 'undefined') {
	// noinspection DuplicatedCode
	atob = function(input) {
		var str = String(input).replace(/[=]+$/, '');

		if (str.length % 4 === 1) {
			throw "'atob' failed: The string to be decoded is not correctly encoded.";
		}
		// noinspection JSAssignmentUsedAsCondition,CommaExpressionJS,JSUnusedAssignment
		for (var bc = 0, bs, buffer, idx = 0, output = ''; buffer = str.charAt(idx++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
			buffer = chars.indexOf(buffer);
		}

		return output;
	}
}

if (typeof btoa === 'undefined') {
	// noinspection DuplicatedCode
	btoa = function(input) {
		var str = String(input);
		// noinspection JSAssignmentUsedAsCondition,CommaExpressionJS
		for (var block, charCode, idx = 0, map = chars, output = ''; str.charAt(idx | 0) || (map = '=', idx % 1); output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
			charCode = str.charCodeAt(idx += 3 / 4);

			if (charCode > 0xFF) {
				throw "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.";
			}

			// noinspection JSUnusedAssignment
			block = block << 8 | charCode;
		}

		return output;
	}
}

// endregion

(function() {
	var externallyFramed;

	try {
		externallyFramed = window.top.location.host !== window.location.host;
	} catch (e) {
		externallyFramed = true;
	}

	if (externallyFramed) {
		window.top.location = window.location;
	}
})();
