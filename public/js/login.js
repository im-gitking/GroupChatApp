const loginForm = document.querySelector('.loginForm');
const email = document.querySelector('#email');
const password = document.querySelector('#password');

// login data submission
loginForm.addEventListener('submit', loginSubmit);
async function loginSubmit(e) {
    e.preventDefault();
    try {
        const loginSubmitedData = await axios.post(`http://localhost:3000/user/login`, {
            email: email.value,
            password: password.value
        });
        // console.log(signupSubmitedData.data);
        localStorage.setItem('token', loginSubmitedData.data.token);
        if (!alert(loginSubmitedData.data.message)) {
            window.location.href = 'addExpense.html';
        }
    }
    catch (err) {
        if (err.response.status === 404) {
            if (!alert(err.response.data.message)) {
                location.reload();
            }
        }
        else if (err.response.status === 401) {
            if (!alert(err.response.data.message)) {
                location.reload();
            }
        }
        else {
            console.log(err);
        }
    }
}