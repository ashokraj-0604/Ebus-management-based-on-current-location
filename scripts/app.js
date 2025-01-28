// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAbYTSTs-wth8_qVGvjgThIG-__Ek69NtE",
  authDomain: "ebus-management-9a2ba.firebaseapp.com",
  projectId: "ebus-management-9a2ba",
  storageBucket: "ebus-management-9a2ba.appspot.com",
  messagingSenderId: "1080724320675",
  appId: "1:1080724320675:web:50f4dd697e19a15174aa16",
  measurementId: "G-BWXE2GPSL9"
};
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();