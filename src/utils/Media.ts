import Media from "../models/Media";
import MediaSrv from "../services/Media";
import Locals from "../providers/Locals";
import Log from "../middlewares/Log";
import Gen from "../utils/Gen"

import multer from "multer"

export default class MediaUtil {
	/**
	 * createOne
	 */
	public static async createOne({
		file,
		createdBy,
		category,
	}: {
		file: any;
		createdBy: string;
		category: string;
	}) {
		let mediaDoc: any;
		const mediaObj: any = {};
		let fileName

		try {
			if (category === "ODK") {
				fileName = file.originalname.replace(/\s+/g, "-").toLowerCase() + `-${Date.now()}.csv`
			} else if (category === "DHIS2") {
				fileName = file.originalname.replace(/\s+/g, "-").toLowerCase() + `-${Date.now()}.csv`
			} else { fileName = `${Date.now()}` + file.originalname.replace(/\s+/g, "-").toLowerCase() }
		} catch (error: any) {
			return error.message

		}

		const Key = await Gen.generateFileKey()
		Log.info(file.path)

		if (file.mimetype === "text/csv" || file.type === "text/csv") {
			mediaObj.dataModel = "Quantitative"
		} else {
			mediaObj.dataModel = "Qualitative"
		}

		mediaObj.path = file.path;
		mediaObj.key = Key;
		mediaObj.name = fileName;
		mediaObj.type = file.mimetype || file.type;
		mediaObj.size = file.size;
		mediaObj.createdBy = createdBy;
		// mediaObj.dataModel = dataModel.toString();
		mediaObj.category = category.toUpperCase();

		try {
			mediaDoc = new Media(mediaObj);

			await mediaDoc.save();
		} catch (error: any) {
			return Promise.reject(error);
		}

		return Promise.resolve(mediaDoc);
	}
}
