import { Router } from "express";

import Statics from "../../middlewares/Statics";
import ClientAppCtr from "../../controllers/Web";

const router = Router();
router.use(Statics.clientStatic);

router.get(
	[
		"/",
		"/dashboard",
		"/auth/signup",
		"/auth/login",
		"/about",
		"/contact",
		"/auth/request-password-reset",
		"/auth/reset-password",
		"/auth/change-email",
		"/error404",
		"/error500",
		"/profile",
		"/settings",
		"/terms",
	],
	ClientAppCtr.sendClient
);

export default router;
