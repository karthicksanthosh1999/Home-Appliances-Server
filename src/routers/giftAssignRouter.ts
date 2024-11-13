import { Router } from "express";
import giftAssignController from "../controllers/giftAssignController";

const giftAssignRouter = Router()

giftAssignRouter.post("/create-gift-assign", giftAssignController.createGiftAssignment);
giftAssignRouter.get("/getAll-gifts-assign", giftAssignController.getAllGiftsAssignment);
giftAssignRouter.get("/getSingle-gift-assign/:id", giftAssignController.getSingleGiftAssignment);
giftAssignRouter.get("/find-gift/:invoiceId", giftAssignController.invoiceMatchedGifts);
giftAssignRouter.put("/update-assign-gift/:id", giftAssignController.updateGiftAssignment);
giftAssignRouter.delete("/delete-gift-assign/:id", giftAssignController.deleteGiftAssignment)

export default giftAssignRouter;