import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Auth from "../Pages/Auth/Auth";
import SetUp from "../Pages/Auth/Setup/SetUp";
import Home from "../Pages/Home/Home";
import UserProfile from "../Pages/Profile/Profile";

import "../fonts.css";

import { auth, db } from "../config/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Router = () => {
  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [isSetupComplete,
    setIsSetupComplete] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          if (user) {
            setIsLoggedIn(true);

            try {
              const docRef = doc(
                db,
                "users",
                user.uid
              );

              const docSnap =
                await getDoc(docRef);

              if (
                docSnap.exists()
              ) {
                const userData =
                  docSnap.data();

                setIsSetupComplete(
                  userData
                    .isSetupComplete ||
                  false
                );
              } else {
                setIsSetupComplete(
                  false
                );
              }
            } catch (error) {
              console.error(
                "Firestore Error:",
                error
              );
              setIsSetupComplete(
                false
              );
            }
          } else {
            setIsLoggedIn(false);
            setIsSetupComplete(
              null
            );
          }

          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <h1>
        Loading...
      </h1>
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* Auth Page */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              isSetupComplete ? (
                <Navigate
                  to="/home"
                />
              ) : (
                <Navigate
                  to="/set-up"
                />
              )
            ) : (
              <Auth />
            )
          }
        />

        {/* Setup Page */}
        <Route
          path="/set-up"
          element={
            isLoggedIn ? (
              isSetupComplete ? (
                <Navigate
                  to="/home"
                />
              ) : (
                <SetUp />
              )
            ) : (
              <Navigate
                to="/"
              />
            )
          }
        />

        {/* Home Page */}
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              isSetupComplete ? (
                <Home />
              ) : (
                <Navigate
                  to="/set-up"
                />
              )
            ) : (
              <Navigate
                to="/"
              />
            )
          }
        />

        {/* Dynamic User Profile */}
        <Route
          path="/asuser/:customId"
          element={
            isLoggedIn ? (
              isSetupComplete ? (
                <UserProfile />
              ) : (
                <Navigate
                  to="/set-up"
                />
              )
            ) : (
              <Navigate
                to="/"
              />
            )
          }
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <Navigate to="/" />
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default Router;