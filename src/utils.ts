const importsRegex = /import ['"]{1}(.+(\.js)?)['"]{1}/g;
/**
 * Take a content and returns an array containing
 * all imported paths.
 */
export function findImportsInContent(content: string) {
	const matches = content.matchAll(importsRegex);
	const imports = [];
	for (const match of matches) {
		imports.push(match[1]);
	}
	return imports;
}
