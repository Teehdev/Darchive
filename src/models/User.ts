import passportLocalMongoose from "passport-local-mongoose";

import IUser from "../interfaces/models/user";
import mongoose from "../providers/Database";

const ObjectId = mongoose.Schema.Types.ObjectId;

// Create the model schema
// Implement registering important custom document methods
export interface IUserModel
	extends IUser,
		mongoose.Document,
		mongoose.PassportLocalDocument {
	gravatar(size: number): string;
}

// Define the User Schema
export const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		lowercase: true,
		trim: true,
	},
	email: {
		// alias for email
		type: String,
		unique: true,
		trim: true,
		required: true,
		lowercase: true,
	},

	telephone: {
		type: String,
		unique: true,
		trim: true,
		lowercase: true,
	},

	dateOfBirth: {
		type: Date,
	},

	/** username: {
    // alias for email
    type: String,
    unique: true,
    trim: true,
    required: true,
    lowercase: true,
  },
	 */
	type: {
		type: String,
		enum: ["Admin", "Staff", "Donors", "Stakeholders"],
		required: true,
	},
	gender: {
		type: String,
		enum: ["Male", "Female"],
		required: true,
	},
	googleRef: {
		type: String,
	},
	avatar: { type: ObjectId, ref: "Media" },
	active: { type: Boolean, default: false },
	isEmailVerified: { type: Boolean, default: false },
	isTelephoneVerified: { type: Boolean, default: false },
	deleted: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now },
});

// User's gravatar method
/* UserSchema.methods.gravatar = function (size: number): string {
	if (!size) {
		size = 200;
	}

	const url = "https://www.gravatar.com/avatar";

	if (!this.email) {
		return `${url}/?s=${size}&d=retro`;
	}

	const md5 = crypto.createHash("md5").update(this.email).digest("hex");

	return `${url}/${md5}?s=${size}&d=retro`;
}; */

// Add passportLocalmongoose as a plugin
UserSchema.plugin(passportLocalMongoose, {
	usernameField: "email",

	findByUsername(model: any, queryParameters: any) {
		queryParameters.active = true;
		return model.findOne(queryParameters);
	},
});

const User = mongoose.model<IUserModel>("User", UserSchema);

export default User;
