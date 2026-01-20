
import { GoogleGenAI, Type } from "@google/genai";
import { Category, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchQuestionsByCategory = async (category: Category, count: number = 15): Promise<Question[]> => {
  const currentYear = 2026;
  const isMixed = category === Category.MIXED;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Você é um historiador de futebol angolano e mundial. Estamos no ano de ${currentYear}.
    Gere exatamente ${count} perguntas de múltipla escolha para a categoria: "${category}".
    
    DIRETRIZES TÉCNICAS:
    - Retorne APENAS um array JSON válido.
    - Use Português de Angola CORRETAMENTE ACENTUADO (é vital que acentos como á, é, í, ó, ú, ç sejam exibidos corretamente).
    - ${isMixed ? 'Misture temas de todas as áreas: Girabola, Mundial, Ligas Europeias, Lendas e Estádios.' : 'Foque exclusivamente no tema: ' + category}
    - Dificuldade progressiva: 1 (fácil) até 15 (lendária).
    
    FORMATO JSON:
    [
      {
        "id": "q1",
        "question": "Pergunta aqui...",
        "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
        "correctAnswer": "A opção correta exatamente igual a um dos itens de options",
        "explanation": "Explicação curta com contexto histórico."
      }
    ]`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  try {
    const rawText = response.text.trim();
    const questions: any[] = JSON.parse(rawText);
    return questions.map(q => ({
      ...q,
      category: isMixed ? Category.MIXED : category
    }));
  } catch (error) {
    console.error("Erro ao processar questões do Gemini:", error);
    throw error;
  }
};
