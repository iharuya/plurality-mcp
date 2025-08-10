import { describe, expect, it, vi } from "vitest";
import { Err, err } from "../src/index.js";

describe("Err", () => {
	describe("constructor and factory", () => {
		it("should create an Err instance with an error", () => {
			const result = new Err("error message");
			expect(result).toBeInstanceOf(Err);
			expect(result.val).toBe("error message");
		});

		it("should create an Err instance using err() factory", () => {
			const result = err("error message");
			expect(result).toBeInstanceOf(Err);
			expect(result.val).toBe("error message");
		});

		it("should handle different error types", () => {
			expect(err(new Error("test")).val).toBeInstanceOf(Error);
			expect(err({ code: 404, message: "Not Found" }).val).toEqual({
				code: 404,
				message: "Not Found",
			});
			expect(err(null).val).toBeNull();
			expect(err(undefined).val).toBeUndefined();
		});
	});

	describe("type guards", () => {
		it("isOk() should return false", () => {
			const result = err("error");
			expect(result.isOk()).toBe(false);
		});

		it("isErr() should return true", () => {
			const result = err("error");
			expect(result.isErr()).toBe(true);
		});

		it("isOkAnd() should always return false", () => {
			const result = err("error");
			expect(result.isOkAnd(() => true)).toBe(false);
			expect(result.isOkAnd(() => false)).toBe(false);
		});

		it("isErrAnd() should check the predicate", () => {
			const result = err("error");
			expect(result.isErrAnd((err) => err === "error")).toBe(true);
			expect(result.isErrAnd((err) => err === "different")).toBe(false);
			expect(result.isErrAnd((err) => err.includes("err"))).toBe(true);
		});
	});

	describe("transformation methods", () => {
		it("map() should return itself unchanged", () => {
			const result = err("error");
			const mapped = result.map(() => 42);
			expect(mapped).toBe(result);
			expect(mapped.val).toBe("error");
		});

		it("mapOr() should return the default value", () => {
			const result = err("error");
			const mapped = result.mapOr(100, () => 200);
			expect(mapped).toBe(100);
		});

		it("mapOrElse() should apply the error function", () => {
			const result = err("error");
			const mapped = result.mapOrElse(
				(err) => `Error occurred: ${err}`,
				() => "never called",
			);
			expect(mapped).toBe("Error occurred: error");
		});

		it("mapErr() should transform the error and return a new Err", () => {
			const result = err("error");
			const mapped = result.mapErr((err) => err.toUpperCase());
			expect(mapped).toBeInstanceOf(Err);
			expect(mapped.val).toBe("ERROR");
			expect(result.val).toBe("error"); // Original unchanged
		});

		it("mapErr() should work with type changes", () => {
			const result = err("404");
			const mapped = result.mapErr((err) => ({
				code: parseInt(err),
				message: "Not Found",
			}));
			expect(mapped.val).toEqual({ code: 404, message: "Not Found" });
		});
	});

	describe("inspection methods", () => {
		it("inspect() should not call the function and return itself", () => {
			const result = err("error");
			const inspectFn = vi.fn();
			const returned = result.inspect(() => {});

			expect(inspectFn).not.toHaveBeenCalled();
			expect(returned).toBe(result);
		});

		it("inspectErr() should call the function with the error and return itself", () => {
			const result = err("error");
			const inspectFn = vi.fn();
			const returned = result.inspectErr(inspectFn);

			expect(inspectFn).toHaveBeenCalledWith("error");
			expect(inspectFn).toHaveBeenCalledTimes(1);
			expect(returned).toBe(result);
		});
	});

	describe("value extraction", () => {
		it("expect() should throw with the provided message", () => {
			const result = err("error");
			expect(() => result.expect("Expected value")).toThrow(
				"Expected value: error",
			);
		});

		it("unwrap() should throw with the error", () => {
			const result = err("error message");
			expect(() => result.unwrap()).toThrow("error message");
		});

		it("unwrap() should throw the Error object itself", () => {
			const error = new Error("test error");
			const result = err(error);
			expect(() => result.unwrap()).toThrow(error);
		});

		it("expectErr() should return the error", () => {
			const result = err("error");
			expect(result.expectErr("Should have error")).toBe("error");
		});

		it("unwrapErr() should return the error", () => {
			const result = err("error");
			expect(result.unwrapErr()).toBe("error");
		});
	});

	describe("chaining operations", () => {
		it("should support method chaining on mapErr", () => {
			const result = err("error")
				.mapErr((e) => e.toUpperCase())
				.mapErr((e) => `[${e}]`)
				.inspectErr((e) => {
					expect(e).toBe("[ERROR]");
				});

			expect(result.val).toBe("[ERROR]");
		});

		it("map operations should not affect Err", () => {
			const result = err("error")
				.map(() => 42)
				.map(() => 47)
				.inspect(() => {
					// This should never be called
					throw new Error("Should not be called");
				});

			expect(result.val).toBe("error");
		});
	});

	describe("error handling patterns", () => {
		it("should handle Error objects properly", () => {
			const error = new Error("Something went wrong");
			const result = err(error);

			expect(result.isErr()).toBe(true);
			expect(result.val).toBe(error);
			expect(result.unwrapErr()).toBe(error);
		});

		it("should support custom error types", () => {
			type CustomError = {
				code: number;
				message: string;
				timestamp: Date;
			};

			const customError: CustomError = {
				code: 500,
				message: "Internal Server Error",
				timestamp: new Date(),
			};

			const result = err(customError);
			expect(result.val.code).toBe(500);
			expect(result.val.message).toBe("Internal Server Error");
			expect(result.val.timestamp).toBeInstanceOf(Date);
		});
	});
});
