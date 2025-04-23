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
          "currentStatus":"healthy | anxiety | depression | bipolar depression | post-traumatic stress disorder (PTSD) | schizophrenia | eating disorders | oppositional defiant disorder screening | neurodevelopmental disorders | "
          "suggestions": ["One sentence actionable suggestion", "Another suggestion if needed"]
        }
        
        Only respond with the JSON output. Do not include any extra explanation or text.
        Only recommend a mental health professional if and only if necessary
        `
  }


  async taskPrompt(promptData , tenure) {
    return `
    Below are the last 3 mental health assessments for a user. Each assessment includes sentiment, risk level, score, summary, and suggestions. Give some meaningfull tasks even if the assesments is empty. Give only 1 task per user.
    ${JSON.stringify(promptData, null, 2)}
    

    Use this data to analyze the user's mental health trend and generate one meaningful ${tenure} task to support or improve their mental well-being.

    Return the task in the following fixed format (Do not give any kind of extra data):

    {
      "userId": "67ea72919fcd0c0538cf74b2",
      "task": {
        "Title": "Mindful Moments: Daily Gratitude Practice",
        "Description": "Dedicate 5 minutes each day to reflect on and write down 3 things you are grateful for. This practice can boost positivity and improve overall mood, even on challenging days."
      }
    }
    `
  }

}

export const prompts = new Prompts();