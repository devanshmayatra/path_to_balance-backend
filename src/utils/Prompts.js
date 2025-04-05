class Prompts {

  async mentalhealthEvaluationPrompt(promptData) {
    return `You are a mental health analysis engine.
        
        Given the following evaluation score data:
        ${JSON.stringify(promptData, null, 2)}
        
        Analyze the user's mental health state based on the data. Output your response in the following strict JSON format:
        
        {
          "sentiment": "positive | neutral | negative",
          "risk_level": "low | moderate | high",
          "summary": "Short summary of your reasoning",
          "assesmentScore":"0-100 (based on threat level)",
          "suggestions": ["One sentence actionable suggestion", "Another suggestion if needed"]
        }
        
        Only respond with the JSON output. Do not include any extra explanation or text.
        Only recommend a mental health professional if and only if necessary
        `
  }

}

export const prompts = new Prompts();