/* chat-app-v3
 Manages the sending and receiving of messages
*/

let chatLogContainer = document.querySelector("#chat-log-container");

async function deleteMessage(messageElement, db_id) {
    // delete the message locally (from the page)
    chatLogContainer.removeChild(messageElement);
    
    const response = await fetch('./api/delete-message', {
        method: 'POST',
        body: JSON.stringify({ id: db_id }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    console.log(await response.text());
}

async function editMessage(messageElement, db_id) { 
    const newContent = prompt("Edit message: ");
    messageElement.querySelector('p.message-content').textContent = newContent;
    
    const response = await fetch('./api/edit-message', {
        method: 'POST',
        body: JSON.stringify({ id: db_id, content: newContent }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    console.log(await response.text());
}

/* this function reloads ALL messages from the server */
async function loadAllMessages() { 
    /* fetch messages from DB */
    const response = await fetch('./api/all-messages');
    const data = await response.text();
    const new_messages = JSON.parse(data);

    /* get the already loaded messages */
    let old_messages = chatLogContainer.querySelectorAll('.message-self, .message-other');
    for (m of new_messages) {
        // if message doesn't exist
        if (!Array.from(old_messages).find(o => o.dataset.origin === m._id)) {
            createMessageElement(m);
        }
    }
    // remove messages which didn't come from the DB
    old_messages.forEach(m => m.dataset.origin == 'null' && chatLogContainer.removeChild(m));
}

/* this function sends a new message to the server */
async function submitNewMessage() {
    if (userName == "") return; // if no userName, stop

    /* get message data */
    const msgInput = document.querySelector('#message-text');
    if (msgInput.value == "") return; // if no message, stop
    const message = msgInput.value;
    msgInput.value = ""; // clear the input form
    
    const messageData = {
        '_id': null,
        'author': userName,
        'content': message,
        'date': new Date().getTime()
    }

    /* create local message (on the page) */
    createMessageElement(messageData);

    /* POST messageData to the server */
    const response = await fetch('./api/create-message', {
        method: 'POST',
        body: JSON.stringify(messageData),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(await response.text());
}

/* receive messages */
if (chatLogContainer !== null) {
    /* reload messages every 2 seconds */
    setInterval(function() {
        loadAllMessages();
    }, 2000);
    loadAllMessages();
}
/* send messages */
function clickHandler(event) {
    event.preventDefault();
    submitNewMessage();
}
const sendButton = document.querySelector("#message-button")
if (sendButton !== null) {
    sendButton.addEventListener('click', clickHandler);
}