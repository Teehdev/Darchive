import mongoose from "../providers/Database";
import IFolder from "../interfaces/models/folder";

export type FolderDocument = mongoose.Document & IFolder;

const ObjectId = mongoose.Schema.Types.ObjectId;

export const FolderSchema = new mongoose.Schema({
	name: { type: String, required: true },
	path: { type: String, required: false },
	createdBy: { type: ObjectId, refPath: "ownerType", required: true },
	createdAt: { type: Date, default: Date.now },
});

const Folder = mongoose.model<FolderDocument>("Folder", FolderSchema);

export default Folder;
