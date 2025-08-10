import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
	api,
	createAPIClient,
	DEFAULT_CONFIG,
} from "@plurality-mcp/scrapbox-api";
import { McpAgent } from "agents/mcp";
import * as z from "zod";
import { apiErrorToText } from "./lib/api-error-to-text";
import { formatPageInfo } from "./lib/format-page-info";
import { formatSearchResult } from "./lib/format-search-result";

type State = { counter: number };

export class MyMCP extends McpAgent<Env, State> {
	server = new McpServer({
		name: "plurality-mcp/scrapbox-japanese",
		title: "Plurality MCP 日本語Scrapbox",
		version: "0.0.0",
	});

	initialState: State = {
		counter: 1,
	};

	async init() {
		this.server.tool(
			"getPage",
			`Get the data of a scrapbox page by its title`,
			{
				pageTitle: z.string().min(1),
			},
			async ({ pageTitle }) => {
				const client = createAPIClient(DEFAULT_CONFIG);
				const data = await api.pages.get(client, {
					projectName: "plurality-japanese",
					pageTitle,
					followRename: true,
				});
				if (data.isErr()) {
					console.error(data.val);
					return {
						isError: true,
						content: [
							{
								type: "text",
								text: apiErrorToText(data.val),
							},
						],
					};
				}

				const pageInfo = formatPageInfo(data.val);

				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(pageInfo, null, 2),
						},
					],
				};
			},
		);
		this.server.tool(
			"searchPage",
			`Search for pages in the scrapbox project`,
			{
				words: z.string().array().min(1),
				excludeWords: z.string().array().optional(),
			},
			async ({ words, excludeWords }) => {
				const client = createAPIClient(DEFAULT_CONFIG);
				const data = await api.pages.search(client, {
					projectName: "plurality-japanese",
					query: {
						words,
						excludes: excludeWords || [],
					},
				});
				if (data.isErr()) {
					console.error(data.val);
					return {
						isError: true,
						content: [
							{
								type: "text",
								text: apiErrorToText(data.val),
							},
						],
					};
				}
				if (data.val.count > 50) {
					return {
						isError: true,
						content: [
							{
								type: "text",
								text: `Search results are too many (hits:${data.val.count}), please refine your search.`,
							},
						],
					};
				}
				const searchResult = formatSearchResult(data.val);
				return {
					content: [
						{
							type: "text",
							text: JSON.stringify(searchResult, null, 2),
						},
					],
				};
			},
		);

		// Example tool
		this.server.resource(`counter`, `mcp://resource/counter`, (uri) => {
			return {
				contents: [{ uri: uri.href, text: String(this.state.counter) }],
			};
		});

		this.server.tool(
			"increment",
			"add 'a' to the counter, stored in the MCP (example tool)",
			{ a: z.number() },
			async ({ a }) => {
				this.setState({ ...this.state, counter: this.state.counter + a });
				return {
					content: [
						{
							type: "text",
							text: String(`Added ${a}, total is now ${this.state.counter}`),
						},
					],
				};
			},
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}

		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		return new Response("Not found", { status: 404 });
	},
};
