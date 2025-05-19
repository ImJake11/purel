
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBcdswIubI98DtXAs2Si-s2dM2BJAZIUnY",
    authDomain: "isafe-fcac7.firebaseapp.com",
    projectId: "isafe-fcac7",
    storageBucket: "isafe-fcac7.appspot.com",
    messagingSenderId: "681524512641",
    appId: "1:681524512641:web:1d259e93de6f2aa1db8a80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };