export type TransformationMode = 'all' | 'perFile';

export interface MaterialAllPluginOptions {
	/**
	 * You can choose between 2 modes:
	 *
	 * - 'all': every `@material/web/all.js` imports will be substituted by imports of all elements found inside your sources.
	 * - 'perFile': all occurence of `@material/web/all.js` will be deleted and individual imports of elements used will be prepended to the module where these elements are found. This is the recommended method since it can help with code-splitting and tree-shaking.
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
	 * @default all js,ts,jsx,tsx files under 'src' directory
	 */
	include: Array<string> | string;
	exclude: Array<string> | string;
}
