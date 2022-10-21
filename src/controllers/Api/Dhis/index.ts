import { Request, Response } from 'express';
import validator from "validator";

import Log from "../../../middlewares/Log";
import Template from "../../../models/Template";
import User from "../../../models/User";
import Media from "../../../models/Media";
import mongoose from "../../../providers/Database";

import { FetchAnalytics } from "../../../plugins/dhis";
import { parseTemplate, WriteToFile } from "../../../utils/Dhis";

const ObjectId = mongoose.Types.ObjectId;

export const pullReport = async (req: Request, res: Response) => {
	const { templateRef = "" } = req.params;
	let userDoc: any;

	const { userRef } = res.locals.user;

	try {
		userDoc = await User.findOne({
			_id: new ObjectId(userRef),
		});

		if (!userDoc) {
			return res.status(401).json({
				message: "Unable to retrieve current user, Please log in again",
				status: 401,
				data: {},
			});
		}

	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			status: 500,
			data: {},
		});
	}

	if (!templateRef) {
		return res.status(400).json({
			message: "Bad templateRef",
			status: 400,
			data: {},
		});
	}

	try {
		const result = await Template.findOne({
			_id: templateRef
		});

		if (!result) {
			return res.status(404).json({
				message: "Template not found.",
				status: 404,
				data: {},
			});
		}

		// get template format
		const params = parseTemplate(result?.fields);
		const title = result.name;

		// create filename for template
		const filename = title.replace(/\s+/g, "-").toLowerCase() + `-${Date.now()}.csv`

		const request = await FetchAnalytics(params);
		if (!request.data) {
			return res.status(400).json({
				message: request.statusText,
				status: 400,
				data: {},
			});
		}

		WriteToFile({ data: request.data, filename }).then(({ path, size }) => {
			const fileSize = size;
			const dataModel = "Quantitative";
			const fileType = "text/csv";
			const category = "DHIS2";
			const manualUpload = false;
			const status = "Approved";

			const mediaObj: any = {};

			mediaObj.path = path;
			mediaObj.name = title;
			mediaObj.type = fileType;
			mediaObj.size = fileSize;
			mediaObj.createdBy = userDoc._id;
			mediaObj.dataModel = dataModel;
			mediaObj.category = category;
			mediaObj.manualUpload = manualUpload;
			mediaObj.status = status;
			mediaObj.approvedBy = userDoc._id;
			mediaObj.approvedAt = Date.now();

			try {
				const mediaDoc = new Media(mediaObj);
				mediaDoc.save().then(() => {
					Log.info(path);
					return res.status(200).json({
						message: "Report has been created successfully",
						status: 200,
						data: {
							path
						},
					});
				})
			} catch (error: any) {
				return res.status(400).json({
					message: `Failed to save form in file: ${path}`,
					status: 400,
					data: {},
				});
			}
		});
	} catch (err: any) {
		return res.status(500).json({
			message: err,
			status: 500,
			data: {},
		});
	}
}

export const createTemplate = async (req: Request, res: Response) => {
	const { name, fields: templateObj } = req.body
	const template: any = {}

	let templateDoc: any;
	let userDoc: any;

	Log.debug("template", { ...templateObj })

	if (!name) {
		return res.status(400).json({
			message: "Template name is required.",
			status: 400,
			data: {},
		});
	}

	if (!templateObj) {
		return res.status(400).json({
			message: "Template fields is required.",
			status: 400,
			data: {},
		});
	}

	const { userRef } = res.locals.user;

	try {
		userDoc = await User.findOne({
			_id: new ObjectId(userRef),
		});

		if (!userDoc) {
			return res.status(401).json({
				message: "Unable to retrieve current user, Please log in again",
				status: 401,
				data: {},
			});
		}

	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			status: 500,
			data: {},
		});
	}

	// populate template object
	template.fields = templateObj
	template.name = name
	template.createdBy = userDoc._id

	try {
		templateDoc = new Template(template);
		templateDoc.save().then((result: any) => {
			return res.status(200).json({
				message: "Template has been created successfully",
				status: 200,
				data: result,
			});
		});
	} catch (err: any) {
		return res.status(400).json({
			message: err,
			status: 400,
			data: {},
		});
	}
};

export const listTemplates = async (req: Request, res: Response) => {
	try {
		Template.find().then((result) => {
			const templates = result.map((template) => {
				return {
					id: template._id,
					name: template.name,
					createdBy: template.createdBy,
					createdAt: template.createdAt
				}
			})

			return res.status(200).json({
				message: "Templates fetched successfully",
				status: 200,
				data: templates,
			});
		}).catch((error) => {
			return res.status(400).json({
				message: error.message,
				status: 400,
				data: {},
			});
		})
	} catch (err: any) {
		return res.status(400).json({
			message: err,
			status: 400,
			data: {},
		});
	}
};

export const updateTemplate = async (req: Request, res: Response) => {
	const { templateRef = "" } = req.params;
	const { name, fields: templateObj } = req.body

	let templateDoc;

	if (!templateRef) {
		return res.status(400).json({
			message: "Bad templateRef",
			status: 400,
			data: {},
		});
	}

	if (!templateObj) {
		return res.status(400).json({
			message: "Please supply a new template",
			status: 400,
			data: {},
		});
	}

	try {
		templateDoc = await Template.findOne({
			_id: templateRef,
		});

		if (!templateDoc) {
			return res.status(404).json({
				message: "No template found.",
				status: 404,
				data: {},
			});
		}

		if (name)
			templateDoc.fields = templateObj;
		templateDoc.save();

		return res.status(200).json({
			message: "Template has been updated successfully",
			status: 200,
			data: templateDoc,
		});

	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			status: 500,
			data: {},
		});
	}
};

export const deleteTemplate = async (req: Request, res: Response) => {
	const { templateRef } = req.params;

	if (!templateRef || !validator.isMongoId(templateRef)) {
		return res.status(400).json({
			message: "bad templateRef param",
			status: 400,
			data: {},
		});
	}

	try {
		Template.findOneAndDelete({ _id: templateRef }).then((result) => {

			if (!result) {
				return res.status(404).json({
					message: "Template not found.",
					status: 404,
					data: {},
				});
			}

			return res.status(200).json({
				message: "Template deleted successfully.",
				status: 200,
				data: {},
			});
		}).catch((error) => {
			return res.status(500).json({
				message: error.message,
				status: 500,
				data: {},
			});
		})
	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			status: 500,
			data: {},
		});
	}
};

export const getTemplate = async (req: Request, res: Response) => {
	const { templateRef = "" } = req.params;

	if (!templateRef) {
		return res.status(400).json({
			message: "Bad templateRef",
			status: 400,
			data: {},
		});
	}

	try {
		const templateDocs = await Template.findOne({
			_id: templateRef
		});

		if (templateDocs) {
			return res.status(200).json({
				message: "Template has been fetched successfully",
				status: 200,
				data: templateDocs,
			});
		} else {
			return res.status(400).json({
				message: "Unable to fetch templates",
				status: 400,
				data: {},
			});
		}
	} catch (err: any) {
		return res.status(400).json({
			message: err,
			status: 400,
			data: {},
		});
	}
};
