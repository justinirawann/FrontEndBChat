import { useEffect, useState } from "react";
import Swal from "sweetalert2";


export default function HomePage() {
  const [user, setUser] = useState(null);
  const [preferredGender, setPreferredGender] = useState("");
  const [preferredCampus, setPreferredCampus] = useState("");
  const [showPreferences, setShowPreferences] = useState(false);
  const [matches, setMatches] = useState([]);
  const [showInfo, setShowInfo] = useState(false);


  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
    setUser(storedUser);
    setPreferredGender(storedUser.preferred_gender || "");
    setPreferredCampus(storedUser.preferred_campus || "");
    }
  }, []);

  // Fetch matches when user is ready
  useEffect(() => {
    if (user && user.id) {
      refreshMatches();
      fetchNewMatchesAndNotify();
    }
  }, [user]);

  // Polling setiap 5 detik untuk cek match baru
  useEffect(() => {
    if (!user || !user.id) return;

    const interval = setInterval(() => {
      fetchNewMatchesAndNotify();
    }, 3000); // 5000 ms = 5 detik

    return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
  }, [user]);


  const refreshMatches = async () => {
    try {
      Swal.fire({
        title: "Loading matches...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await fetch("http://127.0.0.1:8000/api/show-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });

      if (!res.ok) throw new Error("Failed to fetch matches");

      const data = await res.json();
      setMatches(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error(err);
    } finally {
      Swal.close();
    }
  };
  
  const fetchNewMatchesAndNotify = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/get-new-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });

      if (!res.ok) throw new Error("Failed to fetch new matches");

      const newMatches = await res.json();

      if (newMatches.length > 0) {
        for (const match of newMatches) {
          await Swal.fire({
            title: "It's a match!",
            text: `You matched with ${match.name}`,
            imageUrl: match.photos ? `http://127.0.0.1:8000/storage/${JSON.parse(match.photos)[0]}` : undefined,
            imageWidth: 300,
            imageHeight: 300,
            confirmButtonText: "Nice!",
          });
        }

        const matchIds = newMatches.map((m) => m.match_id);
        await fetch("http://127.0.0.1:8000/api/mark-matches-notified", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ match_ids: matchIds }),
        });
      }
    } catch (err) {
      console.error("Error fetching new matches notifications:", err);
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/preferences/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          preferred_gender: preferredGender,
          preferred_campus: preferredCampus,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Preferences updated!",
          confirmButtonText: "Okay!",
        });
        localStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user);
        setShowPreferences(false);
      } else {
        alert(result.message || "Failed to update preferences");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Error connecting to server");
    }
  };

  return (
    <div
      className="relative min-h-screen p-6"
      style={{
        // backgroundImage: 'url("/homepage.png")',
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-white/60 z-0"></div>
      <div className="relative z-10">
        {/* Preferences Button */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-xl shadow hover:bg-orange-600 transition"
          >
            Preferences
          </button>
        </div>

        {/* Preferences Form */}
        {showPreferences && (
          <div className="absolute top-20 right-6 bg-white p-6 rounded-xl shadow-xl w-72 z-30">
            <h3 className="text-lg font-semibold mb-4">Set Preferences</h3>

            <label className="block mb-2 text-sm font-medium">Preferred Gender</label>
            <select
              className="w-full p-2 border rounded mb-4"
              value={preferredGender}
              onChange={(e) => setPreferredGender(e.target.value)}
            >
              <option value="">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <label className="block mb-2 text-sm font-medium">Preferred Campus</label>
            <select
              className="w-full p-2 border rounded mb-4"
              value={preferredCampus}
              onChange={(e) => setPreferredCampus(e.target.value)}
            >
              <option value="">Any</option>
              {[
                "BINUS @Kemanggisan",
                "BINUS @Alam Sutera",
                "BINUS @Senayan",
                "BINUS @Bekasi",
                "BINUS @Bandung",
                "BINUS @Malang",
                "BINUS @Semarang",
              ].map((campus) => (
                <option key={campus} value={campus}>
                  {campus}
                </option>
              ))}
            </select>

            <button
              onClick={handleSavePreferences}
              className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
            >
              Save Preferences
            </button>
          </div>
        )}

        {/* Matches Display */}
        <div className="flex flex-wrap justify-center gap-6 mt-20">
          {matches.map((matchUser) => (
            <MatchCard key={matchUser.id} user={matchUser} onActionDone={refreshMatches} />
          ))}
        </div>
      </div>
    </div>
  );
}

function calculateAge(birthday) {
  if (!birthday) return null;
  const birthDate = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
  }

  function InfoRow({ label, value }) {
    return (
      <div className="flex items-start gap-2">
        <span className="font-semibold w-28">{label}:</span>
        <span>{value}</span>
      </div>
    );
  }

function MatchCard({ user, onActionDone }) {
  const photosArray = user.photos ? JSON.parse(user.photos) : [];
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const handleLike = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.id,
          liked_user_id: user.id,
        }),
      });
      const data = await res.json();
      Swal.fire("❤️", data.message, "success");
      onActionDone();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to like user", "error");
    }
  };

  const handleDislike = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/dislike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.id,
          disliked_user_id: user.id,
        }),
      });
      const data = await res.json();
      Swal.fire("❌", data.message, "info");
      onActionDone();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to skip user", "error");
    }
  };

  const prevPhoto = () => {
    if (photoIndex > 0) setPhotoIndex(photoIndex - 1);
  };

  const nextPhoto = () => {
    if (photoIndex < photosArray.length - 1) setPhotoIndex(photoIndex + 1);
  };
  console.log(user); 
  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center w-80 relative">
        <div className="relative w-full h-96 mb-4 rounded-2xl overflow-hidden select-none">
          {/* Tombol Info di kanan atas */}
          <button
            onClick={() => setShowInfo(true)}
            className="absolute top-3 right-3 z-10 bg-white/70 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white"
          >
            ℹ️
          </button>

          {photosArray.length > 0 ? (
            <>
              <img
                src={`http://127.0.0.1:8000/storage/${photosArray[photoIndex]}`}
                alt={`Photo ${photoIndex + 1}`}
                className="w-full h-full object-cover rounded-2xl"
                draggable={false}
              />
              {/* Tombol prev */}
            <button
              onClick={prevPhoto}
              disabled={photoIndex === 0}
              aria-label="Previous photo"
              className={`absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-transform
                ${photoIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-black/60 hover:scale-110 active:scale-95"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {/* Tombol next */}
            <button
              onClick={nextPhoto}
              disabled={photoIndex === photosArray.length - 1}
              aria-label="Next photo"
              className={`absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-transform
                ${photoIndex === photosArray.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-black/60 hover:scale-110 active:scale-95"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            </>
          ) : (
            <img
              src="https://via.placeholder.com/400x400?text=No+Image"
              alt="No Image"
              className="w-full h-full object-cover rounded-2xl"
            />
          )}
        </div>

        <h2 className="text-xl font-semibold select-text">
          {user.name} {calculateAge(user.birthdate)}
        </h2>
        <p className="text-sm text-gray-500 mb-4 select-text">{user.campus}</p>

        <div className="flex justify-around mt-4">
          <button
            onClick={handleDislike}
            className="bg-white border border-gray-300 p-3 rounded-full shadow hover:bg-red-100 transition"
          >
            ❌
          </button>
          <button
            onClick={handleLike}
            className="bg-white border border-gray-300 p-3 rounded-full shadow hover:bg-blue-100 transition"
          >
            ❤️
          </button>
        </div>
      </div>

      {/* MODAL INFO */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative transition-all duration-300 ease-out scale-100">
            {/* Close button */}
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* User photo */}
            <div className="w-full h-60 rounded-xl overflow-hidden mb-4">
              <img
                src={user.photos ? `http://127.0.0.1:8000/storage/${JSON.parse(user.photos)[0]}` : "https://via.placeholder.com/400x400?text=No+Image"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* User name + age */}
            <h2 className="text-2xl font-bold text-center mb-1">{user.name}, {calculateAge(user.birthdate)}</h2>
            <p className="text-center text-sm text-gray-500 mb-4 italic">{user.status}</p>

            {/* Info grid */}
            <div className="space-y-2 text-sm text-gray-800">
              <InfoRow label="🎓 Faculty" value={user.faculty || "-"} />
              <InfoRow label="📘 Major" value={user.major || "-"} />
              <InfoRow label="📍 Campus" value={user.campus || "-"} />
            </div>
          </div>
        </div>
      )}



    </>
  );
}

