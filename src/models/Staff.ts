import mongoose from "../providers/Database";
import IStaff from "../interfaces/models/staff";
export type TStaffDoc = mongoose.Document & IStaff;

const ObjectId = mongoose.Schema.Types.ObjectId;

export const StaffSchema = new mongoose.Schema({
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

const Staff = mongoose.model<TStaffDoc>("Staff", StaffSchema);

export default Staff;
