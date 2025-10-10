import { NextResponse } from 'next/server';
import { createServiceRoleClient } from "@/lib/supabase/server-client";
import crypto from 'crypto';

export const runtime = 'nodejs';

/**
 * Validates API key and returns institution_id
 */
async function validateApiKey(apiKey) {
  if (!apiKey || !apiKey.startsWith('pk_')) {
    return { valid: false, error: 'Invalid API key format' };
  }

  const supabase = createServiceRoleClient();
  
  // Hash the API key for lookup
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  
  const { data: apiKeyData, error } = await supabase
    .from('api_keys')
    .select('id, institution_id, is_active, rate_limit, last_used_at')
    .eq('key_hash', keyHash)
    .single();

  if (error || !apiKeyData) {
    return { valid: false, error: 'Invalid API key' };
  }

  if (!apiKeyData.is_active) {
    return { valid: false, error: 'API key has been revoked' };
  }

  // Update last_used_at timestamp
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', apiKeyData.id);

  return { 
    valid: true, 
    institutionId: apiKeyData.institution_id,
    rateLimit: apiKeyData.rate_limit 
  };
}

/**
 * Search vectors for institution-specific context
 */
async function searchVectors(query, institutionId, limit = 5) {
  const supabase = createServiceRoleClient();
  
  // TODO: Generate embedding for the query using your embedding service
  // const queryEmbedding = await generateEmbedding(query);
  
  // For now, using text search as placeholder
  const { data, error } = await supabase
    .from('book_vectors')
    .select('content, metadata, book_id')
    .eq('institution_id', institutionId)
    .textSearch('content', query)
    .limit(limit);

  if (error) {
    console.error('Vector search error:', error);
    return [];
  }

  return data || [];
}

export async function POST(request) {
  try {
    // 1. Extract API key from Authorization header
    const authHeader = request.headers.get('Authorization');
    const apiKey = authHeader?.replace('Bearer ', '');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required. Include it in the Authorization header: Bearer pk_...' },
        { status: 401 }
      );
    }

    // 2. Validate API key and get institution
    const { valid, institutionId, error: validationError } = await validateApiKey(apiKey);

    if (!valid) {
      console.error('API key validation failed:', validationError);
      return NextResponse.json(
        { error: validationError || 'Invalid API key' },
        { status: 401 }
      );
    }

    console.log(`✅ Valid API key for institution: ${institutionId}`);

    // 3. Parse request body
    const { message, conversationHistory = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // 4. Search institution-specific vectors for context
    const relevantContext = await searchVectors(message, institutionId);

    console.log(`Found ${relevantContext.length} relevant chunks for query`);

    // 5. Build context for LLM
    const contextText = relevantContext
      .map(chunk => chunk.content)
      .join('\n\n');

    // 6. Call your LLM (OpenAI, Anthropic, etc.)
    // This is a placeholder - replace with your actual LLM integration
    const systemPrompt = `You are a helpful library assistant. Answer questions based on the following context from the institution's library:

${contextText}

If the answer is not in the context, politely say you don't have that information in the library.`;

    // TODO: Replace with actual LLM call
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [
    //     { role: "system", content: systemPrompt },
    //     ...conversationHistory,
    //     { role: "user", content: message }
    //   ]
    // });

    // Placeholder response
    const aiResponse = {
      message: "This is a placeholder response. Integrate your LLM here.",
      sources: relevantContext.map(chunk => ({
        bookId: chunk.book_id,
        excerpt: chunk.content.substring(0, 200) + '...',
      }))
    };

    // 7. Return response
    return NextResponse.json({
      response: aiResponse.message,
      sources: aiResponse.sources,
      institutionId: institutionId // Can be useful for debugging
    });

  } catch (e) {
    console.error('Chat API error:', e);
    return NextResponse.json(
      { error: 'Internal server error', details: e.message },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(request) {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}
