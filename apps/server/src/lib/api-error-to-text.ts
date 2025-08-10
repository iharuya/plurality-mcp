import {
	HTTPError,
	InvalidJsonError,
	NetworkError,
	ResponseValidationError,
} from "@plurality-mcp/scrapbox-api";

/**
 * returns error message for users
 * make sure internal error detail are not exposed to users
 */
export const apiErrorToText = (error: unknown): string => {
	const prefix = "Failed to call internal API:";
	if (error instanceof NetworkError) {
		return `${prefix} server network error`;
	}
	if (error instanceof HTTPError) {
		return `${prefix} status code ${error.status}`;
	}
	if (
		error instanceof ResponseValidationError ||
		error instanceof InvalidJsonError
	) {
		return `${prefix} response shape was unexpected`;
	}
	return `${prefix} unexpected error`;
};
