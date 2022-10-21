/**
 * @author Oyetunji Atilade <atiladeoyetunji@gmail.com>
 * @desc subscription pricing
 * @access Public
 *
 */

import { Request, Response } from "express";
import validator from "validator";
import mongoose from "../../providers/Database";

import User from "../../models/User";
import { deleteFile } from "../../utils/File";
import MediaDBQuery from "../../queries/Media";
import RoleDBQuery from "../../queries/Role";
import Media from "../../models/Media";
import Role from "../../models/Role";
import Admin from "../../models/Admin";
import Staff from "../../models/Staff";
import Folder from "../../models/Folder"
import Log from "../../middlewares/Log";

const ObjectId = mongoose.Types.ObjectId;


class AdminCtr {

	/**
 * getAccount
 */
	public static async getAccount(req: Request, res: Response) {
		const { userRef, userType } = res.locals.user;

		let userDoc: any;
		try {
			switch (userType) {
				case "Staff": {
					userDoc = await AdminCtr.getStaffAccount(userRef);
					break;
				}
				case "Donor": {
					userDoc = await AdminCtr.getDonorAccount(userRef);
					break;
				}
				case "Stakeholder": {
					userDoc = await AdminCtr.getStakeholderAccount(userRef);
					break;
				}

				default:
					break;
			}
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}

		if (!userDoc) {
			return res.status(400).json({
				message: "No userDoc found",
			});
		}

		return res.status(200).json(userDoc);
	}

