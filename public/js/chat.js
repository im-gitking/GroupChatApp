const token = localStorage.getItem('token');
const chatForm = document.querySelector('.chatForm');
const messageText = document.querySelector('#message');
const showMessage = document.querySelector('.showMessage');

const displayMessages = (obj) => {
    // JWT Decode function
    const parseJwt = (token) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };

    const userID = parseJwt(token).userID;

    obj.forEach(msg => {
        if (msg.id === userID) {
            msg.from = 'You'
        }
        showMessage.innerHTML += `<div><p><span>${msg.from}:</span> ${msg.textmsg}</p></div>`
    });
}

// Display All Messages
document.addEventListener('DOMContentLoaded', getmsgs);
async function getmsgs(e) {
    let lastMsgId = 0;
    try {
        // Get All Messages from API, if not stored in Localstorage
        if (!localStorage.getItem('savedMsg')) {
            console.log(5432);
            const AllTextMessages = await axios.get(`http://localhost:3000/chat/getText`, { headers: { Authorization: token } });
            console.log(AllTextMessages.data);
            displayMessages(AllTextMessages.data);

            const newMessages = JSON.stringify(AllTextMessages.data);
            localStorage.setItem('savedMsg', newMessages);
            // console.log(newMessages);

            const totalMsg = Object.keys(AllTextMessages.data).length;
            lastMsgId = AllTextMessages.data[totalMsg - 1].msgId;
            localStorage.setItem('lastMsgId', `${lastMsgId}`);
        }
        // If stored in Localstorage, use them
        else {
            console.log(123456);

            const oldMessages = JSON.parse(localStorage.getItem('savedMsg'));
            displayMessages(oldMessages);
            // console.log(oldMessages);
        }

        // Realtime API calls for new message after 1 sec intervals
        /*setInterval(async () => {
            showMessage.innerHTML = '';
            try {
                const newMsgs = await axios.post(`http://localhost:3000/chat/realTime`,
                    {
                        lastMsgId: +localStorage.getItem('lastMsgId'),

                    }, { headers: { Authorization: token } }
                );

                // If new message is present in DB
                if (newMsgs.data != []) {
                    console.log(6543);

                    const oldMessages = JSON.parse(localStorage.getItem('savedMsg'));

                    const allMsgs = [ ...oldMessages, ...newMsgs.data ];
                    const tenOrLessMsgs = allMsgs.slice(-10);      // take 10 or if less then 10 messages present, take them
                    // console.log(tenOrLessMsgs);

                    const totalMsg = Object.keys(tenOrLessMsgs).length;
                    lastMsgId = tenOrLessMsgs[totalMsg - 1].msgId;
                    localStorage.setItem('lastMsgId', `${lastMsgId}`);

                    const newMessages = JSON.stringify(tenOrLessMsgs);
                    localStorage.setItem('savedMsg', newMessages);
                    
                    displayMessages(tenOrLessMsgs);
                }

            } catch (err) {
                console.error('Error Caught: ', err);
            }
        }, 5000);*/

    } catch (err) {
        console.error('Error Caught: ', err);
    }

}

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