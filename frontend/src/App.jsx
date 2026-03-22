import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./redux/slices/authSlice";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ListingDetail from "./pages/ListingDetail";
import CreateListing from "./pages/CreateListing";
import Dashboard from "./pages/Dashboard";

// Protected route wrapper
const PrivateRoute = ({ children }) => {
  const { user, token } = useSelector((s) => s.auth);
  if (!token && !user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);

  // Restore session on page reload
  useEffect(() => {
    if (token) dispatch(loadUser());
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/create-listing" element={
          <PrivateRoute><CreateListing /></PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
