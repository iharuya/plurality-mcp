import type { Result } from "./types.js";

/**
 * Just to feel like it's Rust but be careful: this is only for `Result`.
 */
export function match<T, E, U>(
	result: Result<T, E>,
	okCallback: (value: T) => U,
	errorCallback: (error: E) => U,
): U {
	if (result.isOk()) {
		return okCallback(result.val);
	}
	return errorCallback(result.val);
}
