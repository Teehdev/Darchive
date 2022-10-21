/**
 * @author Oyetunji Atilade <atiladeoyetunji@gmail.com>
 * @desc Change USer password
   @access Private
 */

		import { Request, Response } from "express";
		import validator from "validator";

		import UserMdl from "../../../models/User";

		export default class User {
				/**
        * changePAssword
        */

				public static async changePassword(req: Request, res: Response) {
						const user = res.locals.user.userRef;
						const { oldPassword, newPassword, confirmPassword } = req.body;
						let userDoc;

						try {
								// check for empty old password field
								if (validator.isEmpty(oldPassword, { ignore_whitespace: true })) {
										return res.status(400).json({
												message: "Password field cannot be blank",
										});
								}
								// check for empty new password field
								if (validator.isEmpty(newPassword, { ignore_whitespace: true })) {
										return res.status(400).json({
												message: "Password field cannot be blank",
										});
								}

								// check for bad  new password type
								if (!["string"].includes(typeof newPassword)) {
										return res.status(400).json({
												message: " password should be a string",
										});
								}

															// Check for password length
							if (!validator.isLength(newPassword, { min: 8 })) {
								return res.status(400).json({
										message: "newPassword length must be atleast 8 characters",
								});
						}

						// Check for insufficient newPassword characters
						if (!/[0-9]/.test(newPassword)) {
								return res.status(400).json({
										message: "newPassword must contain atleast one number",
								});
						}
						if (!/[A-Z]/.test(newPassword)) {
								return res.status(400).json({
										message: "newPassword must contain atleast one uppercase letter",
								});
						}
						if (!/[a-z]/.test(newPassword)) {
								return res.status(400).json({
										message: "newPassword must contain atleast one lowercase letter",
								});
						}

						if (!/[@#$%^&+=,.(*)]/.test(newPassword)) {
								return res.status(400).json({
										message: "newPassword must contain atleast one special character",
								});
						}

								// check for empty confirm password field
								if (validator.isEmpty(confirmPassword, { ignore_whitespace: true })) {
										return res.status(400).json({
												message: " Confirm Password field cannot be blank",
										});
								}
								// check for bad confirm password type
								if (!["string"].includes(typeof confirmPassword)) {
										return res.status(400).json({
												message: "confirm password should be a string",
										});
								}

								// check for inequality between confirm password and password
								if (!validator.equals(newPassword, confirmPassword)) {
										return res.status(400).json({
												message: "Confirm password does not match new Password",
										});
								}
						} catch (error: any) {
								res.status(500).json({ message: error.message });
						}

						userDoc = await UserMdl.findOne({
								_id: user,
						});

						if (!userDoc) {
								return res.status(400).json({
										message: " we were unable to find a user with that email",
								});
						}

						try {
								await userDoc.changePassword(oldPassword, newPassword);
								userDoc.save();
						} catch (error: any) {
								return res.status(500).json({ message: error.message });
						}

						return res.status(200).json({
								message: "Password successfully changed",
						});
				}
		}
