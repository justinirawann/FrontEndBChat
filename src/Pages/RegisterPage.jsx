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

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You have successfully registered!",
        timer: 2000,
        showConfirmButton: false,
      });

      localStorage.setItem("token", data.token);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-yellow-100 items-center justify-center">
      <div className="flex w-[90%] max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* Left Side - Form */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Create an account ✨</h1>
          <p className="mb-8 text-sm text-gray-600">Start your journey with us today.</p>

          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          <div className="mb-4">
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            className="w-full bg-yellow-500 text-white py-3 rounded-lg text-sm font-semibold hover:bg-yellow-600"
            onClick={handleRegister}
          >
            Sign Up
          </button>

          <p className="text-sm text-center mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-yellow-500 font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2">
          <img
            src="/Loginpage2.jpg"
            alt="Register Visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
