/* login.js
 Manage the client's user name
*/

/* default username is blank */
let userName = ""

/* login button: only open chat room if username is not blank */
function login() {
    if (userName == "") {
        alert("Please enter a name!");
    } else {
        window.location.href = 'chat-app.html';
    }
}
const loginButton = document.querySelector('#login-button')
if (loginButton !== null){
    loginButton.addEventListener('click', login);
}

/* whenever the user types their name, change emoji, save name in localStorage */
const inputUsername = document.querySelector("#message-name");
const outputUsername = document.querySelector("p.my-username")
if (inputUsername !== null) {
    inputUsername.addEventListener('input', function() {
        const name = document.querySelector("#message-name").value;
        document.querySelector("p.my-img").textContent = emojiFromName(name);
        userName = name;
        localStorage.setItem("userName", userName);
    });
}

/* on page load, get userName from localStorage */
if(localStorage.getItem("userName") !== null) {
    userName = localStorage.getItem("userName");
    if (inputUsername !== null) {
        inputUsername.value = userName
    };
    document.querySelector("p.my-img").textContent = emojiFromName(userName);
    if (outputUsername !== null) {
        outputUsername.textContent = userName;
    }
}
/* go to login screen if user hasn't yet chosen a name */
if ("/chat-app.html" === window.location.pathname && [null, ''].includes(userName)) {
    window.location.href = "index.html"
}