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
  const [chats, setChats] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null); // ⬅️ Tambah state ini
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

  function getPhotoUrl(photoPath) {
    if (!photoPath) return "/default-avatar.png";
    return `http://127.0.0.1:8000/storage/${photoPath}`;
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

      // Fetch matches
      fetch(`http://127.0.0.1:8000/api/matches?user_id=${parsedUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const processedMatches = data.map((m) => ({
              ...m,
              photos:
                typeof m.photos === "string"
                  ? (() => {
                      try {
                        return JSON.parse(m.photos);
                      } catch {
                        return [];
                      }
                    })()
                  : m.photos || [],
            }));
            setMatches(processedMatches);
          } else {
            setMatches([]);
            console.warn("Matches data is not an array:", data);
          }
        })
        .catch((error) => console.error("Failed to fetch matches:", error));

      // Fetch ALL chats (tidak pakai matchedUserId)
      fetch(`http://127.0.0.1:8000/api/chat/conversations?user_id=${parsedUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const processedChats = data.map((chat) => ({
              ...chat,
              matchedUser: {
                ...chat.matchedUser,
                photos:
                  typeof chat.matchedUser?.photos === "string"
                    ? (() => {
                        try {
                          return JSON.parse(chat.matchedUser.photos);
                        } catch {
                          return [];
                        }
                      })()
                    : chat.matchedUser?.photos || [],
              },
            }));
            setChats(processedChats);
          } else if (data.errors) {
            console.warn("Chats API returned errors:", data.errors);
            setChats([]);
          } else {
            setChats([]);
            console.warn("Chats data is not an array:", data);
          }
        })
        .catch((error) => console.error("Failed to fetch chat conversations:", error));
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg border-r flex flex-col">
        <div className="bg-yellow-500 h-24 flex items-center px-4 text-white relative">
          <Link to="/profile">
            <img
              src={
                profile.photos.length > 0
                  ? getPhotoUrl(profile.photos[0])
                  : "/default-avatar.png"
              }
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
            onClick={() => {
              setActiveTab("matches");
              setSelectedChatId(null);
              navigate("/home");
            }}
          >
            Matches{" "}
            <span className="ml-1 text-xs bg-yellow-500 text-white rounded-full px-2">
              {Array.isArray(matches) ? matches.length : 0}
            </span>
          </button>

          <button
            className={`flex-1 text-sm font-medium py-2 px-4 ${
              activeTab === "messages"
                ? "border-b-2 border-yellow-500 text-yellow-600"
                : "text-gray-500"
            }`}
            onClick={() => {
              setActiveTab("messages");
              navigate("/messages");
            }}
          >
            Messages{" "}
            <span className="ml-1 text-xs bg-yellow-500 text-white rounded-full px-2">
              {Array.isArray(chats) ? chats.length : 0}
            </span>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="overflow-y-auto flex-1 p-2">
          {activeTab === "matches" &&
            (matches.length === 0 ? (
              <p className="text-gray-500 text-sm text-center mt-4">
                No matches yet.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer"
                    onClick={() => setSelectedMatch(match)}
                  >
                    <img
                      src={
                        getPhotoUrl(getFirstPhoto(match)) || "/default-avatar.png"
                      }
                      alt="Match"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs font-semibold p-1 rounded-b-lg text-center">
                      {match.name}
                    </div>
                  </div>
                ))}
              </div>
            ))}

          {activeTab === "messages" &&
            (chats.length === 0 ? (
              <p className="text-gray-500 text-sm text-center mt-4">
                No messages yet.
              </p>
            ) : (
              <ul>
                {chats.map((chat) => (
                  <li
                    key={chat.id}
                    className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 ${
                      selectedChatId === chat.id ? "bg-yellow-100" : ""
                    }`}
                    onClick={() => {
                      setSelectedChatId(chat.id); // ⬅️ Set yang aktif
                      if (chat.matchedUser) {
                        localStorage.setItem(
                          "matchedUser",
                          JSON.stringify(chat.matchedUser)
                        );
                        navigate(`/messages/${chat.matchedUser.id}`);
                      }
                    }}
                  >
                    <img
                      src={
                        chat.matchedUser &&
                        Array.isArray(chat.matchedUser.photos) &&
                        chat.matchedUser.photos.length > 0
                          ? getPhotoUrl(chat.matchedUser.photos[0])
                          : "/default-avatar.png"
                      }
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-3 flex-1 border-b border-gray-200 pb-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold">
                          {chat.matchedUser?.name || "Unknown"}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {chat.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {chat.lastMessage || "No messages yet."}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet context={{ currentUser: user }} />
      </div>

      {/* Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{selectedMatch.name}</h2>
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <img
              src={
                getPhotoUrl(getFirstPhoto(selectedMatch)) ||
                "/default-avatar.png"
              }
              alt="Match"
              className="w-full h-48 object-cover rounded-lg mb-2"
            />
            <p className="text-sm text-gray-600 mb-4">
              {selectedMatch.description || "No description."}
            </p>
            <button
              onClick={() => {
                navigate('/messages', { state: { matchedUser: selectedMatch } });
              }}
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition w-full"
            >
              Start Chatting...
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
