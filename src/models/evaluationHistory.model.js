import { Schema, model } from 'mongoose';

const evaluationHistorySchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questioannaireID: {
    type: Schema.Types.ObjectId,
    ref: "FullQUestionnare",
    required: true,
  },
  evaluationSummary: {
    type: {
      sentiment: String,
      risk_level: String,
      summary: String,
      suggestions: [
        {
          type: String,
        }
      ]
    }
  }
}, {
  timestamps: true,
})

export const EvaluationModel = model("EvaluationModel", evaluationHistorySchema);