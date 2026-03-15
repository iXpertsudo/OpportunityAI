# ⚡ OpportunityAI Quickstart

Get OpportunityAI up and running in less than 3 minutes.

## 1️⃣ Quick Setup (Windows)
```bash
# Clone and enter
cd AssistCommunity

# Create and activate venv
python -m venv venv
venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Create .env and add key
echo GEMINI_API_KEY="your_key" > .env

# Run!
python app.py
```

## 2️⃣ Key URLs
- **Main App**: `http://localhost:5000`
- **Career Guide**: `http://localhost:5000/guide`
- **AI Chatbot**: Available in the bottom-right of every page.

## 3️⃣ Pro Tips
- Use the **AI Profile Analyzer** on the home page for tailored matches.
- The **Assistant** remembers your chat history—ask follow-up questions!
- Check `AI_IMPLEMENTATION.md` for technical deep-dive.
