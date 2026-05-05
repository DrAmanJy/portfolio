import { createProjectSchema } from "@validation/portfolio/project";
import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import * as controller from "../controller/projects.js";

const router = Router();

router.post("/", validate(createProjectSchema), controller.createProject);
router.get("/", controller.getProject);
router.get("/:projectId", controller.getProjects);
// router.delete("/:projectId");

export default router;
