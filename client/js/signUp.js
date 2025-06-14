function validateSignupForm() {
    let valid = true;
    
    // ניקוי שגיאות קודמות
    document.getElementById("nameError").textContent = '';
    document.getElementById("emailError").textContent = '';
    document.getElementById("passwordError").textContent = '';
    document.getElementById("confirmPasswordError").textContent = '';

    // בדיקת שם מלא
    const name = document.getElementById("name").value;
    if (name.length < 2) {
        document.getElementById("nameError").textContent = 'Name must include atleast 2 letters';
        valid = false;
    }

    // בדיקת אימייל
    const email = document.getElementById("email").value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        document.getElementById("emailError").textContent = 'Please enter a valid email';
        valid = false;
    }

    // בדיקת סיסמה
    const password = document.getElementById("password").value;
    const passwordPattern =/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;


    if (!passwordPattern.test(password)) {
        document.getElementById("passwordError").textContent = 'Password is invalid';
        valid = false;
    }

    // בדיקת אישור סיסמה
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (confirmPassword !== password) {
        document.getElementById("confirmPasswordError").textContent = 'Password and Confirm Password are not the same';
        valid = false;
    }

    return valid;
}

document.addEventListener("DOMContentLoaded", async () => {
  // validateSignupForm()

    const signupForm = document.getElementById("signupForm");
  
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const fullname = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      try {
        const response = await fetch("/api/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: fullname, email: email, password: password }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert("Signup successful!");
        } else {
          alert(`Signup failed: ${result.error}`);
        }
      } catch (error) {
        console.error("Error during signup:", error);
        alert("An error occurred. Please try again later.");
      }
    });

});

