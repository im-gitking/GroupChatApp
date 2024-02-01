const createBtn = document.querySelector('.createGroup button');
const joinedGroups = document.querySelector('.joinedGroups');
const groupchatForm = document.querySelector('.chatForm');

// Add Group in Joined Section
const addGroupInList = (groupObj) => {
    groupObj.forEach(obj => {
        joinedGroups.innerHTML += `<div class="group-name" id="${obj.id}"><p>${obj.name}</p></div>`;
    });
};

// Group deatils and Message adder
const groupManager = (groupObj) => {
    // add name, inite link, member count
    const groupNanme = document.querySelector('.groupName');
    const groupMembersCount = document.querySelector('.groupMembersCount');
    const groupLink = document.querySelector('.groupLink');

    groupNanme.innerHTML = `<h3>${groupObj.groupDetails.name}</h3>`;
    groupMembersCount.innerHTML = `<p>Members: ${groupObj.groupDetails.memberCount}</p>`;
    groupLink.innerHTML = `<a href="http://localhost:3000/group/join/${groupObj.groupDetails.inviteLink}"><p>Group Link</p></a>`;

    // show messages of group
    if (intervalId) {
        clearInterval(intervalId);
    }
    localStorage.setItem('groupId', `${groupObj.groupDetails.id}`);

    console.log('getting from LocalStorage 2');
    showMessage.innerHTML = '';
    getmsgs();

    // Make group chat from visibale & add groupId
    const groupIdInput = document.querySelector('#groupId');
    groupIdInput.value = groupObj.groupDetails.id;
    groupchatForm.style.display = 'block';
}

// Open Group
joinedGroups.addEventListener('click', async (e) => {
    if (e.target.classList.contains('group-name') || e.target.parentElement.classList.contains('group-name')) {
        try {
            const groupId = e.target.id || e.target.parentElement.id;
            // console.log(groupId);
            const groupData = await axios.get(`http://localhost:3000/group/openGroup/${groupId}`, { headers: { Authorization: token } });
            // console.log(groupData.data);

            // highlight group name
            const activeGroupId = +localStorage.getItem('groupId');
            if (!isNaN(activeGroupId)) {
                const lastClickedGroup = document.querySelector(`.joinedGroups [id='${activeGroupId}']`);
                if (lastClickedGroup) {
                    lastClickedGroup.style.backgroundColor = 'white';
                }
            }

            const NowClickedGroup = document.querySelector(`.joinedGroups [id='${groupId}']`);
            NowClickedGroup.style.backgroundColor = 'aqua';

            groupManager(groupData.data);

            showMessage.style.display = 'block';

        } catch (err) {
            console.error('Error Caught: ', err);
        }
    }
});

// Create new group
createBtn.addEventListener('click', async (e) => {
    try {
        const newGroup = document.querySelector('.newGroup');
        newGroup.innerHTML = `
        <div>
            <form class="createForm">
                <label for="groupName">Group Name:</label>
                <input type="text" name="groupName" id="groupName" required>
                <input type="submit" value="Create Group" id="sendBtn">
            </form>
            <button class="cancelBtn">Cancel</button>
        </div>
        `;

        // Attach event listeners
        const cancelBtn = document.querySelector('.cancelBtn');
        const createForm = document.querySelector('.createForm');
        const groupName = document.querySelector('#groupName');

        cancelBtn.addEventListener('click', (e) => {
            newGroup.innerHTML = '';
        });

        createForm.addEventListener('submit', async (e) => {
            try {
                e.preventDefault();
                const groupData = await axios.post(`http://localhost:3000/group/createGroup`, {
                    groupName: groupName.value
                }, { headers: { Authorization: token } });
                // console.log(groupData.data);
                addGroupInList([groupData.data]);

            } catch (err) {
                console.error('Error Caught: ', err);
            }
        });

    } catch (err) {
        console.error('Error Caught: ', err);
    }
});

// Display joined groups
document.addEventListener('DOMContentLoaded', async (e) => {
    try {
        const getJoinedGroups = await axios.get(`http://localhost:3000/group/joinedGroups`, { headers: { Authorization: token } });
        // console.log(getJoinedGroups.data);

        if (getJoinedGroups.data.length !== 0) {
            addGroupInList(getJoinedGroups.data);
        }

        joinFinish();
    } catch (err) {
        console.error('Error Caught: ', err);
    }
});

// join operation
async function joinFinish() {
    try {
        if(localStorage.getItem('joinOp') === 'true') {
            const groupId = localStorage.getItem('groupId');
            const groupData = await axios.get(`http://localhost:3000/group/openGroup/${groupId}`, { headers: { Authorization: token } });
            // console.log(groupData.data);

            // highlight group name
            const activeGroupId = +localStorage.getItem('groupId');
            if (!isNaN(activeGroupId)) {
                const lastClickedGroup = document.querySelector(`.joinedGroups [id='${activeGroupId}']`);
                if (lastClickedGroup) {
                    lastClickedGroup.style.backgroundColor = 'white';
                }
            }

            const NowClickedGroup = document.querySelector(`.joinedGroups [id='${groupId}']`);
            NowClickedGroup.style.backgroundColor = 'aqua';

            groupManager(groupData.data);

            showMessage.style.display = 'block';
            localStorage.removeItem('joinOp');
        }
    } catch (err) {
        console.error('Error Caught: ', err);
    }
}