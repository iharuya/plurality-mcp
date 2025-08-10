import { describe, expect, it, vi } from "vitest";
import { Ok, ok } from "../src/index.js";

describe("Ok", () => {
	describe("constructor and factory", () => {
		it("should create an Ok instance with a value", () => {
			const result = new Ok(42);
			expect(result).toBeInstanceOf(Ok);
			expect(result.val).toBe(42);
		});

		it("should create an Ok instance using ok() factory", () => {
			const result = ok("hello");
			expect(result).toBeInstanceOf(Ok);
			expect(result.val).toBe("hello");
		});

		it("should handle different value types", () => {
			expect(ok(null).val).toBeNull();
			expect(ok(undefined).val).toBeUndefined();
			expect(ok({ foo: "bar" }).val).toEqual({ foo: "bar" });
			expect(ok([1, 2, 3]).val).toEqual([1, 2, 3]);
		});
	});

	describe("type guards", () => {
		it("isOk() should return true", () => {
			const result = ok(42);
			expect(result.isOk()).toBe(true);
		});

		it("isErr() should return false", () => {
			const result = ok(42);
			expect(result.isErr()).toBe(false);
		});

		it("isOkAnd() should check the predicate", () => {
			const result = ok(42);
			expect(result.isOkAnd((val) => val > 40)).toBe(true);
			expect(result.isOkAnd((val) => val > 50)).toBe(false);
			expect(result.isOkAnd((val) => val === 42)).toBe(true);
		});

		it("isErrAnd() should always return false", () => {
			const result = ok(42);
			expect(result.isErrAnd(() => true)).toBe(false);
			expect(result.isErrAnd(() => false)).toBe(false);
		});
	});

	describe("transformation methods", () => {
		it("map() should transform the value and return a new Ok", () => {
			const result = ok(42);
			const mapped = result.map((val) => val * 2);
			expect(mapped).toBeInstanceOf(Ok);
			expect(mapped.val).toBe(84);
			expect(result.val).toBe(42); // Original unchanged
		});

		it("map() should work with type changes", () => {
			const result = ok(42);
			const mapped = result.map((val) => `Number: ${val}`);
			expect(mapped.val).toBe("Number: 42");
		});

		it("mapOr() should apply the function and ignore default value", () => {
			const result = ok(42);
			const mapped = result.mapOr(100, (val) => val * 2);
			expect(mapped).toBe(84);
		});

		it("mapOrElse() should apply the function and ignore error function", () => {
			const result = ok(42);
			const mapped = result.mapOrElse(
				() => 100,
				(val) => val * 2,
			);
			expect(mapped).toBe(84);
		});

		it("mapErr() should return itself unchanged", () => {
			const result = ok(42);
			const mapped = result.mapErr((err) => `Error: ${err}`);
			expect(mapped).toBe(result);
			expect(mapped.val).toBe(42);
		});
	});

	describe("inspection methods", () => {
		it("inspect() should call the function with the value and return itself", () => {
			const result = ok(42);
			const inspectFn = vi.fn();
			const returned = result.inspect(inspectFn);

			expect(inspectFn).toHaveBeenCalledWith(42);
			expect(inspectFn).toHaveBeenCalledTimes(1);
			expect(returned).toBe(result);
		});

		it("inspectErr() should not call the function and return itself", () => {
			const result = ok(42);
			const inspectFn = vi.fn();
			const returned = result.inspectErr(inspectFn);

			expect(inspectFn).not.toHaveBeenCalled();
			expect(returned).toBe(result);
		});
	});

	describe("value extraction", () => {
		it("expect() should return the value", () => {
			const result = ok(42);
			expect(result.expect("Should have value")).toBe(42);
		});

		it("unwrap() should return the value", () => {
			const result = ok(42);
			expect(result.unwrap()).toBe(42);
		});

		it("expectErr() should throw with the provided message", () => {
			const result = ok(42);
			expect(() => result.expectErr("Expected error")).toThrow(
				"Expected error: 42",
			);
		});

		it("unwrapErr() should throw with a default message", () => {
			const result = ok(42);
			expect(() => result.unwrapErr()).toThrow(
				"called `Result.unwrapErr()` on an `Ok` value: 42",
			);
		});
	});

	describe("chaining operations", () => {
		it("should support method chaining", () => {
			const result = ok(10)
				.map((x) => x * 2)
				.map((x) => x + 5)
				.inspect((x) => {
					expect(x).toBe(25);
				});

			expect(result.val).toBe(25);
		});

		it("should support complex transformations", () => {
			const result = ok({ count: 5 })
				.map((obj) => obj.count)
				.map((count) => count * 10)
				.map((total) => `Total: ${total}`);

			expect(result.val).toBe("Total: 50");
		});
	});
});
