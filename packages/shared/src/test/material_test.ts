import {assert} from 'chai';
import {getElementImportsMap, pruneFakeElements} from '../material.js';

describe('Material helpers', () => {
	it('loads some cached values', async () => {
		assert.equal(
			(await getElementImportsMap())['md-icon'],
			'@material/web/icon/icon.js'
		);
	});

	it('can prune fake elements', async () => {
		const elements = ['md-icon', 'md-fake-element', 'md-icon-button', 'fake'];
		const pruned = await pruneFakeElements(elements);
		assert.deepEqual(pruned, ['md-icon', 'md-icon-button']);
	});
});
