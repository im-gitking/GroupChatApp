const token = localStorage.getItem('token');
const chatForm = document.querySelector('.chatForm');
const messageText = document.querySelector('#message');
const showMessage = document.querySelector('.showMessage');

// Display All Messages
document.addEventListener('DOMContentLoaded', async (e) => {
    try {
        const AllTextMessages = await axios.get(`http://localhost:3000/chat/getText`, { headers: { Authorization: token } });
        console.log(AllTextMessages);
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
        console.log(sendMessageRes.data);
        
        showMessage.innerHTML += `<p>You: ${sendMessageRes.data.msgText}</p>`
    }
    catch (err) {
        console.error('Error Caught: ', err);
    }
}