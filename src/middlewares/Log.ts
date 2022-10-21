/**
 * Creates and Maintains the log instance
 */
import winston from "winston";

class Log {
	public logger: winston.Logger;

	constructor() {
		const dev = process.env.NODE_ENV !== "production";

		this.logger = winston.createLogger({
			level: dev ? "debug" : "info",
			transports: [
				new winston.transports.File({
					filename: "./logs/error.log",
					level: "error",
				}),
				new winston.transports.Console(),
			],
			exitOnError: false,
		});
	}

	public info(msg: string) {
		this.logger.info(msg);
	}

	public debug(msg: any, meta: any) {
		this.logger.debug(msg, meta);
	}

	public error(msg: string) {
		this.logger.error(msg);
	}
}

export default new Log();
