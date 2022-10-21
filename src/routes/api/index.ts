import { Router } from "express";
import auth from "./auth";
import admin from "./admin";
import dhis from "./dhis";
import odk from "./odk";
import Passport from "../../providers/Passport";
import staff from "./staff";
import ContactMdw from "../../middlewares/Routes/Contact";
import Log from "../../middlewares/Log";

const router = Router();

router.get("/", (req, res) => {
	return res.status(200).json({ message: "success" });
});

router.use("/auth", auth);
router.use("/admin", admin);
router.use("/dhis", dhis);
router.use("/odk", odk);
router.use("/staff", staff);

export default router;
