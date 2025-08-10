import { describe, expect, it, vi } from "vitest";
import { err, match, ok, type Result } from "../src/index.js";

describe("match", () => {
	describe("basic functionality", () => {
		it("should call okCallback for Ok result", () => {
			const result = ok(42);
			const okCallback = vi.fn((val) => `Value is ${val}`);
			const errCallback = vi.fn((err) => `Error is ${err}`);

			const matched = match(result, okCallback, errCallback);

			expect(okCallback).toHaveBeenCalledWith(42);
			expect(okCallback).toHaveBeenCalledTimes(1);
			expect(errCallback).not.toHaveBeenCalled();
			expect(matched).toBe("Value is 42");
		});

		it("should call errorCallback for Err result", () => {
			const result = err("error message");
			const okCallback = vi.fn((val) => `Value is ${val}`);
			const errCallback = vi.fn((err) => `Error is ${err}`);

			const matched = match(result, okCallback, errCallback);

			expect(errCallback).toHaveBeenCalledWith("error message");
			expect(errCallback).toHaveBeenCalledTimes(1);
			expect(okCallback).not.toHaveBeenCalled();
			expect(matched).toBe("Error is error message");
		});
	});

	describe("type transformations", () => {
		it("should transform Ok value to different type", () => {
			const result = ok(42);

			const matched = match(
				result,
				(val) => val.toString(),
				(_err) => "Error",
			);

			expect(matched).toBe("42");
			expect(typeof matched).toBe("string");
		});

		it("should transform Err value to different type", () => {
			const result = err("error");

			const matched = match(
				result,
				(_val) => 0,
				(err: string) => err.length,
			);

			expect(matched).toBe(5);
			expect(typeof matched).toBe("number");
		});

		it("should handle complex transformations", () => {
			const result = ok({ id: 1, name: "Alice" });

			const matched = match(
				result,
				(user) => `User ${user.name} has ID ${user.id}`,
				(_error) => "Failed to get user",
			);

			expect(matched).toBe("User Alice has ID 1");
		});
	});

	describe("side effects in callbacks", () => {
		it("should handle side effects in okCallback", () => {
			let sideEffect = 0;
			const result = ok(10);

			const matched = match(
				result,
				(val) => {
					sideEffect = val * 2;
					return val + 5;
				},
				(_err) => 0,
			);

			expect(sideEffect).toBe(20);
			expect(matched).toBe(15);
		});

		it("should handle side effects in errorCallback", () => {
			let errorLogged = "";
			const result = err("Something went wrong");

			const matched = match(
				result,
				(_val) => "Value exists",
				(err) => {
					errorLogged = `Error logged: ${err}`;
					return null;
				},
			);

			expect(errorLogged).toBe("Error logged: Something went wrong");
			expect(matched).toBeNull();
		});
	});

	describe("edge cases", () => {
		it("should handle null and undefined values", () => {
			const nullResult = ok(null);
			const undefinedResult = ok(undefined);

			expect(
				match(
					nullResult,
					(val) => val === null,
					() => false,
				),
			).toBe(true);
			expect(
				match(
					undefinedResult,
					(val) => val === undefined,
					() => false,
				),
			).toBe(true);
		});

		it("should handle throwing callbacks", () => {
			const result = ok(42);

			expect(() =>
				match(
					result,
					() => {
						throw new Error("Ok callback error");
					},
					() => "error",
				),
			).toThrow("Ok callback error");

			const errResult = err("error");

			expect(() =>
				match(
					errResult,
					() => "ok",
					() => {
						throw new Error("Err callback error");
					},
				),
			).toThrow("Err callback error");
		});
	});

	describe("real-world patterns", () => {
		it("should handle API response pattern", () => {
			type ApiResponse = {
				data: string;
				status: number;
			};

			type ApiError = {
				message: string;
				code: string;
			};

			function fetchData(): Result<ApiResponse, ApiError> {
				// Simulating successful response
				return ok({ data: "Hello World", status: 200 });
			}

			const result = fetchData();
			const response = match(
				result,
				(res: ApiResponse) => ({ success: true, content: res.data }),
				(err: ApiError) => ({ success: false, content: err.message }),
			);

			expect(response).toEqual({ success: true, content: "Hello World" });
		});

		it("should handle parsing pattern", () => {
			function parseNumber(str: string): Result<number, string> {
				const num = parseInt(str);
				if (Number.isNaN(num)) {
					return err(`Cannot parse '${str}' as number`);
				}
				return ok(num);
			}

			const validResult = parseNumber("42");
			const invalidResult = parseNumber("abc");

			expect(
				match(
					validResult,
					(num) => num * 2,
					() => 0,
				),
			).toBe(84);

			expect(
				match(
					invalidResult,
					(num) => num * 2,
					() => 0,
				),
			).toBe(0);
		});
	});

	describe("with Result chain operations", () => {
		it("should work with mapped results", () => {
			const result = ok(10)
				.map((x) => x * 2)
				.map((x) => x + 5);

			const matched = match(
				result,
				(val) => `Final value: ${val}`,
				(err) => `Error: ${err}`,
			);

			expect(matched).toBe("Final value: 25");
		});

		it("should work with error mapped results", () => {
			const result = err("initial error")
				.mapErr((e) => e.toUpperCase())
				.mapErr((e) => `[${e}]`);

			const matched = match(
				result,
				(val) => `Value: ${val}`,
				(err) => `Processed error: ${err}`,
			);

			expect(matched).toBe("Processed error: [INITIAL ERROR]");
		});
	});
});
