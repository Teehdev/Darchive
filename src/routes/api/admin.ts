import { Router } from "express";
import AuthMw from "../../middlewares/Routes/Auth";
import AccessControlMdw from "../../middlewares/Routes/AccessControl";
import AdminCtr from "../../controllers/Api/Admin"
import Passport from "../../providers/Passport";

const router = Router();

router.post("/activate-account", Passport.isAuthenticated, AccessControlMdw.canUpdate(["user"], { checkOnlyAny: true }), AdminCtr.activateAccount)
router.post("/deactivate-account", Passport.isAuthenticated, AccessControlMdw.canUpdate(["user"], { checkOnlyAny: true }), AdminCtr.deActivateAccount)
router.post("/delete-account", Passport.isAuthenticated, AccessControlMdw.canUpdate(["user"], { checkOnlyAny: true }), AdminCtr.deleteAccount)
router.get("/users", Passport.isAuthenticated, AdminCtr.listUsers);

router.post(
	"/upgrade-user/:userId",
	Passport.isAuthenticated,
	AccessControlMdw.canUpdate(["user"], { checkOnlyAny: true }),
	AdminCtr.upgradeUserAccess
);

router.post(
	"/downgrade-user/:userId",
	Passport.isAuthenticated,
	AccessControlMdw.canUpdate(["user"], { checkOnlyAny: true }),
	AdminCtr.downgradeUserAccess
);

router.post(
	"/documents/approve/:id",
	Passport.isAuthenticated,
	AccessControlMdw.canUpdate(["data"]),
	AdminCtr.ApproveDocument
);

router.post(
	"/documents/disapprove/:id",
	Passport.isAuthenticated,
	AccessControlMdw.canUpdate(["data"]),
	AdminCtr.DisapproveDocument
);

router.delete(
	"/documents/:id",
	Passport.isAuthenticated,
	AccessControlMdw.canDelete(["data"]),
	AdminCtr.DeleteDocument
);
// Create folder
router.post("/folders", Passport.isAuthenticated, AdminCtr.createFolder);
// Update folder
router.put("/folders/:folderRef", Passport.isAuthenticated, AdminCtr.updateFolder);
// Delete folder
router.delete("/folders/:folderRef", Passport.isAuthenticated, AdminCtr.deleteFolder);
// List folders
router.get("/folders", Passport.isAuthenticated, AdminCtr.listFolders);
// Get folder
router.get("/folders/:folderRef", Passport.isAuthenticated, AdminCtr.getFolder);

export default router;
