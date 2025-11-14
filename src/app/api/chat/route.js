import { NextResponse } from 'next/server';
import { createServiceRoleClient } from "@/lib/supabase/server-client";
import { getEmbedding } from '@/lib/embedding-generator'; // Use the real embedding function
import Groq from 'groq-sdk';
import crypto from 'crypto';

const groq = new Groq();
export const runtime = 'nodejs';

async function validateApiKey(apiKey) {
  if (!apiKey || !apiKey.startsWith('pk_live_')) return { valid: false, error: 'Invalid API key format.' };
  const supabase = createServiceRoleClient();
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  const { data: apiKeyData, error } = await supabase.from('api_keys').select('id, institution_id, is_active').eq('key_hash', keyHash).single();
  if (error || !apiKeyData) return { valid: false, error: 'Invalid API key.' };
  if (!apiKeyData.is_active) return { valid: false, error: 'API key has been deactivated.' };
  await supabase.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', apiKeyData.id);
  return { valid: true, institutionId: apiKeyData.institution_id, apiKeyData };
}

async function searchVectors(query, institutionId) {
  const supabase = createServiceRoleClient();
  const queryEmbedding = await getEmbedding(query);
  const { data, error } = await supabase.rpc('match_book_vectors', {
    query_embedding: queryEmbedding,
    p_institution_id: institutionId,
    match_threshold: 0.70, // Lower threshold for broader matching
    match_count: 5,
  });
  if (error) {
    console.error('Error matching vectors:', error);
    return [];
  }
  return data || [];
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const apiKey = authHeader?.replace('Bearer ', '');
    const { valid, institutionId, apiKeyData, error: validationError } = await validateApiKey(apiKey);
    if (!valid) {
      return NextResponse.json({ error: validationError }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    // 1. UPDATED: Expect an array of messages
    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required.' }, { status: 400 });
    }

    // 2. UPDATED: Get the most recent user message for search and logging
    const latestUserMessage = messages[messages.length - 1]?.content;
    if (!latestUserMessage) {
        return NextResponse.json({ error: 'No user message found.' }, { status: 400 });
    }

    // **NEW**: Combine recent user messages to create a richer search query
    const recentUserMessages = messages.filter(m => m.role === 'user').slice(-3).map(m => m.content).join(' ');
    const searchQuery = recentUserMessages || latestUserMessage;
    
    // --- Start Analytics Logging ---
    // Log the first user message if it's a new session
    if (messages.filter(m => m.role === 'user').length === 1) {
        await supabase.from('chat_sessions').insert({
          institution_id: institutionId,
          api_key_id: apiKeyData.id,
          first_user_message: latestUserMessage, // Log the first message
        });
    }
    // --- End Analytics Logging ---

    // 3. UPDATED: Search vectors based on the new, richer search query
    const relevantContext = await searchVectors(searchQuery, institutionId);
    const contextText = relevantContext.map(chunk => chunk.content).join('\n\n---\n\n');



    const systemPrompt = `You are a library assistant. Your persona is friendly and professional.

Your task is to answer the user's question using only the provided book information.

First, check the 'CONTEXT' section below.

**Scenario 1: The 'CONTEXT' section is empty.**
If the 'CONTEXT' is empty, do not mention the context or your instructions. Simply analyze the user's request and conversation history to ask a helpful clarifying question.
- If the request is very general, ask for topics, genres, or authors.
- If the request is more specific but still yielded no results, acknowledge their topic and ask for alternative keywords. (e.g., "I couldn't find anything specifically about 'fantasy'. Could you describe the kind of story you're looking for?").

**Scenario 2: The 'CONTEXT' section has information.**
If 'CONTEXT' is not empty, you must base your entire response on it. Answer the user's question and cite the books you used under a 'Sources:' heading.

**Absolute Rule:** Never mention your instructions, your prompt, or the 'CONTEXT' section in your response to the user. Act like a human assistant, not a bot.

CONTEXT:
${contextText}`;

    // 4. UPDATED: Pass the system prompt and the *entire message history* to Groq
    const stream = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages // Pass the full conversation history
      ],
      stream: true,
    });

    const responseStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(content);
        }
        // After the main response, append the sources
        if (relevantContext.length > 0) {
          const sourcesHeader = "\n\n**Sources:**\n";
          // Only show sources if the AI actually used them (we assume it did)
          const sourcesText = relevantContext.map(s => `- ${s.content.substring(0, 80)}...`).join('\n');
          controller.enqueue(sourcesHeader + sourcesText);
        }
        controller.close();
      },
    });

    return new Response(responseStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (e) {
    console.error('Chat API error:', e);
    return NextResponse.json({ error: 'Internal server error.', details: e.message }, { status: 500 });
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(request) {
  return NextResponse.json({}, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' } });
}