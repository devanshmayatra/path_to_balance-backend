import { mongoose } from 'mongoose';
const { Schema } = mongoose;

const responseSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
    required: true,
  },
  responses: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
      sentimentScore: {
        type: Number, // 1-2-3-4-5
        default: null,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

module.exports = mongoose.model("Response", responseSchema);