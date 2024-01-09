import {OutputChunk, rollup} from 'rollup';
import {materialAll} from '../../index.js';
import {expect} from 'chai';
import {
	findImportsFromContent,
	getElementImportsMap,
} from 'rollup-plugin-material-all-shared';

describe('Rollup', () => {
	it('"perFile" mode', async () => {
		const bundle = await rollup({
			input: './test-fixtures/src/entry.js',
			plugins: [
				materialAll({
					include: './test-fixtures/src/**/*.js',
					mode: 'perFile', // default
				}),
			],
		});

		const {output} = await bundle.generate({
			format: 'es',
		});

		const aModule = output.find((o) => o.name == 'a') as OutputChunk;
		const bModule = output.find((o) => o.name == 'b') as OutputChunk;
		const materialModule = output.find(
			(o) => o.name == 'material',
		) as OutputChunk;

		const aImports = findImportsFromContent(aModule.code);
		expect(aImports).to.include('@material/web/icon/icon.js');

		const bImports = findImportsFromContent(bModule.code);
		expect(bImports).to.include('@material/web/menu/menu.js');

		// Rollup will simply omit the file if it's an empty chunk
		expect(materialModule).to.be.undefined;
	});

	it('"all" mode', async () => {
		const bundle = await rollup({
			input: './test-fixtures/src/entry.js',
			plugins: [
				materialAll({
					include: './test-fixtures/src/**/*.js',
					mode: 'all',
				}),
			],
		});

		const {output} = await bundle.generate({
			format: 'es',
		});

		const aModule = output.find((o) => o.name == 'a') as OutputChunk;
		const bModule = output.find((o) => o.name == 'b') as OutputChunk;
		const materialModule = output.find(
			(o) => o.name == 'material',
		) as OutputChunk;

		const aImports = findImportsFromContent(aModule.code);
		expect(aImports.length).to.be.equal(0);

		const bImports = findImportsFromContent(bModule.code);
		expect(bImports.length).to.be.equal(0);

		const materialImports = findImportsFromContent(materialModule.code);
		expect(materialImports.length).to.be.equal(3);
		expect(materialImports).to.deep.equal([
			'@material/web/menu/menu.js',
			'@material/web/menu/menu-item.js',
			'@material/web/icon/icon.js',
		]);
	});
});
