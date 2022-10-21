export type userType = "Partner" | "Driver" | "Admin" | "Staff";

export interface IUser {
	// firstname: string;
	name: string;
	email: string;
	telephone?: string;
	username: string;
	dateOfBirth: Date;
	gender?: string;
	type: userType;
	googleRef?: string;
	avatar?: string;
	lastSeen?: Date;
	createdAt?: Date;
	active: boolean;
	isEmailVerified: boolean;
	isTelephoneVerified: boolean;
	deleted: boolean;
}

export default IUser;
