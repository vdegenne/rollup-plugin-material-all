import {assert} from 'chai';
import {createFilter} from '../filter.js';

const files = [
	'/src/foo.js',
	'/src/bar.js',
	'/src/baz.js?inline',
	'/src/test.js.css',
	'/this/is/a/long/path.txt',
	'/index.html',
	'/bar/index.html',
	'/src/typescript.ts',
	'/public/image.png',
];

describe('filter.js', () => {
	it('accepts extension with a dot', () => {
		const filter = createFilter('src/*.js', '', {resolve: '/'});
		const filtered = files.filter((file) => filter(file));
		assert.deepEqual(filtered, ['/src/foo.js', '/src/bar.js']);
	});

	it('accepts glob patterns', () => {
		const filter = createFilter('src/*.{js,ts}', '', {resolve: '/'});
		const filtered = files.filter((file) => filter(file));
		assert.deepEqual(filtered, [
			'/src/foo.js',
			'/src/bar.js',
			'/src/typescript.ts',
		]);
	});

	it('accepts undefined', () => {
		// undefined acts as a non filter if it was not provided by the user.
		const filter = createFilter(undefined, undefined, {resolve: '/'});
		const filtered = files.filter((file) => filter(file));
		assert.deepEqual(filtered, files);
	});

	it('accepts array of filters', () => {
		const filter = createFilter(['src/*.js', 'src/*.ts'], undefined, {
			resolve: '/',
		});
		const filtered = files.filter((file) => filter(file));
		assert.deepEqual(filtered, [
			'/src/foo.js',
			'/src/bar.js',
			'/src/typescript.ts',
		]);
	});

	it('counters includes', () => {
		const filter = createFilter(['src/*.js', 'src/*.ts'], 'src/*.ts', {
			resolve: '/',
		});
		const filtered = files.filter((file) => filter(file));
		assert.deepEqual(filtered, ['/src/foo.js', '/src/bar.js']);
	});

	it('query string have their own filter', () => {
		const filter = createFilter('src/*.js*', undefined, {
			resolve: '/',
		});
		const filtered = files.filter((file) => filter(file));
		assert.deepEqual(filtered, [
			'/src/foo.js',
			'/src/bar.js',
			'/src/baz.js?inline',
			// Careful because it also includes other extensions than js
			'/src/test.js.css',
		]);
	});
});
