import ITemplate from "../interfaces/models/template";
import mongoose from "../providers/Database";

const ObjectId = mongoose.Schema.Types.ObjectId;

export type TemplateDocument = mongoose.Document & ITemplate;

export const TemplateSchema = new mongoose.Schema({
	name: { type: String, required: true },
	fields: { type: mongoose.Schema.Types.Mixed, required: true },
	createdAt: { type: Date, default: Date.now },
	createdBy: { type: ObjectId, refPath: "user", required: true },
});

const Template = mongoose.model<TemplateDocument>("Template", TemplateSchema);

export default Template;