	/**
	 * Get Staff Data
	 * @param userRef
	 * @returns  userDoc/ error
	 */
	private static async getStaffAccount(userRef: any) {
		let userDoc: any;

		try {
			userDoc = await User.aggregate([
				{
					$match: { _id: new ObjectId(userRef) },
				},

				{ $project: { hash: 0, salt: 0 } },
				...MediaDBQuery.join("avatar", "avatar"),
				{
					$lookup: {
						from: "staff",
						let: { userRef: "$_id" },
						pipeline: [
							{
								$match: {
									$expr: { $eq: ["$user", "$$userRef"] },
								},
							},
						],

						as: "staff",
					},
				},
				{
					$unwind: {
						path: "$staff",
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$addFields: {
						staffRef: "$staff._id",
						staffPublicRef: "$staff.ref",
						role: "$staff.role",
					},
				},

				{
					$project: { staff: 0 },
				},

				...RoleDBQuery.join(),
				{ $addFields: { role: "$role.name" } },
			]).exec();
		} catch (error: any) {
			return Promise.reject(error.message);
		}

		if (!userDoc) {
			return Promise.reject("No user Doc found");
		}

		return Promise.resolve(userDoc);
	}

	/**
 * Get Donor Data
 * @param userRef
 * @returns  userDoc/ error
 */
	private static async getDonorAccount(userRef: any) {
		let userDoc: any;

		try {
			userDoc = await User.aggregate([
				{
					$match: { _id: new ObjectId(userRef) },
				},

				{ $project: { hash: 0, salt: 0 } },
				...MediaDBQuery.join("avatar", "avatar"),
				{
					$lookup: {
						from: "donor",
						let: { userRef: "$_id" },
						pipeline: [
							{
								$match: {
									$expr: { $eq: ["$user", "$$userRef"] },
								},
							},
						],

						as: "donor",
					},
				},
				{
					$unwind: {
						path: "$donor",
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$addFields: {
						donorRef: "$donor._id",
						donorPublicRef: "$donor.ref",
						role: "$donor.role",
					},
				},

				{
					$project: { donor: 0 },
				},

				...RoleDBQuery.join(),
				{ $addFields: { role: "$role.name" } },
			]).exec();
		} catch (error: any) {
			return Promise.reject(error.message);
		}

		if (!userDoc) {
			return Promise.reject("No user Doc found");
		}

		return Promise.resolve(userDoc);
	}

	/**
* Get stakeholder Data
* @param userRef
* @returns  userDoc/ error
*/
	private static async getStakeholderAccount(userRef: any) {
		let userDoc: any;

		try {
			userDoc = await User.aggregate([
				{
					$match: { _id: new ObjectId(userRef) },
				},

				{ $project: { hash: 0, salt: 0 } },
				...MediaDBQuery.join("avatar", "avatar"),
				{
					$lookup: {
						from: "stakeholder",
						let: { userRef: "$_id" },
						pipeline: [
							{
								$match: {
									$expr: { $eq: ["$user", "$$userRef"] },
								},
							},
						],

						as: "stakeholder",
					},
				},
				{
					$unwind: {
						path: "$stakeholder",
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$addFields: {
						stakeholderRef: "$stakeholder._id",
						stakeholderPublicRef: "$stakeholder.ref",
						role: "$stakeholder.role",
					},
				},

				{
					$project: { stakeholder: 0 },
				},

				...RoleDBQuery.join(),
				{ $addFields: { role: "$role.name" } },
			]).exec();
		} catch (error: any) {
			return Promise.reject(error.message);
		}

		if (!userDoc) {
			return Promise.reject("No user Doc found");
		}

		return Promise.resolve(userDoc);
	}

	/**
	 * activateAccount
	 */
	public static async activateAccount(req: Request, res: Response) {
		// const { userRef } = res.locals.user;
		const { email } = req.body;
		let userDoc: any;

		try {
			userDoc = await User.findOne({
				// _id: new ObjectId(userRef),
				email
			});
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}

		try {
			userDoc.active = true;

			await userDoc.save();
		} catch (error: any) {
			return res.status(400).json({ message: error.message });
		}

		return res
			.status(200)
			.json({ message: "Account has been activated successfully" });
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @returns
	 */
	public static async deleteAccount(req: Request, res: Response) {
		// const { userRef } = res.locals.user;
		const { email } = req.body;
		let userDel: any;

		try {
			userDel = await User.deleteOne({
				// _id: new ObjectId(userRef),
				email
			});
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}

		return res
			.status(200)
			.json({ message: "Account has been deleted successfully" });
	}
	/**
	 *
	 * @param req
	 * @param res
	 * @returns
	 */
	public static async deActivateAccount(req: Request, res: Response) {
		// const { userRef } = res.locals.user;
		const { email } = req.body;
		let userDoc: any;

		try {
			userDoc = await User.findOne({
				// _id: new ObjectId(userRef),
				email
			});
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}

		try {
			userDoc.active = false;

			await userDoc.save();
		} catch (error: any) {
			return res.status(400).json({ message: error.message });
		}

		return res
			.status(200)
			.json({ message: "Account has been deactivated successfully" });
	}

	/**
	 * listUsers
	 */
	public static async listUsers(req: Request, res: Response) {
		try {
			const users = await User.find();
			if (users) {
				res.status(200).json(users);
			} else {
				res.send("unable fetch users");
			}
		} catch (error: any) {
			res.status(500).json(error.message);
		}
	}

	public static async ApproveDocument(req: Request, res: Response) {
		const { id } = req.params;
		const { userRef } = res.locals.user;

		let userDoc: any;

		try {
			userDoc = await User.findOne({
				_id: new ObjectId(userRef),
			});
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}

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

			mediaDoc.status = "Approved";
			mediaDoc.approvedBy = userDoc._id;
			mediaDoc.approvedAt = Date.now();

			mediaDoc.save().then(() => {
				return res.status(200).json({
					message: "Document Approved Successfully",
					status: 200,
					data: {},
				});
			})

		} catch (error: any) {
			return res.status(400).json({
				message: error.message,
				status: 400,
				data: {},
			});
		}
	}

	public static async DisapproveDocument(req: Request, res: Response) {
		const { id } = req.params;
		const { userRef } = res.locals.user;
		const { message } = req.body;

		let userDoc: any;

		try {
			userDoc = await User.findOne({
				_id: new ObjectId(userRef),
			});
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}

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

			mediaDoc.status = "Not-Approved";
			mediaDoc.disapprovedBy = userDoc._id;
			mediaDoc.disapprovedAt = Date.now();
			mediaDoc.disapprovalNote = message || "Your upload has been disapproved. Please review the document and re-upload.";

			mediaDoc.save().then(() => {
				return res.status(200).json({
					message: "Document Disapproved Successfully",
					status: 200,
					data: {},
				});
			})

		} catch (error: any) {
			return res.status(400).json({
				message: error.message,
				status: 400,
				data: {},
			});
		}
	}

	public static async DeleteDocument(req: Request, res: Response) {
		const { id } = req.params;
		const { userRef } = res.locals.user;

		let userDoc: any;

		try {
			userDoc = await User.findOne({
				_id: new ObjectId(userRef),
			});
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}

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
					message: `Document with id: ${id} does not exist.`,
					status: 404,
					data: {},
				});
			}

