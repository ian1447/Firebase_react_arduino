import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth, app } from "./config/firebase";
//import firebase from './firebase/firebase';
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import UserManagement from "./components/Dashboard/UserManagement";
import Signup from "./components/Signup/Signup";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log(user);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (localStorage.getItem("user") == null) {
      auth.onAuthStateChanged(setUser);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {" "}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/management" element={user ? <UserManagement /> : <Navigate to="/login" />} />
        <Route path="/management" element={<UserManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
