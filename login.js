const signUpButton=document.getElementById('signUpButton');
const signInButton=document.getElementById('signInButton');
const signInForm=document.getElementById('signIn');
const signUpForm=document.getElementById('signup');
const recoveryForm = document.getElementById('passwordRecovery');
const backToLoginBtn = document.getElementById('backToLogin');

signUpButton.addEventListener('click',function(){
    signInForm.style.display="none";
    signUpForm.style.display="block";
})
signInButton.addEventListener('click', function(){
    signInForm.style.display="block";
    signUpForm.style.display="none";
});
document.querySelector('.recover a').addEventListener('click', function(e) {
    e.preventDefault();
    signInForm.style.display = "none";
    signUpForm.style.display = "none";
    recoveryForm.style.display = "block";
});
backToLoginBtn.addEventListener('click', function() {
    recoveryForm.style.display = "none";
    signInForm.style.display = "block";
});