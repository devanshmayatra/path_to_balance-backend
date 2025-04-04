import { model, Schema } from "mongoose";

const fullQuestionnaireSchema = Schema({
  title: { type: String, required: true },
  options: {
    type: {
      option1: String,
      option2: String,
      option3: String,
      option4: String,
    },
  },
  questions: {
    type: [
      {
        question: String,
      },
    ],
    required: true
  }
}, {
  timestamps: true
})

export const FullQuestionnaire = model("FullQuestionnaire", fullQuestionnaireSchema);