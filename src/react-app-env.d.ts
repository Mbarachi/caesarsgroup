/// <reference types="react-scripts" />

interface WebpackRequireContext {
	keys: () => string[];
	<T = string>(id: string): T;
}

interface NodeRequire {
	context: (
		directory: string,
		useSubdirectories: boolean,
		regExp: RegExp
	) => WebpackRequireContext;
}
