import quotationController from "../controllers/quotationController";
import { Router } from "express";

const quotationRouter = Router();

quotationRouter.post('/create-quotation', quotationController.createQuotation);
quotationRouter.get('/getAll-quotations', quotationController.getAllQuotation);
quotationRouter.get('/single-quotation/:id', quotationController.getSingleQuotation);
quotationRouter.get('/search-quotations', quotationController.searchQuotation);
quotationRouter.put('/update-quotation/:id', quotationController.updateQuotation);
quotationRouter.delete('/delete-quotation/:id', quotationController.deleteQuotation);
quotationRouter.delete('/multipleDelete-quotation', quotationController.multipleDelete);
quotationRouter.get('/export-single-quotation/:id', quotationController.exportPdf);
quotationRouter.get('/email-single-quotation/:id', quotationController.sendQuotation);
quotationRouter.put('/update-quotation-status', quotationController.updateStatusQuotation);
quotationRouter.post('/convet-quotation-status/:id', quotationController.convertQuotaionToInvoice);

export default quotationRouter;