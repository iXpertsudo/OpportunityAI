import os
import json
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from openai import OpenAI
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Initialize OpenAI Client
try:
    openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
except Exception:
    openai_client = None

# Initialize Gemini Client
has_gemini = False
if os.environ.get("GEMINI_API_KEY"):
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
    has_gemini = True

# Strong system prompt for the AI career guide
SYSTEM_PROMPT = """You are OpportunityAI Assistant — a friendly, intelligent, and reliable AI career and opportunity guide built specifically for young people, students, and youth.

Your personality:
- Warm, encouraging, and supportive — like a smart mentor who genuinely cares
- Clear and direct — never vague, robotic, or overly technical
- Inspiring — help users see the possibilities and feel confident about their future

Your expertise covers:
- Career guidance and exploration (across all fields: STEM, arts, business, medicine, law, etc.)
- Scholarships, grants, and financial aid opportunities
- Internships and work experience programs
- Hackathons, competitions, and contests for students
- Education pathways (degrees, certifications, bootcamps, online learning)
- Skill development and personal growth
- Job searching and application tips
- Youth empowerment and motivation

How you respond:
1. Always greet warmly when the user says hi, hello, or hey
2. Introduce yourself briefly when asked who you are
3. For career questions: give a clear structured answer with role names, brief descriptions of what each involves, and what skills/education helps
4. For follow-up questions: reference the previous conversation naturally, like a real conversation
5. Organize long answers with short intro, bullet points or numbered list, brief explanation, and optional next step
6. Be encouraging — remind students that every path is valid and achievable
7. If someone seems confused or lost, gently ask a clarifying question
8. Never give the same generic answer twice — always tailor your response to what was actually asked
9. Use emojis sparingly but effectively (🎓 for education, 💼 for careers, 🚀 for opportunities, ✅ for tips)
10. Keep answers concise but informative — aim for 150–350 words unless more detail is clearly needed

Example of a great response to "What careers can I pursue in mechanical engineering?":
Start with a warm intro sentence, then list 6–8 specific roles (Mechanical Engineer, Automotive Engineer, Aerospace Engineer, Manufacturing Engineer, Robotics Engineer, HVAC Engineer, Design Engineer, Maintenance Engineer), give 1–2 sentences on each, then end with encouragement and a question like "Which of these areas interests you most?"

Remember: you are talking to young people who are exploring their futures. Be the guide they need."""

# Fallback / Mock Data List
MOCK_OPPORTUNITIES = [
    {
        "name": "Google DeepMind Scholarship",
        "category": "Scholarship",
        "description": "Full tuition coverage and mentorship for underrepresented students pursuing AI research.",
        "deadline": "Aug 15, 2024",
        "match_score": "98%",
        "detailed_info": "The Google DeepMind Scholarship program is designed to build a more diverse and inclusive AI community. It provides financial support to talented students... (Mock Data)",
        "application_steps": ["Submit online form", "Provide transcripts", "Two letters of recommendation"],
        "eligibility": ["Undergraduate or Graduate in CS", "Demonstrated AI interest", "Strong academic record"],
        "link": "https://deepmind.google/about/scholarships/"
    },
    {
        "name": "OpenAI Fall Internship",
        "category": "Internship",
        "description": "Work on cutting-edge LLMs and safety research in a fast-paced environment. Must be familiar with Python.",
        "deadline": "Sep 01, 2024",
        "match_score": "95%",
        "detailed_info": "Join the OpenAI research team for a 12-week intensive internship focusing on deep reinforcement learning, large language models, and AI alignment methodologies... (Mock Data)",
        "application_steps": ["Online application", "Coding challenge", "Three rounds of interviews"],
        "eligibility": ["Strong Python proficiency", "Solid math foundation", "Available for 12 weeks"],
        "link": "https://openai.com/careers/"
    },
    {
        "name": "Global AI Hackathon",
        "category": "Competition",
        "description": "Build an AI tool addressing climate change. $50,000 prize pool and networking opportunities.",
        "deadline": "July 20, 2024",
        "match_score": "88%",
        "detailed_info": "The Global AI Hackathon is a 48-hour sprint bringing together developers to conceive, design, and prototype an AI-driven solution addressing climate change... (Mock Data)",
        "application_steps": ["Register team online", "Join discord", "Submit repo by deadline"],
        "eligibility": ["Teams of 2 to 5", "At least one coder", "Original project"],
        "link": "https://devpost.com/"
    }
]


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/guide')
def guide():
    return render_template('guide.html')

