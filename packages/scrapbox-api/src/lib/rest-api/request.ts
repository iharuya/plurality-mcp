import { err, ok, type Result } from "@plurality-mcp/result";
import { HTTPError, NetworkError } from "./error.js";

export const request = async (params: {
	input: RequestInfo | URL;
	init?: RequestInit;
}): Promise<Result<Response, HTTPError | NetworkError>> => {
	const { input, init } = params;
	const defaultHeaders: HeadersInit = {
		"Content-Type": "application/json",
	};
	const headers = new Headers({
		...defaultHeaders,
		...init?.headers,
	});

	try {
		const response = await fetch(input, {
			redirect: "follow",
			...init,
			headers,
		});

		if (!response.ok) {
			return err(new HTTPError(response));
		}
		return ok(response);
	} catch (error) {
		return err(
			new NetworkError(
				`failed to fetch ${input.toString()}: ${error instanceof Error ? error.message : String(error)}`,
			),
		);
	}
};

export type RequestResult = Awaited<ReturnType<typeof request>>;
