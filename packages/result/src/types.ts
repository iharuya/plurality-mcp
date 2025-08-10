// ref: https://doc.rust-lang.org/src/core/result.rs.html

import type { Err } from "./err.js";
import type { Ok } from "./ok.js";

export type Result<T, E = Error> = Ok<T> | Err<E>;
export type ResultSuccess<R> = R extends Ok<infer TSuccess> ? TSuccess : never;
export type ResultError<R> = R extends Err<infer TError> ? TError : never;

export type BaseResult<T, E> = {
	/////////////////////////////////////////////////////////////////////////
	// Querying the contained values
	/////////////////////////////////////////////////////////////////////////

	/**
	 * Returns the contained value or error.
	 */
	get val(): T | E;

	/**
	 * Returns `true` if the result is [`Ok`].
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.isOk() // true
	 * ```
	 */
	isOk(): this is Ok<T>;

	/**
	 * Returns `true` if the result is [`Ok`] and the value inside of it matches a predicate.
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.isOkAnd((val) => val > 1) // true
	 * ```
	 */
	isOkAnd(fn: (value: T) => boolean): boolean;

	/**
	 * Returns `true` if the result is [`Err`].
	 * @example
	 * ```
	 * const result = err("serious error")
	 * result.isErr() // true
	 * ```
	 */
	isErr(): this is Err<E>;

	/**
	 * Returns `true` if the result is [`Err`] and the error inside of it matches a predicate.
	 * @example
	 * ```
	 * const result = err("serious error")
	 * result.isErrAnd((err) => err.startsWith("serious")) // true
	 * ```
	 */
	isErrAnd(fn: (error: E) => boolean): boolean;

	/////////////////////////////////////////////////////////////////////////
	// Transforming contained values
	/////////////////////////////////////////////////////////////////////////

	/**
	 * Maps a [`Result<T, E>`] to [`Result<U, E>`] by applying a function to a contained [`Ok`] value,
	 * leaving an [`Err`] value untouched.
	 * This function can be used to compose the results of two functions.
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.map((val) => val * 2) // ok(4)
	 * ```
	 */
	map<U>(fn: (value: T) => U): Result<U, E>;

	/**
	 * Returns the provided default (if [`Err`]), or applies a function to the contained value (if [`Ok`]).
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.mapOr(0, (val) => val * 2) // 4
	 * const badResult = err("error")
	 * badResult.mapOr(0, (val) => val * 2) // 0
	 * ```
	 */
	mapOr<U>(defaultValue: U, fn: (value: T) => U): U;

	/**
	 * Maps a [`Result<T, E>`] to [`U`] by applying fallback function `defaultFn` to a contained [`Err`] value,
	 * or function `fn` to a contained [`Ok`] value
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.mapOrElse((err) => err.length, (val) => val * 2) // 4
	 * const badResult = err("error")
	 * badResult.mapOrElse((err) => err.length, (val) => val * 2) // 5
	 * ```
	 */
	mapOrElse<U>(defaultFn: (error: E) => U, fn: (value: T) => U): U;

	/**
	 * Maps a [`Result<T, E>`] to [`Result<T, F>`] by applying a function to a contained [`Err`] value,
	 * leaving an [`Ok`] value untouched.
	 * This function can be used to pass through a successful result while handling an error.
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.mapErr((err) => err.message) // ok(2)
	 * const badResult = err("error")
	 * badResult.mapErr((err) => err.message) // err("error")
	 * ```
	 */
	mapErr<U>(fn: (error: E) => U): Result<T, U>;

	/**
	 * Calls the provided closure with a reference to the contained value if [`Ok`]
	 * @example
	 * ```
	 * const result = ok(2)
	 * result
	 *   .inspect((val) => console.log(val))
	 *   .map((val) => val * 2)
	 * ```
	 */
	inspect(fn: (value: T) => void): Result<T, E>;

	/**
	 * Calls the provided closure with a reference to the contained error if [`Err`]
	 * @example
	 * ```
	 * const result = err("error")
	 * result
	 *   .inspectErr((err) => console.log(err))
	 *   .map((val) => val * 2)
	 * ```
	 */
	inspectErr(fn: (error: E) => void): Result<T, E>;

	/////////////////////////////////////////////////////////////////////////
	// Extract a value
	/////////////////////////////////////////////////////////////////////////

	/**
	 * Returns the contained [`Ok`] value, consuming the `self` value.
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.expect("oh no") // 2
	 * ```
	 */
	expect(msg: string): T;

	/**
	 * Returns the contained [`Ok`] value, consuming the `self` value.
	 * Because this function may throw, its use is generally discouraged.
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.unwrap() // 2
	 *
	 * const badResult = err("error")
	 * badResult.unwrap() // throws "serious error"
	 * ```
	 */
	unwrap(): T;

	/**
	 * Returns the contained [`Err`] value, consuming the `self` value.
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.expectErr("testing err") // throws "testing err: 2"
	 * ```
	 */
	expectErr(msg: string): E;

	/**
	 * Returns the contained [`Err`] value, consuming the `self` value.
	 * @example
	 * ```
	 * const result = ok(2)
	 * result.unwrapErr() // throws "2"
	 *
	 * const badResult = err("error")
	 * badResult.unwrapErr() // "error"
	 * ```
	 */
	unwrapErr(): E;

	////////////////////////////////////////////////////////////////////////
	// Boolean operations on the values, eager and lazy
	/////////////////////////////////////////////////////////////////////////
	// UNIMPLEMENTED
};
