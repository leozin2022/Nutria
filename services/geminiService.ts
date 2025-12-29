
import { GoogleGenAI, Type } from "@google/genai";
import { NutritionalInfo } from "../types";

export const analyzePlate = async (base64Image: string): Promise<NutritionalInfo> => {
  // Inicializando com o modelo Flash para melhor custo-benefício em alta escala (30k+ imagens/mês)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Você é um nutricionista sênior especializado em análise visual.
  Analise a imagem deste prato:
  1. Identifique todos os alimentos e estimativa de porções.
  2. Calcule calorias, proteínas, carboidratos, gorduras e fibras.
  3. Dê um feedback motivador e técnico (Nutri Bianca Ferreira).
  
  Importante: Responda apenas em JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview', // Alterado para Flash: mais rápido e muito mais barato para volume
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          }
        ]
      }
    ],
    config: {
      // O modelo Flash não necessita de thinkingBudget alto para tarefas visuais diretas,
      // o que reduz drasticamente a latência.
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          foodItems: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Alimentos identificados."
          },
          calories: {
            type: Type.NUMBER,
            description: "Kcal totais."
          },
          protein: {
            type: Type.NUMBER,
            description: "Gramas de proteína."
          },
          carbs: {
            type: Type.NUMBER,
            description: "Gramas de carboidratos."
          },
          fat: {
            type: Type.NUMBER,
            description: "Gramas de gordura."
          },
          fiber: {
            type: Type.NUMBER,
            description: "Gramas de fibra."
          },
          description: {
            type: Type.STRING,
            description: "Feedback elegante da Nutri Bianca."
          },
          nutritionalScore: {
            type: Type.STRING,
            enum: ['A', 'B', 'C', 'D', 'E'],
            description: "Nota de saúde do prato."
          }
        },
        required: ["foodItems", "calories", "protein", "carbs", "fat", "fiber", "description", "nutritionalScore"]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Resposta vazia da IA.");
    return JSON.parse(text) as NutritionalInfo;
  } catch (error) {
    console.error("Erro na análise:", error);
    throw new Error("Não conseguimos processar a imagem. Tente uma foto mais clara.");
  }
};
