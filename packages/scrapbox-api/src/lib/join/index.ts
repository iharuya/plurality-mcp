export function join(...paths: string[]): string {
	const filteredPaths = paths.filter((path) => path !== "");
	if (filteredPaths.length === 0) return "";

	return filteredPaths.reduce((result, path, index) => {
		if (index === 0) return path;

		const left = result.endsWith("/") ? result.slice(0, -1) : result;
		const right = path.startsWith("/") ? path.slice(1) : path;

		return `${left}/${right}`;
	});
}
