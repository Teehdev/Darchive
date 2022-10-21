/**
 * @author Oyetunji Atilade <atiladeoyetunji@gmail.com>
 * @desc Check if login device is a new device
 */

export default class Check {
	/**
   * isNewLoginDevice
   */
	public static isNewLoginDevice(
		device: string,
		ip: string,
		redisUser: any
	): boolean {
		let isNewDevice = true;

		if (redisUser && Array.isArray(redisUser.knownClients)) {
			redisUser.knownClients.map((client: any) => {
				if (client.device === device && client.ip === ip) {
					isNewDevice = false;
				}
			});
		}

		return isNewDevice;
	}
}
