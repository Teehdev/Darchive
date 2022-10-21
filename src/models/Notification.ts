import INotification from "../interfaces/models/notification";
import mongoose from "../providers/Database";

export type TNotificationDoc = mongoose.Document & INotification;

const ObjectId = mongoose.Schema.Types.ObjectId;

export const NotificationSchema = new mongoose.Schema({
	title: { type: String, required: true },
	message: { type: String, required: true },
	messageType: {
		type: String,
		required: true,
		enum: ["text", "richtext"],
	},
	status: {
		type: String,
		enum: ["unread", "read"],
		default: "unread",
	},
	owner: { type: ObjectId, required: true, refPath: "ownerType" },
	ownerModel: {
		type: String,
		required: true,
		enum: ["Staff", "Admin"],
	},
	createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model<TNotificationDoc>(
	"Notification",
	NotificationSchema
);

export default Notification;
