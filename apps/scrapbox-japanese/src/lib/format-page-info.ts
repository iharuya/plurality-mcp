import type { ResultSuccess } from "@plurality-mcp/result";
import type { api } from "@plurality-mcp/scrapbox-api";

type RPC = typeof api.pages.get;
type Response = ResultSuccess<Awaited<ReturnType<RPC>>>;

type PageInfo = {
	title: string;
	rawText: string;
	relatedTitles: string[];
};

const linesToText = (lines: Response["lines"]): string => {
	return lines.map((line) => line.text).join("\n");
};

const extractRelatedTitles = (
	relatedPages: Response["relatedPages"],
): string[] => {
	const hop1 = relatedPages.links1hop.map((page) => page.title);
	const hop2 = relatedPages.links2hop.map((page) => page.title);
	return [...hop1, ...hop2];
};

export const formatPageInfo = (data: Response): PageInfo => {
	const rawText = linesToText(data.lines);
	const relatedTitles = extractRelatedTitles(data.relatedPages);
	return { title: data.title, rawText, relatedTitles };
};