@app.route('/api/generate', methods=['POST'])
def api_generate():
    """
    Takes user profile form data, asks OpenAI for tailored opportunities, 
    and saves the list into the session.
    """
    age = request.form.get('age')
    country = request.form.get('country')
    education = request.form.get('education')
    skills = request.form.get('skills')
    interests = request.form.get('interests')
    
    # Check if we have an API Key configured
    if not os.environ.get("OPENAI_API_KEY") and not os.environ.get("GEMINI_API_KEY"):
        # FALLBACK: Use mock data
        session['opportunities'] = MOCK_OPPORTUNITIES
        return redirect(url_for('results'))
        
    prompt = f"""
    Suggest scholarships, internships, competitions, hackathons, and training programs 
    for a student with the following profile:
    Age: {age}
    Country: {country}
    Education Level: {education}
    Skills: {skills}
    Interests: {interests}

    Return results STRICTLY as a JSON array of objects, with NO markdown formatting, 
    NO backticks, and NO trailing commas. Each object must have these exactly named keys:
    "name", "description", "category", "deadline", "detailed_info", "application_steps" (list of strings), 
    "eligibility" (list of strings), "match_score" (string percentage like "92%").
    Return 3-4 items.
    """
    
    try:
        content = ""
        if has_gemini:
            model = genai.GenerativeModel('gemini-flash-latest')
            response = model.generate_content(prompt)
            content = response.text.strip()
        else:
            response = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a career AI assistant that outputs structured JSON arrays representing opportunities."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            content = response.choices[0].message.content.strip()
            
        # Clean potential markdown wrapping
        if content.startswith("```json"):
            content = content[7:-3]
        elif content.startswith("```"):
            content = content[3:-3]
            
        opportunities = json.loads(content)
        session['opportunities'] = opportunities
        
    except Exception as e:
        print(f"Error fetching from AI: {e}")
        # Fallback if API call fails
        session['opportunities'] = MOCK_OPPORTUNITIES
        
    return redirect(url_for('results'))

@app.route('/results')
def results():
    """ Displays the generated opportunities from the session """
    opps = session.get('opportunities', [])
    return render_template('results.html', opportunities=opps)

@app.route('/opportunity/<int:opp_id>')
def opportunity_detail(opp_id):
    """ View details of a specific opportunity from the session list """
    opps = session.get('opportunities', [])
    if 0 <= opp_id < len(opps):
        opp = opps[opp_id]
        return render_template('opportunity.html', opp=opp)
    
    return redirect(url_for('results'))

