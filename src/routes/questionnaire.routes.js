import { Router } from "express";
import {
  addQuestionnaire, getAllQuestionnaires, getOneQuestionnaire, uploadFullQusstionnaire,
  getSpecificQuestionnaire
} from "../controller/questionnaire.controller.js";

const router = Router();

router.route("/add").post(
  addQuestionnaire
);

router.route("/get/:id").get(
  getOneQuestionnaire
);

router.route("/get/get-first").get(
  getOneQuestionnaire
);

router.route("/all").get(
  getAllQuestionnaires
);

router.route("/get-specific/:id").get(
  getSpecificQuestionnaire
);

router.route("/upload-full-questionnaire").post(
  uploadFullQusstionnaire
);

export default router;