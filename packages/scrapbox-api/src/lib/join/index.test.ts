import { describe, expect, test } from "vitest";
import { join } from "./index.js";

describe("join function", () => {
	test("basic concatenation", () => {
		expect(join("/a/", "/b/", "/c")).toBe("/a/b/c");
		expect(join("a/", "/b/", "/c/")).toBe("a/b/c/");
		expect(join("a", "b", "c")).toBe("a/b/c");
		expect(join("a", "b/c", "d/")).toBe("a/b/c/d/");
		expect(join("/a/b/c", "d/")).toBe("/a/b/c/d/");
	});

	test("empty string should be ignored", () => {
		expect(join("", "a", "b")).toBe("a/b");
		expect(join("a", "", "b")).toBe("a/b");
		expect(join("a", "b", "")).toBe("a/b");
	});

	test("HTTP URL concatenation", () => {
		expect(join("http://localhost:1234", "path/to/resource")).toBe(
			"http://localhost:1234/path/to/resource",
		);
		expect(join("https://example.com", "path/to/resource")).toBe(
			"https://example.com/path/to/resource",
		);
	});
});
