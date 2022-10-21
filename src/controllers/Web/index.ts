import { Request, Response, NextFunction } from "express";
import path from "path";

export default class WebCtr {
	public static sendClient(req: Request, res: Response, next: NextFunction) {
		return res.sendFile(
			path.join(__dirname, "../../../build", "/index.html"),
			(err) => {
				if (err) {
					next(err);
				}
			}
		);
	}
}
