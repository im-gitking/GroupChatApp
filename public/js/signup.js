const signupForm = document.querySelector('.signupForm');
const name = document.querySelector('#name');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const number = document.querySelector('#number');

// signup data submission
signupForm.addEventListener('submit', signupSubmit);
async function signupSubmit(e) {
    e.preventDefault();
    try {
        const signupSubmitedData = await axios.post(`http://13.53.193.195:3000/user/signup`, {
            name: name.value,
            email: email.value,
            password: password.value,
            number: number.value
        });
        // console.log(signupSubmitedData.data);
        if (!alert(signupSubmitedData.data.message)) {
            window.location.href = '/login';
        }

    }
    catch (err) {
        if (err.response.status === 302) {
            // console.log(err.response.data.message);
            if (!alert(err.response.data.message)) {
                location.reload();
            }
        }
        else {
            console.log(err);
        }
    }
}