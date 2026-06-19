import { useEffect, useState } from "react";
import { auth, db } from "./config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const useUser = () => {
  const [userData, setUserData] = useState(null);
  const [userPFP, setUserPFP] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userPno, setUserPno] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          try {
            setUserPFP(user.photoURL);
            setUserName(user.displayName);
            setUserEmail(user.email);
            setUserPno(user.phoneNumber);

            const docRef = doc(
              db,
              "users",
              user.uid
            );

            const docSnap =
              await getDoc(docRef);

            if (docSnap.exists()) {
              setUserData(docSnap.data());
            }
          } catch (error) {
            console.error(error);
          }
        } else {
          setUserData(null);
          setUserPFP(null);
          setUserName(null);
          setUserEmail(null);
          setUserPno(null);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    userData,
    userPFP,
    userName,
    userEmail,
    userPno,
    loading
  };
};

export default useUser;