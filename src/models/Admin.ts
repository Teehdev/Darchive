import mongoose from "../providers/Database";
import IAdmin from "../interfaces/models/admin";
export type TAdminDoc = mongoose.Document & IAdmin;

const ObjectId = mongoose.Schema.Types.ObjectId;

export const AdminSchema = new mongoose.Schema({
	user: { type: ObjectId, ref: "User", required: true, unique: true },
	ref: { type: String, required: true, unique: true },
	role: { type: ObjectId, ref: "Role", required: true },
	nextOfKin: {
		type: String,
		lowercase: true,
		trim: true,
	},
	nextOfKinTelephone: {
		type: String,
		unique: false,
		trim: true,
		lowercase: true,
	},

	createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.model<TAdminDoc>("Admin", AdminSchema);

export default Admin;
