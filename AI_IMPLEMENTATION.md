# 🤖 AI IMPLEMENTATION GUIDE - Emergency Classification

## Overview

This guide explains how the AI emergency classification system works in Community SOS and how to customize it.

---

## Current Implementation: scikit-learn

### What is scikit-learn?

**scikit-learn** is a free, open-source Python machine learning library that provides:
- Vectorization (converting text to numbers)
- Classification algorithms
- Training and prediction capabilities
- No internet connection required
- Fast local processing

### Architecture

```
User Input (Emergency Description)
    ↓
Text Preprocessing
    ↓
TF-IDF Vectorization (converts words to numerical features)
    ↓
Naive Bayes Classifier (predicts category)
    ↓
Output: Emergency Type + Confidence %
    ↓
Display to User
```

### Code Walkthrough

#### 1. Training the Classifier

```python
def initialize_ai_classifier():
    """Initialize emergency classification model using scikit-learn."""
    
    # Step 1: Sample training data
    training_data = [
        ("heart attack, chest pain", "Medical"),
        ("severe bleeding, injury", "Medical"),
        ("difficulty breathing", "Medical"),
        ("house fire, flames", "Fire"),
        ("car crash, collision", "Accident"),
        ("robbery, theft", "Crime"),
    ]

    # Step 2: Separate descriptions and categories
    descriptions = [item[0] for item in training_data]  # Text
    categories = [item[1] for item in training_data]     # Labels

    # Step 3: Create classification pipeline
    classifier = Pipeline([
        ('tfidf', TfidfVectorizer(
            lowercase=True,           # Normalize case
            stop_words='english'      # Remove common words
        )),
        ('nb', MultinomialNB())       # Naive Bayes classifier
    ])

    # Step 4: Train the model
    classifier.fit(descriptions, categories)
    
    return classifier
```

#### 2. Making Predictions

```python
def classify_emergency_sklearn(description):
    """Classify emergency using scikit-learn."""
    
    # Access the loaded classifier
    if not hasattr(app, 'classifier'):
        app.classifier = initialize_ai_classifier()

    try:
        # Predict the category
        prediction = app.classifier.predict([description])[0]
        
        # Get confidence score (0-1, multiply by 100 for percentage)
        confidence = max(
            app.classifier.predict_proba([description])[0]
        ) * 100
        
        return prediction, confidence
        
    except Exception as e:
        print(f"Error in classification: {e}")
        return "Unknown", 0
```

### Example Flow

```python
# User submits: "Person unconscious and not breathing"

# Processing:
description = "Person unconscious and not breathing"

# TF-IDF converts to numerical vector:
# [unconscious: 0.5, person: 0.3, breathing: 0.8, ...]

# Naive Bayes compares to training data:
# Similar to: "unconscious person", "difficulty breathing"
# → Medical category

# Output:
prediction = "Medical"
confidence = 92.5  # 92.5% confidence
```

---

## Alternative: Google Generative AI

### What is Google Generative AI?

**Google Generative AI** (Gemini API) provides:
- Advanced language understanding
- More sophisticated classification
- Natural language processing
- Requires API key and internet connection
- Potentially more accurate for edge cases

### Setup Instructions

#### Step 1: Get API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API key"
3. Copy the key

#### Step 2: Install Package

```bash
pip install google-generativeai
```

#### Step 3: Configure in app.py

```python
# At the top of app.py
USE_SKLEARN = False  # Switch to Google AI

import google.generativeai as genai
genai.configure(api_key="YOUR_API_KEY_HERE")
```

#### Step 4: Implementation

```python
def classify_emergency_google_ai(description):
    """Classify emergency using Google Generative AI."""
    
    try:
        # Load Gemini model
        model = genai.GenerativeModel('gemini-pro')
        
        # Create prompt for classification
        prompt = f"""Classify the following emergency into exactly ONE category: 
        Medical, Fire, Crime, or Accident.
        
        Emergency Description: {description}
        
        Respond with ONLY the category name and confidence percentage.
        Format: CATEGORY (XX%)
        
        Examples:
        - "Medical (85%)"
        - "Fire (92%)"
        - "Accident (78%)"
        """
        
        # Get response from Gemini
        response = model.generate_content(prompt)
        result = response.text.strip()
        
        # Parse response
        if "Medical" in result:
            return "Medical", 85
        elif "Fire" in result:
            return "Fire", 85
        elif "Crime" in result:
            return "Crime", 85
        elif "Accident" in result:
            return "Accident", 85
        else:
            return "Unknown", 0
            
    except Exception as e:
        print(f"Google AI Error: {e}")
        return "Unknown", 0
```

### Cost Comparison

| Method | Cost | Speed | Accuracy | Requirements |
|--------|------|-------|----------|--------------|
| scikit-learn | Free | ⚡ Fast | ~85% | Training data |
| Google Generative AI | ~$0.001-0.01 per call | Medium | ~95% | API key, internet |

---

## Improving Classification Accuracy

### Method 1: Add More Training Data

```python
training_data = [
    # Medical - Expand with more examples
    ("my heart is racing, pounding", "Medical"),
    ("can't breathe, asthma attack", "Medical"),
    ("diabetic emergency, blood sugar", "Medical"),
    ("allergic reaction, anaphylaxis", "Medical"),
    ("overdose, poisoning", "Medical"),
    ("choking, unable to swallow", "Medical"),
    
    # Fire - More variations
    ("smoke coming from walls", "Fire"),
    ("electrical fire, sparking", "Fire"),
    ("forest fire approaching", "Fire"),
    
    # Crime - More variations
    ("mugging, robbery", "Crime"),
    ("home invasion", "Crime"),
    ("domestic violence", "Crime"),
    ("suspicious person stalking", "Crime"),
    
    # Accident - More variations
    ("structure collapse", "Accident"),
    ("train derailment", "Accident"),
    ("workplace injury", "Accident"),
]
```

### Method 2: Improve Text Preprocessing

```python
from sklearn.feature_extraction.text import TfidfVectorizer

# Enhanced vectorizer
vectorizer = TfidfVectorizer(
    lowercase=True,              # Normalize case
    stop_words='english',        # Remove common words
    max_features=1000,           # Limit features
    ngram_range=(1, 2),          # Include bigrams (2-word phrases)
    min_df=1,                    # Include rare words
    max_df=0.8,                  # Ignore too-common terms
    sublinear_tf=True            # Apply sublinear scaling
)
```

### Method 3: Use Different Classifiers

```python
# Instead of Naive Bayes, try other classifiers:

from sklearn.svm import LinearSVC  # Support Vector Machine
from sklearn.ensemble import RandomForestClassifier  # Random Forest
from sklearn.linear_model import LogisticRegression  # Logistic Regression

# Example: Using Random Forest (often more accurate)
classifier = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('rf', RandomForestClassifier(n_estimators=100))
])
```

### Method 4: Ensemble Method (Combine Multiple Models)

```python
from sklearn.ensemble import VotingClassifier

# Train multiple classifiers
nb = MultinomialNB()
svm = LinearSVC()
rf = RandomForestClassifier()

# Combine them
ensemble = VotingClassifier(
    estimators=[('nb', nb), ('svm', svm), ('rf', rf)],
    voting='soft'  # Use probability averaging
)

classifier = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('ensemble', ensemble)
])
```

---

## Testing the Classifier

### Test Cases

```python
# Create a test function
def test_classifier():
    classifier = initialize_ai_classifier()
    
    test_cases = [
        # (input, expected_output)
        ("heart attack", "Medical"),
        ("fire in building", "Fire"),
        ("car crash", "Accident"),
        ("robbery", "Crime"),
        ("severe bleeding", "Medical"),
        ("house burning", "Fire"),
        ("hit by truck", "Accident"),
        ("burglary at home", "Crime"),
    ]
    
    correct = 0
    for description, expected in test_cases:
        prediction, confidence = classify_emergency_sklearn(description)
        is_correct = prediction == expected
        correct += is_correct
        
        print(f"Input: '{description}'")
        print(f"Expected: {expected}, Got: {prediction} ({confidence}%)")
        print(f"Status: {'✅ PASS' if is_correct else '❌ FAIL'}")
        print()
    
    accuracy = (correct / len(test_cases)) * 100
    print(f"Overall Accuracy: {accuracy}%")

# Run tests
test_classifier()
```

---

## Performance Optimization

### 1. Cache the Classifier

```python
# In app.py - Global cache
_classifier_cache = None

def get_classifier():
    """Get or initialize classifier (cached)."""
    global _classifier_cache
    if _classifier_cache is None:
        _classifier_cache = initialize_ai_classifier()
    return _classifier_cache
```

### 2. Batch Processing

```python
# Process multiple emergencies at once
def classify_batch(descriptions):
    """Classify multiple emergencies efficiently."""
    classifier = get_classifier()
    predictions = classifier.predict(descriptions)
    confidences = classifier.predict_proba(descriptions)
    
    results = []
    for pred, conf in zip(predictions, confidences):
        max_conf = max(conf) * 100
        results.append((pred, max_conf))
    
    return results
```

### 3. Caching Predictions

```python
from functools import lru_cache

@lru_cache(maxsize=1000)
def classify_emergency_cached(description):
    """Cache classification results."""
    return classify_emergency(description)
```

---

## Advanced Features

### 1. Confidence Threshold

```python
def classify_with_threshold(description, threshold=80):
    """Only accept predictions above confidence threshold."""
    prediction, confidence = classify_emergency(description)
    
    if confidence >= threshold:
        return prediction, confidence
    else:
        # Ask user for confirmation if confidence is low
        return "Unknown (Low Confidence)", confidence
```

### 2. Emergency Severity Scoring

```python
def get_severity_score(description, emergency_type):
    """Calculate severity (1-10 scale)."""
    
    severity_keywords = {
        "unconscious": 10,
        "not breathing": 10,
        "severe bleeding": 9,
        "fire": 8,
        "collapse": 9,
        "injury": 6,
        "pain": 5,
    }
    
    score = 2  # default
    desc_lower = description.lower()
    
    for keyword, severity in severity_keywords.items():
        if keyword in desc_lower:
            score = max(score, severity)
    
    return score
```

### 3. Emergency Priority Queuing

```python
def prioritize_emergencies(reports):
    """Sort emergencies by priority."""
    
    priority_weights = {
        "Medical": 10,
        "Fire": 9,
        "Accident": 8,
        "Crime": 7,
    }
    
    # Sort by: weight × confidence × severity
    def calculate_priority(report):
        weight = priority_weights.get(report['type'], 0)
        priority = weight * (report['confidence'] / 100)
        return priority
    
    return sorted(reports, key=calculate_priority, reverse=True)
```

---

## Deployment Considerations

### 1. Load Model Once

```python
# Load classifier on app startup, not per request
@app.before_first_request
def initialize():
    app.classifier = initialize_ai_classifier()
```

### 2. Error Handling

```python
try:
    prediction, confidence = classify_emergency(description)
except ValueError:
    prediction, confidence = "Unknown", 0
except Exception as e:
    logger.error(f"Classification error: {e}")
    prediction, confidence = "Unknown", 0
```

### 3. Logging

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def classify_emergency(description):
    """Classify with logging."""
    try:
        prediction, confidence = classify_emergency_sklearn(description)
        logger.info(f"Classified: {description[:50]}... → {prediction} ({confidence}%)")
        return prediction, confidence
    except Exception as e:
        logger.error(f"Classification failed: {e}")
        return "Unknown", 0
```

---

## Switching Between Methods

### In Code

```python
# If using scikit-learn (default)
if USE_SKLEARN:
    prediction, confidence = classify_emergency_sklearn(description)

# If using Google AI
else:
    prediction, confidence = classify_emergency_google_ai(description)
```

### Runtime Switch

```python
# Add endpoint to toggle AI method
@app.route('/api/config/ai-method', methods=['POST'])
def set_ai_method():
    global USE_SKLEARN
    method = request.json.get('method')  # 'sklearn' or 'google'
    USE_SKLEARN = (method == 'sklearn')
    return jsonify({'success': True, 'method': method})
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Low accuracy | Add more training data, try different classifiers |
| Slow prediction | Cache classifier, batch process, reduce features |
| Wrong classification | Review training data, add edge cases |
| API key errors (Google) | Check key validity, rate limits |
| Memory issues | Use smaller model, implement caching |

---

## Best Practices

1. ✅ Always validate input before classification
2. ✅ Log all predictions for monitoring
3. ✅ Use a threshold to handle low-confidence predictions
4. ✅ Regularly retrain with new data
5. ✅ Monitor accuracy metrics
6. ✅ Have fallback for API failures
7. ✅ Cache expensive computations
8. ✅ Test edge cases and ambiguous inputs
9. ✅ Keep training data balanced across categories
10. ✅ Document all customizations

---

## Resources

- [scikit-learn Documentation](https://scikit-learn.org/stable/documentation.html)
- [Google Generative AI](https://ai.google.dev/tutorials/python_quickstart)
- [TF-IDF Explained](https://en.wikipedia.org/wiki/Tf%E2%80%93idf)
- [Naive Bayes Classifier](https://en.wikipedia.org/wiki/Naive_Bayes_classifier)
- [ML Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)

---

**Happy classifying! 🤖**
