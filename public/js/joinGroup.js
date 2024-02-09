const token = localStorage.getItem('token');
const groupJoiner = document.querySelector('.groupJoiner');
document.addEventListener('DOMContentLoaded', async (e) => {
    try {
        let URL = window.location.pathname;
        let URLparts = URL.split('/');
        let joinId = URLparts[URLparts.length - 1];
        // console.log(joinId);

        const groupDetails = await axios.get(`http://13.53.193.195:3000/group/groupDetails/${joinId}`, { headers: { Authorization: token } });
        console.log(groupDetails.data);
        groupJoiner.innerHTML = `
        <div class="groupDetails">
            <div class="groupName"><p>${groupDetails.data.name}</p></div>
            <div class="groupMembersCount"><p>${groupDetails.data.memberCount} members</p></div>
            <button class="join" id="${groupDetails.data.id}">Join Group</button>
        </div>
        `;

        const joinBtn = document.querySelector('.join');
        joinBtn.addEventListener('click', async (e) => {
            try {
                const joinMember = await axios.get(`http://13.53.193.195:3000/group/joinMember/${e.target.id}`, { headers: { Authorization: token } });
                console.log(joinMember.data);
                
                localStorage.setItem('joinOp', 'true');
                localStorage.setItem('groupId', e.target.id);
                window.location.href = 'http://13.53.193.195:3000/group';
            } catch (error) {
                console.error('Error Caught: ', err);
            }
        })

    } catch (err) {
        console.error('Error Caught: ', err);
    }
})