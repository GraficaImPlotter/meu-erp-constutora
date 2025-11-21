import { GoogleGenAI } from "@google/genai";

// Using Vite environment variable for API Key
const apiKey = import.meta.env.VITE_API_KEY || ''; 

export const getMaterialSuggestions = async (projectPhase: string, projectType: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing. Simulating response.");
    return `Simulação (API Key ausente ou inválida): Para a fase de ${projectPhase} em ${projectType}, recomenda-se verificar estoque de cimento, areia e tijolos. Verifique se VITE_API_KEY está configurada na Vercel.`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
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