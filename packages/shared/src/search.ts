/**
 * @license
 * Copyright (c) 2024 Valentin Degenne
 * SPDX-License-Identifier: MIT
 */
import fs from 'fs/promises';
import {glob} from 'glob';
import {MATERIAL_ELEMENT_REGEX} from './constants.js';
import {pruneFakeElements} from './material.js';

const materialElementGlobalRegex = new RegExp(MATERIAL_ELEMENT_REGEX, 'g');
const importsRegex = /import ['"]{1}(.+(\.js)?)['"]{1}/g;

export function findImportsFromContent(content: string) {
	const matches = content.matchAll(importsRegex);
	const imports: string[] = [];
	for (const match of matches) {
		imports.push(match[1]);
	}
	return imports;
}

export function removeComments(fileContent: string): string {
	const pattern = /\/\/.*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/g;
	return fileContent.replace(pattern, '');
}

export async function findElementsInContent(content: string) {
	const elementsSet = new Set<string>();

	content = removeComments(content);

	const matches = content.matchAll(materialElementGlobalRegex);
	for (const match of matches) {
		elementsSet.add(match[1]);
	}

	let elements = Array.from(elementsSet);
	elements = await pruneFakeElements(elements);

	return elements;
}

/**
 *
 * @param filesPattern files to search md-* elements in
 * @returns
 */
export async function findElementsInFiles(
	filesPattern: string | string[]
): Promise<string[]> {
	const matches = new Set<string>();

	// Get all files matching the glob.
	// const files = await fs.promises.readdir(glob);
	const files = await glob(filesPattern);

	// Iterate over all files and search for regex matches.
	for (const filePath of files) {
		// const filePath = path.join(searchGlob, filepath);

		// Read the file contents.
		const fileContents = await fs.readFile(filePath, 'utf8');

		// Search for regex matches in the file contents.
		for (const el of await findElementsInContent(fileContents)) {
			matches.add(el);
		}
	}

	// Return the matches as an array.
	return Array.from(matches);
}
