import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const isProfileComplete = (user) => {
    const photos = Array.isArray(user.photos) ? user.photos : [];

    return !!user.birthday && photos.length > 0;
  };


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

      // ✅ DEBUG: cek isi data user
      console.log("Birthday:", data.user.birthday);
      console.log("Photos:", data.user.photos);
      console.log("isProfileComplete:", isProfileComplete(data.user));

      console.log("Login Success:", data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("major", JSON.stringify(data.major));
      localStorage.setItem("faculty", JSON.stringify(data.faculty));
      
      if (isProfileComplete(data.user)) {
      navigate("/home");
      } else {
        navigate("/profile");
      }
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-yellow-100 items-center justify-center">
      <div className="flex w-[90%] max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* Left Side - Form */}
        <div className="w-1/2 p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome back<span className="ml-1">👋</span></h1>
          <p className="mb-8 text-sm text-gray-600">Please enter your details.</p>

          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

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

          <div className="flex justify-between items-center text-sm mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember for 30 days
            </label>
            <a href="#" className="text-yellow-500">Forgot password?</a>
          </div>

          <button
            className="w-full bg-yellow-500 text-white py-3 rounded-lg text-sm font-semibold hover:bg-yellow-600"
            onClick={handleLogin}
          >
            Log In
          </button>

          <p className="text-sm text-center mt-6">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-yellow-500 font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2">
          <img
            src="/Loginpage2.jpg"
            alt="Login Visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
