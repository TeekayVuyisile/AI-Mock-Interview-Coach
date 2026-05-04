import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from 'pdf-parse-fork';
import mammoth from 'mammoth';
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false, // Disabling bodyParser to handle multipart/form-data
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable();
  
  try {
    const [fields, files] = await form.parse(req);
    const cvFile = files.cv[0];
    const { fullName, jobTitle, jobDescription, numQuestions, difficulty, interviewType } = fields;

    // 1. Extract CV Text
    let cvText = '';
    const fileBuffer = await fs.readFile(cvFile.filepath);

    if (cvFile.mimetype === 'application/pdf') {
      const data = await pdf(fileBuffer);
      cvText = data.text;
    } else if (cvFile.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const data = await mammoth.extractRawText({ buffer: fileBuffer });
      cvText = data.value;
    } else {
      cvText = fileBuffer.toString();
    }

    // 2. Cleanup temp file
    await fs.unlink(cvFile.filepath);

    // 3. Generate Questions with Gemini
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an expert HR Interviewer. 
      Analyze the following CV and Job Description to generate ${numQuestions} custom interview questions.
      
      User Name: ${fullName}
      Job Title: ${jobTitle}
      Difficulty: ${difficulty}
      Interview Type: ${interviewType}
      
      Job Description:
      ${jobDescription}
      
      Candidate CV:
      ${cvText}
      
      Return a JSON array of objects with the format:
      [
        {
          "id": 1,
          "question": "The actual question text",
          "category": "Technical/Behavioral/HR",
          "intent": "Why this question is being asked"
        }
      ]
      
      Focus on checking if the candidate has the skills required for the job based on their CV.
      Be realistic and professional.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questionsText = response.text();
    const questions = JSON.parse(questionsText);

    return res.status(200).json({
      interviewData: {
        fullName,
        jobTitle,
        difficulty,
        interviewType,
        questions
      }
    });

  } catch (error) {
    console.error("Setup Processing Error:", error);
    return res.status(500).json({ error: 'Failed to process setup and generate questions', details: error.message });
  }
}