@app.route('/chat', methods=['POST'])
def chat():
    """ 
    Receives JSON user query + conversation history for the Chat Assistant.
    Calls Gemini or OpenAI to produce a context-aware intelligent response.
    """
    data = request.json
    user_message = data.get('question', '').strip()
    history = data.get('history', [])  # List of {role, content} dicts

    if not user_message:
        return jsonify({"response": "I didn't catch that. Could you please rephrase?"})

    # ── Offline Fallback ──────────────────────────────────────────────────────
    if not os.environ.get("OPENAI_API_KEY") and not os.environ.get("GEMINI_API_KEY"):
        msg_lower = user_message.lower()
        if any(w in msg_lower for w in ['hi', 'hello', 'hey', 'greetings']):
            reply = ("👋 Hello! I'm OpportunityAI Assistant — your smart career and opportunity guide for young people! "
                     "I'm currently running in offline mode, so my answers are limited. "
                     "Connect an API key to unlock full AI responses. How can I help?")
        elif any(w in msg_lower for w in ['who are you', 'what are you', 'your name']):
            reply = ("I'm OpportunityAI Assistant 🤖 — an AI built to help students and youth explore careers, "
                     "scholarships, internships, hackathons, and opportunities. "
                     "(Running in offline mode — connect an API key for full capability!)")
        elif any(w in msg_lower for w in ['scholarship', 'grant', 'funding']):
            reply = ("🎓 Great question about scholarships! Some well-known options include:\n"
                     "• **Google DeepMind Scholarship** — for AI/CS students\n"
                     "• **Chevening Scholarship** — for international postgraduate study in the UK\n"
                     "• **Mastercard Foundation Scholars Program** — for African students\n"
                     "• **DAAD Scholarships** — for studying in Germany\n\n"
                     "Connect an API key and I can find ones tailored to your profile!")
        elif any(w in msg_lower for w in ['internship', 'intern', 'work experience']):
            reply = ("💼 Internships are a great way to build experience! Top programs include:\n"
                     "• Google STEP Internship\n• Microsoft Explore Internship\n"
                     "• Goldman Sachs Summer Analyst\n• UN Internships\n\n"
                     "Tell me your field and I can narrow it down!")
        elif any(w in msg_lower for w in ['career', 'job', 'profession', 'field']):
            reply = ("🚀 Exploring career paths is exciting! Popular fields for young people include:\n"
                     "• Technology & Software Engineering\n• Medicine & Healthcare\n"
                     "• Business & Entrepreneurship\n• Environmental Science\n"
                     "• Design & Creative Arts\n\nWhat are your interests or strengths?")
        else:
            reply = (f"I see you're asking about: '{user_message}'. "
                     "I'm currently in offline mode with limited responses. "
                     "Connect your Gemini or OpenAI API key to get intelligent, personalized answers! "
                     "For now, try visiting opportunities.google.com or devpost.com for active opportunities.")
        return jsonify({"response": reply})

    # ── Real AI Call ──────────────────────────────────────────────────────────
    try:
        ai_reply = ""

        if has_gemini:
            model = genai.GenerativeModel(model_name='gemini-flash-latest')

            # Build full multi-turn Gemini history
            # Inject system prompt as the very first model "preamble" turn
            gemini_history = [
                {
                    "role": "user",
                    "parts": ["Please read and follow these instructions for our entire conversation:\n\n" + SYSTEM_PROMPT]
                },
                {
                    "role": "model",
                    "parts": ["Understood! I'm OpportunityAI Assistant — your friendly AI career and opportunity guide for young people. I'm ready to help with careers, scholarships, internships, hackathons, and more. What would you like to explore today? 🚀"]
                }
            ]

            # Append the actual conversation history
            for msg in history:
                role = "user" if msg.get("role") == "user" else "model"
                gemini_history.append({
                    "role": role,
                    "parts": [msg.get("content", "")]
                })

            # Start session with full history, send the latest user message
            chat_session = model.start_chat(history=gemini_history)
            response = chat_session.send_message(user_message)
            ai_reply = response.text.strip()

        else:
            # OpenAI multi-turn
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            for msg in history:
                messages.append({
                    "role": msg.get("role", "user"),
                    "content": msg.get("content", "")
                })
            messages.append({"role": "user", "content": user_message})

            response = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.75,
                max_tokens=600
            )
            ai_reply = response.choices[0].message.content.strip()

        return jsonify({"response": ai_reply})

    except Exception as e:
        print(f"Chat API Error: {e}")
        return jsonify({"response": (
            "⚠️ I'm having a little trouble connecting right now. Please try again in a moment. "
            "If this persists, check that your API key in the .env file is valid."
        )})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
