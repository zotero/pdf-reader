'use strict';

import React from 'react';

export function IconHighlight() {
	return (
		<svg width="12" height="12" viewBox="0 0 12 12">
			<path fill="currentColor" d="M12,5H0V3H12Zm0,1H0V8H12ZM9,9H0v2H9Zm3-9H3V2h9Z"/>
		</svg>
	);
}

export function IconNote() {
	return (
		<svg width="12" height="12" viewBox="0 0 12 12">
			<path fill="currentColor" d="M0,7H5v5ZM0,0V6H6v6h6V0Z"/>
		</svg>
	);
}

export function IconArea() {
	return (
		<svg width="12" height="12" viewBox="0 0 12 12">
			<path fill="currentColor" d="M2,7V2H7V7Zm8,2V7H9V9H7v1H9v2h1V10h2V9ZM1,1H9V6h1V0H0V10H6V9H1Z"/>
		</svg>
	);
}

export function IconNoteLarge() {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24">
			<polygon fill="currentColor" points="0.5 0.5 23.5 0.5 23.5 23.5 11.5 23.5 0.5 12.5 0.5 0.5"/>
			<polygon points="0.5 12.5 11.5 12.5 11.5 23.5 0.5 12.5" fill="#fff" opacity="0.4"/>
			<path d="M0,0V12.707L11.293,24H24V0ZM11,22.293,1.707,13H11ZM23,23H12V12H1V1H23Z"/>
		</svg>
	);
}
