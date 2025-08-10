import * as z from "zod";

export class NetworkError extends Error {
	constructor(message?: string) {
		super(message || "Failed to call `fetch()`");
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class HTTPError extends Error {
	constructor(private response: Response) {
		super(response.statusText);
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, new.target.prototype);
	}

	get url() {
		return this.response.url;
	}

	get status() {
		return this.response.status;
	}

	get headers() {
		return this.response.headers;
	}

	get rawResponse() {
		return this.response;
	}
}

export class RequestValidationError extends Error {
	zodError: z.ZodError;
	constructor(zodError: z.ZodError) {
		const pretty = z.prettifyError(zodError);
		super(pretty);
		this.name = "RequestValidationError";
		this.zodError = zodError;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class ResponseValidationError extends Error {
	rawResponse: Response;
	zodError: z.ZodError;
	constructor(zodError: z.ZodError, rawResponse: Response) {
		const pretty = z.prettifyError(zodError);
		super(pretty);
		this.name = "ResponseValidationError";
		this.zodError = zodError;
		this.rawResponse = rawResponse;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class InvalidJsonError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "InvalidJsonError";
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
