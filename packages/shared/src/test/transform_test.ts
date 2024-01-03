/**
 * @license
 * Copyright (c) 2024 Valentin Degenne
 * SPDX-License-Identifier: MIT
 */
import {assert} from 'chai';
import {transform} from '../transform.js';
import {findImportsFromContent} from '../search.js';

describe('Transformation', () => {
	describe("'perFile' mode transformation", () => {
		it('should transform the content according to the specs', async () => {
			const input = `
import "@material/web/all.js";
import "@material/web/all.js";
const test = \`<md-icon>settings</md-icon>\`;
const test2 = \`<md-menu>
                    <md-menu-item>one</md-menu-item>
                    <md-menu-item>two</md-menu-item>
               </md-menu>
               <md-fake-element></md-fake-element>
               <!-- <md-circular-progress></md-circular-progress> -->\`;
// <md-icon-button></md-icon-button>
/* <md-icon-button></md-icon-button> */
               `;

			const output = await transform(input, 'perFile', [
				'md-filled-icon-button',
			]);
			const imports = findImportsFromContent(output);

			assert.deepEqual(imports, [
				'@material/web/icon/icon.js',
				'@material/web/menu/menu.js',
				'@material/web/menu/menu-item.js',
				'@material/web/iconbutton/filled-icon-button.js',
				// Because '@material/web/all.js' was imported twice in this example.
				// TODO: however this should be avoided.
				'@material/web/iconbutton/filled-icon-button.js',
			]);
			// assert.notInclude(output, 'import "@material/web/all.js"');
			// assert.notInclude(
			// 	output,
			// 	'import "@material/web/progress/circular-progress.js"'
			// );
		});
	});

	describe("'all' mode transformation", () => {
		it('should throw if elements were not provided', async () => {
			let threw = false;
			try {
				await transform('', 'all');
			} catch {
				threw = true;
			}
			assert.isTrue(threw);
		});

		it('should transform the content according to the specs', async () => {
			const input = `
import '@material/web/all.js';

// any content
               `;

			const output = await transform(input, 'all', [
				'md-icon',
				'md-icon',
				'md-icon-button',
			]);

			const imports = findImportsFromContent(output);
			assert.deepEqual(imports, [
				'@material/web/icon/icon.js',
				'@material/web/iconbutton/icon-button.js',
			]);
		});
	});
});
