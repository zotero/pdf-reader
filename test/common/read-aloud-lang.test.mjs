/* global globalThis */

import assert from 'node:assert/strict';
import test from 'node:test';

import { getFallbackLanguage, normalizeMetadataLanguage } from '../../src/common/read-aloud/lang.ts';

let userLanguages = ['en-US'];
Object.defineProperty(globalThis, 'navigator', {
	configurable: true,
	get: () => ({ languages: userLanguages }),
});

test('normalizeMetadataLanguage: canonicalizes language tags', () => {
	assert.equal(normalizeMetadataLanguage('en-US'), 'en-US');
	assert.equal(normalizeMetadataLanguage('EN-US'), 'en-US');
	assert.equal(normalizeMetadataLanguage('en_US'), 'en-US');
	assert.equal(normalizeMetadataLanguage(' DE '), 'de');
	assert.equal(normalizeMetadataLanguage('zh-hans-cn'), 'zh-Hans-CN');
	assert.equal(normalizeMetadataLanguage('fil'), 'fil');
});

test('normalizeMetadataLanguage: uses the first valid language in a list', () => {
	assert.equal(normalizeMetadataLanguage('en; nl'), 'en');
	assert.equal(normalizeMetadataLanguage('und; de'), 'de');
	assert.equal(normalizeMetadataLanguage('x-none, fr-FR'), 'fr-FR');
});

test('normalizeMetadataLanguage: maps ISO 639-2/3 codes', () => {
	assert.equal(normalizeMetadataLanguage('eng'), 'en');
	assert.equal(normalizeMetadataLanguage('ger'), 'de');
	assert.equal(normalizeMetadataLanguage('fre-CA'), 'fr-CA');
	assert.equal(normalizeMetadataLanguage('tgl'), 'fil');
});

test('normalizeMetadataLanguage: rejects non-languages', () => {
	for (let value of ['', 'x-none', 'x-unknown', 'und', 'mul', 'i-klingon', 'English', 'en-US.UTF-8', null, 5]) {
		assert.equal(normalizeMetadataLanguage(value), null, `${JSON.stringify(value)}`);
	}
});

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
