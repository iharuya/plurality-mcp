import type { BaseResult } from "./types.js";
import { unwrapFailed } from "./utils.js";

export class Err<E> implements BaseResult<never, E> {
	constructor(private error: E) {}
	get val(): E {
		return this.error;
	}

	isOk(): this is never {
		return false;
	}

	isOkAnd(_: (value: never) => boolean): boolean {
		return false;
	}

	isErr(): this is Err<E> {
		return true;
	}

	isErrAnd(fn: (error: E) => boolean): boolean {
		return fn(this.error);
	}

	map<U>(_fn: (value: never) => U): Err<E> {
		return this;
	}

	mapOr<U>(defaultValue: U, _: (value: never) => U): U {
		return defaultValue;
	}

	mapOrElse<U>(defaultFn: (error: E) => U, _: (value: never) => U): U {
		return defaultFn(this.error);
	}

	mapErr<U>(fn: (error: E) => U): Err<U> {
		return err(fn(this.error));
	}

	inspect(_fn: (value: never) => void): Err<E> {
		return this;
	}

	inspectErr(fn: (error: E) => void): Err<E> {
		fn(this.error);
		return this;
	}

	expect(msg: string): never {
		unwrapFailed(msg, this.error);
	}

	unwrap(): never {
		throw this.error;
	}

	expectErr(_: string): E {
		return this.error;
	}

	unwrapErr(): E {
		return this.error;
	}
}

export function err<E>(error: E): Err<E> {
	return new Err(error);
}
