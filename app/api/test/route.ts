import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export async function POST() {
    const model = new ChatGoogleGenerativeAI({
        model: 'gemini-2.0-flash',
        apiKey: process.env.GOOGLE_API_KEY,
    });

    const response = await model.invoke('안녕 오늘은 몇요일이야??');

    return Response.json({ message: response.content });
}
