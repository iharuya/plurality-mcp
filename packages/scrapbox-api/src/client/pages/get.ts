// ref: https://scrapbox.io/scrapboxlab/api%2Fpages%2F:projectname%2F:pagetitle

import * as z from "zod";
import { queryString } from "@/lib/querystring/index.js";
import type { APIClient } from "@/lib/rest-api/client.js";

const ParamsSchema = z.object({
	projectName: z.string().min(1),
	pageTitle: z.string().min(1),
	followRename: z.boolean().optional().default(false),
	filterType: z.literal(["icon"]).optional(),
	filterValue: z.string().optional(),
});

type Params = z.infer<typeof ParamsSchema>;

const RelatedPageSchema = z.object({
	id: z.string(),
	title: z.string(),
	titleLc: z.string(),
	image: z.string().nullable().optional(),
	descriptions: z.string().array(),
	linksLc: z.string().array(),
	linked: z.number(),
	updated: z.number(),
	accessed: z.number(),
});

const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
	photo: z.string(),
});

const ResponseSchema = z.object({
	id: z.string(),
	title: z.string(),
	image: z.string().nullable().optional(),
	descriptions: z.string().array(),
	pin: z.number(),
	views: z.number(),
	linked: z.number(),
	commitId: z.string().nullable().optional(),
	created: z.number(),
	updated: z.number(),
	accessed: z.number(),
	lastAccessed: z.number().nullable(),
	snapshotCreated: z.number().nullable().optional(),
	snapshotCount: z.number().nullable().optional(),
	pageRank: z.number(),
	lines: z
		.object({
			id: z.string(),
			text: z.string(),
			userId: z.string(),
			created: z.number(),
			updated: z.number(),
		})
		.array(),
	links: z.string().array(),
	icons: z.string().array(),
	files: z.string().array(),
	relatedPages: z.object({
		links1hop: RelatedPageSchema.array(),
		links2hop: RelatedPageSchema.array(),
		hasBackLinksOrIcons: z.boolean(),
	}),
	user: UserSchema,
	collaborators: UserSchema.array(),
});

export const get = (client: APIClient, params: Params) => {
	const { projectName, pageTitle, ...rest } = params;
	const path = `/pages/${projectName}/${pageTitle}?${queryString(rest)}`;

	return client.get(path, ResponseSchema);
};
