import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: In a real environment, this API Key is managed via process.env.API_KEY
// The app assumes the key is present in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateArticleSummary = async (articleContent: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is missing. Unable to generate summary.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following news article in 3 concise bullet points suitable for a quick preview.
      
      Article Content:
      ${articleContent}`,
    });

    return response.text || "No summary available.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Failed to generate summary. Please try again later.";
  }
};

export const generateHeadlineIdeas = async (topic: string): Promise<string[]> => {
    if (!process.env.API_KEY) return ["API Key Missing"];

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate 5 catchy, SEO-friendly news headlines for a story about: ${topic}. Return only the headlines as a JSON array of strings.`,
            config: {
                responseMimeType: 'application/json'
            }
        });
        
        const text = response.text;
        if(text) {
             return JSON.parse(text) as string[];
        }
        return [];
    } catch (e) {
        console.error(e);
        return [];
    }
}