import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../../config/config';

import './SetUp.css'
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const SetUp = () => {
  const [userPFP, setUserPFP] = useState();
  const [userPno, setUserPno] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Hash password
  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  // Save password
  const savePassword = async () => {
    const user = auth.currentUser;

    if (!user) return alert("No user logged in");

    if (password !== verifyPassword) {
      return alert("Passwords do not match");
    }

    const hashedPass = await hashPassword(password);

    await updateDoc(doc(db, "users", user.uid), {
      chataccesspass: hashedPass,
      isSetupComplete: true
    });

    window.location.href = "/home"

    alert("Password saved successfully");
  };

  // Verify password
  const verifyChatPassword = async () => {
    const user = auth.currentUser;

    if (!user) return alert("No user logged in");

    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return alert("User data not found");

    const savedHash = docSnap.data().chataccesspass;

    const enteredHash = await hashPassword(loginPassword);

    if (savedHash === enteredHash) {
      alert("Access granted");
    } else {
      alert("Wrong password");
    }
  };

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No user found");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserPFP(currentUser.photoURL);
        setUserName(currentUser.displayName);
        setUserEmail(currentUser.email);
        setUserPno(currentUser.phoneNumber);
      } else {
        setUserPFP({
          photo: 'https://www.gstatic.com/mobilesdk/240501_mobilesdk/firebase_28dp.png'
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>

      <center>
        <div className="welcomeMsg">
          <h1 className="btxt">Welcome {userName}</h1><br />
          <p className="stxt">Let us finish setting up!</p>
        </div>
        <div className="setup">
          <div className="emailandphoto">
            <img src={`${userPFP}`} alt="" className="photo" />
            <div className="creds">
              <p className='email btxt'><span style={{ color: '#FF5F1F' }}>Your Email:</span>{userEmail}</p>

              <p className="asid btxt"><span style={{ color: '#FF5F1F' }}>Your ASID:</span> {userData.customID}</p>

              <p className="asid btxt"><span style={{ color: '#FF5F1F' }}>Your Phone Number:</span> {userPno ? userPno : "No Phone Number Provided"}</p>

            </div>
          </div>
          
          </div>
          <div className="password-wrapper" style={{marginTop: '10px', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px'}}>
            <div className="createpassword">
              <h2>Create Chat Password</h2>

              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Verify password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
              />

              <button onClick={savePassword}>Save Password</button>
            </div>
        </div>
      </center>

    </>
  )
}

export default SetUp