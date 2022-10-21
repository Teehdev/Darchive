import IRole from "./role";
import IUser from "./user";
import IAddress from "./address";

export interface IStaff {
	user: string | IUser;
	ref: string;
	role: string | IRole;
	nextOfKin?: string;
	nextOfKinTelephone?: string;
	createdAt?: Date;
}

export default IStaff;
