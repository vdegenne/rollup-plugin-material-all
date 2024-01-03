export type TransformationMode = 'all' | 'perFile';

export interface MaterialAllPluginOptions {
	/**
	 * You can choose between 2 modes:
	 *
	 * - 'all': Every `@material/web/all.js` imports will be substituted by imports of all elements found inside your sources.
	 * - 'perFile': all occurence of `@material/web/all.js` will be deleted and individual imports of elements used will be prepended to the module where these elements are found. This is the recommended method since it can help with code-splitting and tree-shaking.
	 *
	 * @default 'perFile'
	 */
	mode: TransformationMode;
	/**
	 * By default all files will be subjected to transformation.
	 * Use this field to narrow down your sources and improve build performance.
	 */
	include: Array<string | RegExp> | string | RegExp | null;
	exclude: Array<string | RegExp> | string | RegExp | null;
}
