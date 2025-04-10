import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

const firebaseConfig = {
    apiKey: "AIzaSyA8a65KdnY4FzeX_UAC0tapvlE7pwQWWq0",
    authDomain: "forum-359a6.firebaseapp.com",
    projectId: "forum-359a6",
    storageBucket: "forum-359a6.firebasestorage.app",
    messagingSenderId: "558570896770",
    appId: "1:558570896770:web:7b5a2e6b4fc96a0891639b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Get DOM elements
const userEmail = document.getElementById('userEmail');
const userPopup = document.getElementById('userPopup');
const logoutBtn = document.getElementById('logoutBtn');
const navLinks = document.getElementById('nav-links');

// Show popup when email is clicked
userEmail.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent the click from bubbling up
    
    // Toggle the popup
    if (userPopup.style.display === 'block') {
        userPopup.style.display = 'none';
    } else {
        userPopup.style.display = 'block';
    }
});

// Close popup when clicking outside
document.addEventListener('click', (e) => {
    if (!userEmail.contains(e.target) && !userPopup.contains(e.target)) {
        userPopup.style.display = 'none';
    }
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            localStorage.removeItem('loggedInUserId');
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
});

onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    // Update email in nav
                    document.getElementById('loggedUserEmail').innerText = userData.email;
                    // Update popup details
                    document.getElementById('popupFName').innerText = userData.firstName;
                    document.getElementById('popupLName').innerText = userData.lastName;
                    document.getElementById('popupEmail').innerText = userData.email;
                } else {
                    console.log("No document found matching id");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    } else {
        console.log("User ID not found in Local storage");
        window.location.href = 'index.html';
    }
});