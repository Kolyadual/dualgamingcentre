Func = {
	curry: (fn) => {
		var fnArity = fn.length;
		var f = (args) => {
			return () => {
				var newArgs = (args || []).concat([].slice.call(arguments, 0));
				if (newArgs.length >= fnArity) {
					return fn.apply(this, newArgs);
				} else {
					return f(newArgs);
				}
			};
		};

		return f([]);
	},
	always: (x) => {
		return () => {
			return x;
		};
	}
};