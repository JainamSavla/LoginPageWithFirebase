// Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
 import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup, sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
 import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
 
 const firebaseConfig = {
    apiKey: "AIzaSyDfcgk7nrDfC-hM_iDkKsGzU90uEicwhNY",
    authDomain: "login-form-992fd.firebaseapp.com",
    projectId: "login-form-992fd",
    storageBucket: "login-form-992fd.firebasestorage.app",
    messagingSenderId: "465154906827",
    appId: "1:465154906827:web:8779e28ea473d3c02e194e"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);

 function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
 }
 const signUp=document.getElementById('submitSignUp');
 signUp.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('rEmail').value;
    const password=document.getElementById('rPassword').value;
    const firstName=document.getElementById('fName').value;
    const lastName=document.getElementById('lName').value;

    const auth=getAuth();
    const db=getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            email: email,
            firstName: firstName,
            lastName:lastName
        };
        showMessage('Account Created Successfully', 'signUpMessage');
        const docRef=doc(db, "users", user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            // Switch to sign in form instead of redirecting
            document.getElementById('signup').style.display = "none";
            document.getElementById('signIn').style.display = "block";
            showMessage('Please sign in with your new account', 'signInMessage');
        })
        .catch((error)=>{
            console.error("error writing document", error);
        });
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use'){
            showMessage('Email Address Already Exists !!!', 'signUpMessage');
        }
        else{
            showMessage('unable to create User', 'signUpMessage');
        }
    })
 });

 const signIn=document.getElementById('submitSignIn');
 signIn.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const auth=getAuth();

    signInWithEmailAndPassword(auth, email,password)
    .then((userCredential)=>{
        showMessage('login is successful', 'signInMessage');
        const user=userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href='http://127.0.0.1:5500/Chatbot%20copy/chatbot/index.html';
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Incorrect Email or Password', 'signInMessage');
        }
        else{
            showMessage('Account does not Exist', 'signInMessage');
        }
    })
 })
const provider = new GoogleAuthProvider();
const auth = getAuth(app);
auth.languageCode = 'en';

async function handleGoogleSignIn() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = 'http://127.0.0.1:5500/Chatbot%20copy/chatbot/index.html';
    } catch (error) {
        console.error(error);
        showMessage('Failed to sign in with Google', 'signInMessage');
    }
}

// Add listeners for both Google buttons
document.getElementById('googleSignUpBtn').addEventListener('click', handleGoogleSignIn);
document.getElementById('googleSignInBtn').addEventListener('click', handleGoogleSignIn);

const reset = document.getElementById("recover");
reset.addEventListener("click", async function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    
    if (!email) {
        showMessage('Please enter your email address', 'signInMessage');
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        showMessage('Password reset email sent! Please check your inbox', 'signInMessage');
    } catch (error) {
        const errorMessage = error.code === 'auth/user-not-found' 
            ? 'No account found with this email'
            : 'Failed to send reset email. Please try again';
        showMessage(errorMessage, 'signInMessage');
    }
});
