import { err, ok, type Result, type ResultError } from "@plurality-mcp/result";
import type z from "zod";
import { join } from "../join/index.js";
import type { Config } from "./config.js";
import {
	InvalidJsonError,
	RequestValidationError,
	ResponseValidationError,
} from "./error.js";
import { type RequestResult, request } from "./request.js";

/**
 * Processes a Response, parsing JSON and validating against a Zod schema.
 */
const processResponse = async <TResponse extends z.ZodType>(
	requestResult: RequestResult,
	responseSchema: TResponse,
): Promise<
	Result<
		z.output<TResponse>,
		ResultError<RequestResult> | InvalidJsonError | ResponseValidationError
	>
> => {
	if (requestResult.isErr()) {
		return requestResult;
	}
	const response = requestResult.val;
	const responseForError = response.clone();

	// Handle empty responses (e.g., 204 No Content) gracefully
	if (
		response.status === 204 ||
		response.headers.get("content-length") === "0"
	) {
		const parsed = await responseSchema.safeParseAsync(undefined);
		if (!parsed.success) {
			return err(new ResponseValidationError(parsed.error, responseForError));
		}
		return ok(parsed.data);
	}

	let json: unknown;
	try {
		json = await response.json();
	} catch (e) {
		const message = e instanceof Error ? e.message : String(e);
		return err(
			new InvalidJsonError(`Failed to parse JSON from response: ${message}`),
		);
	}

	const parsed = await responseSchema.safeParseAsync(json);
	if (!parsed.success) {
		return err(new ResponseValidationError(parsed.error, responseForError));
	}
	return ok(parsed.data);
};

type ProcessResponseResult = Awaited<ReturnType<typeof processResponse>>;

export const createAPIClient = (config: Config) => {
	const { baseUrl, fetchOptions: baseFetchOptions } = config;

	const get = async <TResponse extends z.ZodType>(
		path: string,
		responseSchema: TResponse,
		init?: RequestInit,
	): Promise<
		Result<z.output<TResponse>, ResultError<ProcessResponseResult>>
	> => {
		const requestResult = await request({
			input: join(baseUrl, path),
			init: {
				...baseFetchOptions,
				...init,
				method: "GET",
			},
		});

		return processResponse(requestResult, responseSchema);
	};

	const requestWithBody =
		<TRequest extends z.ZodType, TResponse extends z.ZodType>(
			method: "POST" | "PUT" | "PATCH",
		) =>
		async (
			path: string,
			requestSchema: TRequest,
			responseSchema: TResponse,
			data: z.input<TRequest>,
			init?: RequestInit,
		): Promise<
			Result<
				z.output<TResponse>,
				ResultError<ProcessResponseResult> | RequestValidationError
			>
		> => {
			const requestParsed = await requestSchema.safeParseAsync(data);
			if (!requestParsed.success) {
				return err(new RequestValidationError(requestParsed.error));
			}

			const requestResult = await request({
				input: join(baseUrl, path),
				init: {
					...baseFetchOptions,
					...init,
					method,
					body: JSON.stringify(requestParsed.data),
					headers: {
						"Content-Type": "application/json",
						...baseFetchOptions?.headers,
						...init?.headers,
					},
				},
			});

			return processResponse(requestResult, responseSchema);
		};

	// 'delete' is a reserved keyword
	const del = async <TResponse extends z.ZodType>(
		path: string,
		responseSchema: TResponse,
		init?: RequestInit,
	): Promise<
		Result<z.output<TResponse>, ResultError<ProcessResponseResult>>
	> => {
		const requestResult = await request({
			input: join(baseUrl, path),
			init: {
				...baseFetchOptions,
				...init,
				method: "DELETE",
			},
		});

		return processResponse(requestResult, responseSchema);
	};

	return {
		get,
		post: requestWithBody("POST"),
		put: requestWithBody("PUT"),
		patch: requestWithBody("PATCH"),
		delete: del,
	};
};

/**
 * The type of the created API client, for easy reference.
 */
export type APIClient = ReturnType<typeof createAPIClient>;
