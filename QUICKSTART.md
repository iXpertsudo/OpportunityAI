# 🚀 QUICK START GUIDE - Community SOS

## Get Started in 3 Minutes!

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Run the App
```bash
python app.py
```

### Step 3: Open in Browser
```
http://localhost:5000
```

---

## 🎯 What to Try First

1. **Home Page** - See the welcome screen and features
2. **Report Emergency** - Go to `/sos` and submit an emergency
   - Example: "Severe car accident on Main Street with multiple injuries"
   - Watch AI classify it and redirect to dashboard
3. **Dashboard** - View all reports and statistics
4. **Volunteers** - See available community helpers

---

## 🤖 AI Classification Examples

### Medical
- "Heart attack, severe chest pain at home"
- "Severe bleeding from accident"
- "Person unconscious, not breathing"

### Fire
- "House fire in my neighborhood"
- "Large building on fire downtown"
- "Smoke detected in building"

### Crime
- "Robbery in progress at store"
- "Break-in at my house"
- "Assault happening near park"

### Accident
- "Car crash on highway"
- "Motorcycle accident"
- "Multiple vehicle collision"

---

## 📋 File Structure

```
AssistCommunity/
├── app.py                  ← Main application (AI logic + Flask routes)
├── requirements.txt        ← Python dependencies
├── README.md              ← Full documentation
├── QUICKSTART.md          ← This file
├── templates/
│   ├── index.html         ← Home page
│   ├── sos.html           ← Emergency reporting
│   ├── dashboard.html     ← Live dashboard
│   └── volunteer.html     ← Volunteer list
└── static/
    └── style.css          ← Modern professional styling
```

---

## 🔧 How AI Classification Works

The app uses **scikit-learn** to classify emergencies:

```python
1. User describes emergency in SOS form
2. AI extracts keywords using TF-IDF (text analysis)
3. Naive Bayes classifier predicts category
4. Returns: Emergency Type + Confidence %
5. Save to in-memory reports list
6. Show confirmation & auto-redirect
```

**Example Flow:**
- Input: "Car crash with injuries on Highway 5"
- Processing: Extract keywords (crash, injuries, highway)
- Output: "Accident (85% confidence)"

---

## 🎨 Key Features

✅ AI Emergency Classification
✅ Real-time Dashboard
✅ Volunteer Management
✅ Beautiful Responsive Design
✅ Professional UI with Cards & Tables
✅ Auto-refreshing Statistics
✅ Mobile-Friendly Layout
✅ Success/Error Notifications
✅ Type Distribution Charts
✅ Live Emergency Feed

---

## 🌐 Pages Overview

### Home (`/`)
- Hero section with welcome message
- Features overview
- Quick navigation cards
- Statistics
- How it works explanation

### SOS (`/sos`)
- Emergency submission form
- AI auto-detection option
- Instant success confirmation
- Emergency type badges
- Important information box

### Dashboard (`/dashboard`)
- Live stats (emergencies, volunteers, assignments)
- Emergency reports table with type classification
- Type distribution visualization
- Quick action buttons
- Auto-refreshes every 10 seconds

### Volunteers (`/volunteer`)
- Volunteer cards with skills
- Availability status
- Directory table
- Skills overview matrix
- Contact information

---

## 💾 In-Memory Storage Example

```python
# Emergency Report Structure
{
    'id': 1,
    'description': 'Car crash with injuries',
    'location': 'Main St & 5th Ave',
    'type': 'Accident',           # AI-classified
    'confidence': 85,              # AI confidence
    'time': '2024-03-11 10:30:00',
    'status': 'Active'
}

# Volunteer Structure
{
    'id': 1,
    'name': 'John Doe',
    'skills': ['CPR', 'First Aid'],
    'availability': True
}
```

---

## 🔌 API Endpoints

### Get All Reports
```bash
curl http://localhost:5000/api/reports
```

### Get Dashboard Stats
```bash
curl http://localhost:5000/api/stats
```

---

## ⚙️ Switching AI Methods

### Using scikit-learn (Default)
```python
# In app.py
USE_SKLEARN = True  # ← Already set
```

### Using Google Generative AI
1. Install: `pip install google-generativeai`
2. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Update app.py:
```python
USE_SKLEARN = False
import google.generativeai as genai
genai.configure(api_key="YOUR_API_KEY")
```

---

## 🛠️ Common Customizations

### Change Primary Color (Red to Blue)
```css
/* In static/style.css */
:root {
    --primary: #0099FF;  /* Was #FF6B6B */
}
```

### Add New Volunteer
```python
# In app.py
volunteers.append({
    'id': 6,
    'name': 'Alice Wonder',
    'skills': ['Rescue', 'Paramedic'],
    'availability': True
})
```

### Add New Emergency Type
```python
# In app.py training_data
training_data = [
    # ... existing
    ("earthquake, aftershock", "Disaster"),
]
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change port in app.py: `port=8000` |
| Module not found | Run: `pip install -r requirements.txt` |
| AI not working | Check scikit-learn installed |
| Form not submitting | Clear browser cache, check console errors |
| Dashboard empty | Submit an SOS first to see data |

---

## 📦 Dependencies Explained

```
Flask==2.3.2              # Web framework
scikit-learn==1.2.2       # Machine learning (AI classification)
numpy==1.24.3             # Numerical computing (for scikit-learn)
Jinja2==3.1.2             # Template engine
```

---

## 🚀 Next Steps

1. Customize colors and branding
2. Add more sample emergencies
3. Integrate with real volunteer database
4. Add user authentication
5. Deploy to Heroku/AWS
6. Connect to Google Maps API
7. Add SMS/Email notifications
8. Implement real database (PostgreSQL)

---

## 📞 Using the App

### Submit an Emergency (Demo)
1. Click "🚨 Report Emergency"
2. Fill form with sample emergency
3. Watch AI classify it
4. See it appear on Dashboard

### View Dashboard
1. Click "Dashboard" or `/dashboard`
2. See real-time stats update
3. View all emergencies with AI types
4. Monitor volunteer assignments

### Browse Volunteers
1. Click "Volunteers" or `/volunteer`
2. See available helpers
3. Check their skills & certifications
4. View availability status

---

## 🎓 Learning Resources

- **Flask**: [flask.palletsprojects.com](https://flask.palletsprojects.com/)
- **scikit-learn**: [scikit-learn.org](https://scikit-learn.org/)
- **Jinja2**: [jinja.palletsprojects.com](https://jinja.palletsprojects.com/)

---

## ✨ Pro Tips

- Use browser DevTools (F12) to inspect elements and debug CSS
- Check Flask console for error messages
- Test with various emergency descriptions to see AI classification
- Try different browsers for cross-browser compatibility testing
- Use the Dashboard auto-refresh to monitor submissions

---

**Ready to save lives? Let's go! 🚀**

For detailed documentation, see [README.md](README.md)
