import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


const handleLogin = async () => {
    try {
        const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
        });

        if (!response.ok) {
        throw new Error("Login failed");
        }

        const data = await response.json();
        console.log("Login Success:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user)); // simpan data user
        // Navigate to HomePage after successful login
        navigate("/home");
    } catch (err) {
        console.error(err);
        setError(err.message || "Login failed");
    }
    };


  return (
    <div className="flex h-screen">
      {/* Left Side - Form */}
      <div className="w-1/2 bg-white flex flex-col justify-center p-12">
        <h1 className="text-2xl font-semibold mb-4">Welcome back</h1>
        <p className="mb-8 text-gray-600">Welcome back! Please enter your details.</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-700">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-700">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-between mb-4">
          <div>
            <input type="checkbox" className="mr-2" />
            <span>Remember for 30 days</span>
          </div>
          <a href="#" className="text-sm text-blue-500">Forgot password?</a>
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded mb-4 hover:bg-blue-700"
          onClick={handleLogin}
        >
          Sign in
        </button>

        <p className="text-sm text-center">
          Don’t have an account? <a href="#" className="text-blue-500">Sign up for free</a>
        </p>
      </div>

      {/* Right Side - Image and Quote */}
      <div className="w-1/2 bg-gray-100 relative">
        <img
          src="/LoginPage.jpg"
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-10 left-10 bg-white bg-opacity-70 p-4 rounded-lg backdrop-blur">
          <p className="text-lg font-semibold mb-2">
            “We’ve been using Untitled to kick start every new project and can’t imagine working without it.”
          </p>
          <p className="text-sm font-bold">Andi Lane</p>
          <p className="text-xs">Founder, Catalog - Web Design Agency</p>
        </div>
      </div>
    </div>
  );
}
