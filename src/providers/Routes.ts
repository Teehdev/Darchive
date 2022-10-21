import { Application } from "express";

import apiRouter from "../routes/api";
import webRouter from "../routes/web";
import Log from "../middlewares/Log";

class Routes {
	public mountWeb(app: Application): Application {
		Log.info("Routes :: Mounting Web Routes...");

		return app.use("/", webRouter);
	}

	public mountApi(app: Application): Application {
		Log.info("Routes :: Mounting API Routes...");

		return app.use("/api", apiRouter);
	}
}

export default new Routes();
