// --- 3D Particle/Node Network (Hero Canvas) ---
const canvas = document.getElementById('hero-canvas');
let ctx = null;
if (canvas) {
    ctx = canvas.getContext('2d');
}

let particles = [];
let mouse = {
    x: null,
    y: null,
    radius: 150
};

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 50;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 50;
                }
            }
        }
    }

    draw() {
        ctx.fillStyle = 'rgba(14, 165, 233, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    let numberOfParticles = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = dx * dx + dy * dy;

            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                let opacity = 1 - (distance / 20000);
                ctx.strokeStyle = `rgba(109, 40, 217, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
}

if (canvas) {
    initParticles();
    animateParticles();
}

// --- Scroll Reveal Animation ---
const revealElements = document.querySelectorAll('.reveal');

function checkReveal() {
    const triggerBottom = window.innerHeight * 0.85;
    revealElements.forEach(el => {
        const elTop = el.getBoundingClientRect().top;
        if (elTop < triggerBottom) {
            el.classList.add('active');
        }
    });
}
window.addEventListener('scroll', checkReveal);
checkReveal();

// --- Backend Integrated Form Handling ---
const form = document.getElementById('ai-profile-form');
const btnLoader = document.querySelector('.btn-loader');
const aiIcon = document.querySelector('.ai-submit-btn .fa-wand-magic-sparkles');

if (form) {
    form.addEventListener('submit', (e) => {
        if (btnLoader && aiIcon) {
            aiIcon.classList.add('hidden');
            btnLoader.classList.remove('hidden');
            const submitBtn = btnLoader.closest('button');
            if (submitBtn) {
                const textSpan = submitBtn.querySelector('span');
                if (textSpan) textSpan.textContent = 'Processing...';
            }
        }
    });
}


// ═══════════════════════════════════════════════════════════
//  CHATBOT — Intelligent Multi-turn AI Assistant
// ═══════════════════════════════════════════════════════════

const chatbotWindow = document.getElementById('chatbot-window');
const chatBody = document.getElementById('chat-body');
const chatInput = document.getElementById('chat-input');

// Conversation history for multi-turn context
let chatHistory = [];
let chatbotInitialized = false;

// Markdown-to-HTML parser (lightweight)
function parseMarkdown(text) {
    // Escape raw HTML first for security
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Bold: **text** or __text__
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italic: *text* or _text_
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // Split lines for list detection
    const lines = html.split('\n');
    const result = [];
    let inUl = false;
    let inOl = false;

    lines.forEach(line => {
        const ulMatch = line.match(/^[\*\-•]\s+(.+)/);
        const olMatch = line.match(/^\d+\.\s+(.+)/);

        if (ulMatch) {
            if (!inUl) { result.push('<ul>'); inUl = true; }
            if (inOl) { result.push('</ol>'); inOl = false; }
            result.push(`<li>${ulMatch[1]}</li>`);
        } else if (olMatch) {
            if (!inOl) { result.push('<ol>'); inOl = true; }
            if (inUl) { result.push('</ul>'); inUl = false; }
            result.push(`<li>${olMatch[1]}</li>`);
        } else {
            if (inUl) { result.push('</ul>'); inUl = false; }
            if (inOl) { result.push('</ol>'); inOl = false; }
            if (line.trim() === '') {
                result.push('<br>');
            } else {
                result.push(`<p>${line}</p>`);
            }
        }
    });

    if (inUl) result.push('</ul>');
    if (inOl) result.push('</ol>');

    return result.join('');
}

// Smooth character-by-character typing animation
function typeMessage(container, text, onComplete) {
    const html = parseMarkdown(text);
    // Temporarily render full html for measurement, then animate
    container.innerHTML = '';
    
    let charIndex = 0;
    const plainChars = text.split('');
    const totalChars = plainChars.length;

    // We animate by revealing characters of the raw text,
    // then do a final full render once done (for accurate markdown)
    const tempSpan = document.createElement('span');
    tempSpan.style.whiteSpace = 'pre-wrap';
    container.appendChild(tempSpan);

    function typeNext() {
        if (charIndex < totalChars) {
            tempSpan.textContent += plainChars[charIndex];
            charIndex++;
            chatBody.scrollTop = chatBody.scrollHeight;
            // Speed: faster for short messages, a touch slower for long
            const delay = totalChars < 100 ? 18 : 10;
            setTimeout(typeNext, delay);
        } else {
            // Replace plain text render with proper markdown
            container.innerHTML = parseMarkdown(text);
            chatBody.scrollTop = chatBody.scrollHeight;
            if (onComplete) onComplete();
        }
    }
    typeNext();
}

// Append a chat bubble
function appendMessage(text, className, animate = false) {
    const msg = document.createElement('div');
    msg.className = `message ${className} message-enter`;
    chatBody.appendChild(msg);

    if (animate && className === 'ai-message') {
        typeMessage(msg, text);
    } else {
        if (className === 'ai-message') {
            msg.innerHTML = parseMarkdown(text);
        } else {
            // User messages — plain text for safety
            msg.textContent = text;
        }
    }

    chatBody.scrollTop = chatBody.scrollHeight;
    // Trigger enter animation
    requestAnimationFrame(() => msg.classList.add('message-visible'));
    return msg;
}

// Show/hide chatbot
function toggleChat(e) {
    if (e) e.preventDefault();
    chatbotWindow.classList.toggle('hidden');

    if (!chatbotWindow.classList.contains('hidden')) {
        chatInput.focus();
        if (!chatbotInitialized) {
            showWelcomeMessage();
        }
    }
}

function showWelcomeMessage() {
    const welcome = "Hello! I'm your AI career guide. 🎓 I'm here to help you explore careers, scholarships, internships, and opportunities that match your interests. Ask me anything!";
    appendMessage(welcome, 'ai-message', true);
    chatbotInitialized = true;
}

// Main send function
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Append user bubble
    appendMessage(text, 'user-message');
    chatInput.value = '';
    chatInput.disabled = true;

    // Add user turn to local history BEFORE sending
    // (We'll add the AI reply after we get it)
    const historyToSend = [...chatHistory];

    // Show typing indicator
    const typingMsg = document.createElement('div');
    typingMsg.className = 'message ai-message';
    typingMsg.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    chatBody.appendChild(typingMsg);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: text,
                history: historyToSend
            })
        });

        const data = await response.json();
        chatBody.removeChild(typingMsg);

        const aiReply = data.response || "I'm sorry, I couldn't generate a response.";

        // Update local history with user message + AI reply
        chatHistory.push({ role: 'user', content: text });
        chatHistory.push({ role: 'model', content: aiReply });

        // Keep history bounded to last 20 turns (10 exchanges) to avoid huge payloads
        if (chatHistory.length > 20) {
            chatHistory = chatHistory.slice(chatHistory.length - 20);
        }

        appendMessage(aiReply, 'ai-message', true);

    } catch (error) {
        chatBody.removeChild(typingMsg);
        appendMessage("⚠️ Connection error. Please make sure the server is running and try again.", 'ai-message');
        console.error("Chat Error:", error);
    } finally {
        chatInput.disabled = false;
        chatInput.focus();
    }
}

// Enter to send, Shift+Enter for newline
if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}

// Auto-show welcome message when page loads (chatbot starts visible or on first open)
window.addEventListener('load', () => {
    // Delay slightly so page renders first
    setTimeout(() => {
        if (!chatbotInitialized && chatbotWindow && !chatbotWindow.classList.contains('hidden')) {
            showWelcomeMessage();
        }
    }, 800);
});


// --- Modal Logic ---
const modalOverlay = document.getElementById('opportunity-modal');
const modalTitle = document.getElementById('modal-title');
const modalIcon = document.getElementById('modal-icon');
const modalCategory = document.getElementById('modal-category');
const modalMatchScore = document.getElementById('modal-match-score');
const modalDescription = document.getElementById('modal-description');
const modalRequirements = document.getElementById('modal-requirements');
const modalBenefits = document.getElementById('modal-benefits');
const modalDeadlineText = document.getElementById('modal-deadline-text');
const modalApplyBtn = document.getElementById('modal-apply-btn');

function openModal(opportunity) {
    modalTitle.textContent = opportunity.title;
    modalIcon.innerHTML = `<i class="fa-brands ${opportunity.icon} fa-solid ${opportunity.icon}"></i>`;
    modalCategory.textContent = opportunity.category;
    modalMatchScore.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${opportunity.matchValue}% Match`;
    modalDescription.textContent = opportunity.fullDescription;
    modalDeadlineText.textContent = opportunity.deadline;
    modalApplyBtn.href = opportunity.applyLink;

    modalRequirements.innerHTML = '';
    opportunity.requirements.forEach(req => {
        const li = document.createElement('li');
        li.textContent = req;
        modalRequirements.appendChild(li);
    });

    modalBenefits.innerHTML = '';
    opportunity.benefits.forEach(ben => {
        const li = document.createElement('li');
        li.textContent = ben;
        modalBenefits.appendChild(li);
    });

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}
