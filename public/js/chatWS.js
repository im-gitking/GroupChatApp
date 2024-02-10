const token = localStorage.getItem('token');
const chatForm = document.querySelector('.chatForm');
const messageText = document.querySelector('#message');
const showMessage = document.querySelector('.showMessage');
const uploadFile = document.querySelector('#uploadFile');
showMessage.style.display = 'none';

// creating new Webscoket connection on this link
const socket = io('http://13.53.193.195:3000', { auth: { token: token } });

let socketId = null;
socket.on('connect', () => {
    console.log(`You connected with id: ${socketId = socket.id}`);
})

socket.on('connect_error', error => {
    console.log(error);
});

socket.on('recieved-message', message => {
    console.log(message);
});

let intervalId = null;

// JWT Decode function
const parseJwt = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};


const displayMessages = (obj) => {
    const userID = parseJwt(token).userID;

    obj.forEach(msg => {
        msg.postion = 'message-box-left';
        msg.class = 'message-container';
        if (msg.id === userID) {
            msg.from = 'You';
            msg.class = 'message-container my-message';
            msg.postion = 'message-box-right';
        }

        let imageElm = '';
        // console.log(msg.image);
        if (msg.image) {
            imageElm = `<div class="messageImage"><img src="${msg.image}"></div>`;
        }

        showMessage.innerHTML += `<div class="${msg.postion}">
        <div class="${msg.class}">
        <div class="userName">${msg.from}:</div>
        ${imageElm}
        <p> ${msg.textmsg}</p>
        </div>
        <div>`;
    });
}

// Display All Messages
async function getmsgs() {
    let lastMsgId = 0;
    const activeGroupId = +localStorage.getItem('groupId');

    try {
        // Get All Messages from API, if not stored in Localstorage
        if (!localStorage.getItem(`savedGroup${activeGroupId}`)) {
            console.log('getting MSG from API');

            let AllTextMessages = await new Promise((resolve) => {
                socket.emit('group all messages', activeGroupId, (cbMessage) => {
                    console.log(12, cbMessage);
                    resolve(cbMessage);
                });
            });
            console.log(13, AllTextMessages);


            // const AllTextMessages = await axios.get(`http://13.53.193.195:3000/chat/getText/${activeGroupId}`, { headers: { Authorization: token } });
            console.log(14, AllTextMessages);
            displayMessages(AllTextMessages);

            if (AllTextMessages.length > 0) {
                const newMessages = JSON.stringify(AllTextMessages);
                localStorage.setItem(`savedGroup${activeGroupId}`, newMessages);
                // console.log(newMessages);

                const totalMsg = Object.keys(AllTextMessages).length;
                lastMsgId = AllTextMessages[totalMsg - 1].msgId;
                localStorage.setItem(`lastMsgIdOfGrp${activeGroupId}`, `${lastMsgId}`);
            } else {
                const newMessages = JSON.stringify([]);
                localStorage.setItem(`savedGroup${activeGroupId}`, newMessages);

                localStorage.setItem(`lastMsgIdOfGrp${activeGroupId}`, `${lastMsgId}`);
            }
        }
        // If stored in Localstorage, use them
        else {
            console.log('getting from LocalStorage');

            const oldMessages = JSON.parse(localStorage.getItem(`savedGroup${activeGroupId}`));
            displayMessages(oldMessages);
            // console.log(oldMessages);
        }

        // Realtime API calls for new message after 1 sec intervals
        intervalId = setInterval(async () => {
            try {
                const newMsgs = await axios.post(`http://13.53.193.195:3000/chat/realTime/${localStorage.getItem('groupId')}`,
                    {
                        lastMsgId: +localStorage.getItem(`lastMsgIdOfGrp${localStorage.getItem('groupId')}`),

                    }, { headers: { Authorization: token } }
                );

                // If new message is present in DB
                if (newMsgs.data.length > 0) {
                    console.log('Realtime message fecthing');
                    showMessage.innerHTML = '';

                    const oldMessages = JSON.parse(localStorage.getItem(`savedGroup${localStorage.getItem('groupId')}`));

                    const allMsgs = [...oldMessages, ...newMsgs.data];
                    const tenOrLessMsgs = allMsgs.slice(-10);      // take 10 or if less then 10 messages present, take them
                    // console.log(tenOrLessMsgs);

                    const totalMsg = Object.keys(tenOrLessMsgs).length;
                    lastMsgId = tenOrLessMsgs[totalMsg - 1].msgId;
                    localStorage.setItem(`lastMsgIdOfGrp${localStorage.getItem('groupId')}`, `${lastMsgId}`);

                    const newMessages = JSON.stringify(tenOrLessMsgs);
                    localStorage.setItem(`savedGroup${activeGroupId}`, newMessages);

                    displayMessages(tenOrLessMsgs);
                }

            } catch (err) {
                console.error('Error Caught: ', err);
            }
        }, 5000);

    } catch (err) {
        console.error('Error Caught: ', err);
    }
}

// File/Image uploading
chatForm.addEventListener('submit', sendMessage);
async function sendMessage(e) {
    const activeGroupId = +localStorage.getItem('groupId');

    try {
        e.preventDefault();
        if (messageText.value || uploadFile.value) {
            const formData = new FormData();
            formData.append('text', messageText.value);
            formData.append('image', uploadFile.files[0]);
            formData.append('groupId', activeGroupId);
            formData.append('socketId', socketId);

            const sendMessageRes = await axios.post('http://13.53.193.195:3000/chat/sendMessage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token
                }
            });
            console.log(sendMessageRes.data);
            displayMessages(sendMessageRes.data);

            messageText.value = '';
            uploadFile.value = '';
        }
        else {
            alert('No message text or image to send...');
        }
    }
    catch (err) {
        console.error('Error Caught: ', err);
    }
}

socket.on('event', (message) => {
    console.log(message);
})