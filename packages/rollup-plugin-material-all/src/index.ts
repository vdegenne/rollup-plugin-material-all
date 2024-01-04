/**
 * @license
 * Copyright (c) 2024 Valentin Degenne
 * SPDX-License-Identifier: MIT
 */
import {type Plugin as RollupPlugin} from 'rollup';
import {type Plugin as VitePlugin} from 'vite';
import {
	type MaterialAllPluginOptions,
	createFilter,
	DEFAULT_INCLUDE,
	transform,
	findElementsInFiles,
} from 'rollup-plugin-material-all-shared';

export function materialAll(
	options: Partial<MaterialAllPluginOptions> = {}
): RollupPlugin & VitePlugin {
	options.mode ??= 'perFile';
	options.include ??= DEFAULT_INCLUDE;

	const filter = createFilter(options.include, options.exclude);

	let elements = options.additionalElements ?? [];

	return {
		name: 'material-all',

		/** Vite-only attribute */
		apply: 'build',

		async buildStart() {
			// Scan the code to find md-* elements in 'all' mode
			if (options.mode == 'all') {
				const elementsFoundInFiles = await findElementsInFiles(
					options.include!
				);
				elements = elements.concat(elementsFoundInFiles);
			}
		},

		async transform(code: string, id: string) {
			if (filter(id)) {
				const result = await transform(code, id, options.mode, elements);
				return result;
			}
		},
	};
}
