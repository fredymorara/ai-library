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

    const supabase = createServiceRoleClient(); // <-- DEFINE SUPERBASE HERE

    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    // --- Start Analytics Logging ---
    await supabase.from('chat_sessions').insert({
      institution_id: institutionId,
      api_key_id: apiKeyData.id,
      first_user_message: message,
    });
    // --- End Analytics Logging ---

    const relevantContext = await searchVectors(message, institutionId);
    const contextText = relevantContext.map(chunk => chunk.content).join('\n\n---\n\n');

    const systemPrompt = `You are a helpful library assistant for Kabarak University. Your name is 'Kabi'. Answer the user's question based ONLY on the following context provided from the university's library collection. Do not use any outside knowledge. If the answer is not in the context, politely say that you do not have information on that topic in the library's current collection. Be friendly and conversational. Always cite the sources of your information from the context provided.`;

    const stream = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
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