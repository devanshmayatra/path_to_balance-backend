import { Schema, model } from "mongoose";

const questionSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    optionOne: {
      type: String,
      required:true,
      default: "Not at All"
    },
    optionTwo: {
      type: String,
      default: "Several days"
    },
    optionThree: {
      type: String,
      default: "More than half the days"
    },
    optionFour: {
      type: String,
      default: "Nearly everyday"
    }
  }
});

export const Question = model("Question", questionSchema);