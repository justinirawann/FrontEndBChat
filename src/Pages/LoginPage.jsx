import React from 'react';

export default function LoginPage() {
  return (
    <div className="flex h-screen">
      {/* Left Side - Form */}
      <div className="w-1/2 bg-white flex flex-col justify-center p-12">
        <h1 className="text-2xl font-semibold mb-4">Welcome back</h1>
        <p className="mb-8 text-gray-600">Welcome back! Please enter your details.</p>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-700">Email</label>
          <input type="email" className="w-full p-2 border rounded" placeholder="Enter your email" />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-700">Password</label>
          <input type="password" className="w-full p-2 border rounded" placeholder="Enter your password" />
        </div>

        <div className="flex justify-between mb-4">
          <div>
            <input type="checkbox" className="mr-2" />
            <span>Remember for 30 days</span>
          </div>
          <a href="#" className="text-sm text-blue-500">Forgot password?</a>
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded mb-4 hover:bg-blue-700">Sign in</button>
        {/* <button className="w-full border py-2 rounded mb-4 flex justify-center items-center hover:bg-gray-100" onClick={() => console.log('Google sign in button clicked')}>
        <img src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png" alt="Google Sign In" className="mr-2" />
        <span>Sign in with Google</span>
        </button> */}

        <p className="text-sm text-center">
          Don’t have an account? <a href="#" className="text-blue-500">Sign up for free</a>
        </p>
      </div>

      {/* Right Side - Image and Quote */}
      <div className="w-1/2 bg-gray-100 relative">
        <img
          src="/public/LoginPage.jpg"
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
