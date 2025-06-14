function validateSignupForm() {
    let valid = true;

    document.getElementById("emailError").textContent = '';
    document.getElementById("passwordError").textContent = '';
 
    const email = document.getElementById("email").value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent = 'Please enter a valid email';
        valid = false;
    }

    const password = document.getElementById("password").value;
    const passwordPattern =/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;


    if (!passwordPattern.test(password)) {
        document.getElementById("passwordError").textContent = 'Incorrect password';
        valid = false;
    }



    return valid;
}
