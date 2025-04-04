import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const goToAiResponse = asyncHandler(
  async (req, res) => {
    const { evaluationScore } = req.body;

    // const options = {
    //   0:
    //   1:
    //   2:
    //   3:
    // }

    const prompt = `evaluationScore, You are a mental health analysis engine.
    
    Given the following evaluation score data:
    ${JSON.stringify(evaluationScore, null, 2)}
    
    Analyze the user's mental health state based on the data. Output your response in the following strict JSON format:
    
    {
      "sentiment": "positive | neutral | negative",
      "risk_level": "low | moderate | high",
      "summary": "Short summary of your reasoning",
      "suggestions": ["One sentence actionable suggestion", "Another suggestion if needed"]
    }
    
    Only respond with the JSON output. Do not include any extra explanation or text.
    Only recommend a mental health professional if and only if necessary
    `



    const answer = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
        "HTTP-Referer": "app", // Optional. Site URL for rankings on openrouter.ai.
        "X-Title": "path_to_balance", // Optional. Site title for rankings on openrouter.ai.
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "mistralai/mistral-7b-instruct:free",
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ]
      })
    });

    const body = await answer.json();

    function parseEscapedJson(escapedStr) {
      try {
        // Step 1: Remove any leading/trailing whitespace
        const trimmed = escapedStr.trim();

        // Step 2: Unescape the escaped characters (like \n and \")
        const unescaped = trimmed.replace(/\\n/g, '')
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\\\/g, '\\');

        // Step 3: Parse the unescaped string into JSON
        const jsonObject = JSON.parse(unescaped);

        return jsonObject;
      } catch (error) {
        console.error("Failed to parse JSON:", error.message);
        return null;
      }
    }


    const sentiment = parseEscapedJson(body.choices[0].message.content);

    return res.status(200)
      .json(
        new ApiResponse(
          200,
          {
            sentiment: sentiment
          },
          "Ai analysis done"
        )
      )
  }
);

export {
  goToAiResponse,
}