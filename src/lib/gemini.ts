import type { Message } from '@/types';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function* streamGeminiResponse(userMessage: string): AsyncGenerator<string> {
  if (!API_KEY) {
    throw new Error('Google Gemini API key not configured');
  }

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: userMessage,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Sorry, I could not generate a response.';

    // Stream the response character by character
    for (let i = 0; i < text.length; i++) {
      yield text[i];
      // Add a small delay to simulate streaming
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  } catch (error) {
    throw error;
  }
}

export async function sendMessage(message: string): Promise<string> {
  if (!API_KEY) {
    throw new Error('Google Gemini API key not configured');
  }

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Sorry, I could not generate a response.'
    );
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}
