import { Router } from "express";
import { GetToken, GetAllForms, GetForm } from "../../controllers/Api/Odk";
import Passport from "../../providers/Passport";

const router = Router();

// get api token
router.post("/token", Passport.isAuthenticated, GetToken);
// list all forms
router.post("/forms", Passport.isAuthenticated, GetAllForms);
// get form data
router.post("/form", Passport.isAuthenticated, GetForm);

// fetch analytics from dhis2 server and save to database

export default router;
