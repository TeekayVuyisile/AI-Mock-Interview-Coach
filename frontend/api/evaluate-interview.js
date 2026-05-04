import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { answers, jobTitle, difficulty } = req.body;

  if (!answers || answers.length === 0) {
    return res.status(400).json({ error: 'No answers provided for evaluation' });
  }

  try {
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an expert Interview Coach and Senior Recruiter. 
      Evaluate the following mock interview transcript for the role of: ${jobTitle} (Difficulty: ${difficulty}).
      
      Session Transcript:
      ${JSON.stringify(answers, null, 2)}
      
      Provide a comprehensive evaluation in JSON format including:
      1. "overallScore": A number from 0-100.
      2. "scores": An object with ratings (0-100) for "confidence", "communication", "relevance", "technicalDepth", and "clarity".
      3. "strengths": An array of 3-4 bullet points.
      4. "improvements": An array of 3-4 bullet points.
      5. "suggestedQuestions": An array of 3 advanced questions for the candidate to practice next.
      
      Be constructive, professional, and specific. If an answer is missing or too short, reflect that in the "clarity" and "relevance" scores.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const evaluationText = response.text();
    const evaluation = JSON.parse(evaluationText);

    return res.status(200).json({ evaluation });
  } catch (error) {
    console.error("Evaluation Error:", error);
    return res.status(500).json({ error: 'Failed to generate evaluation', details: error.message });
  }
}
