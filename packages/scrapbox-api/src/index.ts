import type { Config } from "./lib/rest-api/index.js";

export { api } from "./client/index.js";
export {
	type APIClient,
	type Config,
	createAPIClient,
	HTTPError,
	InvalidJsonError,
	NetworkError,
	RequestValidationError,
	ResponseValidationError,
} from "./lib/rest-api/index.js";

export const BASE_URL = "https://scrapbox.io/api";
export const DEFAULT_CONFIG: Config = {
	baseUrl: BASE_URL,
};
