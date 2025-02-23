// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue , child, get } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyD5EsN7iDZGQ_-uudDM6M-5bawOiHQ5-XU",
    authDomain: "hair-palace-3b036.firebaseapp.com",
    databaseURL: "https://hair-palace-3b036-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "hair-palace-3b036",
    storageBucket: "hair-palace-3b036.firebasestorage.app",
    messagingSenderId: "810402369762",
    appId: "1:810402369762:web:3969534faa984984becebb",
    measurementId: "G-GV20Q3GZJ1"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, push, onValue ,child, get};