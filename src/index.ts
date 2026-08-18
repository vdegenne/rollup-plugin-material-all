/**
 * @license
 * Copyright (c) 2024 Valentin Degenne
 * SPDX-License-Identifier: MIT
 */
import {type Plugin as RollupPlugin} from 'rollup';
import {type Plugin as VitePlugin} from 'vite';
import {type MaterialAllPluginOptions} from './types.js';
import {createFilter} from '@rollup/pluginutils';
import fastGlob from 'fast-glob';
import {findElementsFromFiles} from 'mwc3-back-helpers';
import {transform} from './transform.js';

export function materialAll(
	options?: Partial<MaterialAllPluginOptions>
): RollupPlugin & VitePlugin {
	const _options: MaterialAllPluginOptions = {
		mode: 'perFile',
		include: './{src,lib}/**/*.{ts,js,jsx,tsx}',
		exclude: null,
		additionalElements: [],
		includeComments: false,
		...options,
	};

	const filter = createFilter(_options.include, _options.exclude);

	let elements = _options.additionalElements ?? [];

	return {
		name: 'material-all',

		/** Vite-only attribute */
		// apply: 'build',

		async buildStart() {
			// Scan the code to find md-* elements in 'all' mode
			if (_options.mode == 'all') {
				const files = await fastGlob(_options.include);
				const elementsFoundInFiles = await findElementsFromFiles(
					files,
					_options.includeComments
				);
				elements = elements.concat(elementsFoundInFiles);
			}
		},

		async transform(code: string, id: string) {
			if (!filter(id)) return null;

			const result = await transform(
				code,
				id,
				_options.mode,
				elements,
				_options.includeComments
			);
			return result;
		},
	};
}
