import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize late to avoid crashing if key is missing during build
let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.error("❌ AI Error: GOOGLE_AI_API_KEY is missing or is the placeholder in .env.local");
    return null;
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateSummary(title: string, body: string) {
  try {
    const ai = getGenAI();
    if (!ai) throw new Error("AI not configured");

    const model = ai.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `
      You are an expert content summarizer. 
      Read the following blog post title and content, and generate a concise summary of approximately 200 words.
      The summary should be engaging and informative.
      Return ONLY the summary text, no extra commentary.
      
      Title: ${title}
      Content: ${body}
      
      Summary:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) throw new Error("Empty response from Gemini");
    
    return text;
  } catch (error: any) {
    console.error("Gemini API Error:", error.message);
    throw error;
  }
}

export async function generateSummaryWithRetry(title: string, body: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await generateSummary(title, body);
    } catch (err) {
      if (i === retries - 1) throw err;
      const waitTime = 2000 * (i + 1);
      await new Promise(res => setTimeout(res, waitTime));
    }
  }
}
