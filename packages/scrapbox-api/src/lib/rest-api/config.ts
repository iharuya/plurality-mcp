export type Config = {
	baseUrl: string;
	/**
	 * Optional default fetch options to apply to all requests.
	 * e.g. for setting authorization headers.
	 */
	fetchOptions?: RequestInit;
};
