document.addEventListener('DOMContentLoaded', () => {
    const chatArea = document.getElementById('chatArea');
    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessageButton');
    const recipientNameElement = document.getElementById('recipientNameDynamic'); // Matches updated ID in chat.html

    // Recipient info is now passed from the template via global JS variables:
    // - chatWithRecipientId (defined in chat.html <script> block)
    // - chatWithRecipientName (defined in chat.html <script> block)

    if (recipientNameElement && typeof chatWithRecipientName !== 'undefined' && chatWithRecipientName) {
        recipientNameElement.textContent = chatWithRecipientName;
    } else if (recipientNameElement) {
        recipientNameElement.textContent = 'User'; // Fallback if name somehow not passed
    }

    let messages = []; // Store messages locally

    // BACKEND_INTEGRATION (Fetch Initial Chat History):
    // This function should be called to load messages when the chat page opens.
    // API Endpoint: GET /api/chat_history?recipient_id=<chatWithRecipientId> (example)
    // The API should return a JSON array of message objects. Each object should include:
    // - id (unique message_id)
    // - sender_id (ID of the user who sent the message)
    // - text (message content)
    // - timestamp (formatted string, e.g., "10:05 AM")
    // To determine if a message is 'sent' (by current user) or 'received' (by the other user),
    // the backend should either:
    //   a) Include a flag like `is_sent_by_me: true/false` in each message object.
    //   b) This script would need to know the current_user's ID (e.g., passed from template like recipient_id)
    //      to compare with `sender_id`. Option 'a' is often cleaner for the frontend.
    async function fetchChatHistory() {
        if (typeof chatWithRecipientId === 'undefined') {
            console.error("Recipient ID is not defined. Cannot fetch chat history.");
            chatArea.innerHTML = '<p class="text-muted text-center">Could not load chat. Recipient not specified.</p>';
            sendMessageButton.disabled = true;
            messageInput.disabled = true;
            return;
        }

        console.log(`BACKEND_INTEGRATION: Attempting to GET /api/chat_history?recipient_id=${chatWithRecipientId}`);
        try {
            // --- MOCK API CALL ---
            // const response = await fetch(`/api/chat_history?recipient_id=${chatWithRecipientId}`);
            // if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            // const fetchedMessages = await response.json();
            // --- SIMULATED RESPONSE ---
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            const fetchedMessages = [
                { id: 1, sender_id: chatWithRecipientId, text: 'Hey, how’s it going?', timestamp: '10:05 AM', is_sent_by_me: false },
                { id: 2, sender_id: 'current_user_placeholder_id', text: 'Pretty good! Just working on this chat interface.', timestamp: '10:06 AM', is_sent_by_me: true },
                { id: 3, sender_id: chatWithRecipientId, text: 'Oh cool! How’s it looking?', timestamp: '10:07 AM', is_sent_by_me: false },
                { id: 4, sender_id: 'current_user_placeholder_id', text: 'Coming along. Adding mock messages now. This one is a bit longer to test wrapping and bubble size.', timestamp: '10:08 AM', is_sent_by_me: true },
            ];
            // --- END MOCK ---

            messages = fetchedMessages.map(msg => ({
                ...msg,
                sender: msg.is_sent_by_me ? 'me' : 'them' // Use the backend flag
            }));

            renderMessages();
        } catch (error) {
            console.error("Failed to fetch chat history:", error);
            chatArea.innerHTML = '<p class="text-danger text-center">Could not load messages. Please try again later.</p>';
        }
    }

    function renderMessages() {
        chatArea.innerHTML = ''; // Clear existing messages/placeholders
        if (messages.length === 0) {
            chatArea.innerHTML = '<p class="text-muted text-center">No messages yet. Start the conversation!</p>';
            return;
        }
        messages.forEach(displayMessage);
        chatArea.scrollTop = chatArea.scrollHeight; // Scroll to bottom after rendering
    }

    function displayMessage(message) { // message object: {sender: 'me'/'them', text: '', timestamp: ''}
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', message.sender); // 'sent' or 'received'

        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');

        const textP = document.createElement('p');
        textP.classList.add('message-text');
        textP.textContent = message.text;

        const timestampSpan = document.createElement('span');
        timestampSpan.classList.add('message-timestamp');
        timestampSpan.textContent = message.timestamp;

        bubbleDiv.appendChild(textP);
        bubbleDiv.appendChild(timestampSpan);
        messageDiv.appendChild(bubbleDiv);
        chatArea.appendChild(messageDiv);
    }

    function simulateReplyAfterDelay() {
        const replyText = "That sounds interesting! Tell me more.";
        const replyMessage = {
            sender: 'them', // This is a simulated reply
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        // BACKEND_INTEGRATION: This is a mock reply. In a real system, new messages would arrive
        // via WebSocket or periodic polling. See `startReceivingMessages` placeholder.
        setTimeout(() => {
            messages.push(replyMessage);
            displayMessage(replyMessage);
            chatArea.scrollTop = chatArea.scrollHeight;
            console.log("Simulated reply displayed: " + replyText);
        }, 1500);
    }

    sendMessageButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText && typeof chatWithRecipientId !== 'undefined') {
            const newMessage = {
                sender: 'me',
                text: messageText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                // id and sender_id would be confirmed by backend response
            };

            messages.push(newMessage);
            displayMessage(newMessage);
            chatArea.scrollTop = chatArea.scrollHeight;
            messageInput.value = ''; // Clear input field

            // BACKEND_INTEGRATION (Send Message):
            // API Endpoint: POST /api/send_message (example)
            // Request Body: { "recipient_id": chatWithRecipientId, "text": messageText }
            // The backend should save the message, associate it with the current_user (sender),
            // and ideally return the saved message object (including its new ID and confirmed timestamp).
            console.log(`BACKEND_INTEGRATION: Sending POST /api/send_message with { recipient_id: ${chatWithRecipientId}, text: "${messageText}" }`);
            // fetch('/api/send_message', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json', /* Add CSRF token if needed */ },
            //     body: JSON.stringify({ recipient_id: chatWithRecipientId, text: messageText })
            // })
            // .then(response => response.json())
            // .then(data => {
            //     if(data.success && data.message) {
            //         console.log("Message sent and saved to backend:", data.message);
            //         // Optionally, update the displayed message with ID from 'data.message.id'
            //         // or replace the optimistically added message with the confirmed one.
            //     } else {
            //         console.error("Failed to send message to backend:", data.error || "Unknown error");
            //         // Optionally, mark the message as 'failed to send' in the UI.
            //     }
            // })
            // .catch(error => {
            //     console.error("Error sending message via API:", error);
            //     // Optionally, mark the message as 'failed to send' in the UI.
            // });

            simulateReplyAfterDelay(); // Keep for demo purposes
        } else if (typeof chatWithRecipientId === 'undefined') {
            console.error("Cannot send message: Recipient ID is not defined.");
            // Optionally display an error to the user in the UI.
        }
    });

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) { // Send on Enter, allow Shift+Enter for newline
            event.preventDefault(); // Prevent default Enter behavior (newline in textarea or form submit)
            sendMessageButton.click();
        }
    });

    // Load initial messages
    fetchChatHistory();

    // BACKEND_INTEGRATION (Receiving New Messages):
    // Implement logic to receive new messages in real-time or near real-time.
    // This typically involves WebSockets or periodic polling (long polling).
    // function startReceivingMessages() {
    //     console.log(`BACKEND_INTEGRATION: Setup WebSocket or start polling for new messages for chat with recipient: ${chatWithRecipientId}.`);
    //     // Example (Polling):
    //     // let lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : 0;
    //     // setInterval(async () => {
    //     //     try {
    //     //         const response = await fetch(`/api/new_messages?recipient_id=${chatWithRecipientId}&since_message_id=${lastMessageId}`);
    //     //         if (!response.ok) throw new Error("Polling request failed");
    //     //         const newMessages = await response.json(); // Expects an array of message objects
    //     //         if (newMessages && newMessages.length > 0) {
    //     //             newMessages.forEach(msg => {
    //     //                 const formattedMsg = { ...msg, sender: msg.is_sent_by_me ? 'me' : 'them' };
    //     //                 messages.push(formattedMsg);
    //     //                 displayMessage(formattedMsg);
    //     //                 lastMessageId = formattedMsg.id;
    //     //             });
    //     //             chatArea.scrollTop = chatArea.scrollHeight;
    //     //         }
    //     //     } catch (error) {
    //     //         console.error("Error polling for new messages:", error);
    //     //     }
    //     // }, 5000); // Poll every 5 seconds
    // }
    // if (typeof chatWithRecipientId !== 'undefined') {
    //     startReceivingMessages();
    // }
});
