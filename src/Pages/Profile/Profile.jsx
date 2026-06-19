import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";
import {
  auth,
  db
} from "../../config/config";
import {
  updateEmail,
  updatePassword
} from "firebase/auth";

const UserProfile = () => {
  const { customId } = useParams();

  const [profileUser, setProfileUser] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) return;

      // current logged-in user data
      const currentQuery = query(
        collection(db, "users"),
        where("uid", "==", currentUser.uid)
      );

      const currentSnapshot = await getDocs(currentQuery);

      currentSnapshot.forEach((docSnap) => {
        setCurrentUserData({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });

      // profile being visited
      const profileQuery = query(
        collection(db, "users"),
        where("customID", "==", customId)
      );

      const profileSnapshot = await getDocs(profileQuery);

      profileSnapshot.forEach((docSnap) => {
        setProfileUser({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });
    };

    fetchData();
  }, [customId]);

  // Like user
  const likeUser = async () => {
    if (!profileUser || !currentUserData) return;

    await updateDoc(doc(db, "users", profileUser.id), {
      likes: arrayUnion(currentUserData.customID),
    });

    alert("Liked user");
  };

  // Send request
  const sendRequest = async () => {
    if (!profileUser || !currentUserData) return;

    await updateDoc(doc(db, "users", profileUser.id), {
      requests: arrayUnion(currentUserData.customID),
    });

    alert("Request sent");
  };

  // Edit email
  const changeEmail = async () => {
    await updateEmail(auth.currentUser, newEmail);
    alert("Email updated");
  };

  // Edit password
  const changePassword = async () => {
    await updatePassword(auth.currentUser, newPassword);
    alert("Password updated");
  };

  if (!profileUser || !currentUserData) return <h1>Loading...</h1>;

  const isOwner =
    currentUserData.customID === profileUser.customID;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img src={profileUser.photo} alt="profile" />

        <h1>{profileUser.name}</h1>
        <p>{profileUser.customID}</p>

        <div className="stats">
          <div>
            <h2>{profileUser.likes?.length || 0}</h2>
            <p>Likes</p>
          </div>

          <div>
            <h2>{profileUser.requests?.length || 0}</h2>
            <p>Requests</p>
          </div>
        </div>

        {isOwner ? (
          <div className="owner-actions">
            <input
              type="email"
              placeholder="New Email"
              onChange={(e) =>
                setNewEmail(e.target.value)
              }
            />

            <button onClick={changeEmail}>
              Update Email
            </button>

            <input
              type="password"
              placeholder="New Password"
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
            />

            <button onClick={changePassword}>
              Update Password
            </button>
          </div>
        ) : (
          <div className="actions">
            <button onClick={sendRequest}>
              Send Request
            </button>

            <button onClick={likeUser}>
              Like Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;