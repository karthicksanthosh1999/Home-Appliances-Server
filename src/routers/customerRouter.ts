import customerController from "../controllers/customerController";
import { Router } from "express";
import { validator } from "../middleware/validator";
import { createCustomerModal, updateCustomerModal } from "../modals/customerSchema/customerSchemaValidation";
import { authMiddleware } from "../controllers/authenticationController";

const customerRouter = Router();

customerRouter.post('/create-customer', authMiddleware, validator(createCustomerModal), customerController.createCustomer);
customerRouter.get('/single-customer/:id', authMiddleware, customerController.getSingleCutomer);
customerRouter.get('/existing-customer/:mobile', authMiddleware, customerController.existingCustomer);
customerRouter.get('/getAll-customers', authMiddleware, customerController.getAllCustomer);
customerRouter.delete('/delete-customer/:id', authMiddleware, customerController.deleteCustomer);
customerRouter.put('/update-customer/:id', authMiddleware, validator(updateCustomerModal), customerController.updateCustomer)
customerRouter.get('/search-customers', authMiddleware, customerController.searchCustomer)
customerRouter.delete('/multipleDelete-customers', authMiddleware, customerController.multipleDelete)

export default customerRouter;