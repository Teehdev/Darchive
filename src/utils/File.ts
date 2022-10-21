import fs from "fs";
import Log from "../middlewares/Log";
import { parse } from "csv-parse";

export const getFilesizeInBytes = (filepath: string) => {
	const stats = fs.statSync(filepath);
	const fileSizeInBytes = stats.size;
	return fileSizeInBytes;
}

export const deleteFile = async (path: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		try {
			fs.unlinkSync(path);
			Log.info(`File removed: ${path}`);
			resolve(true);
		} catch (err) {
			reject(err);
		}
	});
}


export const ReadHeaders = async (path: string) => {
	const headers: string[] = [];
	let errors: any;
	const rows: string[] = [];

	return new Promise((resolve, reject) => {
		try {
			fs.createReadStream(path)
				.pipe(parse({ delimiter: "," }))
				.on("data", (row: any) => {
					rows.push(row);
				})
				.on("end", () => {
					Log.info("finished reading file");
					resolve({
						headers: rows.at(0)
					});
				})
				.on("error", (error: any) => {
					errors = error;
					Log.info(error.message);
				});
		} catch (exception) {
			Log.error(`failed to read ${path}`);
			reject();
		}
	});
}

export const ReadFile = async (path: string): Promise<{ headers: any, data: string[] }> => {
	const headers: string[] = [];
	let errors: any;
	const rows: string[] = [];

	return new Promise((resolve, reject) => {
		try {
			fs.createReadStream(path)
				.pipe(parse({ delimiter: "," }))
				.on("data", (row: any) => {
					rows.push(row);
				})
				.on("end", () => {
					Log.info("finished reading file");
					resolve({
						headers: rows[0],
						data: rows.splice(1)
					});
				})
				.on("error", (error: any) => {
					errors = error;
					Log.info(error.message);
				});
		} catch (exception) {
			Log.error(`failed to read ${path}`);
			reject();
		}
	});
}