/**
 * @author Oyetunji Atilade <atiladeoyetunji@gmail.com>
 * @desc Change USer password
	 @access Private
 */

import { NextFunction, Request, Response } from "express"
import User from "../../models/User"
import Staff from "../../models/Staff";
import mongoose from "../../providers/Database";
import UploadDHIS from "../../controllers/Api/Dhis/upload"
import UploadODK from "../../controllers/Api/Odk/upload"
import MediaSrv from "../../services/Media";
import MediaUtil from "../../utils/Media"

const ObjectId = mongoose.Types.ObjectId;

export default class UploadMDW {

	/**
	 * manual
	 */
	public static async manual(req: Request, res: Response, next: NextFunction) {
		const { userRef } = res.locals.user;
		const files = req.files
		let userDoc: any;
		let promises: any

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

		if (!files) {
			return res.status(400).json({
				message: "No file is selected",
				status: 400,
				data: {},
			});
		}


		if (Array.isArray(files) && files.length > 0) {
			try {
				promises = files.map(async (file: any) => {
					const upload = MediaUtil.createOne({
						file,
						createdBy: userDoc._id,
						category: "MANUAL",
					})
					return upload
				});

				await Promise.all(promises);
				await userDoc.save();
			} catch (error: any) {
				return res.status(500).json({
					message: error.message,
					status: 500,
					data: {},
				});
			}
		}
		return res.status(200).json({
			message: "Manual upload successful",
			status: 200,
			data: files,
		});
	}

	/**
	 * DHIS2
	 */
	public static async dhis2(req: Request, res: Response, next: NextFunction) {
		const { userRef } = res.locals.user;
		const files = req.files
		let userDoc: any;
		let promises: any



		try {
			userDoc = await User.findOne({
				_id: new ObjectId(userRef),
			});

			if (!userDoc) {
				return res.status(400).json({
					message: "Unable to retrieve current user, Please log in again",
					status: 400,
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

		if (!files) {
			return res.status(400).json({
				message: "No file is selected",
				status: 400,
				data: {},
			});
		}


		if (Array.isArray(files) && files.length > 0) {
			try {
				promises = files.map(async (file: any) => {
					const upload = MediaUtil.createOne({
						file,
						createdBy: userDoc._id,
						category : "DHIS2",
					})
					return upload
				});

				await Promise.all(promises);
				await userDoc.save();
			} catch (error: any) {
				return res.status(500).json({
					message: error.message,
					status: 500,
					data: {},
				});
			}
		}
		return res.status(200).json({
			message: "Manual DHIS2 upload successful",
			status: 200,
			data: files,
		});
	}

	/**
	 * ODK
	 */
	public static async odk(req: Request, res: Response, next: NextFunction) {
		const { userRef } = res.locals.user;
		const files = req.files
		let userDoc: any;
		let promises: any

		try {
			userDoc = await User.findOne({
				_id: new ObjectId(userRef),
			});

			if (!userDoc) {
				return res.status(400).json({
					message: "Unable to retrieve current user, Please log in again",
					status: 400,
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

		if (!files) {
			return res.status(400).json({
				message: "No file is selected",
				status: 400,
				data: {},
			});
		}


		if (Array.isArray(files) && files.length > 0) {
			try {
				promises = files.map(async (file: any) => {
					const upload = MediaUtil.createOne({
						file,
						createdBy: userDoc._id,
						category: "ODK",
					})
					return upload
				});

				await Promise.all(promises);
				await userDoc.save();
			} catch (error: any) {
				return res.status(500).json({
					message: error.message,
					status: 500,
					data: {},
				});
			}
		}
		return res.status(200).json({
			message: "Manual ODK upload successful",
			status: 200,
			data: files,
		});
	}
}