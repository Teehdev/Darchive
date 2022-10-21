export type notificationType = "text" | "richtext";
export type notificationStatus = "unread" | "read";
export type ownerType = "Partner" | "Staff" | "Admin";

export interface INotification {
	owner: string;
	ownerModel: ownerType;
	title: string;
	message: string;
	messageType: notificationType;
	status: notificationStatus;
	createdAt?: Date;
}

export default INotification;
