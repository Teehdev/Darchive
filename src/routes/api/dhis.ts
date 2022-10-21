import { Router } from "express";
import { listTemplates, createTemplate, updateTemplate, deleteTemplate, getTemplate } from "../../controllers/Api/Dhis";
import { pullReport } from "../../controllers/Api/Dhis";
import Passport from "../../providers/Passport";

const router = Router();

// Create template
router.post("/templates", Passport.isAuthenticated, createTemplate);
// Update template
router.put("/templates/:templateRef", Passport.isAuthenticated, updateTemplate);
// Delete template
router.delete("/templates/:templateRef", Passport.isAuthenticated, deleteTemplate);
// List templates
router.get("/templates", Passport.isAuthenticated, listTemplates);
// Get template
router.get("/templates/:templateRef", Passport.isAuthenticated, getTemplate);

// get api token
router.post("/reports/:templateRef", Passport.isAuthenticated, pullReport);

export default router;
