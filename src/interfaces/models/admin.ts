import IRole from "./role";
import IUser from "./user";

export interface IAdmin {
	user: string | IUser;
	ref: string;
	role: string | IRole;
	nextOfKin?: string;
	nextOfKinTelephone?: string;
	createdAt?: Date;
}

export default IAdmin;
