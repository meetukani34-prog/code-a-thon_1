import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { messages, contextType, extraContext } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    let systemPrompt = "You are a helpful AI assistant.";

    if (contextType === 'admin') {
      systemPrompt = "You are the Campus OS Admin Assistant. You only answer questions related to campus management, student records, hostel alerts, placements overview, and college administration. Be concise and professional. Do not answer general knowledge questions outside of the portal's scope.";
    } else if (contextType === 'placement') {
      systemPrompt = "You are a Career Counselor AI for Campus OS. If the user is a student, help them improve their resume and prepare for interviews based on the provided context. If the user is an admin, provide insights about the student's resume and job fit. Keep answers professional and focused on career development.";
    }

    if (extraContext) {
      systemPrompt += `\n\nAdditional Context:\n${extraContext}`;
    }

    const completion = await openai.chat.completions.create({
      model: 'meta/llama-3.1-8b-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
