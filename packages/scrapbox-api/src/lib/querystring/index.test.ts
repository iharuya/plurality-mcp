import { describe, expect, it } from "vitest";
import { type HTTPQuery, queryString } from "./index.js";

describe("queryString function", () => {
	it("empty object", () => {
		const input: HTTPQuery = {};
		expect(queryString(input)).toBe("");
	});

	it("single string value", () => {
		const input: HTTPQuery = { name: "John Doe" };
		expect(queryString(input)).toBe("name=John%20Doe");
	});

	it("single number value", () => {
		const input: HTTPQuery = { age: 30 };
		expect(queryString(input)).toBe("age=30");
	});

	it("single boolean value", () => {
		const input: HTTPQuery = { isActive: true };
		expect(queryString(input)).toBe("isActive=true");
	});

	it("null and undefined values", () => {
		const input: HTTPQuery = { nullValue: null, undefinedValue: undefined };
		expect(queryString(input)).toBe("");
	});

	it("Date object", () => {
		const date = new Date("2023-01-01T00:00:00Z");
		const input: HTTPQuery = { createdAt: date };
		expect(queryString(input)).toBe("createdAt=2023-01-01T00%3A00%3A00.000Z");
	});

	it("array of strings", () => {
		const input: HTTPQuery = { tags: ["javascript", "typescript"] };
		expect(queryString(input)).toBe("tags=javascript&tags=typescript");
	});

	it("array of numbers", () => {
		const input: HTTPQuery = { scores: [85, 90, 95] };
		expect(queryString(input)).toBe("scores=85&scores=90&scores=95");
	});

	it("Set of values", () => {
		const input: HTTPQuery = { uniqueTags: new Set(["js", "ts"]) };
		expect(queryString(input)).toBe("uniqueTags=js&uniqueTags=ts");
	});

	it("multiple key-value pairs", () => {
		const input: HTTPQuery = { name: "Alice", age: 25, isStudent: true };
		expect(queryString(input)).toBe("name=Alice&age=25&isStudent=true");
	});

	it("special characters in keys and values", () => {
		const input: HTTPQuery = {
			"user name": "John & Jane",
			"email@example.com": "test+user@example.com",
		};
		expect(queryString(input)).toBe(
			"user%20name=John%20%26%20Jane&email%40example.com=test%2Buser%40example.com",
		);
	});

	it("mixed types", () => {
		const input: HTTPQuery = {
			name: "John",
			age: 30,
			isStudent: false,
			courses: ["Math", "Science"],
			lastLogin: new Date("2023-01-01T00:00:00Z"),
		};
		expect(queryString(input)).toBe(
			"name=John&age=30&isStudent=false&courses=Math&courses=Science&" +
				"lastLogin=2023-01-01T00%3A00%3A00.000Z",
		);
	});

	it("empty string values", () => {
		const input: HTTPQuery = { emptyString: "" };
		expect(queryString(input)).toBe("emptyString=");
	});

	it("zero as a value", () => {
		const input: HTTPQuery = { count: 0 };
		expect(queryString(input)).toBe("count=0");
	});

	it("prefix for top-level keys", () => {
		const input: HTTPQuery = { name: "John", age: 30 };
		expect(queryString(input, "user")).toBe(
			"user%5Bname%5D=John&user%5Bage%5D=30",
		);
	});

	it("prefix with array values", () => {
		const input: HTTPQuery = { tags: ["javascript", "typescript"] };
		expect(queryString(input, "post")).toBe(
			"post%5Btags%5D=javascript&post%5Btags%5D=typescript",
		);
	});

	it("prefix with mixed types", () => {
		const input: HTTPQuery = {
			name: "Alice",
			age: 25,
			isStudent: true,
			courses: ["Math", "Science"],
			lastLogin: new Date("2023-01-01T00:00:00Z"),
		};
		expect(queryString(input, "user")).toBe(
			"user%5Bname%5D=Alice&user%5Bage%5D=25&user%5BisStudent%5D=true&" +
				"user%5Bcourses%5D=Math&user%5Bcourses%5D=Science&" +
				"user%5BlastLogin%5D=2023-01-01T00%3A00%3A00.000Z",
		);
	});
});
