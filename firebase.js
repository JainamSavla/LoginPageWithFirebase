
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, sendEmailVerification} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};


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


const provider = new GoogleAuthProvider();
const auth = getAuth(app);
auth.languageCode = 'en';

async function handleGoogleSignIn() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = 'http://127.0.0.1:5500/Chatbot%20copy/Login/homepage.html';
    } catch (error) {
        console.error(error);
        showMessage('Failed to sign in with Google', 'signInMessage');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const signUp = document.getElementById('submitSignUp');
    const signIn = document.getElementById('submitSignIn');
    const googleSignUpBtn = document.getElementById('googleSignUpBtn');
    const googleSignInBtn = document.getElementById('googleSignInBtn');
    const submitRecovery = document.getElementById('submitRecovery');

    if (signUp) {
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
                
                
                sendEmailVerification(user)
                .then(() => {
                    showMessage('Account Created Successfully! Please check your email for verification link.', 'signUpMessage');
                    const docRef=doc(db, "users", user.uid);
                    setDoc(docRef,userData)
                    .then(()=>{
                       
                        setTimeout(() => {
                            document.getElementById('signup').style.display = "none";
                            document.getElementById('signIn').style.display = "block";
                            showMessage('Please verify your email and sign in', 'signInMessage');
                        }, 2000);
                    })
                    .catch((error)=>{
                        console.error("error writing document", error);
                    });
                })
                .catch((error) => {
                    console.error("Error sending verification email:", error);
                    showMessage('Account created but failed to send verification email', 'signUpMessage');
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
    }

    if (signIn) {
        signIn.addEventListener('click', (event)=>{
            event.preventDefault();
            const email=document.getElementById('email').value;
            const password=document.getElementById('password').value;
            const auth=getAuth();

            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential)=>{
                const user=userCredential.user;
                
                
                if (!user.emailVerified) {
                    showMessage('Please verify your email before signing in. Check your inbox for verification link.', 'signInMessage');
                    
                   
                    const resendBtn = document.createElement('button');
                    resendBtn.textContent = 'Resend Verification Email';
                    resendBtn.className = 'btn';
                    resendBtn.style.marginTop = '10px';
                    resendBtn.onclick = () => {
                        sendEmailVerification(user)
                        .then(() => {
                            showMessage('Verification email sent! Please check your inbox.', 'signInMessage');
                            resendBtn.remove();
                        })
                        .catch((error) => {
                            console.error("Error sending verification email:", error);
                            showMessage('Failed to send verification email', 'signInMessage');
                        });
                    };
                    
                    const messageDiv = document.getElementById('signInMessage');
                    messageDiv.appendChild(resendBtn);
                    return;
                }
                
                showMessage('Login is successful', 'signInMessage');
                localStorage.setItem('loggedInUserId', user.uid);
                window.location.href='http://127.0.0.1:5500/Chatbot%20copy/Login/homepage.html';
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
        });
    }

    
    if (googleSignUpBtn) {
        googleSignUpBtn.addEventListener('click', handleGoogleSignIn);
    }
    
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', handleGoogleSignIn);
    }

 
    if (submitRecovery) {
        submitRecovery.addEventListener('click', async function(event) {
            event.preventDefault();
            const email = document.getElementById('recoveryEmail').value;
            
            if (!email) {
                showMessage('Please enter your email address', 'recoveryMessage');
                return;
            }

            try {
                await sendPasswordResetEmail(auth, email);
                showMessage('Password reset email sent! Please check your inbox and follow the instructions.', 'recoveryMessage');
                
                // Clear the form
                document.getElementById('recoveryEmail').value = '';
                
                
                setTimeout(() => {
                    document.getElementById('passwordRecovery').style.display = 'none';
                    document.getElementById('signIn').style.display = 'block';
                }, 3000);
            } catch (error) {
                console.error("Password reset error:", error);
                let errorMessage = 'Failed to send reset email. Please try again.';
                
                if (error.code === 'auth/user-not-found') {
                    errorMessage = 'No account found with this email address.';
                } else if (error.code === 'auth/invalid-email') {
                    errorMessage = 'Please enter a valid email address.';
                }
                
                showMessage(errorMessage, 'recoveryMessage');
            }
        });
    }
});
