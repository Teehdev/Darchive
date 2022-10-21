/**
 * @author Oyetunji Atilade <atiladeoyetunji@gmail.com>
 * @desc Register new User
   @desc  POST /api/Users
   @access Public
 */
import { customAlphabet } from "nanoid/async";

export default class UniqueGen {
	/**
	 * @description Unique reference Generator function
	 * @param {string} label
	 */
	private static async generateUniqueRef(label?: string, length?: number) {
		const nanoid = customAlphabet(
			"1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
			15
		);

		const ref = await nanoid(length);

		if (!label) {
			return `${ref}`;
		}

		return `${label}_${ref}`;
	}

	private static async generateRandNumber(length?: number) {
		const nanoid = customAlphabet("1234567890", 11);

		const ref = await nanoid(length);

		return `${ref}`;
	}

	public static async generateAdminRef() {
		const uniqueRef = await this.generateUniqueRef("ADM");
		return uniqueRef;
	}

	public static async generateDonorRef() {
		const uniqueRef = await this.generateUniqueRef("DRV");
		return uniqueRef;
	}

	public static async generateStakeholderRef() {
		const uniqueRef = await this.generateUniqueRef("PTR");
		return uniqueRef;
	}

	public static async generateStaffRef() {
		const uniqueRef = await this.generateUniqueRef("STF");
		return uniqueRef;
	}

	public static async generateVerificationToken() {
		const token = await this.generateRandNumber(6);
		return token;
	}

	public static async generateOtpToken() {
		const token = await this.generateRandNumber(4);
		return token;
	}



	public static async generatePaystackRef() {
		const uniqueRef = await this.generateUniqueRef("PSK");
		return uniqueRef;
	}



	public static async generatePartnerCompanyVerificationRef() {
		const uniqueRef = await this.generateUniqueRef("PCV");
		return uniqueRef;
	}

	public static async generateTripRef() {
		const uniqueRef = await this.generateUniqueRef("PCV", 9);
		return uniqueRef;
	}

	public static async generateSlugToken() {
		const token = await this.generateUniqueRef(undefined, 6);
		return token;
	}

	public static async generateFileKey() {
		const uniqueRef = await this.generateUniqueRef(undefined, 15);
		return uniqueRef;
	}
}
