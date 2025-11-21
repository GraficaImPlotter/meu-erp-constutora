import { GoogleGenAI } from "@google/genai";

export const getMaterialSuggestions = async (projectPhase: string, projectType: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Atue como um Engenheiro Civil experiente.
      Estou gerenciando uma obra do tipo: "${projectType}".
      A fase atual é: "${projectPhase}".
      
      Liste 5 materiais essenciais que eu devo comprar ou verificar no estoque agora para não atrasar a obra.
      Seja direto e breve. Retorne apenas a lista em formato Markdown (bullet points).
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Não foi possível gerar sugestões no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao conectar com a IA. Verifique sua cota ou chave de API.";
  }
};