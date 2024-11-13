import invoiceController from "../controllers/invoiceController";
import { Router } from "express";

const invoiceRouter = Router();

invoiceRouter.post('/create-invoice', invoiceController.createInvoice);
invoiceRouter.get('/getAll-invoices', invoiceController.getAllInvoice);
invoiceRouter.get('/single-invoice/:id', invoiceController.getSingleInvoice);
invoiceRouter.get('/search-invoices', invoiceController.searchInvoice);
invoiceRouter.put('/update-invoice/:id', invoiceController.updateInvoice);
invoiceRouter.delete('/delete-invoice/:id', invoiceController.deleteInvoice);
invoiceRouter.delete('/multipleDelete-invoice', invoiceController.multipleDelete);

export default invoiceRouter;