import * as fs from "node:fs";
import * as path from "node:path";

type JsonFormat = {
	version: number;
	name: string;
	data: Array<{
		path: string[];
		isGroup: boolean;
		value?: string;
	}>;
};

function readFilesFromDirectory(dir: string): JsonFormat {
	const result: JsonFormat = {
		version: 2,
		name: "ranges",
		data: [],
	};

	result.data.push({
		path: [dir],
		isGroup: true,
	});

	function walk(directory: string): void {
		const files = fs.readdirSync(directory);

		for (const file of files) {
			const fullPath = path.join(directory, file);
			const stats = fs.statSync(fullPath);

			if (stats.isDirectory()) {
				walk(fullPath);
			} else if (stats.isFile() && path.extname(fullPath) === ".txt") {
				const fileContent = fs.readFileSync(fullPath, "utf-8");
				const relativePath = path.relative(dir, fullPath);
				const pathWithoutExtension = relativePath.replace(/\.txt$/, "");

				result.data.push({
					path: [dir, pathWithoutExtension],
					isGroup: false,
					value: fileContent,
				});
			}
		}
	}

	walk(dir);

	return result;
}

const dir = "Cash6m50z100bbGeneral";
const jsonData = readFilesFromDirectory(dir);
fs.writeFileSync(`${dir}.json`, JSON.stringify(jsonData, null, 2), "utf-8");
