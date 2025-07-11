const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');
const recoveryForm = document.getElementById('passwordRecovery');
const backToLoginBtn = document.getElementById('backToLogin');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');

// Navigate to sign up form
signUpButton.addEventListener('click', function() {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
    recoveryForm.style.display = "none";
    clearMessages();
});

// Navigate to sign in form
signInButton.addEventListener('click', function() {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
    recoveryForm.style.display = "none";
    clearMessages();
});

// Navigate to password recovery form
forgotPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    signInForm.style.display = "none";
    signUpForm.style.display = "none";
    recoveryForm.style.display = "block";
    clearMessages();
});

// Navigate back to login from password recovery
backToLoginBtn.addEventListener('click', function() {
    recoveryForm.style.display = "none";
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
    clearMessages();
});

// Function to clear all message divs
function clearMessages() {
    const messageDivs = ['signInMessage', 'signUpMessage', 'recoveryMessage'];
    messageDivs.forEach(id => {
        const div = document.getElementById(id);
        if (div) {
            div.style.display = 'none';
            div.innerHTML = '';
        }
    });
}