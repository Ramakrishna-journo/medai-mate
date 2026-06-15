import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured on the server.' }, { status: 500 })
    }

    // Initialize the official Google Gen AI SDK
    const ai = new GoogleGenAI({ apiKey })

    // Provide some context to the AI about its role
    const systemInstruction = `
      You are MedAI Mate, an expert editorial assistant for a modern newsroom. 
      You help journalists, editors, and producers brainstorm story ideas, refine headlines, suggest formats (Video, Text, Reel), and provide data insights.
      Keep your responses extremely concise, professional, and action-oriented. Format with clear bullet points.
    `

    // We combine the system instruction with the user message since the standard generateContent doesn't always have a separate system prompt field depending on the model tier, but Gemini 1.5 Pro/Flash supports it via config.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
            systemInstruction: systemInstruction,
            maxOutputTokens: 250, // Added to conserve free tier tokens
        }
    })

    return NextResponse.json({ response: response.text })
  } catch (error: any) {
    console.error('Gemini API Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate AI response' }, { status: 500 })
  }
}
