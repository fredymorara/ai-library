
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.models) {
      const embedModels = data.models.filter(m => m.name.toLowerCase().includes('embed'));
      console.log('Available embedding models:', embedModels.map(m => m.name));
    } else {
      console.log('No models returned:', data);
    }
  } catch (e) {
    console.error('Fetch failed:', e);
  }
}
run();
