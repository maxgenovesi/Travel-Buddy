// TravelBuddy API Token
const token = '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'; 

// Gets references to elements in the HTML code
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Detects when user clicks the send button or hits enter key to send message
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Handles sending a a user message (fetch is from ChatGPT Forums)
function sendMessage() {
    let userMessage = userInput.value;
    // Makes sure the user message is not empty or just spaces
    if (userMessage.trim() !== '') {
        // Altering of the prompt to fit the theme of the application
        let alteredMessage = 'You are an enthusiastic travel assistant. If it is the first message that you recieve,' + 
        'respond with a friendly greeting.' + 'Answer the given question and then end your response ' +
        'with a fun tip related to the country or topic of the question preferably.' + 'If the question is not ' +
        'about a country, travel, or your previous responses, respond saying you cannot help with that.' +
         'Keep your responses to three sentences or less' + 'Here is my question: ' + userMessage;
        displayUserMessage(userMessage);

        // Send a request to the OpenAI GPT-3.5 Turbo model
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "assistant", "content": alteredMessage}
                ]
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.choices && data.choices.length > 0) {
                const botResponse = data.choices[0].message.content;
                displayBotMessage(botResponse);
            } else {
                // Error handling when the response is emtpy
                console.error("No valid response from the OpenAI API.");
            }
        })
        .catch(error => {
            // Error handling when transmitting the data from OpenAI
            console.error("Error fetching data from OpenAI:", error);
        });

        // Resets the user input field
        userInput.value = '';
    }
}

// Handles displaying the users message 
function displayUserMessage(message) {
    const messageContainer = createMessageContainer('user-message'); // user message styling
    messageContainer.textContent = 'You: ' + message;
    chatBox.appendChild(messageContainer);
    chatBox.scrollTop = chatBox.scrollHeight; // Scrolls conversation
}

// Handles the bot's response/message
function displayBotMessage(message) {
    const messageContainer = createMessageContainer('bot-message'); // bot message styling
    messageContainer.textContent = 'TravelBuddy: ' + message;
    chatBox.appendChild(messageContainer);
    chatBox.scrollTop = chatBox.scrollHeight; // Scrolls conversation
}

// Abstracted out creating a message container with the specified class
function createMessageContainer(className) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container', className);
    return messageContainer;
}