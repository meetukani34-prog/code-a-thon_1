import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createServiceRoleClient, createServerSupabaseClient } from '@/lib/supabase/server';

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
    let dynamicContext = "";

    if (contextType === 'admin') {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        const userRole = session?.user.user_metadata?.role || 'student';
        const userCollege = session?.user.user_metadata?.college_name;

        const adminClient = await createServiceRoleClient();
        const { data } = await adminClient.auth.admin.listUsers();
        
        if (data && data.users) {
          let usersToCount = data.users;
          
          if (userRole === 'admin') {
            usersToCount = usersToCount.filter(u => {
              const uRole = u.user_metadata?.role || 'student'; // Unassigned are treated as student
              const uCollege = u.user_metadata?.college_name;
              const isTargetRole = uRole === 'student' || uRole === 'faculty' || uRole === 'pending' || !u.user_metadata?.role;
              return isTargetRole && uCollege === userCollege;
            });
          }

          const totalIdentities = usersToCount.length;
          const students = usersToCount.filter((u: any) => (u.user_metadata?.role?.toLowerCase() === 'student' || !u.user_metadata?.role)).length;
          const faculty = usersToCount.filter((u: any) => u.user_metadata?.role?.toLowerCase() === 'faculty').length;
          const pending = usersToCount.filter((u: any) => u.user_metadata?.role?.toLowerCase() === 'pending').length;
          
          dynamicContext = `\n[LIVE SYSTEM DATA]\nTotal Identities: ${totalIdentities}\nStudents Enrolled: ${students}\nFaculty Enrolled: ${faculty}\nPending Users: ${pending}\nAlways use this LIVE SYSTEM DATA to answer questions about user counts. Do not invent numbers.`;
        }
      } catch (e) {
        console.error("Failed to fetch live data", e);
      }
      
      systemPrompt = "You are the Campus OS Admin Assistant. You only answer questions related to campus management, student records, hostel alerts, placements overview, and college administration. Be concise and professional. Do not answer general knowledge questions outside of the portal's scope." + dynamicContext;
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
  } catch (error: any) {
    console.error('Error in chat API:', error);
    // Mock Fallback for hackathon demo if API key is missing
    return NextResponse.json({ reply: "I'm currently running in Demo Mode because the NVIDIA API Key is missing. However, the system is fully operational. Please explore the dashboard features!" });
  }
}
