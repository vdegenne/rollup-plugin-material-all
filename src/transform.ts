import {
	MdElementsImportsMap,
	findElementsFromContent,
	pruneFakeElements,
} from 'mwc3-back-helpers/md-elements.js';
import {MATERIAL_ALL_IMPORT_REGEX} from 'mwc3-back-helpers/regexps.js';
import type {TransformationMode} from './types.js';

const materialAllImportGlobalRegex = new RegExp(MATERIAL_ALL_IMPORT_REGEX, 'g');

/**
 * Takes a code and transform it according to the given mode.
 *
 * @param code Code to transform.
 * @param id filepath of the file being subjected to transformation.
 * @param mode Transformation mode to use.
 * @param elements A list of md-* elements which imports will be resolved and will replace `@material/web/all.js` (In 'all' mode it should be all md-* elements found throughout the project. In 'perFile' mode this parameter is optional but can be used to provide additional elements to bundle.)
 * @param includeComments Whether to include commented elements in perFile mode (defaults to false)
 */
export async function transform(
	code: string,
	id: string,
	mode: TransformationMode = 'perFile',
	elements?: string[],
	includeComments = false
): Promise<string> {
	switch (mode) {
		case 'perFile':
			return perFileTransform(code, id, elements, includeComments);
		case 'all':
			if (elements === undefined) {
				throw new Error("`elements` argument is required in 'all' mode.");
			}
			return allTransformation(code, id, elements);
	}
}

export function perFileTransform(
	code: string,
	id: string,
	additionalElements: string[] = [],
	includeComments: boolean
) {
	if (/\.html/.test(id)) {
		// Can't inject imports in html files
		// Returns unmodified code
		return code;
	}

	let additionalImports = '';
	if (additionalElements) {
		// Remove fake elements and unifies list
		additionalElements = [...new Set(pruneFakeElements(additionalElements))];
		additionalImports = additionalElements
			.map((elementName) => `import '${MdElementsImportsMap[elementName]}';`)
			.join('\n');
	}

	// 1. Remove material all imports if any
	// TODO: This should not be duplicated.
	code = code.replaceAll(materialAllImportGlobalRegex, additionalImports);

	// 2. Prepend elements found in this code
	const elements = findElementsFromContent(code, includeComments);
	const imports = elements
		.map((elementName) => `import '${MdElementsImportsMap[elementName]}';`)
		.join('\n');
	code = `${imports}${code}`;

	return code;
}

export function allTransformation(
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
	const importsOutput = elements
		.map((elementName) => `import '${MdElementsImportsMap[elementName]}';`)
		.join('\n');

	// 1. Replace all `@material/web/all.js` occurences with project elements.
	// TODO: This should not be duplicated.
	code = code.replaceAll(materialAllImportGlobalRegex, importsOutput);

	return code;
}
