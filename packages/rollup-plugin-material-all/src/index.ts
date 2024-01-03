/**
 * @license
 * Copyright (c) 2023 Valentin Degenne
 * SPDX-License-Identifier: MIT
 */
import type {Plugin as RollupPlugin} from 'rollup';
import type {ResolvedConfig, Plugin as VitePlugin} from 'vite';
import {grep} from './utils.js';
import pathlib from 'path';
import {existsSync} from 'fs';
import {readFile} from 'fs/promises';

const allFilePath = pathlib.join('node_modules', '@material', 'web', 'all.js');

type MaterialAllPluginOptions = {
	/**
	 * Glob pattern of the files to include in the search of the md elements.
	 * Defaults to all html, ts, js, tsx, jsx files under "src" directory.
	 */
	include: string;
};

export function materialAll(
	options: Partial<MaterialAllPluginOptions> = {}
): RollupPlugin {
	let importLine = '';

	// defaults
	const _options = {
		...({
			include: 'src/**/*.{html,ts,js,tsx,jsx}',
		} as MaterialAllPluginOptions),
		...(options ?? {}),
	};

	let viteConfig: ResolvedConfig | undefined;

	return {
		name: 'rollup-plugin-material-all',

		async buildStart() {
			if (viteConfig && viteConfig.command === 'serve') {
				return;
			}

			if (!existsSync(allFilePath)) {
				throw new Error(
					'ERROR @material/web installation not found, rollup-plugin-material-all ignored.'
				);
			}
			// Find all elements in sources.
			const elements = await grep(/<md-([\w-]+)[\s>]/g, _options.include);

			// Build the elements map
			const fileContent = await readFile(allFilePath);

			const imports = fileContent
				.toString()
				.match(
					/\/\/ go\/keep-sorted start\n([\s\S]*?)\n\/\/ go\/keep-sorted end/
				);
			const importsList = imports![1].split('\n');
			const elementsMap = new Map();
			for (const imp of importsList) {
				const nameMatch = imp.match(/([^/]+)\.js';$/);
				elementsMap.set(nameMatch![1], imp.replace(/\./, '@material/web'));
			}
			importLine = elements.map((name) => elementsMap.get(name)).join(' ');
		},

		transform(code: string) {
			const matches = code.matchAll(
				/import ['"]@material\/web\/all\.js['"]( ?;)?/g
			);

			// Replace each instance with a constant.
			for (const match of matches) {
				if (importLine) {
					code = code.replace(match[0], importLine + '\n');
				}
			}

			return code;
		},
	};
}
