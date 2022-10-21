import cors from "cors";
import { Application } from "express";

import Locals from "../providers/Locals";
import Log from "../middlewares/Log";

class CORS {
	public mount(app: Application): Application {
		Log.info(`Booting the \'CORS\' middleware...`);

		const whitelist = [ Locals.config().url, 'http://example2.com']
const options = {
	origin (origin: any, callback: any) {
	if (whitelist.indexOf(origin) !== -1) {
	callback(null, true)
	} else {
	callback(new Error('Not allowed by CORS'))
	}
	},
	optionsSuccessStatus: 200, // Some legacy browsers choke on 204
}

/* 		const options = {
			origin: Locals.config().url,
			optionsSuccessStatus: 200, // Some legacy browsers choke on 204
		}; */

		app.use(cors());

		return app;
	}
}

export default new CORS();
