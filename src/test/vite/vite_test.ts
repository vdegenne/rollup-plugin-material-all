import {Plugin, build as viteBuild} from 'vite';
import {materialAll} from '../../index.js';
import type {OutputChunk, RollupOutput} from 'rollup';
import {assert} from 'chai';

// Used to silence empty chunk warnings
global.console.warn = () => '';

async function build(materialAllPlugin: Plugin) {
	return (
		(await viteBuild({
			esbuild: {
				legalComments: 'none',
			},
			logLevel: 'silent',
			build: {
				write: false,
				minify: false,
				modulePreload: {
					polyfill: false,
				},
				rollupOptions: {
					output: {
						chunkFileNames: 'assets/[name].js',
						entryFileNames: 'assets/[name].js',
					},
				},
			},
			plugins: [materialAllPlugin],
		})) as RollupOutput
	).output;
}

const include = 'test-fixtures/src/**/*.js';

describe('Vite', () => {
	describe("'perFile' mode", () => {
		it('includes elements per file', async () => {
			const output = await build(
				materialAll({
					include,
					mode: 'perFile', // default
				})
			);

			const aModule = output.find((out) => out.name === 'a') as OutputChunk;
			const bModule = output.find((out) => out.name === 'b') as OutputChunk;
			assert.include(aModule.code, 'let MdIcon ');
			assert.notInclude(aModule.code, 'let MdTextButton ');
			assert.include(bModule.code, 'let MdMenu ');
			assert.include(bModule.code, 'let MdMenuItem ');
			assert.notInclude(bModule.code, 'let MdCircularProgress ');

			// Material all import should be removed
			const mAllModule = output.find(
				(out) => out.name === 'material'
			) as OutputChunk;
			// equal to 1 because of the EOF return
			assert.equal(mAllModule.code.length, 1);
		});

		it('accepts additional elements', async () => {
			const output = await build(
				materialAll({
					include,
					mode: 'perFile',
					additionalElements: ['md-circular-progress'],
				})
			);

			const aModule = output.find((out) => out.name === 'a') as OutputChunk;
			const bModule = output.find((out) => out.name === 'b') as OutputChunk;
			assert.include(aModule.code, 'let MdIcon ');
			assert.notInclude(aModule.code, 'let MdTextButton ');
			assert.include(bModule.code, 'let MdMenu ');
			assert.include(bModule.code, 'let MdMenuItem ');
			assert.notInclude(bModule.code, 'let MdCircularProgress ');

			// Material all import should be removed
			const mAllModule = output.find(
				(out) => out.name === 'material'
			) as OutputChunk;
			assert.include(mAllModule.code, 'let MdCircularProgress ');
		});
	});

	describe("'all' mode", () => {
		it('bundles everything in place of `all.js` import', async () => {
			const output = await build(
				materialAll({
					include,
					mode: 'all',
				})
			);

			const aModule = output.find((out) => out.name === 'a') as OutputChunk;
			const bModule = output.find((out) => out.name === 'b') as OutputChunk;
			assert.notInclude(aModule.code, 'let MdIcon ');
			assert.notInclude(bModule.code, 'let MdMenu ');
			assert.notInclude(bModule.code, 'let MdMenuItem ');

			// Everything is at material all.js import
			const mAllModule = output.find(
				(out) => out.name === 'material'
			) as OutputChunk;
			assert.include(mAllModule.code, 'let MdIcon ');
			assert.include(mAllModule.code, 'let MdMenu ');
			assert.include(mAllModule.code, 'let MdMenuItem ');
			assert.notInclude(mAllModule.code, 'let MdCircularProgress ');
		});

		it('additional elements can be supplied', async () => {
			const output = await build(
				materialAll({
					include,
					mode: 'all',
					additionalElements: ['md-circular-progress', 'md-text-button'],
				})
			);

			const aModule = output.find((out) => out.name === 'a') as OutputChunk;
			const bModule = output.find((out) => out.name === 'b') as OutputChunk;
			assert.notInclude(aModule.code, 'let MdIcon ');
			assert.notInclude(bModule.code, 'let MdMenu ');
			assert.notInclude(bModule.code, 'let MdMenuItem ');

			// Everything is at material all.js import
			const mAllModule = output.find(
				(out) => out.name === 'material'
			) as OutputChunk;
			assert.include(mAllModule.code, 'let MdIcon ');
			assert.include(mAllModule.code, 'let MdMenu ');
			assert.include(mAllModule.code, 'let MdMenuItem ');
			assert.include(mAllModule.code, 'let MdCircularProgress ');
			assert.include(mAllModule.code, 'let MdTextButton ');
		});
	});
});
