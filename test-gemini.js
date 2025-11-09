// Simple test script to verify Gemini API integration
// Run with: node test-gemini.js

const GEMINI_API_KEY = 'AIzaSyDSO4p4MmOi9vD3BoMoj68wf2tndJvgZcQ';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

async function testGeminiAPI() {
  console.log('Testing Gemini API connection...\n');

  const testMessage = {
    contents: [
      {
        role: 'user',
        parts: [{ text: 'Hello! I am feeling anxious today. Can you help me?' }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMessage)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error:', errorData);
      console.error('Status:', response.status, response.statusText);
      return false;
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      console.log('✅ API Connection Successful!\n');
      console.log('Test Question: "Hello! I am feeling anxious today. Can you help me?"\n');
      console.log('AI Response:', aiResponse);
      console.log('\n✅ Gemini API is working correctly!');
      return true;
    }

    console.error('❌ Unexpected response format');
    return false;
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    return false;
  }
}

testGeminiAPI();
