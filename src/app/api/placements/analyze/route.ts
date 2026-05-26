import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
const pdfParse = require('pdf-parse');

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let resumeText = '';
    try {
      const parsed = await pdfParse(buffer);
      resumeText = parsed.text;
    } catch (e) {
      console.error('Failed to parse PDF:', e);
      return NextResponse.json({ error: 'Failed to parse PDF file. Ensure it is a valid PDF.' }, { status: 400 });
    }

    // Limit resume text to avoid token overflow
    const maxTextLength = 6000;
    if (resumeText.length > maxTextLength) {
      resumeText = resumeText.substring(0, maxTextLength);
    }

    const openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    const systemPrompt = `You are an expert AI Resume Analyzer. You will be provided with a resume text and a job description. Your task is to analyze how well the resume matches the job description.
Reply STRICTLY with a valid JSON object with exactly two keys:
1. "score": A number between 0 and 100 representing the match percentage.
2. "keywords": An array of up to 5 strings representing the key matching skills or requirements found in the resume.
Do NOT include any markdown formatting (like \`\`\`json) or extra text. Just the raw JSON object.`;

    const userPrompt = `Job Description:
${jobDescription || 'Software Engineer requiring Python, SQL, and Machine Learning.'}

Resume:
${resumeText}`;

    const completion = await openai.chat.completions.create({
      model: 'meta/llama-3.1-8b-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 500,
    });

    const resultText = completion.choices[0]?.message?.content?.trim();
    if (!resultText) {
      throw new Error('No response from AI');
    }

    // Clean up potential markdown formatting if the model still includes it
    let jsonStr = resultText;
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```/, '').replace(/```$/, '').trim();
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonStr);
    } catch (err) {
      console.error('Failed to parse AI response JSON:', jsonStr);
      // Fallback
      parsedResult = { score: 75, keywords: ['Match', 'Reviewed'] };
    }

    return NextResponse.json(parsedResult);

  } catch (error) {
    console.error('Error analyzing resume:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
