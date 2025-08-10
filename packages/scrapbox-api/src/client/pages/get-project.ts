// ref: https://scrapbox.io/scrapboxlab/api%2Fpages%2F:projectname
import * as z from "zod";
import { queryString } from "@/lib/querystring/index.js";
import type { APIClient } from "@/lib/rest-api/client.js";

const ParamsSchema = z.object({
	projectName: z.string().min(1),
	query: z
		.object({
			limit: z.number(),
			skip: z.number(),
			sort: z.literal([
				"updated",
				"created",
				"accessed",
				"linked",
				"views",
				"updatedByMe",
			]),
		})
		.optional(),
});
type Params = z.infer<typeof ParamsSchema>;

const ResponseSchema = z.object({
	projectName: z.string(),
	skip: z.number().nullable().optional(),
	limit: z.number().nullable().optional(),
	count: z.number(),
	pages: z
		.object({
			id: z.string(),
			title: z.string(),
			image: z.string().nullable().optional(),
			descriptions: z.string().array(),
			user: z.object({ id: z.string() }),
			pin: z.number(),
			views: z.number(),
			linked: z.number(),
			commitId: z.string().nullable().optional(),
			created: z.number(),
			updated: z.number(),
			accessed: z.number(),
			lastAccessed: z.number().nullable().optional(),
			snapshotCreated: z.number().nullable().optional(),
			pageRank: z.number().nullable().optional(),
		})
		.array(),
});

export const getProject = (client: APIClient, params: Params) => {
	let path = `/pages/${params.projectName}`;
	if (params.query) {
		const { limit, skip, sort } = params.query;
		path += `?${queryString({
			limit,
			skip,
			sort,
		})}`;
	}
	return client.get(path, ResponseSchema);
};
