import { Application } from "express";

import CORS from "./CORS";
import Http from "./Http";
import Statics from "./Statics";
import CsrfToken from "./CsrfToken";

import Locals from "../providers/Locals";

class Kernel {
	public static init(app: Application): Application {
		// Check if CORS is enabled
		if (Locals.config().isCORSEnabled) {
			// Mount CORS middleware
			app = CORS.mount(app);
		}

		// Mount basic express apis middleware
		app = Http.mount(app);

		// Mount csrf token verification middleware
		app = CsrfToken.mount(app);

		// Mount view engine middleware
		// app = Views.mount(app);

		// Mount statics middleware
		app = Statics.mount(app);

		// Mount status monitor middleware
		// app = StatusMonitor.mount(app);

		return app;
	}
}

export default Kernel;
