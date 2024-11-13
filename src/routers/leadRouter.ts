import leadController from "../controllers/leadController";
import { Router } from "express";
import { validator } from "../middleware/validator";
import { createLeadModal, updateLeadModal, } from "../modals/leadSchema/leadSchemaValidation";
import { authMiddleware } from "../controllers/authenticationController";

const leadRouter = Router();

leadRouter.post('/create-lead', authMiddleware, validator(createLeadModal), leadController.createLead);
leadRouter.get('/single-lead/:id', authMiddleware, leadController.getSingleLead);
leadRouter.get('/getAll-leads', authMiddleware, leadController.getAllLead);
leadRouter.delete('/delete-lead/:id', authMiddleware, leadController.deleteLead);
leadRouter.put('/update-lead/:id', authMiddleware, validator(updateLeadModal), leadController.updateLead)
leadRouter.get('/search-leads', authMiddleware, leadController.searchLead)
leadRouter.delete('/multipleDelete-leads', authMiddleware, leadController.multipleDelete)
leadRouter.post('/bulk-leads', authMiddleware, leadController.bulkUpload)
leadRouter.get('/today-leads', authMiddleware, leadController.todayLeads)
leadRouter.post('/exports-leads', authMiddleware, leadController.exportLeads)

export default leadRouter;