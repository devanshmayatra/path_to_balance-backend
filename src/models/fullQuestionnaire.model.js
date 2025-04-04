import { model, Schema } from "mongoose";

const fullQuestionnaireSchema = Schema({
  name: { type: String, required: true },
  questionnaire: {
    type: {},
    required: true
  }
}, {
  timestamps: true
})

export const FullQuestionnaire = model("FullQuestionnaire", fullQuestionnaireSchema);