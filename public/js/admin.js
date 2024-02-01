const memberSection = document.querySelector('.member');
const groupMembersCount = document.querySelector('.groupMembersCount');

// member list maker
const memberList = (members) => {
    members.forEach(member => {
        
    });
};

addEventListener.groupMembersCount('click', async(e) => {
    const groupId = localStorage.getItem('groupId');
    try {
        // show all members
        const allMembers = await axios.get(`http://localhost:3000/group/membersDetails/${groupId}`, { headers: { Authorization: token } });
        console.log(allMembers.data);
        memberSection.innerHTML = '';
        memberList(allMembers.data);
    } catch (err) {
        console.error('Error Caught: ', err);
    }
});