import { Router } from "express";
import { authMiddleware } from "../controllers/authenticationController";
import deliveryController from '../controllers/deliveryController';
import upload from "../config/multer-config";


const deliveryRouter = Router()

deliveryRouter.post('/create-delivery', authMiddleware, upload.single("installationProof"), deliveryController.createDelivery)
deliveryRouter.get('/getAll-delivery', authMiddleware, deliveryController.getAllDelivery)
deliveryRouter.get('/single-delivery/:id', authMiddleware, deliveryController.getSingleDelivery)
deliveryRouter.delete('/delete-delivery/:id', authMiddleware, deliveryController.deleteSingleDelivery)
deliveryRouter.put('/update-delivery/:id', authMiddleware, upload.single("installationProof"), deliveryController.updateSingleDelivery)
deliveryRouter.get('/search-deliverys', authMiddleware, deliveryController.searchDeliverys)


export default deliveryRouter;