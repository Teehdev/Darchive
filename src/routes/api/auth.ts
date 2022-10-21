import { Router } from "express";
import AuthMw from "../../middlewares/Routes/Auth";

import RegisterCtr from "../../controllers/Api/Auth/Register";
import LoginCtr from "../../controllers/Api/Auth/Login";
import ResetCtr from "../../controllers/Api/Auth/ResetPassword";
import ChangePasswordCtr from "../../controllers/Api/Auth/ChangePassword";

// import LogoutCtr from "../../controllers/Api/Auth/Logout";
import Passport from "../../providers/Passport";
import passport from "passport";

const router = Router();

router.post(
	"/signup-admin",
	AuthMw.onSuccessfulAdminRegistration,
	RegisterCtr.admin
);
router.post(
	"/signup-staff",
	AuthMw.onSuccessfulStaffRegistration,
	RegisterCtr.staff
);

router.post("/verify-email", RegisterCtr.accountVerification);
router.post(
	"/signin-admin",
	AuthMw.onSuccessfulAdminLoginFromNewDevice,
	LoginCtr.admin
);
router.post(
	"/signin-admin/verify-newdevice-login",
	LoginCtr.verifyNewDeviceLogin
);
router.post(
	"/signin-staff",
	AuthMw.onSuccessfulStaffLoginFromNewDevice,
	LoginCtr.staff
);
router.post(
	"/signin-staff/verify-newdevice-login",
	LoginCtr.verifyNewDeviceLogin
);

router.post(
	"/request-reset-password-link",
	AuthMw.onRequestLink,
	ResetCtr.requestLink
);

router.get("/verify-request-password-token/:code", ResetCtr.verifyToken);
router.post("/reset-password", ResetCtr.verifyToken, ResetCtr.reset);

// Change password route
router.post(
	"/change-password",
	Passport.isAuthenticated,
	ChangePasswordCtr.changePassword
);



// Logout
// router.post("/logout", Passport.isAuthenticated, LogoutCtr.admin);

export default router;
