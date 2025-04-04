import { Router } from "express";
import { goToAiResponse } from "../controller/response.controller.js";

const router = Router();

router.route("/").post(
  goToAiResponse,
)

export default router;