import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { api, createAPIClient, DEFAULT_CONFIG } from "@/index.js";
import { ResponseValidationError } from "@/lib/rest-api/error.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const writeToFile = (content: string) => {
	const filename = path.join(__dirname, "logs", "result.json");
	console.log(`Writing content to ${filename}`);
	try {
		writeFileSync(filename, content, "utf8");
		console.log(`Content written to ${filename}`);
	} catch (error) {
		console.error(`Error writing to file ${filename}:`, error);
	}
};

const main = async () => {
	const client = createAPIClient(DEFAULT_CONFIG);
	const data = await api.pages.search(client, {
		projectName: "iharuya",
		query: {
			words: ["Typescript"],
			excludes: ["rest"],
		},
	});

	if (data.isErr()) {
		console.error("Error fetching");
		if (data.val instanceof ResponseValidationError) {
			writeToFile(
				JSON.stringify(
					{
						zodError: data.val.zodError.issues,
						rawResponse: await data.val.rawResponse.json(),
					},
					null,
					2,
				),
			);
		} else {
			writeToFile(JSON.stringify(data.val.stack, null, 2));
		}
	} else {
		console.log("API call successful");
		writeToFile(JSON.stringify(data.unwrap(), null, 2));
	}
};

main().catch((error) => {
	console.error("An error occurred:", error);
	process.exit(1);
});
