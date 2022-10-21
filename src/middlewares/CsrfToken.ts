import { Application } from "express";
import * as lusca from "lusca";

import Locals from "../providers/Locals";
import Log from "../middlewares/Log";

class CsrfToken {
	public static mount(app: Application): Application {
		Log.info(`Booting the \'CsrfToken\' middleware...`);

		app.set("trust proxy", 1);

		// Enables x-frame-options headers
		app.use(lusca.xframe("SAMEORIGIN"));

		// Enables xss-protection headers
		app.use(lusca.xssProtection(true));

		return app;
	}
}

export default CsrfToken;
