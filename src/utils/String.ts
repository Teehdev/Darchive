export const toProperCase = (str: string) => {
	return str.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

export const ArrayToDict = (headers: string[], data: string[]) => {
	const dict: any = {};

	// add headers to object
	for (const header of headers) {
		dict[header] = [];
	}

	// push values to correct object keys
	for (const row of data) {
		for (let index = 0; index < row.length; index++) {
			dict[headers[index]].push(row[index])
		}
	}

	return dict
}