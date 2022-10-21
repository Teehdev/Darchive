/**
 * @author Oyetunji Atilade <atiladeoyetunji@gmail.com>
 * @desc Access control init implementation
 * @access Public
 *
 */
import { AccessControl } from "accesscontrol";

import Role, { TRoleDoc } from "../models/Role";
import { IPermissions, IPermission } from "../interfaces/models/role";
import Log from "../middlewares/Log";

class AccessControlProvider {
	public ac: AccessControl;

	constructor(grantList: object[]) {
		this.ac = new AccessControl(grantList);
	}

	public static async getGrantList() {
		const grantList: object[] = [];
		const roleDocs = await this.getRoles();
		// Log.info(`${JSON.stringify(roleDocs, null, 4)}`);

		roleDocs.map((roleDoc) => {
			(Object.keys(roleDoc.permissions) as (keyof IPermissions)[]).map(
				(resource) => {
					if (roleDoc.permissions[resource]) {
						(
							Object.keys(
								roleDoc.permissions[resource]
							) as (keyof IPermission)[]
						).map((action) => {
							if (
								/* action != "$init" &&  */ roleDoc.permissions[resource][
									action
								] === true
							) {
								grantList.push({
									role: roleDoc.name,
									resource,
									action,
									attributes: "*",
								});
							}
						});
					}
				}
			);
		});

		return grantList;
	}

	public static async getRoles() {
		const roles: TRoleDoc[] = await Role.find().lean();

		return roles;
	}

	public async reset() {
		this.ac.reset();

		this.ac.setGrants(await AccessControlProvider.getGrantList());
	}
}

const instantiateAC = (async () => {
	const grantList = await AccessControlProvider.getGrantList();
	// Log.info(`${JSON.stringify(grantList, null, 4)}`);

	return new AccessControlProvider(grantList);
})();

export default instantiateAC;
