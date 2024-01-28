const token = localStorage.getItem('token');
const chatForm = document.querySelector('.chatForm');
const messageText = document.querySelector('#message');
const showMessage = document.querySelector('.showMessage');

const displayMessages = (obj) => {
    // JWT Decode function
    const parseJwt = (token) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };

    const userID = parseJwt(token).userID;

    obj.forEach(msg => {
        if(msg.id === userID) {
            msg.from = 'You'
        }
        showMessage.innerHTML += `<div><p><span>${msg.from}:</span> ${msg.textmsg}</p></div>`
    });
}

// Display All Messages
document.addEventListener('DOMContentLoaded', async (e) => {
    try {
        const AllTextMessages = await axios.get(`http://localhost:3000/chat/getText`, { headers: { Authorization: token } });
        displayMessages(AllTextMessages.data);
    } catch (err) {
        console.error('Error Caught: ', err);
    }
})

// Post Text Message
chatForm.addEventListener('submit', sendMessage);
async function sendMessage(e) {
    try {
        e.preventDefault();
       console.log(messageText.value);
        const sendMessageRes = await axios.post(`http://localhost:3000/chat/sendText`, {
            message: messageText.value
        }, { headers: { Authorization: token } });
        // console.log(sendMessageRes.data);
        
        displayMessages(sendMessageRes.data);
    }
    catch (err) {
        console.error('Error Caught: ', err);
    }
}