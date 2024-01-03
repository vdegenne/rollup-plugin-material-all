import {assert} from 'chai';
import {
	MATERIAL_ALL_IMPORT_REGEX,
	MATERIAL_ELEMENT_REGEX,
} from '../constants.js';

describe('MATERIAL_ALL_IMPORT_REGEXP', () => {
	it('matches double-quotes imports', () => {
		assert.isTrue(
			MATERIAL_ALL_IMPORT_REGEX.test(`import "@material/web/all.js";`)
		);
	});
	it('matches single-quote imports', () => {
		assert.isTrue(
			MATERIAL_ALL_IMPORT_REGEX.test(`import '@material/web/all.js';`)
		);
	});
	it('matches without .js extension explicitely written', () => {
		assert.isTrue(
			MATERIAL_ALL_IMPORT_REGEX.test(`import '@material/web/all';`)
		);
	});
	it('matches without a final semi colon', () => {
		assert.isTrue(
			MATERIAL_ALL_IMPORT_REGEX.test(`import '@material/web/all.js'`)
		);
	});
	it('can have spaces before semi colon', () => {
		assert.isTrue(
			MATERIAL_ALL_IMPORT_REGEX.test(`import '@material/web/all.js'    ;`)
		);
	});
	it('matches even with spaces', () => {
		assert.isTrue(
			MATERIAL_ALL_IMPORT_REGEX.test(`import    '@material/web/all.js'   `)
		);
	});
	it('matches anywhere', () => {
		assert.isTrue(
			MATERIAL_ALL_IMPORT_REGEX.test(`

               import    '@material/web/all.js'

               ;`)
		);
	});
	it('can be used to replace import', () => {
		const input = `AAAA import   '@material/web/all.js'    ; BBBB`;
		const replaced = input.replace(MATERIAL_ALL_IMPORT_REGEX, 'REPLACED');
		assert.equal(replaced, 'AAAA REPLACED BBBB');
	});
	it('can be used to replace multiple imports', () => {
		const input = `AAAA import   '@material/web/all.js'    ; BBBB
          CCCC import '@material/web/all.js'; DDDD
          `;
		const replaced = input.replace(
			new RegExp(MATERIAL_ALL_IMPORT_REGEX, 'g'),
			'REPLACED'
		);
		assert.equal(
			replaced,
			`AAAA REPLACED BBBB
          CCCC REPLACED DDDD
          `
		);
	});
});

describe('MATERIAL_ELEMENT_REGEXP', () => {
	it('matches basic element', () => {
		const input = `<md-icon>settings</md-icon>`;
		const match = input.match(MATERIAL_ELEMENT_REGEX);
		assert.equal(match[1], 'md-icon');
	});
	it('matches multi-line element', () => {
		const input = `<md-icon>
          settings
          </md-icon>
          `;
		const match = input.match(MATERIAL_ELEMENT_REGEX);
		assert.equal(match[1], 'md-icon');
	});
	it('matches broken tag', () => {
		const input = `<md-icon
          >
          settings
          </md-icon>
          `;
		const match = input.match(MATERIAL_ELEMENT_REGEX);
		assert.equal(match[1], 'md-icon');
	});
	it('ignores arrow functions', () => {
		const input = `<md-icon @click=${() => console.log('test')}
          >settings</md-icon>`;
		const match = input.match(MATERIAL_ELEMENT_REGEX);
		assert.equal(match[1], 'md-icon');
	});
	it('can be used to match multiple elements', () => {
		const input = `<md-icon
          >settings</md-icon>
          <md-menu>
            <md-menu-item>test</md-menu-item>
          </md-menu>
          `;
		const matches = input.matchAll(new RegExp(MATERIAL_ELEMENT_REGEX, 'g'));
		let elements = [];
		for (const match of matches) {
			elements.push(match[1]);
		}
		assert.deepEqual(elements, ['md-icon', 'md-menu', 'md-menu-item']);
	});
});
