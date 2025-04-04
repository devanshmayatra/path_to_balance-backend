import { Schema, model } from "mongoose";

const specialistSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  experience: {
    type: Number,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  yearsOfExperience: {
    type: Number,
    required: true
  },
  basedOf: {
    type: String,
    required: true
  },
  noOfPatientsTreated: {
    type: Number,
  }
}, {
  timestamps: true
});

export const Specialist = model('Specialist' , specialistSchema);