import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
  };
 
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const auth = getAuth();
  const db = getFirestore();

  onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
      console.log(user);
      const docRef = doc(db, "users", loggedInUserId);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            document.getElementById('loggedUserFName').innerText = userData.firstName;
            document.getElementById('loggedUserEmail').innerText = userData.email;
            document.getElementById('loggedUserLName').innerText = userData.lastName;
            
            // Display profile picture if available in user data
            if (userData.profilePicUrl) {
              document.getElementById('profilePic').src = userData.profilePicUrl;
            } else if (user.photoURL) {
              // If user signed in with Google, they might have a photoURL
              document.getElementById('profilePic').src = user.photoURL;
            }
          } else {
            console.log("no document found matching id");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    } else {
      console.log("User Id not Found in Local storage");
    }
  });

  const logoutButton = document.getElementById('logout');

  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
      .then(() => {
        window.location.href = 'Login.html';  // Changed from index.html to Login.html
      })
      .catch((error) => {
        console.error('Error Signing out:', error);
      });
  });
