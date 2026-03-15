# 🆘 Community SOS - Flask Web App

A modern, AI-powered emergency response system that connects emergency victims with trained community volunteers.

## Features

### ✅ Core Features
- **🚨 SOS Submission**: Quick emergency reporting with AI classification
- **🤖 AI Classification**: Automatic emergency categorization (Medical, Fire, Crime, Accident)
- **📊 Real-time Dashboard**: Monitor all emergencies and volunteer assignments
- **👥 Volunteer Management**: View and manage community volunteers
- **⚡ Instant Response**: AI-powered dispatch system for faster help
- **🎯 Professional UI**: Modern, hackathon-ready design with responsive layout

### 🔧 Technical Features
- Built with **Flask** (Python web framework)
- **scikit-learn** for AI emergency classification
- Optional **Google Generative AI** integration
- In-memory storage (extendable to database)
- Responsive design with modern CSS
- Real-time dashboard with auto-refresh

---

## Installation

### Prerequisites
- Python 3.8+
- pip (Python package manager)

### Step 1: Clone or Download This Project

```bash
cd AssistCommunity
```

### Step 2: Create Virtual Environment (Recommended)

On Windows:
```bash
python -m venv venv
venv\Scripts\activate
```

On macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Run the Application

```bash
python app.py
```

The app will start on `http://localhost:5000`

---

## Usage

### Home Page (`/`)
- Welcome message and navigation
- Quick links to SOS, Dashboard, and Volunteers
- Feature overview and statistics

### SOS Page (`/sos`)
1. Click on **"🚨 Report Emergency"** or go to `/sos`
2. Fill in:
   - **Description**: Detailed description of emergency
   - **Location**: Your location
   - **Type** (optional): Emergency type (AI auto-detects if not provided)
3. Click **"SUBMIT SOS"**
4. Get instant confirmation with AI-classified emergency type
5. Automatically redirected to Dashboard

### Dashboard (`/dashboard`)
- **Stats Cards**: Total emergencies, volunteers, assigned, unassigned
- **Emergency Reports Table**: All submitted emergencies with type, location, time
- **Type Distribution**: Visual breakdown of emergency types
- **Real-time Auto-refresh**: Updates every 10 seconds

### Volunteers Page (`/volunteer`)
- Browse community volunteers
- View skills and certifications
- Check availability status
- Skills overview matrix

---

## AI Classification

### Option A: scikit-learn (Default - Recommended)

The app uses **scikit-learn's Naive Bayes classifier** with TF-IDF vectorizer to classify emergencies.

**Advantages:**
- No API key needed
- Fast local processing
- Free to use
- Works offline

**How it works:**
```python
# Training on sample emergency descriptions
emergency_descriptions = [
    ("heart attack, chest pain", "Medical"),
    ("house fire, flames", "Fire"),
    ("robbery, theft", "Crime"),
    ("car accident, collision", "Accident")
]

# Pipeline: TF-IDF → Naive Bayes
classifier = Pipeline([
    ('tfidf', TfidfVectorizer(...)),
    ('nb', MultinomialNB())
])
```

### Option B: Google Generative AI

To use Google Generative AI instead:

1. **Install package**:
   ```bash
   pip install google-generativeai
   ```

2. **Get API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key

3. **Configure in `app.py`**:
   ```python
   # At the top of app.py
   USE_SKLEARN = False  # Change to False

   import google.generativeai as genai
   genai.configure(api_key="YOUR_API_KEY_HERE")
   ```

---

## Project Structure

```
AssistCommunity/
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── README.md                   # This file
├── templates/                  # HTML templates
│   ├── index.html             # Home page
│   ├── sos.html               # SOS submission
│   ├── dashboard.html         # Dashboard
│   └── volunteer.html         # Volunteers
└── static/                    # Static files
    └── style.css              # Styling
```

---

## API Endpoints

### Web Routes
- `GET /` - Home page
- `GET/POST /sos` - SOS submission page
- `GET /dashboard` - Emergency dashboard
- `GET /volunteer` - Volunteers page

### API Endpoints
- `GET /api/reports` - Get all emergency reports (JSON)
- `GET /api/stats` - Get dashboard statistics (JSON)

---

## In-Memory Storage

The app stores data in memory (lost on restart):

```python
reports = []      # Emergency reports
volunteers = []   # Volunteer list
```

### Upgrade to Database

To use a real database (e.g., SQLite, PostgreSQL):

1. Add ORM (SQLAlchemy recommended)
2. Create database models
3. Replace in-memory lists with database queries

Example with SQLAlchemy:
```python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy(app)

class Emergency(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String)
    location = db.Column(db.String)
    type = db.Column(db.String)
    time = db.Column(db.DateTime)
    status = db.Column(db.String)
```

---

## Customization

### Change Colors
Edit CSS variables in `static/style.css`:

```css
:root {
    --primary: #FF6B6B;        /* Red - Emergency */
    --secondary: #4ECDC4;      /* Teal - Accent */
    --success: #2ECC71;        /* Green - Success */
    /* ... more colors */
}
```

### Add New Emergency Types
In `app.py`, add to training data:

```python
training_data = [
    # ... existing entries
    ("natural disaster, earthquake", "Disaster"),  # New type
]
```

### Add Volunteers
In `app.py`:

```python
volunteers = [
    {"id": 6, "name": "Frank Brown", "skills": ["Rescue", "Water Safety"], "availability": True},
    # ... more volunteers
]
```

### Customize Email/Notifications
Add email integration:

```python
from flask_mail import Mail, Message

# Configure and send emails to volunteers/admins
```

---

## Deployment

### Heroku Deployment

1. Create `Procfile`:
   ```
   web: gunicorn app:app
   ```

2. Create `runtime.txt`:
   ```
   python-3.11.0
   ```

3. Deploy:
   ```bash
   heroku login
   heroku create your-app-name
   git push heroku main
   ```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
```

Run:
```bash
docker build -t community-sos .
docker run -p 5000:5000 community-sos
```

---

## Troubleshooting

### Port Already in Use
```bash
# Change port in app.py
app.run(debug=True, host='0.0.0.0', port=8000)
```

### scikit-learn Not Found
```bash
pip install scikit-learn
```

### Google AI API Errors
- Check API key is correctly set
- Ensure package is installed: `pip install google-generativeai`
- Check internet connection

### Database Errors
- Clear cookies/cache
- Restart the Flask app
- Reset in-memory data by restarting

---

## Future Enhancements

- [ ] Real database integration (PostgreSQL/MongoDB)
- [ ] User authentication & authorization
- [ ] Email/SMS notifications
- [ ] Mobile app version
- [ ] Advanced analytics & reporting
- [ ] Integration with Google Maps API
- [ ] Machine learning model improvements
- [ ] Multi-language support
- [ ] Emergency history & archiving
- [ ] Volunteer ratings & reviews
- [ ] Payment integration for donations
- [ ] Webhook integrations with external systems

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Flask |
| Frontend | HTML5 + CSS3 + JavaScript |
| AI/ML | scikit-learn (Naive Bayes) |
| Templating | Jinja2 |
| Styling | Custom CSS (Responsive) |
| Optional AI | Google Generative AI |

---

## Contributing

Contributions are welcome! Feel free to:
1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

This project is open source and available under the MIT License.

---

## Author

**Community SOS Dev Team**

Built as a hackathon-ready emergency response system.

---

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review code comments for AI implementation details

---

## Disclaimer

⚠️ **Important**: This is a demo application. In real emergencies, always call official emergency services (911 in the US).

---

**Happy coding! 🚀**
