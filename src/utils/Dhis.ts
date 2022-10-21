import { TemplateType, DimentionType } from "../interfaces/dhis/templates"
import fs from "fs";
import Log from "../middlewares/Log";

const UPLOAD_DIR = "/tmp/uploads/dhis/";

export const WriteToFile = ({ filename, data }: { filename: string, data: string[] }): Promise<{ path: string, size: number }> => {
	return new Promise((resolve, reject) => {
		try {
			// create write stream
			const writer = fs.createWriteStream(UPLOAD_DIR + filename);

			// write data to file
			writer.write(data, "utf-8");

			// handle writer events
			writer.on('finish', () => {
				Log.info(`finished writing to file: ${writer.path.toString()}`);
				resolve({ path: writer.path.toString(), size: fs.statSync(writer.path.toString()).size });

			});
			writer.on('error writing to file', (err) => {
				Log.error(err.stack);
			});

			// end write stream
			writer.end();
		} catch (error) {
			reject(error)
		}
	})
}

export const parseTemplate = (template: TemplateType): string => {
	let params = "";

	// parse columns
	const columns: string = template.columns ? parseDimension(template.columns) : ""

	// parse rows
	const rows: string = template.rows ? parseDimension(template.rows) : ""

	// parse filters
	const filters: string = template.filters ? parseFilters(template.filters) : ""

	// format columns and rows
	const directions: string = parseDirections(template);

	// format output scheme
	const outputScheme = "outputIdScheme=NAME";

	params = encodeParams([columns, rows, filters, directions, outputScheme]);

	return params;
}

export const encodeParams = (params: any[]): string => {
	let encoded: string = "";
	for (const param of params) {
		if (param) {
			encoded += encoded ? `&${param}` : param;
		}
	}
	return encoded;
}

export const parseDimension = (dimensions: DimentionType[]): string => {
	let stringParams: string = "";

	if (dimensions && typeof (dimensions) === "object" && dimensions.length > 0) {
		// loop through columns, which usually has 1 object
		for (const [i, column] of dimensions.entries()) {
			const dimension = column.dimension;
			// append a new dimension if multiple dimensions exist
			stringParams += (i !== dimensions.length - 1) ? `dimension=${dimension}:` : `&dimension=${dimension}:`;

			for (const [index, item] of column.items.entries()) {
				// add separator if not last item
				stringParams += (index !== column.items.length - 1) ? `${item.id};` : `${item.id}`;
			}
		}
	}

	return stringParams;
}

export const parseFilters = (filters: DimentionType[]): string => {
	let stringParams: string = "";

	if (filters && typeof (filters) === "object" && filters.length > 0) {
		// loop through filters, which usually has 1 object
		for (const [i, filter] of filters.entries()) {
			const dimension = filter.dimension;
			// append a new dimension if multiple dimensions exist
			stringParams += (i === filters.length - 1) ? `filter=${dimension}:` : `&filter=${dimension}:`;

			for (const [index, item] of filter.items.entries()) {
				// add separator if not last item
				stringParams += (index !== filter.items.length - 1) ? `${item.id};` : `${item.id}`;
			}
		}
	}

	return stringParams;
}

export const parseDirections = (template: TemplateType): string => {
	let rows: string = "";
	let columns: string = "";
	let stringParams: string = "";

	if (template.rows && typeof (template.rows) === "object" && template.rows.length > 0) {
		rows = "rows=";
		// loop through rows, which usually has 1 object
		for (const [index, row] of template.rows.entries()) {
			rows += (index !== template.rows.length - 1) ? `${row.dimension};` : `${row.dimension}`;
		}
	}

	if (template.columns && typeof (template.columns) === "object" && template.columns.length > 0) {
		columns = "columns=";
		// loop through columns, which usually has 1 object
		for (const [index, col] of template.columns.entries()) {
			columns += (index !== template.columns.length - 1) ? `${col.dimension};` : `${col.dimension}`;
		}
	}

	if (rows) {
		stringParams += rows;
	}

	if (columns) {
		stringParams += rows ? `&${columns}` : columns;
	}

	return stringParams;
}

export const createSampleTemplate = (): TemplateType => {
	const template: TemplateType = {
		"columns": [
			{
				"dimension": "dx",
				"items": [
					{
						"id": "F7IcUrZxi2Z",
						"name": "DPT 1 Coverage"
					},
					{
						"id": "AErjqVmK3pZ",
						"name": "DPT 3 Coverage"
					},
					{
						"id": "hohHPLpnfnU",
						"name": "IPTp1 Coverage (institutional)"
					}
				]
			}
		],
		"rows": [
			{
				"dimension": "pe",
				"items": [
					{
						"id": "LAST_12_MONTHS",
						"name": "Last 12 months"
					}
				]
			}
		],
		"filters": [
			{
				"dimension": "ou",
				"items": [
					{
						"id": "s5DPBsdoE8b",
						"name": "ng Federal Government"
					}
				]
			}
		]
	}
	return template;
}

export const createSampleTemplate2 = (): TemplateType => {
	const template: TemplateType = {
		"columns": [
			{
				"dimension": "dx",
				"items": [
					{
						"id": "ZeMXMabbR4C",
						"name": "BCG Coverage (Monthly)"
					},
					{
						"id": "k7TZGtTN2Md",
						"name": "HBV 0 Coverage (Monthly)"
					},
					{
						"id": "yHw3A23QqP8",
						"name": "Penta 1 Coverage"
					},
					{
						"id": "VRycpXG44y1",
						"name": "Penta 3 Coverage (Monthly)"
					},
					{
						"id": "tb5NGUMB9dQ",
						"name": "Measles 1 Dose Coverage (Monthly)"
					},
					{
						"id": "qagHWllYle8",
						"name": "Measles 2 Dose Coverage (Monthly)"
					},
					{
						"id": "lJsYWH1Yp17",
						"name": "% of planned fixed sessions held"
					},
					{
						"id": "Ho56x8j62Wo",
						"name": "% of Planned outreach sessions held"
					}
				]
			},
			{
				"dimension": "pe",
				"items": [
					{
						"id": "MONTHS_THIS_YEAR",
						"name": "Months this year"
					}
				]
			}
		],
		"rows": [
			{
				"dimension": "ou",
				"items": [
					{
						"id": "LEVEL-3",
						"name": "LEVEL-3"
					},
					{
						"id": "ziJ3yxfgb3m",
						"name": "ba Bauchi State"
					}
				]
			}
		]
	}
	return template;
}