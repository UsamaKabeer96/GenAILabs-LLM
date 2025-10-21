import { Router } from "express";
import { experimentRoutes } from "./experiments";
import { exportController } from "@/controllers/exportController";
import { ExperimentService } from "@/modules/services/ExperimentService";

const experimentService = new ExperimentService();

export const AppRoutes = Router();

AppRoutes.use('/experiments', experimentRoutes());
AppRoutes.use('/export', exportController(experimentService));