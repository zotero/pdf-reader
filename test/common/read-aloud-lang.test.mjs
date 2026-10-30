/* global globalThis */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

let userLanguages = ['en-US'];
Object.defineProperty(globalThis, 'navigator', {
	configurable: true,
	get: () => ({ languages: userLanguages }),
});

let source = ts.transpileModule(
	readFileSync(new URL('../../src/common/read-aloud/lang.ts', import.meta.url), 'utf8'),
	{ compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }
).outputText;
const { getFallbackLanguage } = await import(
	'data:text/javascript,' + encodeURIComponent(source)
);

test('getFallbackLanguage: prefers user languages in order', () => {
	let langs = ['ar-XA', 'de-DE', 'en-GB', 'en-US', 'fr-FR'];
	userLanguages = ['fr-CA', 'de-DE', 'en-US'];
	assert.equal(getFallbackLanguage(langs), 'fr-FR');
	userLanguages = ['it-IT', 'de'];
	assert.equal(getFallbackLanguage(langs), 'de-DE');
	userLanguages = ['en-GB', 'en'];
	assert.equal(getFallbackLanguage(langs), 'en-GB');
});

test('getFallbackLanguage: falls back to English, then first language', () => {
	userLanguages = ['it-IT'];
	assert.equal(getFallbackLanguage(['ar-XA', 'de-DE', 'en-GB', 'en-US']), 'en-US');
	assert.equal(getFallbackLanguage(['ar-XA', 'de-DE']), 'ar-XA');
	assert.equal(getFallbackLanguage([]), null);
	userLanguages = [];
	assert.equal(getFallbackLanguage(['ar-XA', 'en-GB']), 'en-GB');
});
