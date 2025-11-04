import { GoogleGenAI, Chat, Content } from "@google/genai";
import { ChatMessage } from "../types.ts";

const API_KEY = process.env.API_KEY;

// We will check for the API key inside the functions to avoid crashing the app on load.
const getAiInstance = () => {
  if (!API_KEY) {
    console.error("API_KEY environment variable not set.");
    return null;
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

const buildHistory = (messages: ChatMessage[]): Content[] => {
    return messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
};

const missingApiKeyError = "The AI service is not configured. Please ensure the API Key is set up correctly in the Vercel deployment environment variables.";

export const sendMessageToAI = async (message: string, history: ChatMessage[]): Promise<string> => {
    const ai = getAiInstance();
    if (!ai) {
        return missingApiKeyError;
    }

    try {
        const currentChat: Chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are Ai-buddy, a friendly and encouraging AI tutor for ExamRedi. Your goal is to help students understand complex topics and prepare for their exams. Explain concepts clearly, provide examples, and test their knowledge with relevant questions. Keep your tone positive and supportive. Format your responses using markdown for better readability.`,
            },
            history: buildHistory(history)
        });

        const response = await currentChat.sendMessage({ message });
        
        return response.text;
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return "I'm having trouble connecting right now. Please try again later.";
    }
};

export const generateStudyGuide = async (subject: string, topic: string): Promise<string> => {
    const ai = getAiInstance();
    if (!ai) {
        return missingApiKeyError;
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a study guide for the subject "${subject}" on the topic "${topic}".`,
            config: {
                systemInstruction: `You are an expert educator and content creator. Your task is to generate a concise and easy-to-understand study guide on a given topic. The guide should be structured like a handbook, focusing on key concepts, definitions, and important points. Use clear headings, bullet points, and simple language to make the information digestible for a student preparing for an exam. Use markdown for formatting.`,
            },
        });
        
        return response.text;

    } catch (error) {
        console.error("Error generating study guide:", error);
        return "Sorry, I encountered an error while generating the study guide. Please check the topic and try again.";
    }
};

export const researchTopic = async (searchType: 'university' | 'course', query: string): Promise<string> => {
    const ai = getAiInstance();
    if (!ai) {
        return missingApiKeyError;
    }

    let prompt = '';
    if (searchType === 'university') {
        prompt = `Provide a detailed overview of the Nigerian university: "${query}". Include information on its history, notable alumni, available faculties, admission requirements (especially JAMB cut-off marks if available), and student life. Format this for a prospective Nigerian student.`;
    } else { // course
        prompt = `Generate a comprehensive guide for a student in Nigeria considering a career in "${query}". Include the required subjects for JAMB, top universities in Nigeria offering this course, a potential career paths after graduation in Nigeria, and the skills needed to succeed in this field.`;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: `You are a knowledgeable career and academic advisor for Nigerian students. Provide accurate, detailed, and encouraging information. Use clear headings, bullet points, and bold text for readability. Use markdown formatting.`,
            },
        });
        
        return response.text;
    } catch (error) {
        console.error("Error researching topic:", error);
        return "I'm having trouble connecting right now. Please try again later.";
    }
};