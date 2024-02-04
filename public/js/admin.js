const memberSection = document.querySelector('.member');
const ownerDiv = document.querySelector('.owner-div');
const memberDiv = document.querySelector('.member-div');
const adminDiv = document.querySelector('.admin-div');
const groupMembersCount = document.querySelector('.groupMembersCount');
const memberSearch = document.querySelector('.memberSearch');
const memberSearchResult = document.querySelector('.memberSearchResult');
const findMember = document.querySelector('#findMember');
const closeMember = document.querySelector('.closeMember');

let myRankInActiveGroup = null;

function memberToMessageOpen() {
    findMember.value = '';
    memberSearchResult.innerHTML = '';
    closeMember.style.display = 'none';
    memberSearch.style.display = 'none';
    memberSearchResult.innerHTML = '';
    ownerDiv.innerHTML = '';
    adminDiv.innerHTML = '';
    memberDiv.innerHTML = '';
    showMessage.style.display = 'block';
    groupchatForm.style.display = 'block';
}
function messageToMemberOpen() {
    findMember.value = '';
    memberSearchResult.innerHTML = '';
    groupchatForm.style.display = 'none';
    showMessage.style.display = 'none';
    closeMember.style.display = 'block';
    memberSearch.style.display = 'block';
    ownerDiv.innerHTML = '';
    adminDiv.innerHTML = '';
    memberDiv.innerHTML = '';
}

const memberPrint = (member, isAdmin, isOwner) => {
    let memberHTML = `
            <div class="member${member.id}">
                <span class="memberName" id="${member.id}">${member.user.name}</span>
                <span class="memberRank" id="${member.id}">${member.rank}</span>
            </div>
        `;

    if (isAdmin) {
        if (member.rank === 'Member') {
            memberHTML += `
                <div class="member${member.id}">
                    <button class="promote" id="${member.id}">Promote</button>
                    <button class="remove" id="${member.id}">Remove</button>
                </div>
                `;
        }
    }
    else if (isOwner) {
        if (member.rank === 'Member') {
            memberHTML += `
                <div class="member${member.id}">
                    <button class="promote" id="${member.id}">Promote</button>
                    <button class="remove" id="${member.id}">Remove</button>
                </div>
                `;
        }
        else if (member.rank === 'Admin') {
            memberHTML += `
                <div class="member${member.id}">
                    <button class="demote" id="${member.id}">Demote</button>
                    <button class="remove" id="${member.id}">Remove</button>
                </div>
                `;
        }
    }

    return memberHTML;
}

// member list maker
const memberList = (members) => {
    messageToMemberOpen();

    const userID = parseJwt(token).userID;

    function findRank(members, userID) {
        for (let member of members) {
            if (member.userId === userID) {
                return member.rank;
            }
        }
    }

    const myRank = findRank(members, userID);
    console.log(myRank);
    myRankInActiveGroup = myRank;

    const isAdmin = myRank === 'Admin' ? true : false;
    const isOwner = myRank === 'Owner' ? true : false;

    members.forEach(member => {
        const memberHTML = memberPrint(member, isAdmin, isOwner);

        if (member.rank === 'Member') {
            memberDiv.innerHTML += memberHTML;
        } else if (member.rank === 'Admin') {
            adminDiv.innerHTML += memberHTML;
        } else { // for Owner
            ownerDiv.innerHTML += memberHTML;
        }
    });
};

// show members list and action buttons accrodingly
groupMembersCount.addEventListener('click', async (e) => {
    const groupId = localStorage.getItem('groupId');
    try {
        // show all members
        const allMembers = await axios.get(`http://13.53.193.195:3000/admin/membersDetails/${groupId}`, { headers: { Authorization: token } });
        // console.log(allMembers.data);
        memberList(allMembers.data);
    } catch (err) {
        console.error('Error Caught: ', err);
    }
});

