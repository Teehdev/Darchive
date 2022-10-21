/**
 * @author Oyetunji Atilade <atiladeoyetunji@gmail.com>
 * @desc Staff controller
 * @access Public
 *
 */

import { Request, Response } from "express";
import validator from "validator";
import { parse } from "csv-parse";
import fs from "fs-extra"

import mongoose from "../../providers/Database";

import User from "../../models/User";
import Media from "../../models/Media";
import Staff from "../../models/Staff"
import { ArrayToDict } from "../../utils/String";
import { ReadHeaders, ReadFile } from "../../utils/File";
import MediaUtil from "../../utils/Media";
import Log from "../../middlewares/Log";
import { validation } from "../../utils/Visualization";


const ObjectId = mongoose.Types.ObjectId;



class StaffCtr {
	public static async uploadFile(req: Request, res: Response) {
		const { userRef } = res.locals.user;
		const files = req.files;
		let promises: any;
		let uploadResponse: any;
		let userDoc: any;
		let staffDoc: any


		try {
			userDoc = await User.findOne({
				_id: new ObjectId(userRef),
			});
			staffDoc = await Staff.findOne({
				user: new ObjectId(userRef),
			})


		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}

		if (Array.isArray(files) && files.length > 0) {
			try {
				promises = (files as []).map(async (file: any) => {
					uploadResponse = await MediaUtil.createOne({
						file,
						createdBy: userDoc._id,
						category: "file",
					});
					return uploadResponse;
				});
				await Promise.all(promises);

				await userDoc.save();
			} catch (error: any) {
				return res.status(500).json({ message: error.message });
			}
		}

		return res
			.status(200)
			.json({ message: "File(s) uploaded successfully" });
	}

	public static async listAllFiles(req: Request, res: Response) {
		try {
			const documents = await Media.find();
			if (documents) {
				res.status(200).json(documents);
			} else {
				res.send("unable fetch documents");
			}
		} catch (error: any) {
			res.status(500).json(error.message);
		}
	}

	public static async listOdkFiles(req: Request, res: Response) {
		try {
			const documents = await Media.find({
				category: "ODK"
			});
			if (documents) {
				res.status(200).json(documents);
			} else {
				res.send("unable fetch ODK documents");
			}
		} catch (error: any) {
			res.status(500).json(error.message);
		}
	}

	public static async listDhisFiles(req: Request, res: Response) {
		try {
			const documents = await Media.find({
				category: "DHIS2"
			});
			if (documents) {
				res.status(200).json(documents);
			} else {
				res.send("unable fetch DHIS documents");
			}
		} catch (error: any) {
			res.status(500).json(error.message);
		}
	}

	public static async listManualUploadFiles(req: Request, res: Response) {
		try {
			const documents = await Media.find({
				category: "MANUAL"
			});
			if (documents) {
				res.status(200).json(documents);
			} else {
				res.send("unable fetch Manual Upload documents");
			}
		} catch (error: any) {
			res.status(500).json(error.message);
		}
	}

	public static async ReadDocumentHeaders(req: Request, res: Response) {
		const { id } = req.params;
		const { numeric } = req.query;

		let mediaDoc: any;

		if (!id) {
			return res.status(400).json({
				message: "'file id' is required.",
				status: 400,
				data: {},
			});
		}

		try {
			mediaDoc = await Media.findOne({
				_id: id
			});

			if (!mediaDoc) {
				return res.status(404).json({
					message: `Document with id: '${id}' not found`,
					status: 404,
					data: {},
				});
			}

			if (mediaDoc?.dataModel !== "Quantitative") {
				return res.status(400).json({
					message: "Visualization can only de done on Quantitative data",
					status: 400,
					data: {},
				});
			}

			// const data = await ReadHeaders(mediaDoc.path);
			const data = await ReadFile(mediaDoc.path);

			if (!data) {
				return res.status(400).json({
					message: "Failed to read file",
					status: 400,
					data: {},
				});
			}

			if (numeric !== "true") {
				return res.status(200).json({
					message: "Headers fetched successfully",
					status: 200,
					data: { headers: data.headers },
				});
			}

			const isNumericColumn = (columns: any) => {
				for (let i = 0; i < columns.length; i++) {
					const element = columns[i];
					if (validation.isNotEmpty(element) && !validation.isNumber(element)) {
						return false
					}
				}
				return true
			}

			const csvObject = ArrayToDict(data.headers, data.data);

			const numericHeaders: string[] = [];

			const keys = Object.keys(csvObject);

			keys.forEach((key, index) => {
				if (isNumericColumn(csvObject[key])) {
					numericHeaders.push(key);
				}
			});

			return res.status(200).json({
				message: "Numeric Headers fetched successfully",
				status: 200,
				data: { headers: numericHeaders },
			});
		} catch (error: any) {
			return res.status(400).json({
				message: error.message,
				status: 400,
				data: {},
			});
		}
	}

	public static async GetAnalytics(req: Request, res: Response) {
		const { id } = req.params;
		const { columns } = req.body;

		let mediaDoc: any;

		if (!id) {
			return res.status(400).json({
				message: "'file id' is required.",
				status: 400,
				data: {},
			});
		}

		try {
			mediaDoc = await Media.findOne({
				_id: id
			});

			if (mediaDoc.dataModel !== "Quantitative") {
				return res.status(400).json({
					message: "Visualization can only de done on Quantitative data",
					status: 400,
					data: {},
				});
			}

			const data = await ReadFile(mediaDoc.path);

			if (!data) {
				return res.status(400).json({
					message: "Failed to read file",
					status: 400,
					data: {},
				});
			}

			const csvObject = ArrayToDict(data.headers, data.data);

			const filtered: any = {};

			for (const key in csvObject) {
				if (Object.prototype.hasOwnProperty.call(csvObject, key)) {
					// filter the object with the selected columns
					for (const selection of columns) {
						if (key === selection) {
							filtered[key] = csvObject[key];
						}
					}
				}
			}

			// compute the sum of array values
			for (const key in filtered) {
				if (Object.prototype.hasOwnProperty.call(filtered, key)) {
					let sum = 0;

					const list = filtered[key];
					for (const value of list) {
						sum += parseFloat(value) || 0
					}
					filtered[key] = sum;
				}
			}

			return res.status(200).json({
				message: "Analytics fetched successfully",
				status: 200,
				data: { ...filtered },
			});
		} catch (error: any) {
			return res.status(400).json({
				message: error.message,
				status: 400,
				data: {},
			});
		}
	}

	public static async GetReport(req: Request, res: Response) {
		const { id } = req.params;
		const { columns } = req.body;

		let mediaDoc: any;

		if (!id) {
			return res.status(400).json({
				message: "'file id' is required.",
				status: 400,
				data: {},
			});
		}

		try {
			mediaDoc = await Media.findOne({
				_id: id
			});

			if (mediaDoc.dataModel !== "Quantitative") {
				return res.status(400).json({
					message: "Report can only de done on Quantitative data",
					status: 400,
					data: {},
				});
			}

			const data = await ReadFile(mediaDoc.path);

			if (!data) {
				return res.status(400).json({
					message: "Failed to read file",
					status: 400,
					data: {},
				});
			}

			const csvObject = ArrayToDict(data.headers, data.data);

			if (!columns) {
				return res.status(200).json({
					message: "Report fetched successfully",
					status: 200,
					data: { ...csvObject },
				});
			}

			const filtered: any = {};

			for (const key in csvObject) {
				if (Object.prototype.hasOwnProperty.call(csvObject, key)) {
					// filter the object with the selected columns
					for (const selection of columns) {
						if (key === selection) {
							filtered[key] = csvObject[key];
						}
					}
				}
			}

			return res.status(200).json({
				message: "Report fetched successfully",
				status: 200,
				data: { ...filtered },
			});
		} catch (error: any) {
			return res.status(400).json({
				message: error.message,
				status: 400,
				data: {},
			});
		}
	}

	public static async downloadFile(req: Request, res: Response) {
		const { fileRef } = req.params;
		let fileDocs: any = {}

		if (!fileRef) {
			return res.status(400).json({
				message: "Bad fileRef",
				status: 400,
				data: {},
			});
		}

		try {
			fileDocs = await Media.findOne({
				_id: fileRef
			});

			if (fileDocs) {
				return res.download(fileDocs.path, (err) => {
					if (err) {
						return res.status(500).json(err);
					}
				})
			} else {
				return res.status(400).json({
					message: "Unable to fetch file",
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

	}

	public static async previewFile(req: Request, res: Response) {
		const { fileRef } = req.params;
		let fileDocs: any = {}

		if (!fileRef) {
			return res.status(400).json({
				message: "Bad fileRef",
				status: 400,
				data: {},
			});
		}

		try {
			fileDocs = await Media.findOne({
				_id: fileRef
			});

			if (fileDocs) {
				const file = fs.createReadStream(fileDocs.path)
				res.setHeader('Content-Disposition', 'inline')
				return file.pipe(res)
			} else {
				return res.status(400).json({
					message: "Unable to fetch file",
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

	}
}

export default StaffCtr;
