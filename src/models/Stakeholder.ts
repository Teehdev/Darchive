import mongoose from "../providers/Database";
import IStakeholder from "../interfaces/models/stakeholder";
export type TStakeholderDoc = mongoose.Document & IStakeholder;

const ObjectId = mongoose.Schema.Types.ObjectId;

export const StakeholderSchema = new mongoose.Schema({
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
		unique: true,
		trim: true,
		lowercase: true,
	},

	createdAt: { type: Date, default: Date.now },
});

const Stakeholder = mongoose.model<TStakeholderDoc>("Stakeholder", StakeholderSchema);

export default Stakeholder;
