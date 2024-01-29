const createBtn = document.querySelector('.createGroup button');

createBtn.addEventListener('click', async (e) => {
    try {
        const newGroup = document.querySelector('.newGroup');
        newGroup.innerHTML = `
        <div>
            <form class="createForm">
                <label for="groupName">Group Name:</label>
                <input type="text" name="groupName" id="groupName" required>
                <input type="submit" value="Create Group" id="sendBtn">
                <button class="cancelBtn">Cancel</button>
            </form>
        </div>
        `;

        // Create a new script element
        let script = document.createElement('script');
        script.src = '../js/createGroup.js';

        // Append the script element to the document
        document.body.appendChild(script);
    } catch (err) {
        console.error('Error Caught: ', err);
    }
});