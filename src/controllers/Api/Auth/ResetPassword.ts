/**
 * Define the Reset Password logic
 *
 * @author Oyetunji Atilade <atiladeoyetunji@gmail.com>
 */

 import { Request, Response, NextFunction } from "express";
 import validator from "validator";

 import moment from "moment";
 import User from "../../../models/User";

 import Gen from "../../../utils/Gen";
 import Log from "../../../middlewares/Log";
 import Token from "../../../models/Token";
 import Locals from "../../../providers/Locals";

 class ResetPassword {
			/**
      *  Request a Reset Password Link.
      *  @Route POST /api/auth/request-reset-password-link
      */

			public static async requestLink(req: Request, res: Response) {
					const { email = "" } = req.body;

					let tokenDoc;
					let userDoc;
					let sanitizedEmail;

					try {
							// check for empty email field
							if (validator.isEmpty(email, { ignore_whitespace: true })) {
									return res.status(400).json({
											message: "E-mail cannot be blank",
									});
							}
							// check for bad  email type
							if (typeof email !== "string") {
									return res.status(400).json({
											message: "email should be a string",
									});
							}

							// check for invalid email
							if (!validator.isEmail(email)) {
									return res.status(400).json({
											message: "E-mail is not valid",
									});
							}
					} catch (error: any) {
							res.status(500).json({ message: error.message });
					}

					// define verifiedEmail

					sanitizedEmail = validator.normalizeEmail(email, {
							gmail_remove_dots: false,
					});

					userDoc = await User.findOne({
							email: sanitizedEmail,
					});

					if (!userDoc) {
							return res.status(400).json({
									message: " we were unable to find a user with that email",
							});
					}

					// Generate slug Token
					const tokenCode = await Gen.generateSlugToken();

					try {
							tokenDoc = new Token({
									user: userDoc._id,
									kind: "local",
									code: tokenCode,
									expiresAt: moment().add(10, "minutes").valueOf(),
							});

							await tokenDoc.save();
					} catch (error: any) {
							Log.error(`${error.message}`);
					}

					// Create reset password link
					const link = `${
							Locals.config().url
					}/api/auth/request-password/${tokenCode}`;

					// Prepare res.locals variables
					res.locals.mwData = {
							userDoc,
							tokenDoc,
							link,
					};

					return res.status(200).json({
							message:
									"Your reset password link has been sent to your registered email",
					});
			}

			/**
      * Verify a User token from the request reset link.
      * @route GET/api/auth/verify-request-password-token/:code
      * verifyToken
      */
			public static async verifyToken(req: Request, res: Response, next: NextFunction) {
					// const { code = "" } = req.params;
					const { code = "" } = req.body;
					let tokenDoc;
					let userDoc;

					Log.info(code);
					if (!code) {
							return res.redirect("/error/bad-token");
					}

					try {
							tokenDoc = await Token.findOne({
									code,
									expiresAt: { $gt: new Date() },
							});

							userDoc = await User.findOne({
									_id: tokenDoc?.user,
							});
					} catch (error: any) {
							return res.redirect("/error/500");
					}
					Log.info(`${tokenDoc}`);

					if (!tokenDoc) {
							return res.redirect("/error/bad-token");
					}

					if (!userDoc) {
							return res.redirect("/error/no corresponding user found");
					}

					return next

/* 					res.cookie("tokenRef", code, {
							httpOnly: true,
					}); */

					// return res.redirect("/auth/reset-password"); // password reset page
			}

			/**
      * Resets the password after verifying token
      * reset
      * @route POST /api/auth/reset-password
      */
			public static async reset(req: Request, res: Response) {
					const { password = "", confirmPassword = "", code = "" } = req.body;
					let tokenDoc;
					let userDoc;


					try {
							// Check for empty password
							if (validator.isEmpty(password, { ignore_whitespace: true })) {
									return res.status(400).json({
											message: "Password field cannot be empty",
									});
							}

							if (!["string"].includes(typeof password)) {
									return res.status(400).json({
											message: "Password should be a string",
									});
							}

							// Check for password length
							if (!validator.isLength(password, { min: 8 })) {
									return res.status(400).json({
											message: "Password length must be atleast 8 characters",
									});
							}

						// Check for insufficient newPassword characters
						if (!/[0-9]/.test(password)) {
							return res.status(400).json({
									message: "password must contain atleast one number",
							});
						}
						if (!/[A-Z]/.test(password)) {
							return res.status(400).json({
									message: "password must contain atleast one uppercase letter",
							});
						}
						if (!/[a-z]/.test(password)) {
							return res.status(400).json({
									message: "password must contain atleast one lowercase letter",
							});
						}

						if (!/[@#$%^&+=,.(*)]/.test(password)) {
							return res.status(400).json({
									message: "password must contain atleast one special character",
							});
						}

							// Check for empty confirmPassword
							if (validator.isEmpty(confirmPassword, { ignore_whitespace: true })) {
									return res.status(400).json({
											message: "confirmPassword field cannot be empty",
									});
							}

							if (!["string"].includes(typeof confirmPassword)) {
									return res.status(400).json({
											message: "confirmPassword should be a string",
									});
							}

							// Check for inequality between password and confirmPassword
							if (!validator.equals(password, confirmPassword)) {
									return res.status(400).json({
											message: "confirm password does not match password",
									});
							}
					} catch (error: any) {
							res.status(500).json({ message: error.message });
					}

					try {
							tokenDoc = await Token.findOne({
									code,
									expiresAt: { $gt: new Date() },
							});

							userDoc = await User.findOne({
									_id: tokenDoc?.user,
							});
					} catch (error: any) {
							return res.status(500).json({
									message: error.message,
							});
					}

/* 					if (!tokenDoc) {
							return res.status(400).json({ message: "Bad token" });
					} */

					if (!userDoc) {
							return res.status(400).json({ message: " could not find account" });
					}

					try {
							await userDoc.setPassword(password);
							userDoc.save();
					} catch (error: any) {
							return res.status(500).json({ message: error.message });
					}

					/* delete token used to reset password from cookie and database */
					// tokenDoc.remove();
					// res.cookie("tokenRef", null);

					// Prepare res.local variables
					res.locals.mwData = {
							userDoc,
					};

					return res.status(200).json({
							message: "Password successfully changed",
					});
			}
 }

 export default ResetPassword;
