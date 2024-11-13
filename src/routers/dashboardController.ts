import { Router } from "express";
import dashboardController from "../controllers/dashboardController";

const dashboardRouter = Router();

dashboardRouter.get('/todaySummary', dashboardController.totalSummary)

export default dashboardRouter;