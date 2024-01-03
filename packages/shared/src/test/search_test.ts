import {assert} from 'chai';
import {
	findElementsInContent,
	findElementsInFiles,
	findImportsFromContent,
} from '../search.js';

describe('findImportsInContent', () => {
	it('returns single-quote imports', () => {
		const input = `import './test.js';`;
		const imports = findImportsFromContent(input);
		assert.deepEqual(imports, ['./test.js']);
	});

	it('returns double-quote imports', () => {
		const input = `import "./test.js";`;
		const imports = findImportsFromContent(input);
		assert.deepEqual(imports, ['./test.js']);
	});

	it('returns relative imports', () => {
		const input = `import "./relative/path/test.js";`;
		const imports = findImportsFromContent(input);
		assert.deepEqual(imports, ['./relative/path/test.js']);
	});

	it('returns relative imports without extension', () => {
		const input = `import "./relative/path/test";`;
		const imports = findImportsFromContent(input);
		assert.deepEqual(imports, ['./relative/path/test']);
	});

	it('returns bare module specifiers', () => {
		const input = `import "module";`;
		const imports = findImportsFromContent(input);
		assert.deepEqual(imports, ['module']);
	});

	it('returns an array', () => {
		const input = `import './test.js';
import "module";`;
		const imports = findImportsFromContent(input);
		assert.deepEqual(imports, ['./test.js', 'module']);
	});

	it("shouldn't return a distinct result", () => {
		const input = `import './test.js';
import './test.js';`;
		const result = findImportsFromContent(input);
		assert.equal(result.length, 2);
		assert.deepEqual(result, ['./test.js', './test.js']);
	});
});

describe('findElementsInContent', () => {
	it('should find elements', async () => {
		const input = `<md-icon>settings</md-icon>`;
		const elements = await findElementsInContent(input);

		assert.equal(elements[0], 'md-icon');
	});

	it('should find multiple elements', async () => {
		const input = `
          <md-icon>settings</md-icon>
          <md-menu>
            <md-menu-item>test</md-menu-item>
          </md-menu>
          `;
		const elements = await findElementsInContent(input);

		assert.deepEqual(elements, ['md-icon', 'md-menu', 'md-menu-item']);
	});

	it('should return a distinct result', async () => {
		const input = `
          <md-icon>settings</md-icon>
          <md-icon>delete</md-icon>
          `;
		const elements = await findElementsInContent(input);

		assert.deepEqual(elements, ['md-icon']);
		assert.equal(elements.length, 1);
	});

	it('should ignore comments', async () => {
		const input = ` // <md-fab></md-fab>
          // <md-icon>settings</md-icon>
          <!-- <md-chip-set></md-chip-set> -->
          <md-circular-progress></md-circular-progress>
          `;
		const elements = await findElementsInContent(input);

		assert.deepEqual(elements, ['md-circular-progress']);
		assert.equal(elements.length, 1);
	});

	it('should prune fake elements', async () => {
		const input = `
          <md-icon>settings</md-icon>
          <md-this-element-does-not-exist></md-this-element-does-not-exist>`;
		const elements = await findElementsInContent(input);

		assert.deepEqual(elements, ['md-icon']);
		assert.equal(elements.length, 1);
	});
});

describe('findElementsInFiles', () => {
	it('should find elements from a glob pattern', async () => {
		const elements = await findElementsInFiles(
			'./test-fixtures/src/**/*.{js,ts}'
		);
		assert.deepEqual(elements, [
			'md-circular-progress',
			'md-icon',
			'md-fab',
			'md-icon-button',
		]);
	});
});
