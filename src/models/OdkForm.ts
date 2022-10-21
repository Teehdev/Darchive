import mongoose from "../providers/Database";
import IOdkForm from "../interfaces/models/odkform";

export type OdkFormDocument = mongoose.Document & IOdkForm;

const ObjectId = mongoose.Schema.Types.ObjectId;

export const OdkFormSchema = new mongoose.Schema({
	headers: { type: Array, required: false },
	metadata: { type: Object, required: false },
	rows: { type: Array, required: false },
	syncedAt: { type: Date, default: Date.now },
}, { strict: false });

const OdkForm = mongoose.model<OdkFormDocument>("OdkForm", OdkFormSchema);

export default OdkForm;
