import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

const dummyData = [
  { name: "Magnus Rodriguez", message: "Et doloremque ea officiis rerum c..." },
  { name: "Prof. Lyla Johnston PhD", message: "Debitis a autem dicta. Commodi v..." },
  { name: "Miss Marcelle Weimann II", message: "Rerum qui accusantium quam qu..." },
  { name: "Zackary Becker", message: "Placeat aut quia nostrum saepe s..." },
  { name: "Megane Schaefer", message: "Officia expedita culpa facilis face..." },
  { name: "Ricky Harris", message: "Est modi explicabo necessitatib..." },
  { name: "Dr. Issac Aufderhar Jr.", message: "Et sit eum aut aut ut dolorem blan..." },
];

export default function UserLayout() {
  const [activeTab, setActiveTab] = useState("matches");
  const [user, setUser] = useState(null); // Declare state for the user
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    birthdate: "",
    gender: "",
    status: "",
    description: "",
    photos: [],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let parsedUser = null;

    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);

        // Kalau photos masih string, parse jadi array
        if (typeof parsedUser.photos === "string") {
          parsedUser.photos = JSON.parse(parsedUser.photos);
        }
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
      console.log("User photos:", profile.photos);

    }

    if (parsedUser) {
      setUser(parsedUser);
      setProfile({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        birthdate: parsedUser.birthdate || "",
        gender: parsedUser.gender || "",
        status: parsedUser.status || "",
        description: parsedUser.description || "",
        photos: parsedUser.photos || [],
      });
    }
  }, []);
  function getPhotoUrl(photoPath) {
    if (!photoPath) return "/default-avatar.png";
    return `http://127.0.0.1:8000/storage/${photoPath}`;
  }



  //   const storedProfile = localStorage.getItem("profile"); // Ambil profile dari localStorage
  //   if (storedUser) {
  //     try {
  //       setUser(JSON.parse(storedUser));
  //     } catch (err) {
  //       console.error("Error parsing user from localStorage", err);
  //     }
  //   }
  //   if (storedProfile) {
  //     try {
  //       setProfile(JSON.parse(storedProfile)); // Ambil profile yang telah disimpan
  //     } catch (err) {
  //       console.error("Error parsing profile from localStorage", err);
  //     }
  //   }
  // }, []);

  if (!user) {
    return <div>Loading...</div>; // Render a loading state while user data is being fetched
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg border-r flex flex-col">
        {/* Header */}
        <div className="bg-yellow-500 h-24 flex items-center px-4 text-white relative">
          {/* Profile Image (Left) */}
          <Link to="/profile">
            <img
              src={profile.photos.length > 0 ? getPhotoUrl(profile.photos[0]) : "/default-avatar.png"}
              alt="Profile"
              className="w-12 h-12 bg-gray-300 rounded-full hover:ring-2 hover:ring-white transition"
            />
          </Link>

          {/* Title (Center) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 mr-2">
            <p className="font-semibold text-lg">{user.name}</p>
          </div>

          {/* Logout Button (Right) */}
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="ml-auto text-sm bg-white text-black px-3 py-1 rounded-full hover:bg-yellow-100 transition"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 text-sm font-medium py-2 px-4 ${activeTab === "matches" ? "border-b-2 border-yellow-500 text-yellow-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("matches")}
          >
            Matches <span className="ml-1 text-xs bg-yellow-500 text-white rounded-full px-2">7</span>
          </button>
          <button
            className={`flex-1 text-sm font-medium py-2 px-4 ${activeTab === "messages" ? "border-b-2 border-yellow-500 text-yellow-600" : "text-gray-500"}`}
            onClick={() => setActiveTab("messages")}
          >
            Messages <span className="ml-1 text-xs bg-yellow-500 text-white rounded-full px-2">7</span>
          </button>
        </div>

        {/* User List */}
        <div className="overflow-y-auto flex-1 px-2 py-2">
          {dummyData.map((user, index) => (
            <div
              key={index}
              className="flex items-start p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
              <div>
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-gray-500 truncate w-56">
                  {user.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content (Right Side) */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
