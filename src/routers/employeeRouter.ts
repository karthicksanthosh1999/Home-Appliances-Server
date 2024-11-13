import employeeController from "../controllers/employeeController";
import { Router } from "express";
import { validator } from "../middleware/validator";
import { createEmployeeModal, updateEmployeeModal } from "../modals/employeeSchema/employeeSchemaValidation";
import { authMiddleware } from "../controllers/authenticationController";
import upload from "../config/multer-config";

const employeeRouter = Router();

employeeRouter.post('/create-employee', authMiddleware, upload.single('idProof'), employeeController.createEmployee);
employeeRouter.get('/single-employee/:id', authMiddleware, employeeController.getSingleEmployee);
employeeRouter.get('/getAll-employees', authMiddleware, employeeController.getAllEmployee);
employeeRouter.delete('/delete-employee/:id', authMiddleware, upload.single('idProof'), employeeController.deleteEmployee);
employeeRouter.put('/update-employee/:id', authMiddleware, upload.single('idProof'), employeeController.updateEmployee)
employeeRouter.get('/search-employees', authMiddleware, employeeController.searchEmployee)
employeeRouter.delete('/multipleDelete-employees', authMiddleware, employeeController.multipleDelete)

export default employeeRouter;