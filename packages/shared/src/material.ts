import pathlib from 'path';
import fs from 'fs';
import {findImportsFromContent} from './search.js';

const allFilePath = pathlib.resolve(
	'node_modules',
	'@material',
	'web',
	'all.js'
);

let cachedAllFileContent: string;
let cachedElementImportsMap: {[elementName: string]: string} = {};

export async function getElementImportsMap() {
	if (cachedAllFileContent === undefined) {
		await loadAllFile();
	}
	return cachedElementImportsMap;
}

export async function loadAllFile() {
	if (!fs.existsSync(allFilePath)) {
		throw new Error(
			'\n`@material/web/all.js` file not found, make sure `@material/web` is installed in the current project.\n'
		);
	}

	cachedAllFileContent = (await fs.promises.readFile(allFilePath)).toString();

	// Process the elements imports Map
	const imports = findImportsFromContent(cachedAllFileContent);

	const elementNameRegex = /\/([^/.]+)\.js/;
	for (const importee of imports) {
		const elementNameMatch = importee.match(elementNameRegex);
		cachedElementImportsMap[`md-${elementNameMatch[1]}`] = importee.replace(
			/^\./,
			'@material/web'
		);
	}
}

export async function pruneFakeElements(elements: string[]) {
	const availableElements = Object.keys(await getElementImportsMap());

	return elements.filter((el) => availableElements.includes(el));
}

export async function mapNamesToImports(elementNames: string[]) {
	const map = await getElementImportsMap();

	return elementNames.map((name) => map[name]);
}
