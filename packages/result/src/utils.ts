export function unwrapFailed<E>(msg: string, error: E): never {
	throw new Error(`${msg}: ${error}`);
}
