import {OutputChunk, rollup} from 'rollup';
import {materialAll} from '../../index.js';
import {expect} from 'chai';
import {findImportsInContent} from '../../utils.js';

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
			(o) => o.name == 'material'
		) as OutputChunk;

		const aImports = findImportsInContent(aModule.code);
		expect(aImports).to.include('@material/web/icon/icon.js');

		const bImports = findImportsInContent(bModule.code);
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
			(o) => o.name == 'material'
		) as OutputChunk;

		const aImports = findImportsInContent(aModule.code);
		expect(aImports.length).to.be.equal(0);

		const bImports = findImportsInContent(bModule.code);
		expect(bImports.length).to.be.equal(0);

		const materialImports = findImportsInContent(materialModule.code);
		expect(materialImports.length).to.be.equal(3);
		expect(materialImports).to.deep.equal([
			'@material/web/icon/icon.js',
			'@material/web/menu/menu.js',
			'@material/web/menu/menu-item.js',
		]);
	});
});
