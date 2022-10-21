import IRole from "../interfaces/models/role";
import mongoose from "../providers/Database";

export type TRoleDoc = mongoose.Document & IRole;

export const PermissionSchema = new mongoose.Schema(
	{
		"create:any": { type: Boolean, default: false },
		"read:any": { type: Boolean, default: false },
		"update:any": { type: Boolean, default: false },
		"delete:any": { type: Boolean, default: false },
		"create:own": { type: Boolean, default: false },
		"read:own": { type: Boolean, default: false },
		"update:own": { type: Boolean, default: false },
		"delete:own": { type: Boolean, default: false },
	},
	{ _id: false }
);

export const RoleSchema = new mongoose.Schema({
	createdAt: {
		type: Date,
		default: Date.now,
	},
	type: {
		type: String,
		enum: ["Staff", "Admin"],
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	permissions: {
		category: PermissionSchema,
		admin: PermissionSchema,
		role: PermissionSchema,
		staff: PermissionSchema,
		user: PermissionSchema,
		payment: PermissionSchema,
	},
});

const Role = mongoose.model<TRoleDoc>("Role", RoleSchema);

export default Role;
