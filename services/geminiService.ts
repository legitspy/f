import { GoogleGenAI } from "@google/genai";
import type { Transaction } from '../types';

export const analyzeSpending = async (transactions: Transaction[]): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API key is not configured in environment variables. AI features will be disabled.");
    return "### AI Features Disabled\nAI-powered spending insights are currently unavailable. This feature requires configuration by the app administrator.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash';

  const transactionSummary = transactions
    .map(t => `${t.date}: ${t.description} (${t.category}) - ${t.amount.toFixed(8)} BTC`)
    .join('\n');

  const prompt = `
    You are a friendly financial advisor for a smart wallet app called BitPrivacy.
    Analyze the following list of user transactions and provide a brief, insightful summary of their spending habits.
    
    The user's transactions are:
    ${transactionSummary}

    Your analysis should be:
    - Concise (2-3 paragraphs max).
    - Easy to understand for a non-expert.
    - Highlight the largest spending category (excluding income).
    - Offer one or two simple, actionable tips for improvement.
    - Be encouraging and positive in tone.
    - Format your response using markdown. Use headings and bullet points for clarity.
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('API key is invalid'))) {
        return "Sorry, I couldn't analyze your spending. The AI service is not configured correctly.";
    }
    return "Sorry, I couldn't analyze your spending right now. There was an issue connecting to the AI service.";
  }
};
