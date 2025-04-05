import { asyncHandler } from "./asyncHandler.js";
import { GoogleGenAI } from "@google/genai";

const GetResponseFromAi =
  async (prompt, role) => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      role:role,
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const returnValue = response.text;

    return returnValue;
  };

export {
  GetResponseFromAi
};
