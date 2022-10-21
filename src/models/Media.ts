import mongoose from "../providers/Database";
import IMedia from "../interfaces/models/media";

export type MediaDocument = mongoose.Document & IMedia;

const ObjectId = mongoose.Schema.Types.ObjectId;

export const MediaSchema = new mongoose.Schema({
	name: { type: String, required: true },
	key: { type: String, required: false },
	type: { type: String, required: true },
	size: { type: Number, required: true },
	preview: { type: String, required: false },
	path: { type: String, required: false },
	category: {
		type: String,
		enum: ["ODK", "DHIS2", "MANUAL"],
		default: "MANUAL",
	},
	manualUpload: { type: Boolean, default: true },
	status: {
		type: String,
		enum: ["Approved", "Not-Approved", "Pending-Approval"],
		default: "Pending-Approval",
		required: true,
	},
	createdBy: { type: ObjectId, refPath: "ownerType", required: true },
	approvedBy: { type: ObjectId, refPath: "ownerType", required: false },
	disapprovedBy: { type: ObjectId, refPath: "ownerType", required: false },
	dataModel: {
		type: String,
		enum: ["Quantitative", "Qualitative"],
		required: true,
	},
	disapprovalNote: { type: String, required: false },
	createdAt: { type: Date, default: Date.now },
	approvedAt: { type: Date, required: false },
	disapprovedAt: { type: Date, required: false },
});

const Media = mongoose.model<MediaDocument>("Media", MediaSchema);

export default Media;
