import mongoose from "mongoose";

import Locals from "./Locals";
import Log from "../middlewares/Log";

export class Database {
	private static count = 0;

	public static init(): void {
		const dsn = Locals.config().mongoDBUri || "mongodb://localhost/logistics";
		const options: mongoose.ConnectOptions = { autoIndex: false };

		mongoose.Promise = Promise;

		mongoose
			.connect(dsn, options)
			.then(() => {
				Log.info(`MongoDB is connected at ${dsn}`);
			})
			.catch((err) => {
				Log.info(
					`MongoDB connection to ${dsn} unsuccessful, retry after 5 seconds. ${++this
						.count}`
				);
				setTimeout(Database.init, 5000);
			});
	}
}

export default mongoose;
