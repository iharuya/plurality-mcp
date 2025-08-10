type PrimitiveQueryValue = string | number | boolean | null | undefined;

type QueryValue =
	| PrimitiveQueryValue
	| Date
	| Array<PrimitiveQueryValue>
	| Set<PrimitiveQueryValue>;

export type HTTPQuery = Record<string, QueryValue>;

/**
 * Convert a depth-1 object to a query string.
 * @param params - The object to convert to a query string.
 * @param prefix - The prefix to add to the query string.
 * @returns The query string.
 */
export const queryString = (params: HTTPQuery, prefix = ""): string => {
	return Object.entries(params)
		.map(([key, value]) => queryStringSingleKey(key, value, prefix))
		.filter(Boolean)
		.join("&");
};

const queryStringSingleKey = (
	key: string,
	value: QueryValue,
	prefix = "",
): string => {
	const fullKey = prefix ? `${prefix}[${key}]` : key;

	if (value === null || value === undefined) return "";
	if (Array.isArray(value)) {
		return value
			.map(
				(v) =>
					`${encodeURIComponent(fullKey)}=${encodeURIComponent(String(v))}`,
			)
			.join("&");
	}
	if (value instanceof Set) {
		return queryStringSingleKey(key, Array.from(value), prefix);
	}
	if (value instanceof Date) {
		return `${encodeURIComponent(fullKey)}=${encodeURIComponent(
			value.toISOString(),
		)}`;
	}
	if (typeof value === "object") {
		return queryString(value as HTTPQuery, fullKey);
	}
	return `${encodeURIComponent(fullKey)}=${encodeURIComponent(String(value))}`;
};
