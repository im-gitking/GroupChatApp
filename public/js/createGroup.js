const newGroup = document.querySelector('.newGroup');
const cancelBtn = document.querySelector('.cancelBtn');
const createForm = document.querySelector('.createForm');

cancelBtn.addEventListener('click', (e) => {
    console.log(12);
    newGroup.innerHTML = '';
});

createForm.addEventListener('submit', async(e) => {
    e.preventDefault();
    console.log(23);
});