import { useEffect, useState } from "react";
import { useAuth } from "./Context/UserContext";
import Customize from "./pages/Customize";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { Routes, Route, Navigate } from "react-router-dom";
import Customize2 from "./pages/Customize2";

function App() {
  const { profile, setProfile } = useAuth();
  console.log(profile)

  return (
    <Routes>
      <Route
        path="/"
        element={
          profile?.assistentname && profile?.assistentimage ? (
            <Home />
          ) : (
            <Navigate to={"/cust"} />
          )
        }
      ></Route>
      <Route
        path="/signup"
        element={!profile ? <SignUp /> : <Navigate to={"/"} />}
      ></Route>
      <Route
        path="/signin"
        element={!profile ? <SignIn /> : <Navigate to={"/"} />}
      ></Route>
      <Route
        path="/cust"
        element={profile ? <Customize /> : <Navigate to={"/signin"} />}
      ></Route>
      <Route
        path="/cust2"
        element={profile ? <Customize2 /> : <Navigate to={"/signin"} />}
      ></Route>
    </Routes>
  );
}

export default App;
