import mongoose from "../providers/Database";
import IDonor from "../interfaces/models/donor";
export type TDonorDoc = mongoose.Document & IDonor;

const ObjectId = mongoose.Schema.Types.ObjectId;

export const DonorSchema = new mongoose.Schema({
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

const Donor = mongoose.model<TDonorDoc>("Donor", DonorSchema);

export default Donor;
