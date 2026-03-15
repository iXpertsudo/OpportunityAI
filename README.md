# 🧠 OpportunityAI - AI-Powered Career Discovery

Unlock your future with OpportunityAI. A modern, AI-powered platform that helps young people discover scholarships, internships, hackathons, and career paths tailored to their unique profile.

## Features

### ✅ Core Features
- **🎯 AI Profile Analysis**: Targeted recommendations based on age, education, skills, and interests.
- **🤖 AI Career Assistant**: An intelligent chatbot that provides guidance and answers follow-up questions about various career paths.
- **🚀 Opportunity Scanner**: Real-time discovery of scholarships, internships, and competitions.
- **📊 Career Extrapolation**: predictive modeling suggests future roles based on aptitude.
- **🎯 Professional UI**: Premium, dark-themed glassmorphism design with interactive 3D particle effects.

### 🔧 Technical Features
- Built with **Flask** (Python web framework)
- **Google Gemini API** (or OpenAI) for intelligent recommendations and chat
- **SQLite** database for persistent storage
- **Responsive Design**: Modern CSS with glassmorphism and animations
- **Interactive Assistant**: Multi-turn conversation capability

---

## Installation

### Prerequisites
- Python 3.10+
- EITHER Google Gemini API key OR OpenAI API key

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd AssistCommunity
```

### Step 2: Set Up Virtual Environment
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY="your_gemini_api_key"
# OR
OPENAI_API_KEY="your_openai_api_key"
```

### Step 5: Run the Application
```bash
python app.py
```
Go to `http://localhost:5000` to start exploring.

---

## Project Structure
```
AssistCommunity/
├── app.py                  # Flask backend & AI logic
├── static/                 # CSS, JS, and Images
│   ├── styles.css          # Modern UI styling
│   └── script.js           # Frontend logic & Chatbot
├── templates/              # HTML Templates
│   ├── index.html          # Landing & discovery page
│   ├── profile.html        # Detailed profile form
│   ├── results.html        # AI recommendations display
│   ├── opportunity.html    # Opportunity detail view
│   └── guide.html          # Career guide page
├── .env                    # API keys (Keep private!)
└── requirements.txt        # Python packages
```

---

## AI Capability
OpportunityAI leverages the **Gemini 2.0 Flash** model (with fallback options) to provide:
1. **Personalized Matching**: Analyzing user profiles against a vast space of opportunities.
2. **Contextual Chat**: A smart assistant that understands conversation history.
3. **Structured Data**: Converting complex career queries into easy-to-read guides.

---

## Troubleshooting
- **API Errors**: Ensure your `.env` file has a valid API key and you have quota remaining.
- **ModuleNotFoundError**: Ensure you've activated the virtual environment and run `pip install -r requirements.txt`.
- **Database Issues**: If `db.sqlite3` is corrupted, you can delete it and restart the app to reinitialize.

---

## Future Enhancements
- [ ] User authentication and saved favorites
- [ ] Automated application tracking
- [ ] Integration with LinkedIn for profile importing
- [ ] SMS/Email alerts for new matching opportunities

---

## License
This project is licensed under the MIT License.

---

**Built with ❤️ by the OpportunityAI Team**
