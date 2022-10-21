/**
 * @author Oyetunji Atilade <atiladeoyetunji@gmail.com>
 * @desc Register new User
	 @access Public
 */

import { from } from "form-data";
import validator from "validator";
import { Request, Response } from "express";
import moment from "moment";

import User from "../../../models/User";
import Gen from "../../../utils/Gen";
import UserRole from "../../../models/Role";
import Admin from "../../../models/Admin";
import Staff from "../../../models/Staff";
import Token from "../../../models/Token";
import Role from "../../../models/Role";
import Log from "../../../middlewares/Log";
import { toProperCase } from "../../../utils/String";
import Locals from "../../../providers/Locals";

class Register {
	/**
	 * Register new users
	 * @route POST /api/auth/signup-admin
	 */

	/**
	 * admin
	 */
	public async admin(req: Request, res: Response) {
		const type = "Admin";
		const {
			name,
			email,
			password,
			confirmPassword,
			telephone,
			gender,
			dateOfBirth,
			nextOfKin,
			nextOfKinTelephone,
		} = req.body;

		let roleDoc;

		try {
			// check for empty name field
			if (validator.isEmpty(name, { ignore_whitespace: true })) {
				return res.status(400).json({
					message: " Name field cannot be blank",
				});
			}

			// check for bad  name type
			if (typeof name !== "string") {
				return res.status(400).json({
					message: "Name should be a string",
				});
			}
			/* 		// check for empty address field
		if (validator.isEmpty(address, { ignore_whitespace: true })) {
			return res.status(400).json({
				message: " address field cannot be blank",
			});
		}

		// check for bad  address type
		if (typeof address !== "string") {
			return res.status(400).json({
				message: "address should be a string",
			});
		} */
			// check for empty nextOfKin field
			if (validator.isEmpty(nextOfKin, { ignore_whitespace: true })) {
				return res.status(400).json({
					message: " nextOfKin field cannot be blank",
				});
			}

			// check for bad  nextOfKin type
			if (typeof nextOfKin !== "string") {
				return res.status(400).json({
					message: "Name should be a string",
				});
			}

			// check for empty gender field
			if (validator.isEmpty(gender, { ignore_whitespace: true })) {
				return res.status(400).json({
					message: " gender field cannot be blank",
				});
			}

			// check for bad  gender type
			if (typeof gender !== "string") {
				return res.status(400).json({
					message: "gender should be a string",
				});
			}

			// check for empty email field
			if (validator.isEmpty(email, { ignore_whitespace: true })) {
				return res.status(400).json({
					message: "E-mail field cannot be blank",
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

			// check for empty password field
			if (validator.isEmpty(password, { ignore_whitespace: true })) {
				return res.status(400).json({
					message: "Password field cannot be blank",
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

			// check for bad  password type
			if (!["string"].includes(typeof password)) {
				return res.status(400).json({
					message: " password should be a string",
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
			if (!validator.equals(password, confirmPassword)) {
				return res.status(400).json({
					message: "Confirm password does not match Password",
				});
			}

			// check for empty dateOfBirth field
			if (validator.isEmpty(dateOfBirth, { ignore_whitespace: true })) {
				return res.status(400).json({
					message: "dateOfBirth cannot be blank",
				});
			}

			// check for bad dateOfBirth type
			if (!["string"].includes(typeof dateOfBirth)) {
				return res.status(400).json({
					message: "dateOfBirth should be a string",
				});
			}

			// Check for bad dateOfBirth type
			// if (!validator.isDate(dateOfBirth)) {
			// 	return res.status(400).json({
			// 		message: "invalid date type",
			// 	});
			// }

			// check for empty telephone field
			if (validator.isEmpty(telephone, { ignore_whitespace: true })) {
				return res.status(400).json({
					message: "Telephone cannot be blank",
				});
			}

			// check for bad telephone type
			if (!["string"].includes(typeof telephone)) {
				return res.status(400).json({
					message: "Telephone should be a string",
				});
			}
			// Check for invalid telephone number

			if (
				!validator.isMobilePhone(telephone, ["en-NG"], { strictMode: true })
			) {
				return res.status(400).json({
					message: "Invalid telephone",
				});
			}
			// check for empty nextOfKinTelephone field
			if (validator.isEmpty(nextOfKinTelephone, { ignore_whitespace: true })) {
				return res.status(400).json({
					message: "nextOfKinTelephone cannot be blank",
				});
			}

			// check for bad nextOfKinTelephone type
			if (!["string"].includes(typeof nextOfKinTelephone)) {
				return res.status(400).json({
					message: "nextOfKinTelephone should be a string",
				});
			}
			// Check for invalid nextOfKinTelephone number

			if (
				!validator.isMobilePhone(nextOfKinTelephone, ["en-NG"], {
					strictMode: true,
				})
			) {
				return res.status(400).json({
					message: "Invalid nextOfKinTelephone",
				});
			}
		} catch (error: any) {
			res.status(500).json({ message: error.message });
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

		// Check if user exists
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({
				message: "user already exists",
			});
		}
		/*
		// Create role for Users
		const userRole = await UserRole.create({
			name: type,
			type,
		});
		*/

		// Create User

		/*  const user = await User.create({
		name,
		email,
		type,
		telephone,
		password, // hashedPassword,
	});

		*/

		const userDoc = new User({
			name,
			email,
			type,
			telephone,
			gender: toProperCase(gender),
			dateOfBirth,
			isEmailVerified: true,
			active: true,
			// username:email,
		});

		const user = await User.register(userDoc, password);

		if (user) {
			Log.info("created");
			/**	res.status(201).json({
				_id: user.id,
				name: user.name,
				email: user.email,
				accountType: user.type,
				telephone: user.telephone,
			});
		 */
		} else {
			res.status(400);
			throw new Error("Invalid user data");
		}

		// Generate adminRef

		const customRef = await Gen.generateAdminRef();

		// Create Admin

		const admin = await Admin.create({
			user: user._id,
			name: roleDoc.name,
			ref: customRef,
			role: roleDoc._id,
			nextOfKin,
			nextOfKinTelephone,
		});
		if (!admin) {
			return res.status(500).json({
				message: "Unable to create admin",
			});
		}

		// Save to local variables

		res.locals.mwData = {
			user,
			link: Locals.config().url,
			password,
			accountType: "Admin"
		};

		return res.status(200).json({
			message:
				"Admin user account has been created and activated successfully",
		});
		/* 		// Verification
				const tokenCode = await Gen.generateVerificationToken();

				const token = await Token.create({
					user: user._id,
					kind: "local",
					code: tokenCode,
					expiresAt: moment().add(10, "minutes").valueOf(),
				});

				// Save to local variables

				res.locals.mwData = {
					user,
					token,
				};

				return res.status(200).json({
					message:
						"A token has been sent to your email, Please verify your account",
				}); */
	}

	/**
	 * @desc Verify user account
	 * adminAccountVerification
	 */
	public async accountVerification(req: Request, res: Response) {
		const { code = "" } = req.body;
		let tokenDoc;
		let userDoc;
		let updatedUserDoc;

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

		if (!tokenDoc) {
			return res.redirect("/error/bad-token");
		}

		if (!userDoc) {
			return res.redirect("/error/user-not-found");
		}

		try {
			updatedUserDoc = await User.updateOne(
				{ _id: tokenDoc?.user },
				{ $set: { isEmailVerified: true, active: true } },
				{ runValidators: true }
			);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
		if (!updatedUserDoc) {
			res.status(400).json({
				message: "Unable to verify User",
			});
		}
		return res.status(200).json({
			message: "Account verified",
		});
	}

	/**
 * Register new users
 * @route POST /api/auth/signup-staff
 */

	/**
	 * staff
	 */
	public async staff(req: Request, res: Response) {
		const type = "Staff";
		const {
			name,
			email,
			password,
			confirmPassword,
			telephone,
			gender,
			dateOfBirth,
			nextOfKin,
			nextOfKinTelephone,
		} = req.body;

		let roleDoc;
		let user;
		let userDoc;

		try {
			// check for empty name field
			if (validator.isEmpty(name, { ignore_whitespace: true })) {
				return res.status(400).json({
					message: " Name field cannot be blank",
				});
			}

			// check for bad  name type
			if (typeof name !== "string") {
				return res.status(400).json({
					message: "Name should be a string",
				});
			}
			/* 		// check for empty address field
		if (validator.isEmpty(address, { ignore_whitespace: true })) {
			return res.status(400).json({
				message: " address field cannot be blank",
			});
		}

		// check for bad  address type
		if (typeof address !== "string") {
			return res.status(400).json({
				message: "address should be a string",
			});
		} */
			// check for empty nextOfKin field
			if (validator.isEmpty(nextOfKin, { ignore_whitespace: true })) {
				return res.status(400).json({
					message: " nextOfKin field cannot be blank",
				});
			}

			// check for bad  nextOfKin type
			if (typeof nextOfKin !== "string") {
				return res.status(400).json({
					message: "Name should be a string",
				});
			}

			// check for empty gender field
			if (validator.isEmpty(gender, { ignore_whitespace: true })) {
				return res.status(400).json({
					message: " gender field cannot be blank",
				});
			}

			// check for bad  gender type
			if (typeof gender !== "string") {
				return res.status(400).json({
					message: "gender should be a string",
				});
			}

			// check for empty email field
			if (validator.isEmpty(email, { ignore_whitespace: true })) {
				return res.status(400).json({
					message: "E-mail field cannot be blank",
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

			// check for empty password field
			if (validator.isEmpty(password, { ignore_whitespace: true })) {
				return res.status(400).json({
					message: "Password field cannot be blank",
				});
			}

			// check for bad  password type
			if (!["string"].includes(typeof password)) {
				return res.status(400).json({
					message: " password should be a string",
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
			if (!validator.equals(password, confirmPassword)) {
				return res.status(400).json({
					message: "Confirm password does not match Password",
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


			// check for empty dateOfBirth field
			if (validator.isEmpty(dateOfBirth, { ignore_whitespace: true })) {
				return res.status(400).json({
					message: "dateOfBirth cannot be blank",
				});
			}

			// check for bad dateOfBirth type
			if (!["string"].includes(typeof dateOfBirth)) {
				return res.status(400).json({
					message: "dateOfBirth should be a string",
				});
			}

			// Check for bad dateOfBirth type
			// if (!validator.isDate(dateOfBirth)) {
			// 	return res.status(400).json({
			// 		message: "invalid date type",
			// 	});
			// }

			// check for empty telephone field
			if (validator.isEmpty(telephone, { ignore_whitespace: true })) {
				return res.status(400).json({
					message: "Telephone cannot be blank",
				});
			}

			// check for bad telephone type
			if (!["string"].includes(typeof telephone)) {
				return res.status(400).json({
					message: "Telephone should be a string",
				});
			}
			// Check for invalid telephone number

			if (
				!validator.isMobilePhone(telephone, ["en-NG"], { strictMode: true })
			) {
				return res.status(400).json({
					message: "Invalid telephone",
				});
			}
			// check for empty nextOfKinTelephone field
			if (validator.isEmpty(nextOfKinTelephone, { ignore_whitespace: true })) {
				return res.status(400).json({
					message: "nextOfKinTelephone cannot be blank",
				});
			}

			// check for bad nextOfKinTelephone type
			if (!["string"].includes(typeof nextOfKinTelephone)) {
				return res.status(400).json({
					message: "nextOfKinTelephone should be a string",
				});
			}
			// Check for invalid nextOfKinTelephone number

			if (
				!validator.isMobilePhone(nextOfKinTelephone, ["en-NG"], {
					strictMode: true,
				})
			) {
				return res.status(400).json({
					message: "Invalid nextOfKinTelephone",
				});
			}
		} catch (error: any) {
			res.status(500).json({ message: error.message });
		}

		// ensure role exists with type === "Staff"
		try {
			roleDoc = await Role.findOne({ type: "Staff" });
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}

		if (!roleDoc) {
			return res
				.status(400)
				.json({ message: "No Role exists for Staff yet. Contact Support." });
		}

		// Check if user exists
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({
				message: "user already exists",
			});
		}
		/*
		// Create role for Users
		const userRole = await UserRole.create({
			name: type,
			type,
		});
		*/

		// Create User

		/*  const user = await User.create({
		name,
		email,
		type,
		telephone,
		password, // hashedPassword,
	});

		*/

		try {
			userDoc = new User({
				name,
				email,
				type,
				telephone,
				gender,
				dateOfBirth,
				isEmailVerified: true,
				active: true,
				// username:email,
			});

			user = await User.register(userDoc, password);
		} catch (error: any) {
			return res.status(500).json({ message: error.message })
		}


		if (user) {
			Log.info("created");
			/**	res.status(201).json({
				_id: user.id,
				name: user.name,
				email: user.email,
				accountType: user.type,
				telephone: user.telephone,
			});
		 */
		} else {
			res.status(400);
			throw new Error("Invalid user data");
		}

		// Generate staffRef

		const customRef = await Gen.generateStaffRef();

		// Create StaffQW

		const staff = await Staff.create({
			user: user._id,
			name: roleDoc.name,
			ref: customRef,
			role: roleDoc._id,
			nextOfKin,
			nextOfKinTelephone
		});
		if (!staff) {
			return res.status(500).json({
				message: "Unable to create staff",
			});
		}


		res.locals.mwData = {
			user,
			link: Locals.config().url,
			password,
			accountType: "Staff"
		};

		return res.status(200).json({
			message:
				"Staff user account has been created and activated successfully",
		});

		/* 		// Verification
				const tokenCode = await Gen.generateVerificationToken();

				const token = await Token.create({
					user: user._id,
					kind: "local",
					code: tokenCode,
					expiresAt: moment().add(10, "minutes").valueOf(),
				});

				// Save to local variables

				res.locals.mwData = {
					user,
					token,
				};

				return res.status(200).json({
					message:
						"A token has been sent to your email, Please verify your account",
				}); */
	}

	/**
	 * @desc Verify user account
	 * staffAccountVerification
	 */
	public async staffAccountVerification(req: Request, res: Response) {
		const { code = "" } = req.body;
		let tokenDoc;
		let userDoc;
		let updatedUserDoc;

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

		if (!tokenDoc) {
			return res.redirect("/error/bad-token");
		}

		if (!userDoc) {
			return res.redirect("/error/user-not-found");
		}

		try {
			updatedUserDoc = await User.updateOne(
				{ _id: tokenDoc?.user },
				{ $set: { isEmailVerified: true, active: true } },
				{ runValidators: true }
			);
		} catch (error: any) {
			return res.status(500).json({ message: error.message });
		}
		if (!updatedUserDoc) {
			res.status(400).json({
				message: "Unable to verify User",
			});
		}
		return res.status(200).json({
			message: "Account verified",
		});
	}
}

export default new Register();
