# 🤖 OpportunityAI Implementation Guide

This guide explains how OpportunityAI uses Google Gemini (or OpenAI) to provide intelligent career discovery and assistance.

## 🧠 AI Core: Google Gemini API
OpportunityAI uses the **Gemini 2.0 Flash** model for high-speed, intelligent reasoning.

### Key Logic
The AI is integrated in `app.py` for two main purposes:

1. **Discovery Engine (`/api/generate`)**
    - Takes user input (age, skills, interests).
    - Uses a structured prompt to generate a JSON array of matching opportunities.
    - Matches users with scholarships, internships, and competitions.

2. **Career Assistant (`/chat`)**
    - Sustains a multi-turn conversation.
    - Grounded by a strong system prompt to act as a career mentor.
    - Remembers previous context for follow-up questions.

## 🛠️ Configuration
Ensure you have the following in your `.env`:
```env
GEMINI_API_KEY="AIza..."
```

## 📈 Improving Results
To refine the AI output:
- **Profile Detail**: Encourage users to provide specific skills (e.g., "React.js" instead of "Web Dev").
- **Prompt Tuning**: The system prompts in `app.py` can be adjusted to change the assistant's "voice" or the format of suggested opportunities.
