import { Router } from "express";
import AuthMw from "../../middlewares/Routes/Auth";
import AccessControlMdw from "../../middlewares/Routes/AccessControl";
import AdminCtr from "../../controllers/Api/Admin"
import Passport from "../../providers/Passport";
import MediaMw from "../../middlewares/Routes/Media";
import StaffCtr from "../../controllers/Api/Staff"
import Manual from "../../controllers/Api/Manual"
import User from "../../models/User";
import Staff from "../../models/Staff";
import mongoose from "../../providers/Database";
import UploadDHIS from "../../controllers/Api/Dhis/upload"
import UploadODK from "../../controllers/Api/Odk/upload"

import MediaSrv from "../../services/Media";
import MediaUtil from "../../utils/Media"
import UploadMDW from "../../middlewares/Routes/Upload"

const ObjectId = mongoose.Types.ObjectId;


const router = Router();



router.post(
	"/upload-s3-file",
	Passport.isAuthenticated,
	AccessControlMdw.canCreate(["data"]),
	MediaSrv.parseRequest,
	MediaMw.checkBadFileType,
	StaffCtr.uploadFile
);
router.post(
	"/upload-manual",
	Passport.isAuthenticated,
	AccessControlMdw.canCreate(["data"]),
	MediaMw.checkBadFileType,
	Manual.any(),
	UploadMDW.manual
);

router.post(
	"/upload-odk",
	Passport.isAuthenticated,
	AccessControlMdw.canCreate(["data"]),
	MediaMw.checkBadFileType,
	UploadODK.any(),
	UploadMDW.odk
)
router.post(
	"/upload-dhis",
	Passport.isAuthenticated,
	AccessControlMdw.canCreate(["data"]),
	MediaMw.checkBadFileType,
	UploadDHIS.any(),
	UploadMDW.dhis2
)

router.get(
	"/documents",
	Passport.isAuthenticated,
	AccessControlMdw.canRead(["data"]),
	StaffCtr.listAllFiles
);

router.get(
	"/documents/odk",
	Passport.isAuthenticated,
	AccessControlMdw.canRead(["data"]),
	StaffCtr.listOdkFiles
);

router.get(
	"/documents/dhis",
	Passport.isAuthenticated,
	AccessControlMdw.canRead(["data"]),
	StaffCtr.listDhisFiles
);

router.get(
	"/documents/manual",
	Passport.isAuthenticated,
	AccessControlMdw.canRead(["data"]),
	StaffCtr.listManualUploadFiles
);

router.get(
	"/documents/headers/:id",
	Passport.isAuthenticated,
	AccessControlMdw.canRead(["data"]),
	StaffCtr.ReadDocumentHeaders
);

router.post(
	"/documents/analytics/:id",
	Passport.isAuthenticated,
	AccessControlMdw.canRead(["data"]),
	StaffCtr.GetAnalytics
);

router.post(
	"/documents/report/:id",
	Passport.isAuthenticated,
	AccessControlMdw.canRead(["data"]),
	StaffCtr.GetReport
);
router.get(
	"/documents/download/:fileRef",
	Passport.isAuthenticated,
	AccessControlMdw.canRead(["data"]),
	StaffCtr.downloadFile
);
router.get(
	"/documents/preview/:fileRef",
	Passport.isAuthenticated,
	AccessControlMdw.canRead(["data"]),
	StaffCtr.previewFile
);

export default router;