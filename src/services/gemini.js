const GEMINI_API_KEY = 'AIzaSyAoJzQB5aPTPDCnyKwVwTtlFkEC-LWv4gE';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// System prompt to configure Gemini as a therapist
const THERAPIST_SYSTEM_PROMPT = `You are a compassionate, empathetic, and professional mental health therapist. Your role is to:

1. Listen actively and validate the user's feelings without judgment
2. Ask thoughtful, open-ended questions to help users explore their emotions
3. Provide evidence-based coping strategies and techniques when appropriate
4. Maintain a warm, supportive, and non-judgmental tone
5. Encourage self-reflection and personal growth
6. Recognize when professional help might be needed and gently suggest it
7. Keep responses concise but meaningful (2-4 sentences typically)
8. Use empathetic language and show genuine care
9. Never diagnose or prescribe medication
10. Focus on emotional support, active listening, and therapeutic techniques like CBT, mindfulness, and positive psychology

Remember: You are here to support, not to fix. Help users feel heard, understood, and empowered.`;

/**
 * Send a message to Gemini API and get a therapist-style response
 * @param {Array} messages - Array of message objects with role and content
 * @returns {Promise<string>} - The AI response text
 */
export const getGeminiResponse = async (messages) => {
  try {
    // Format messages for Gemini API
    // Gemini expects a specific format with "parts" containing text
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Add system prompt as the first user message if this is the start of conversation
    const contents = [
      {
        role: 'user',
        parts: [{ text: THERAPIST_SYSTEM_PROMPT }]
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I will act as a compassionate mental health therapist, providing empathetic support and guidance. How can I help you today?' }]
      },
      ...formattedMessages
    ];

    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_NONE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE'
        }
      ]
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the text from Gemini's response
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        return candidate.content.parts[0].text;
      }
    }

    throw new Error('Unexpected response format from Gemini API');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

/**
 * Test the Gemini API connection
 * @returns {Promise<boolean>} - True if connection is successful
 */
export const testGeminiConnection = async () => {
  try {
    const testMessages = [
      { role: 'user', content: 'Hello, can you hear me?' }
    ];
    const response = await getGeminiResponse(testMessages);
    console.log('Gemini API Test Response:', response);
    return true;
  } catch (error) {
    console.error('Gemini API Test Failed:', error);
    return false;
  }
};
