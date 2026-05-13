import { GoogleGenAI } from "@google/genai";

// Standard initialization as per skills
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generateHRAdvice = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert HR Consultant for Hossam HR. Provide professional, clear, and actionable HR advice. If the user asks in Arabic, respond in Arabic. If in English, respond in English.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw error;
  }
};

export const analyzeJobDescription = async (description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Please analyze this job description and suggest improvements for clarity, inclusivity, and impact: \n\n${description}`,
      config: {
        systemInstruction: "You are an expert recruitment specialist. Focus on making the job post more attractive to top talent.",
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw error;
  }
};
