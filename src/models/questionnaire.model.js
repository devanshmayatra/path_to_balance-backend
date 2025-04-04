import { Schema, model } from "mongoose";

const questionnaireSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      }
    ]
  }
}, {
  timestamps: true
});

export const Questionnaire = model("Questionnaire", questionnaireSchema);