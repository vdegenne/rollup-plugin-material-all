import {type FilterPattern} from '@rollup/pluginutils';

export type TransformationMode = 'all' | 'perFile';

export interface MaterialAllPluginOptions {
	/**
	 * You can choose between 2 modes:
	 *
	 * - 'perFile': All occurence of `@material/web/all.js` will be deleted
	 *		and individual imports of known elements found in your code will be prepended to the module.
	 *		This is the recommended method because it can help with code-splitting and tree-shaking.
	 *
	 * - 'all': Every `@material/web/all.js` imports will be substituted
	 *		with imports of all elements found inside your sources.
	 *
	 * @default 'perFile'
	 */
	mode: TransformationMode;
	/**
	 * List of additional md-* elements to include in the builds, for instance when
	 * you define elements in static template that the parser can't understand.
	 * in 'perFile' mode this can be used to add elements that are used in untransformable files
	 * such as html files.
	 *
	 * @default []
	 */
	additionalElements: string[];
	/**
	 * Whether to include comments or not during the search for md-* elements in sources.
	 *
	 * @default false
	 */
	includeComments: boolean;
	/**
	 * @default all js,ts,jsx,tsx files under 'src' or 'lib' directory
	 */
	include: string | string[];
	exclude: string | string[] | null;
}
