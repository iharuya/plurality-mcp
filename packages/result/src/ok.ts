import type { BaseResult } from "./types.js";
import { unwrapFailed } from "./utils.js";

export class Ok<T> implements BaseResult<T, never> {
	constructor(private value: T) {}
	get val(): T {
		return this.value;
	}

	isOk(): this is Ok<T> {
		return true;
	}

	isOkAnd(fn: (value: T) => boolean): boolean {
		return fn(this.value);
	}

	isErr(): this is never {
		return false;
	}

	isErrAnd(_: (error: never) => boolean): boolean {
		return false;
	}

	map<U>(fn: (value: T) => U) {
		return ok(fn(this.value));
	}

	mapOr<U>(_defaultValue: U, fn: (value: T) => U): U {
		return fn(this.value);
	}

	mapOrElse<U>(_defaultFn: (error: never) => U, fn: (value: T) => U): U {
		return fn(this.value);
	}

	mapErr<U>(_fn: (error: never) => U): Ok<T> {
		return this;
	}

	inspect(fn: (value: T) => void) {
		fn(this.value);
		return this;
	}

	inspectErr(_fn: (error: never) => void): Ok<T> {
		return this;
	}

	expect(_: string) {
		return this.value;
	}

	unwrap(): T {
		return this.value;
	}

	expectErr(msg: string): never {
		unwrapFailed(msg, this.value);
	}

	unwrapErr(): never {
		unwrapFailed("called `Result.unwrapErr()` on an `Ok` value", this.value);
	}
}

export function ok<T>(value: T): Ok<T> {
	return new Ok(value);
}
