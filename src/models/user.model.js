import { Schema, model } from 'mongoose';
import bcrypt from "bcrypt";

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: "No Bio"
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  authType: {
    type: String,
    enum: ['email-password', 'oauth'],
    required: true,
    default: "email-password",
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: "user",
  },
  avatar: {
    type: String,
    default: "",
  },
  mentalHealthScore: {
    type: Number,
    default: 0,
    max: 10
  },
  assesmentHistory: [
    {
      questionnaireId: {
        type: Schema.Types.ObjectId,
        ref: "FullQuestionnaire",
        required: true
      },
      score: {
        type: Number,
        max: 3,
        required: true
      }
    }
  ],
  isLoggedIn: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {

  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

export const User = model('User', userSchema);