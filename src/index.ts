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

const DEFAULT_INCLUDE = 'src/**/*.{js,ts,jsx,tsx}';

export function materialAll(
	options: Partial<MaterialAllPluginOptions> = {}
): RollupPlugin & VitePlugin {
	options.mode ??= 'perFile';
	options.include ??= DEFAULT_INCLUDE;
	options.includeComments ??= false;

	const filter = createFilter(options.include, options.exclude);

	let elements = options.additionalElements ?? [];

	return {
		name: 'material-all',

		/** Vite-only attribute */
		// apply: 'build',

		async buildStart() {
			// Scan the code to find md-* elements in 'all' mode
			if (options.mode == 'all') {
				const files = await fastGlob(options.include);
				const elementsFoundInFiles = await findElementsFromFiles(
					files,
					options.includeComments
				);
				elements = elements.concat(elementsFoundInFiles);
			}
		},

		async transform(code: string, id: string) {
			if (filter(id)) {
				const result = await transform(
					code,
					id,
					options.mode,
					elements,
					options.includeComments
				);
				return result;
			}
		},
	};
}
