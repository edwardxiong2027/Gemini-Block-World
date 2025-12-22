
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface ArchitectureHint {
  title: string;
  description: string;
  suggestedMaterials: string[];
}

export const getArchitecturalAdvice = async (theme: string): Promise<ArchitectureHint> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Give me a creative building idea for a Minecraft-style game. The theme is: ${theme}. 
      Include a catchy title, a short description, and a list of 3-4 suggested materials (e.g., wood, cobblestone, glass, dirt, log, grass).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            suggestedMaterials: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "description", "suggestedMaterials"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      title: "Simple Cabin",
      description: "A cozy place to stay the night. Classic and reliable.",
      suggestedMaterials: ["wood", "log", "cobblestone"]
    };
  }
};