// promote demote
memberSection.addEventListener('click', async (e) => {
    const groupId = +localStorage.getItem('groupId');
    try {
        if (e.target.classList.contains('promote') || e.target.classList.contains('demote')) {
            const promoteMember = await axios.post(`http://13.53.193.195:3000/admin/promoteDemote`, {
                groupId: groupId,
                targetMember: e.target.id
            }, { headers: { Authorization: token } });

            if (promoteMember.data.rank === 'Admin') {
                const rankSpan = document.querySelector(`.memberRank[id='${e.target.id}']`);
                rankSpan.innerHTML = 'Admin';
                e.target.classList = 'demote';
                e.target.innerHTML = 'Demote';
            }
            else {
                const rankSpan = document.querySelector(`.memberRank[id='${e.target.id}']`);
                rankSpan.innerHTML = 'Member';
                e.target.classList = 'promote';
                e.target.innerHTML = 'Promote';
            }
        }
        else if (e.target.classList.contains('remove')) {
            const removeMember = await axios.post(`http://13.53.193.195:3000/admin/removeMember`, {
                groupId: groupId,
                targetMember: e.target.id
            }, { headers: { Authorization: token } });

            const membersCountElement = document.querySelector('.groupMembersCount p');
            let currentCount = parseInt(membersCountElement.textContent.split(': ')[1]);
            let newCount = currentCount - 1;
            membersCountElement.textContent = `Members: ${newCount}`;

            const rmUserDivs = document.querySelectorAll(`.member${e.target.id}`);
            console.log(rmUserDivs);
            rmUserDivs.forEach(div => div.remove());
        }
    } catch (err) {
        console.error('Error Caught: ', err);
    }
});

// member search
memberSearch.addEventListener('submit', async (e) => {
    const groupId = +localStorage.getItem('groupId');
    try {
        e.preventDefault();
        const nameOrEmailOrNumber = findMember.value;

        function isEmail(str) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(str);
        }

        console.log(isNaN(+nameOrEmailOrNumber));
        console.log(+nameOrEmailOrNumber);

        const findingMember = await axios.post(`http://13.53.193.195:3000/admin/searchMember`, {
            name: isEmail(nameOrEmailOrNumber) || !isNaN(+nameOrEmailOrNumber) ? NaN : nameOrEmailOrNumber,
            email: isEmail(nameOrEmailOrNumber) ? nameOrEmailOrNumber : NaN,
            number: +nameOrEmailOrNumber,
            groupId: groupId
        }, { headers: { Authorization: token } });

        messageToMemberOpen();

        // if user not found
        if (!findingMember.data.userfound) {
            console.log('not found');
            console.log(myRankInActiveGroup);
            memberSearchResult.innerHTML = `
            <div class="usrNotFound">
                <span class="memberName">User Not Found.</span>
            </div>
            `;
        }
        // if user found but not in Group
        else if (!findingMember.data.inGroup) {
            console.log('found & not in group');
            const member = findingMember.data;
            memberSearchResult.innerHTML = `
            <div class="user${member.user.id}">
                <span class="userName" id="${member.user.id}">${member.user.name}</span>
            </div>
            <div class="user${member.user.id}">
                <button class="addMember" id="${member.user.id}">Add Member</button>
            </div>
            `;
        }
        // if user found & already in Group
        else if (findingMember.data.inGroup) {
            console.log('found & in group');
            const isAdmin = myRankInActiveGroup === 'Admin' ? true : false;
            const isOwner = myRankInActiveGroup === 'Owner' ? true : false;
            const member = findingMember.data;
            memberSearchResult.innerHTML = memberPrint(member, isAdmin, isOwner);
        }
    } catch (err) {
        console.error('Error Caught: ', err);
    }
});

// close member details
closeMember.addEventListener('click', (e) => {
    memberToMessageOpen();
});

memberSearchResult.addEventListener('click', async (e) => {
    const groupId = +localStorage.getItem('groupId');
    try {
        if (e.target.classList.contains('addMember')) {
            const findingMember = await axios.post(`http://13.53.193.195:3000/admin/addMember`, {
                userId: e.target.id,
                groupId: groupId
            }, { headers: { Authorization: token } });
            
            console.log(findingMember.data);
            groupMembersCount.click();
        }
    } catch (err) {
        console.error('Error Caught: ', err);
    }
});