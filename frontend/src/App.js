import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import CountryList from "./components/CountryList";
import LoginPage from "./components/LoginPage.js";
import RegisterPage from "./components/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">Country Explorer</a>
          <div>
            {user ? (
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            ) : (
              <div>
                <button className="btn btn-primary me-2" onClick={() => navigate("/login")}>Login</button>
                <button className="btn btn-outline-primary" onClick={() => navigate("/register")}>Register</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <CountryList />
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;