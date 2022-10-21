import { Application, NextFunction, Request, Response } from "express";
import apicache from "apicache";

import RedisService from "../services/Redis";
import Log from "../middlewares/Log";

class CacheProvider {
	public cacheClient: any;

	private static redisClient = RedisService.getInstance()
		.getBullOptions()
		.createClient();

	constructor() {
		this.cacheClient = apicache.options({
			redisClient: CacheProvider.redisClient as any,
			appendKey: (req: Request, res: Response) => {
				const userRef = res.locals.user ? res.locals.user.userRef : "";
				const method = req.method;
				const path = req.path;
				const query = req.query;

				return `${method}${userRef}:${path}${query}`;
			},
		}).middleware;
	}

	public mountPackage(app: Application): Application {
		app = app.use(
			this.cacheClient(
				"5 minutes",
				(req: Request, res: Response, next: NextFunction) =>
					res.statusCode === 200 && req.method === "GET"
			)
		);

		return app;
	}

	public clear(req: Request, res: Response) {
		if (!req.params.target) {
			return res.status(400).json({ message: "target param required" });
		}

		return res.json(apicache.clear(req.params.target));
	}
}

export default new CacheProvider();
