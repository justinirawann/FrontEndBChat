import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           "Accept": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0][0];
          setError(firstError);
        } else {
          setError(data.message || "Registration failed");
        }
        return;
      }

      // Success: Tampilkan swal dan redirect
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You have successfully registered!",
        timer: 2000,
        showConfirmButton: false,
      });

      localStorage.setItem("token", data.token);

      // Delay sebentar supaya swal sempat muncul sebelum redirect
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Form */}
      <div className="w-1/2 bg-white flex flex-col justify-center p-12">
        <h1 className="text-2xl font-semibold mb-4">Create an account</h1>
        <p className="mb-8 text-gray-600">Start your journey with us today.</p>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Name */}
        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-700">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
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

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-700">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-700">Confirm Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded mb-4 hover:bg-blue-700"
          onClick={handleRegister}
        >
          Sign up
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500">Sign in</a>
        </p>
      </div>

      {/* Right Side - Image and Quote */}
      <div className="w-1/2 bg-gray-100 relative">
        <img
          src="/LoginPage.jpg"
          alt="Register Illustration"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-10 left-10 bg-white bg-opacity-70 p-4 rounded-lg backdrop-blur">
          <p className="text-lg font-semibold mb-2">
            “The beginning is the most important part of the work.” – Plato
          </p>
          <p className="text-sm font-bold">Your Journey Starts Here</p>
        </div>
      </div>
    </div>
  );
}
