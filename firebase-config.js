// firebase-config.js
// Firebase initialization for SmartPark real-time slot sync.
// This file must be loaded as a module BEFORE script.js in index.html.

// 1) Replace this with YOUR OWN config from:
//    Firebase Console -> Project Settings -> General -> Your apps -> Web app
const firebaseConfig = {
    apiKey: "AIzaSyAwCmIT80872V-MDHiYlUgPqOenjTaIqRg",
    authDomain: "smartpark-hg.firebaseapp.com",
    databaseURL: "https://smartpark-hg-default-rtdb.firebaseio.com",
    projectId: "smartpark-hg",
    storageBucket: "smartpark-hg.firebasestorage.app",
    messagingSenderId: "133491256946",
    appId: "1:133491256946:web:9f1dfe6a38ffb2a986dceb"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    update,
    onValue,
    get
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Expose a small API on window so script.js (a plain, non-module script)
// can call into Firebase without being converted into a module itself.
window.SmartParkFirebase = {
    db,
    ref,
    set,
    update,
    onValue,
    get,
    auth,
    googleProvider,
    signInWithPopup
};

// Let script.js know Firebase is ready, since module scripts execute
// asynchronously relative to regular scripts.
document.dispatchEvent(new CustomEvent('firebase:ready'));

console.log('Firebase initialized for SmartPark');
