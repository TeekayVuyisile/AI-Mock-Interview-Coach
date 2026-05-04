# AI Mock Interview Coach 🎙️🤖

An AI-powered interview simulator that uses the **Gemini API** and **Web Speech API** to provide a realistic, voice-driven mock interview experience.

## 🌟 Key Features
- **CV & Job Analysis:** Upload your CV (PDF/DOCX) and a job description. The AI tailors questions specifically for you.
- **Voice-to-Voice Interaction:** The AI speaks questions, and you respond using your microphone.
- **Real-time Transcripts:** See your spoken words converted to text live on the screen.
- **AI Feedback Dashboard:** Get an overall score and detailed analysis of your confidence, technical depth, and more.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **Gemini API Key:** Get yours at [Google AI Studio](https://aistudio.google.com/).

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <your-repo-url>
cd frontend
npm install
```

### 3. Environment Setup
Create a `.env` file in the `frontend` root directory and add your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### 4. Running Locally
To run both the frontend and the serverless API functions:
```bash
npx vercel dev
```
Open [http://localhost:3000](http://localhost:3000) to start your mock interview!

---

## 🛠️ Tech Stack
- **Frontend:** React, Bootstrap, Framer Motion
- **Backend:** Vercel Serverless Functions (Node.js)
- **AI:** Google Gemini gemini-3-flash-preview
- **Voice:** Web Speech API (STT), SpeechSynthesis (TTS)
- **Parsing:** `pdf-parse-fork`, `mammoth` (DOCX), `formidable` (Uploads)

---

## 📦 Deployment

### GitHub
1. Create a new repository on GitHub.
2. Push your code:
   ```bash
   git add .
   git commit -m "Initial commit: AI Mock Interview Coach"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
   *Note: Ensure `.env` is in your `.gitignore` to protect your API key.*

### Vercel
1. Connect your GitHub repository to [Vercel](https://vercel.com/).
2. In the Vercel Dashboard, go to **Settings > Environment Variables**.
3. Add `VITE_GEMINI_API_KEY` with your actual key.
4. Deploy! Vercel will automatically detect the `/api` folder and serve the serverless functions.

---

## 🔒 Security
- This app does **not** store CVs or recordings. 
- All files are processed in-memory and deleted immediately after analysis.
- API keys are handled server-side to prevent exposure in the browser.

---
Author: Teekay Vuyisile Manale
