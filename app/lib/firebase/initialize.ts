
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAtnLdyncyhKflRYuAnkYIqNPo84U-Wdcc",
    authDomain: "purel-c7502.firebaseapp.com",
    projectId: "purel-c7502",
    storageBucket: "purel-c7502.firebasestorage.app",
    messagingSenderId: "623307554548",
    appId: "1:623307554548:web:ae4370f6f23a007bd3e8a1",
    measurementId: "G-3CZF2C0NVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };