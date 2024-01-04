import {MATERIAL_ALL_IMPORT_REGEX} from './constants.js';
import type {TransformationMode} from './index.js';
import {getElementImportsMap, mapNamesToImports} from './material.js';
import {findElementsInContent} from './search.js';

const materialAllImportGlobalRegex = new RegExp(MATERIAL_ALL_IMPORT_REGEX, 'g');

/**
 * Takes a code and transform it according to the given mode.
 *
 * @param code Code to transform.
 * @param id filepath of the file being subjected to transformation.
 * @param mode Transformation mode to use.
 * @param elements A list of md-* elements which imports will be resolved and will replace `@material/web/all.js` (In 'all' mode it should be all md-* elements found throughout the project. In 'perFile' mode this parameter is optional but can be used to provide additional elements to bundle.)
 *                      testt
 */
export async function transform(
	code: string,
	id: string,
	mode: TransformationMode = 'perFile',
	elements?: string[]
): Promise<string> {
	switch (mode) {
		case 'perFile':
			return await perFileTransform(code, id, elements);
		case 'all':
			if (elements === undefined) {
				throw new Error("elements argument is required in 'all' mode.");
			}
			return await allTransformation(code, id, elements);
	}
}

export async function perFileTransform(
	code: string,
	id: string,
	additionalElements: string[] = []
) {
	if (/\.html/.test(id)) {
		// Can't inject imports in html files
		// Returns unmodified code
		return code;
	}

	let additionalImports = '';
	if (additionalElements) {
		const imports = await mapNamesToImports(additionalElements);
		additionalImports = imports.map((path) => `import '${path}';`).join('\n');
	}

	// 1. Remove material all imports if any
	// TODO: This should not be duplicated.
	code = code.replaceAll(materialAllImportGlobalRegex, additionalImports);

	// 2. Prepend elements found in this code
	const elements = await findElementsInContent(code);
	const importsMap = await getElementImportsMap();
	const imports = elements
		.map((name) => `import "${importsMap[name]}";`)
		.join('\n');
	code = `${imports}${code}`;

	return code;
}

export async function allTransformation(
	code: string,
	id: string,
	elements: string[]
) {
	if (/\.html/.test(id)) {
		// Can't inject imports in html files
		// Returns unmodified code
		return code;
	}
	elements = [...new Set(elements)]; // Remove duplicates
	const imports = await mapNamesToImports(elements);
	const importsOutput = imports.map((path) => `import '${path}';`).join('\n');

	// 1. Replace all `@material/web/all.js` occurences with project elements.
	// TODO: This should not be duplicated.
	code = code.replaceAll(materialAllImportGlobalRegex, importsOutput);

	return code;
}
