// src/lib/rag-llm.js

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini client using the API key from environment variables
// IMPORTANT: Use the API key set in your Next.js environment variables (e.g., GEMINI_API_KEY)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""; 
// NOTE: We are using a mock client since the full GoogleGenerativeAI library isn't available
// in this environment, but this structure shows the correct streaming logic.

const SYSTEM_INSTRUCTION = `You are a Smart Library Assistant. Your role is to answer user questions based STRICTLY and only on the provided context (the book excerpts). 
Do not use any external knowledge. If the answer is not in the context, clearly state: "I cannot find the answer to that in the available library materials."
Structure your response clearly and concisely.`;

/**
 * Assembles the RAG prompt and streams the response from the LLM.
 * @param {string} userQuery - The user's original question.
 * @param {Array<{content: string, book_id: string}>} contextChunks - The retrieved book excerpts.
 * @returns {Promise<Response>} A standard Next.js Streaming Response.
 */
export async function streamRAGResponse(userQuery, contextChunks) {
    // 1. Assemble Context and System Prompt
    const contextText = contextChunks.map(c => c.content).join("\n---\n");
    const fullPrompt = `CONTEXT (Retrieved Book Excerpts):\n\n${contextText}\n\n---\n\nUSER QUESTION: ${userQuery}`;

    // 2. Call the Gemini API (Placeholder for actual fetch)
    const apiKey = GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: fullPrompt }] }],
        systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        config: {
            // Optional: Specify temperature, etc.
        }
    };

    // Note: The Gemini API currently supports streaming via a different endpoint/SDK method. 
    // For this example, we will simulate a streaming response structure common in Next.js 
    // or use a standard fetch, assuming the client handles it. Since we cannot use the 
    // official streaming SDK here, we will demonstrate the standard fetch pattern 
    // that wraps the streamed response.
    
    // Fallback to non-streaming for compliance with single-file architecture restrictions,
    // and then simulate the streaming using a ReadableStream.

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error("LLM API Error:", response.statusText);
            throw new Error(`LLM API failed with status ${response.status}`);
        }

        const result = await response.json();
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
        
        // Use a simple ReadableStream to simulate streaming chunk-by-chunk
        const stream = new ReadableStream({
            start(controller) {
                // Split text into words and push them chunk-by-chunk
                const words = generatedText.split(' ');
                let index = 0;
                
                function pushWord() {
                    if (index < words.length) {
                        // Send the next word followed by a space
                        controller.enqueue(words[index] + ' ');
                        index++;
                        // Simulate delay
                        setTimeout(pushWord, 20); 
                    } else {
                        controller.close();
                    }
                }
                pushWord();
            },
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain',
                // Allow CORS if needed, but in Next.js this is often handled automatically
            }
        });

    } catch (e) {
        console.error('Error during LLM API call:', e);
        // Create an error stream to send back to the client
        const errorStream = new ReadableStream({
            start(controller) {
                controller.enqueue(`Error: An internal error occurred while generating the response. ${e.message}`);
                controller.close();
            }
        });
        return new Response(errorStream, { status: 500 });
    }
}
