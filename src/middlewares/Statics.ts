import path from "path";
import express, { Application } from "express";
import Log from "../middlewares/Log";

class Statics {
	public static mount(app: Application): Application {
		Log.info(`Booting the \'Statics\' middleware...`);

		// Loads options
		const options = { maxAge: 31557600000 };

		// Load Statics
		app.use(express.static(path.join(__dirname, "../../public"), options));

		return app;
	}

	public static clientStatic = express.static(
		path.join(__dirname, "../../../src/build"),
		{
			fallthrough: true,
		}
	);
}
export default Statics;
