import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function UserLayout() {
  const [activeTab, setActiveTab] = useState("matches");
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    birthdate: "",
    gender: "",
    status: "",
    description: "",
    photos: [],
  });
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  function getFirstPhoto(match) {
    if (!match.photos) return null;
    if (typeof match.photos === "string") {
      try {
        const photosArray = JSON.parse(match.photos);
        return photosArray.length > 0 ? photosArray[0] : null;
      } catch {
        return null;
      }
    }
    return match.photos.length > 0 ? match.photos[0] : null;
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    let parsedUser = null;

    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);
        if (typeof parsedUser.photos === "string") {
          parsedUser.photos = JSON.parse(parsedUser.photos);
        }
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
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

      fetch(`http://127.0.0.1:8000/api/matches?user_id=${parsedUser.id}`)
        .then((res) => res.json())
        .then((data) => setMatches(data))
        .catch((error) => console.error("Failed to fetch matches:", error));
    }
  }, []);

  function getPhotoUrl(photoPath) {
    if (!photoPath) return "/default-avatar.png";
    return `http://127.0.0.1:8000/storage/${photoPath}`;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg border-r flex flex-col">
        {/* Header */}
        <div className="bg-yellow-500 h-24 flex items-center px-4 text-white relative">
          <Link to="/profile">
            <img
              src={profile.photos.length > 0 ? getPhotoUrl(profile.photos[0]) : "/default-avatar.png"}
              alt="Profile"
              className="w-12 h-12 bg-gray-300 rounded-full hover:ring-2 hover:ring-white transition"
            />
          </Link>

          <div className="absolute left-1/2 transform -translate-x-1/2 mr-2">
            <p className="font-semibold text-lg">{user.name}</p>
          </div>

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
            className={`flex-1 text-sm font-medium py-2 px-4 ${
              activeTab === "matches"
                ? "border-b-2 border-yellow-500 text-yellow-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("matches")}
          >
            Matches{" "}
            <span className="ml-1 text-xs bg-yellow-500 text-white rounded-full px-2">
              {matches.length}
            </span>
          </button>
          <button
            className={`flex-1 text-sm font-medium py-2 px-4 ${
              activeTab === "messages"
                ? "border-b-2 border-yellow-500 text-yellow-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("messages")}
          >
            Messages{" "}
            <span className="ml-1 text-xs bg-yellow-500 text-white rounded-full px-2">
              0
            </span>
          </button>
        </div>

        {/* Match Grid */}
        <div className="overflow-y-auto flex-1 p-2">
          {matches.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-4">
              No matches yet.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className="relative cursor-pointer"
                  onClick={() => navigate(`/chat/${match.id}`)}
                >
                  <img
                    src={getPhotoUrl(getFirstPhoto(match)) || "/default-avatar.png"}
                    alt="Match"
                    className="w-full h-24 object-cover rounded-lg"
                  />

                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs font-semibold p-1 rounded-b-lg text-center">
                    {match.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
