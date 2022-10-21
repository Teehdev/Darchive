import { userType } from "./user";

export interface IPermission {
	"create:any": boolean;
	"read:any": boolean;
	"update:any": boolean;
	"delete:any": boolean;
	"create:own": boolean;
	"read:own": boolean;
	"update:own": boolean;
	"delete:own": boolean;
}

export interface IPermissions {
	user: IPermission;
	admin: IPermission;
	role: IPermission;
	staff: IPermission;
	billing: IPermission;
	payment: IPermission;
}

export interface IRole {
	name: string;
	type: userType;
	createdAt?: Date;
	permissions: IPermissions;
}

export default IRole;