			const deletion = await deleteFile(mediaDoc.path);

			if (deletion) {
				mediaDoc.delete().then(() => {
					return res.status(200).json({
						message: "Document Deleted Successfully",
						status: 200,
						data: {},
					});
				});
			} else {
				return res.status(400).json({
					message: "Document could not be deleted",
					status: 400,
					data: {},
				});
			}
		} catch (error: any) {
			return res.status(400).json({
				message: error.message,
				status: 400,
				data: {},
			});
		}
	}
	public static async upgradeUserAccess(req:Request, res: Response) {
		const {userId = ""} = req.params
		let roleDoc
		let userDoc
		let staffDoc
		let staffDel
		let adminExists

		if (!userId) {
			return res.status(400).json({
				message: "Bad userId",
				status: 400,
				data: {},
			});
		}
				// ensure role exists with type === "Admin"
		try {
			roleDoc = await Role.findOne({ type: "Admin" });
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}

		if (!roleDoc) {
			return res
				.status(400)
				.json({ message: "No Role exists for admin yet. Contact Support." });
		}

		try {
			userDoc = await User.findOne({
				_id: new ObjectId(userId),
			});
			if (!userDoc) {
				return res.status(401).json({
					message: "Unable to retrieve user, Please log in again",
					status: 401,
					data: {},
				});
			}

			userDoc.type = "Admin";

			await userDoc.save();

		} catch (error: any) {
			return res.status(500).json({
				message: error.message,
				status: 500,
				data: {},
			});
		}

		try {
			staffDoc = await Staff.findOne({
				user: new ObjectId(userId),
			});
			if (!staffDoc) {
				return res.status(401).json({
					message: "Unable to retrieve staff document, Please try again",
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


		// Check if admin account already exists
		try {
			adminExists = await Admin.findOne({
				user: userId
			})

			if (adminExists) {
				return res.status(401).json({
					message: "User already exist as admin account",
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

		try {
				// Create Admin

		const admin = await Admin.create({
			user: userDoc._id,
			// name: roleDoc.name,
			ref: staffDoc.ref,
			role: roleDoc._id,
			nextOfKin: staffDoc.nextOfKin,
			nextOfKinTelephone: staffDoc.nextOfKinTelephone,
		});
		if (!admin) {
			return res.status(500).json({
				message: "Unable to create admin",
			});
		}

		staffDel = await Staff.deleteMany({
			// _id: staffDoc.id
						user: userId

		});
		if (!staffDel) {
				return res.status(500).json({
				message: "Unable to delete staff document",
			});
		}

		return res
			.status(200)
			.json({ message: "User role has been Upgraded successfully" });
		} catch (error:any) {
			return res.status(500).json({
				message: error.message,
				status: 500,
				data: {},
			});
		}





	}
	public static async downgradeUserAccess(req:Request, res: Response) {
		const {userId = ""} = req.params
		let roleDoc
		let userDoc
		let adminDoc
		let adminDel
		let staffExists

		if (!userId) {
			return res.status(400).json({
				message: "Bad userId",
				status: 400,
				data: {},
			});
		}
				// ensure role exists with type === "Admin"
		try {
			roleDoc = await Role.findOne({ type: "Staff" });
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}

		if (!roleDoc) {
			return res
				.status(400)
				.json({ message: "No Role exists for admin yet. Contact Support." });
		}

		try {
			userDoc = await User.findOne({
				_id: new ObjectId(userId),
			});
			if (!userDoc) {
				return res.status(401).json({
					message: "Unable to retrieve user, Please log in again",
					status: 401,
					data: {},
				});
			}

			userDoc.type = "Staff";

			await userDoc.save();

		} catch (error: any) {
			return res.status(500).json({
				message: error.message,
				status: 500,
				data: {},
			});
		}

		try {
			adminDoc = await Admin.findOne({
				user: new ObjectId(userId),
			});
			if (!adminDoc) {
				return res.status(401).json({
					message: "Unable to retrieve admin document, Please try again",
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


		// Check if staff account already exists
		try {
			staffExists = await Staff.findOne({
				user: userId
			})

			if (staffExists) {
				return res.status(401).json({
					message: "User already exist as staff account",
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

		try {
				// Create staff

		const staff = await Staff.create({
			user: userDoc._id,
			// name: roleDoc.name,
			ref: adminDoc.ref,
			role: roleDoc._id,
			nextOfKin: adminDoc.nextOfKin,
			nextOfKinTelephone: adminDoc.nextOfKinTelephone,
		});
		if (!staff) {
			return res.status(500).json({
				message: "Unable to create staff",
			});
		}

		Log.info(adminDoc.id)
		adminDel = await Admin.deleteOne({
			_id: adminDoc.id
		});
		if (!adminDel) {
				return res.status(500).json({
				message: "Unable to delete admin document",
			});
		}

		return res
			.status(200)
			.json({ message: "User role has been downgraded to Staff successfully" });
		} catch (error:any) {
			return res.status(500).json({
				message: error.message,
				status: 500,
				data: {},
			});
		}





	}
	public static async createFolder(req:Request, res: Response) {
		const { name } = req.body
	const folder: any = {}

	let folderDoc: any;
	let userDoc: any;


	// Log.debug("folder", { ...folderObj })

	if (!name) {
		return res.status(400).json({
			message: "folder name is required.",
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

	// populate folder object
	folder.name = name
	folder.path = name.replace(/\s+/g, "-").toLowerCase()
	folder.createdBy = userDoc._id

	try {
		folderDoc = new Folder(folder);
		folderDoc.save().then((result: any) => {
			return res.status(200).json({
				message: "folder has been created successfully",
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
	}

	public static async listFolders(req:Request, res: Response) {
			try {
		Folder.find().then((result) => {
			const folders = result.map((folder) => {
				return {
					id: folder._id,
					name: folder.name,
					path: folder.path,
					createdBy: folder.createdBy,
					createdAt: folder.createdAt
				}
			})

			return res.status(200).json({
				message: "Folders fetched successfully",
				status: 200,
				data: folders,
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
	}

	public static async updateFolder(req:Request, res: Response) {
			const { folderRef = "" } = req.params;
	const { name } = req.body

	let folderDoc;

	if (!folderRef) {
		return res.status(400).json({
			message: "Bad folderRef",
			status: 400,
			data: {},
		});
	}

	if (!name) {
		return res.status(400).json({
			message: "Please supply a new folder name",
			status: 400,
			data: {},
		});
	}

	try {
		folderDoc = await Folder.findOne({
			_id: folderRef,
		});

		if (!folderDoc) {
			return res.status(404).json({
				message: "No folder found.",
				status: 404,
				data: {},
			});
		}

		if (name) {
			folderDoc.name = name;
			folderDoc.path = name.replace(/\s+/g, "-").toLowerCase()
		folderDoc.save();

		return res.status(200).json({
			message: "Folder has been updated successfully",
			status: 200,
			data: folderDoc,
		});
		}

	} catch (error: any) {
		return res.status(500).json({
			message: error.message,
			status: 500,
			data: {},
		});
	}
	}

	public static async deleteFolder(req: Request, res: Response) {
			const { folderRef } = req.params;

	if (!folderRef || !validator.isMongoId(folderRef)) {
		return res.status(400).json({
			message: "bad folderRef param",
			status: 400,
			data: {},
		});
	}

	try {
		Folder.findOneAndDelete({ _id: folderRef }).then((result) => {

			if (!result) {
				return res.status(404).json({
					message: "Folder not found.",
					status: 404,
					data: {},
				});
			}

			return res.status(200).json({
				message: "Folder deleted successfully.",
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
	}

	public static async getFolder(req: Request, res: Response) {
			const { folderRef = "" } = req.params;

	if (!folderRef) {
		return res.status(400).json({
			message: "Bad folderRef",
			status: 400,
			data: {},
		});
	}

	try {
		const folderDocs = await Folder.findOne({
			_id: folderRef
		});

		if (folderDocs) {
			return res.status(200).json({
				message: "Folder has been fetched successfully",
				status: 200,
				data: folderDocs,
			});
		} else {
			return res.status(400).json({
				message: "Unable to fetch folders",
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

export default AdminCtr;