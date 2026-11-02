// Preloaded by `npm test` (`node --import ./test/register.mjs`) so that tests can
// import source modules the same way webpack resolves them in the app:
//
// - Extensionless relative imports resolve using webpack's `resolve.extensions`
// - TypeScript is transpiled with the project's own compiler, which (unlike
//   Node's built-in type stripping) elides type-only imports and supports enums,
//   parameter properties, etc.
//
// Tests can still register their own hooks to stub modules; those run first
// and fall through to these.

import { readFileSync } from 'node:fs';
import { registerHooks, setSourceMapsSupport } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Keep in sync with `resolve.extensions` in webpack.config.js
const EXTENSIONS = ['.js', '.ts', '.tsx'];
const TS_EXTENSION_RE = /\.[mc]?tsx?$/;
// All app source is ESM, but package.json has no "type": "module"
const SRC_URL = new URL('../src/', import.meta.url).href;

const COMPILER_OPTIONS = {
	module: ts.ModuleKind.ESNext,
	target: ts.ScriptTarget.ES2023,
	jsx: ts.JsxEmit.React,
	inlineSourceMap: true,
	inlineSources: true,
};

setSourceMapsSupport(true);

function resolveWithExtensions(specifier, context, nextResolve) {
	try {
		return nextResolve(specifier, context);
	}
	catch (e) {
		let isPath = /^\.{0,2}\//.test(specifier);
		let hasExtension = /\.[a-z]+$/i.test(specifier);
		if (!isPath || hasExtension) {
			throw e;
		}
		for (let extension of EXTENSIONS) {
			try {
				return nextResolve(specifier + extension, context);
			}
			catch {}
		}
		throw e;
	}
}

registerHooks({
	resolve(specifier, context, nextResolve) {
		let resolved = resolveWithExtensions(specifier, context, nextResolve);
		if (resolved.url.startsWith(SRC_URL) && resolved.url.endsWith('.js')) {
			return { ...resolved, format: 'module' };
		}
		return resolved;
	},

	load(url, context, nextLoad) {
		if (!url.startsWith('file:') || !TS_EXTENSION_RE.test(url) || url.includes('/node_modules/')) {
			return nextLoad(url, context);
		}
		let fileName = fileURLToPath(url);
		let { outputText } = ts.transpileModule(readFileSync(fileName, 'utf8'), {
			fileName,
			compilerOptions: COMPILER_OPTIONS,
		});
		return { format: 'module', source: outputText, shortCircuit: true };
	},
});
