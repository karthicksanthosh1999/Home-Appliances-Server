import { Router } from "express";
import giftControllers from "../controllers/giftControllers";

const giftRouter = Router()

giftRouter.post("/create-gift", giftControllers.createGift);
giftRouter.get("/getAll-gifts", giftControllers.getAllGifts);
giftRouter.get("/getSingle-gift/:id", giftControllers.getSingleGift);
giftRouter.put("/update-gift/:id", giftControllers.updateGift);
giftRouter.delete("/delete-gift/:id", giftControllers.deleteGift);
giftRouter.get("/search-gift", giftControllers.searchGift);

export default giftRouter;