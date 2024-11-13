import branchController from "../controllers/branchController";
import { Router } from "express";
import { validator } from "../middleware/validator";
import { createBranchModal } from "../modals/branchSchema/branchSchemaValidation";
import { authMiddleware } from "../controllers/authenticationController";

const branchRouter = Router();

branchRouter.post('/create-branch', authMiddleware, validator(createBranchModal), branchController.createBranch);
branchRouter.get('/getAll-branches', authMiddleware, branchController.getAllBranchs);
branchRouter.get('/single-branch/:id', authMiddleware, branchController.getSingleBranch);
branchRouter.delete('/delete-branch/:id', authMiddleware, branchController.deleteBranch);
branchRouter.put('/update-branch/:id', authMiddleware, validator(createBranchModal), branchController.updateBranch)
branchRouter.get('/search-branches', authMiddleware, branchController.searchBranchs)
branchRouter.delete('/multipleDelete-branches', authMiddleware, branchController.multipleDelete)
branchRouter.get('/total-branche-details/:id', authMiddleware, branchController.totalDetailsBranchs)

export default branchRouter;