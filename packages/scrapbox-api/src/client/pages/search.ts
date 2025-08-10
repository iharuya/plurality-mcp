// ref: https://scrapbox.io/scrapboxlab/api%2Fpages%2F:projectname%2Fsearch%2Fquery
import * as z from "zod";
import { queryString } from "@/lib/querystring/index.js";
import type { APIClient } from "@/lib/rest-api/client.js";

const ParamsSchema = z.object({
	projectName: z.string().min(1),
	query: z.object({
		words: z.string().array().min(1),
		excludes: z.string().array().optional(),
	}),
});
type Params = z.infer<typeof ParamsSchema>;

const ResponseSchema = z.object({
	projectName: z.string(),
	searchQuery: z.string(),
	query: z.object({
		words: z.string().array(),
		excludes: z.string().array(),
	}),
	limit: z.number(),
	count: z.number(),
	existsExactTitleMatch: z.boolean(),
	pages: z
		.object({
			id: z.string(),
			title: z.string(),
			image: z.string().nullable().optional(),
			words: z.string().array(),
			lines: z.string().array(),
		})
		.array(),
});

export const search = (client: APIClient, params: Params) => {
	const { query } = params;
	const words: string = query.words.map((w) => `"${w}"`).join(" ");
	const excludes: string = query.excludes
		? query.excludes.map((e) => `"-${e}"`).join(" ")
		: "";
	let q = words;
	if (excludes !== "") q += ` ${excludes}`;
	const path = `/pages/${params.projectName}/search/query?${queryString({
		q,
	})}`;
	return client.get(path, ResponseSchema);
};
