import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

const RegisterPage = () => {
  const [userData, setUserData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(userData);
      navigate("/login");
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <h2 className="mb-4">Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            onChange={(e) => setUserData({...userData, username: e.target.value})}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            onChange={(e) => setUserData({...userData, password: e.target.value})}
          />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
        <button 
          type="button" 
          className="btn btn-link"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;