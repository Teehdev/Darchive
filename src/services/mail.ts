import Email from "email-templates";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import Log from "../middlewares/Log";

import Locals from "../providers/Locals";

class MailService {
	private mailtrapPort = Locals.config().mailtrapPort;

	private mailtrapHost = Locals.config().mailtrapHost;

	private mailtrapUsername = Locals.config().mailtrapUsername;

	private mailtrapPassword = Locals.config().mailtrapPassword;

	/* private sendgridPort = Locals.config().sendgridPort;

	private sendgridHost = Locals.config().sendgridHost;

	private sendgridUsername = Locals.config().sendgridUsername; */

	private sendgridApiKey = Locals.config().sendgridApiKey;

	private email: Email;

	constructor() {
		this.email = new Email({
			send: true,
			transport: this.getTransport(),
			preview: true, // To preview in the browser
			views: {
				options: {
					extension: "hbs",
				},
			},
		});
	}

	private getOptions() {
		if (process.env.NODE_ENV === "production") {
			return nodemailerSendgrid({
				apiKey: this.sendgridApiKey,
			});
		} else {
			return {
				host: this.mailtrapHost,
				port: this.mailtrapPort,
				auth: {
					user: this.mailtrapUsername,
					pass: this.mailtrapPassword,
				},
			};
		}
	}

	private getTransport() {
		try {
			return nodemailer.createTransport(this.getOptions());
		} catch (error: any) {
			Log.info(error.message);
		}
	}

	public async send(toEmail: string, template: string, locals: object) {
		const COMPANY_NAME = "Solina";
		const COMPANY_ADDRESS = process.env.COMPANY_ADDRESS;

		await this.email.send({
			template,
			message: {
				from: "NNRIPS <oyetunji.solina@gmail.com>",
				to: toEmail,
			},
			locals: { ...locals, COMPANY_NAME, COMPANY_ADDRESS },
		});
	}
}

export default new MailService();
