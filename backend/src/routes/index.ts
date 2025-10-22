import { Router } from "express";
import { experimentRoutes } from "./experiments";
import { exportController } from "../controllers/exportController";
import { ExperimentService } from "../modules/services/ExperimentService";

// Don't instantiate services at module load time
// They will be created when routes are accessed

export const AppRoutes = Router();

AppRoutes.use('/experiments', experimentRoutes());
AppRoutes.use('/export', exportController(new ExperimentService()));