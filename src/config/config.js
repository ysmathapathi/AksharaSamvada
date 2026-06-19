import { initializeApp } from "firebase/app";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";

import {
  getFirestore,
  doc,
  setDoc
} from "firebase/firestore";

const firebaseConfig = { apiKey: "AIzaSyBtDr8Yx9kj16QrYTvqxIiaw3vV6ThEVQ4", authDomain: "aksharasamvada.firebaseapp.com", projectId: "aksharasamvada", storageBucket: "aksharasamvada.firebasestorage.app", messagingSenderId: "462884191806", appId: "1:462884191806:web:340ae24466de4601d05b6f", measurementId: "G-7DXDY68WML" };
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GithubAuthProvider();
const gprovider = new GoogleAuthProvider();

// logout function
const logout = async () => {

  try {
    await signOut(auth);
    console.log("Logged out successfully");
  } catch (error) {
    console.error(error);
  }
};

// Generate custom ID
const generateCustomID = (uid) => {
  let hash = 0;

  for (let i = 0; i < uid.length; i++) {
    hash = uid.charCodeAt(i) + ((hash << 5) - hash);
  }

  const fiveDigit = Math.abs(hash % 90000) + 10000;

  return `AS${fiveDigit}`;
};


// Save user
const saveUser = async (user) => {
  if (!user) return;

  const customID = generateCustomID(user.uid);

  try {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      customID,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      phone: user.phoneNumber || null,
      likes: [],
      requests: [],
      reports: [],
      createdAt: new Date()
    });

    console.log("Saved:", customID);
  } catch (error) {
    console.error(error);
  }
};


// GitHub login
const handleGitHubLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    await saveUser(result.user);

    window.location.href = "/set-up";
  } catch (error) {
    console.error(error.message);
  }
};


// Google login
const handleGoogleSignin = async () => {
  try {
    const result = await signInWithPopup(auth, gprovider);
    await saveUser(result.user);

    window.location.href = "/set-up";
  } catch (error) {
    console.error(error.message);
  }
};


export {
  auth,
  db,
  provider,
  gprovider,
  generateCustomID,
  saveUser,
  handleGitHubLogin,
  handleGoogleSignin,
  logout
};