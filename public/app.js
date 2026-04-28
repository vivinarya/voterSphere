const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let sessionId = localStorage.getItem('votersphere_session');
if (!sessionId) {
    sessionId = '';
}

function appendMessage(msg, type) {
    const div = document.createElement('div');
    div.classList.add('message', type);
    // Use innerHTML instead of textContent to allow for clickable links
    div.innerHTML = msg.replace(/\n/g, '<br>');
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage(message) {
    appendMessage(message, 'user-msg');
    userInput.value = '';

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, message })
        });
        const data = await res.json();
        
        if (!sessionId || sessionId !== data.sessionId) {
            sessionId = data.sessionId;
            localStorage.setItem('votersphere_session', sessionId);
        }

        appendMessage(data.reply, 'bot-msg');
    } catch (err) {
        appendMessage('Error: Could not connect to server.', 'bot-msg');
    }
}

sendBtn.addEventListener('click', () => {
    if (userInput.value.trim()) sendMessage(userInput.value.trim());
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && userInput.value.trim()) {
        sendMessage(userInput.value.trim());
    }
});

// Start conversation on load
window.onload = async () => {
    if(!sessionId) {
        sendMessage('/start');
        // Hack to remove the invisible user /start message
        setTimeout(() => {
            const msgs = document.querySelectorAll('.user-msg');
            if(msgs.length > 0 && msgs[0].textContent === '/start') {
                msgs[0].style.display = 'none';
            }
        }, 10);
    } else {
         appendMessage('Welcome back to VoterSphere! Type "menu" to see your options.', 'bot-msg');
    }
};
