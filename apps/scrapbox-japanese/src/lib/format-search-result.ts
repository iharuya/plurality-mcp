import type { ResultSuccess } from "@plurality-mcp/result";
import type { api } from "@plurality-mcp/scrapbox-api";

type RPC = typeof api.pages.search;
type Response = ResultSuccess<Awaited<ReturnType<RPC>>>;

type HitPage = {
	title: string;
	firstParagraph: string;
};
type SearchResult = {
	count: number;
	pages: HitPage[];
};

export const formatSearchResult = (data: Response): SearchResult => {
	const pages: HitPage[] = data.pages.map((page) => {
		return {
			title: page.title,
			firstParagraph: page.lines.join("\n"),
		};
	});
	return {
		count: data.count,
		pages,
	};
};
