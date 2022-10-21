import fs from "fs";
import dotenv from "dotenv";
import { Request, Response } from 'express';
import Log from "../../../middlewares/Log";
import Media from "../../../models/Media";
import { FetchForms, FetchFormData, GetApiToken, FetchFormMetadata } from "../../../plugins/koboconnect"
import { FormResponse } from '../../../interfaces/odk/form';
import User from "../../../models/User";
import mongoose from "../../../providers/Database";

const UPLOAD_DIR = "/tmp/uploads/odk/";

const ObjectId = mongoose.Types.ObjectId;

const WriteToFile = ({ filename, data }: { filename: string, data: string[] }): Promise<{ path: string, size: number }> => {
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

export const GetAllForms = async (req: Request, res: Response) => {
	const { url = process.env.ODK_KC_URL, token } = req.body;

	if (!url) {
		return res.status(400).json({
			message: "'url' is required.",
			status: 400,
			data: {},
		});
	} else if (!token) {
		return res.status(400).json({
			message: "'token' is required.",
			status: 400,
			data: {},
		});
	}

	try {
		FetchForms({ url, token }).then((response) => {
			const forms = response.data.map((form: FormResponse) => {
				return {
					id: form.formid,
					title: form.title,
					data_modified: form.date_modified,
					last_submission_time: form.last_submission_time,
				}
			})
			return res.status(200).json({
				message: "Successfully fetched all forms",
				status: 200,
				data: forms,
			});
		}).catch((error) => {
			return res.status(400).json({
				message: "Error fetching forms.",
				status: 400,
				data: error,
			});
		})
	} catch (err) {
		return res.status(400).json({
			message: err,
			status: 400,
			data: {},
		});
	}
};

export const GetForm = async (req: Request, res: Response) => {
	const { url = process.env.ODK_KC_URL, token, form_id: formId } = req.body;
	const { userRef } = res.locals.user;

	let userDoc: any;

	try {
		userDoc = await User.findOne({
			_id: new ObjectId(userRef),
		});
	} catch (error: any) {
		return res.status(500).json({ message: error.message });
	}

	if (!url) {
		return res.status(400).json({
			message: "'url' is required.",
			status: 400,
			data: {},
		});
	} else if (!token) {
		return res.status(400).json({
			message: "'token' is required.",
			status: 400,
			data: {},
		});
	} else if (!formId) {
		return res.status(400).json({
			message: "'form_id' is required.",
			status: 400,
			data: {},
		});
	}

	try {
		// fetch form metadata
		const metadataResponse = await FetchFormMetadata({ url, token, formId });

		if (metadataResponse.data.title) {
			const title = metadataResponse.data.title;
			const id = metadataResponse.data.formid;

			// fetch form data
			FetchFormData({ url, token, formId }).then((response) => {
				const filename = title.replace(/\s+/g, "-").toLowerCase() + `-${Date.now()}.csv`

				WriteToFile({ data: response.data, filename }).then(({ path, size }) => {
					const fileSize = size;
					const dataModel = "Quantitative";
					const fileType = "text/csv";
					const category = "ODK"
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
							// TODO: Store form detail and location in database
							return res.status(200).json({
								message: "Successfully pulled ODK form data",
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
				})
			})
		} else {
			return res.status(400).json({
				message: `Failed to fetch form: ${formId}`,
				status: 400,
				data: {},
			});
		}
	} catch (err) {
		return res.status(400).json({
			message: err,
			status: 400,
			data: {},
		});
	}
};

export const GetToken = async (req: Request, res: Response) => {
	dotenv.config();

	const { url = process.env.ODK_KOBO_URL, username, password } = req.body;
	Log.info(process.env.ODK_KOBO_URL || "Undefined")

	if (!url) {
		return res.status(400).json({
			message: "'url' is required.",
			status: 400,
			data: {},
		});
	} else if (!username) {
		return res.status(400).json({
			message: "'username' is required.",
			status: 400,
			data: {},
		});
	} else if (!password) {
		return res.status(400).json({
			message: "'password' is required.",
			status: 400,
			data: {},
		});
	}

	try {
		GetApiToken({ url, username, password }).then((response) => {
			if (response.data.token) {
				return res.status(200).json({
					message: "Successfully fetched API token.",
					status: 200,
					data: response.data,
				});
			} else {
				return res.status(400).json({
					message: "Invalid username/password.",
					status: 400,
					data: {},
				});
			}
		}).catch((error) => {
			return res.status(400).json({
				message: "Error fetching API token.",
				status: 400,
				data: {},
			});
		})
	} catch (err) {
		return res.status(400).json({
			message: err,
			status: 400,
			data: {},
		});
	}
};
