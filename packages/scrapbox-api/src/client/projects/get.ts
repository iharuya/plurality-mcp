// ref: https://scrapbox.io/scrapboxlab/api%2Fprojects%2F:projectname
import * as z from "zod";
import type { APIClient } from "@/lib/rest-api/client.js";

const ParamsSchema = z.object({
	projectName: z.string().min(1),
});
type Params = z.infer<typeof ParamsSchema>;

const ResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string(),
	publicVisible: z.boolean(),
	theme: z.string(),
	image: z.string().optional(),
	created: z.number(),
	updated: z.number(),
	isMember: z.boolean(), // 現時点では認証ロジックがないため常にfalse
});

export const get = (client: APIClient, params: Params) =>
	client.get(`/projects/${params.projectName}`, ResponseSchema);
