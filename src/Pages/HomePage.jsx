  import { useEffect, useState } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import Swal from "sweetalert2";
  import { Mars, Venus, RotateCw } from "lucide-react";

  export default function HomePage() {
    const [user, setUser] = useState(null);
    const [preferredGender, setPreferredGender] = useState("");
    const [preferredCampus, setPreferredCampus] = useState("");
    const [showPreferences, setShowPreferences] = useState(false);
    const [matches, setMatches] = useState([]);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
        setPreferredGender(storedUser.preferred_gender || "");
        setPreferredCampus(storedUser.preferred_campus || "");
      }
    }, []);

    useEffect(() => {
      if (user && user.id) {
        refreshMatches();
        fetchNewMatchesAndNotify();
      }
    }, [user]);

    useEffect(() => {
      if (!user || !user.id) return;
      const interval = setInterval(() => {
        fetchNewMatchesAndNotify();
      }, 10000);
      return () => clearInterval(interval);
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
          const names = newMatches.map((m) => m.name).join(", ");
          await Swal.fire({
            title: "It's a match!",
            html: `You matched with: <b>${names}</b>`,
            imageUrl: newMatches[0].photos
              ? `http://127.0.0.1:8000/storage/${
                  JSON.parse(newMatches[0].photos)[0]
                }`
              : undefined,
            imageWidth: 300,
            imageHeight: 300,
            confirmButtonText: "Nice!",
          });

          const matchIds = newMatches.map((m) => m.match_id);
          await fetch("http://127.0.0.1:8000/api/mark-matches-notified", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ match_ids: matchIds }),
          });

          window.location.reload();
        }
      } catch (err) {
        console.error("Error fetching new matches notifications:", err);
      }
    };

    const handleSavePreferences = async () => {
      if (!user) return;
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/preferences/${user.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              preferred_gender: preferredGender,
              preferred_campus: preferredCampus,
            }),
          }
        );

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
        className="relative min-h-screen p-6 bg-gray-200"
        style={{
          backgroundSize: "cover",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/60 z-0"></div>
        <div className="relative z-10">
          <div className="absolute top-6 right-6 z-20">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-xl shadow hover:bg-yellow-600 transition"
            >
              Preferences
            </button>
          </div>

          {showPreferences && (
            <div className="absolute top-20 right-6 bg-white p-6 rounded-xl shadow-xl w-72 z-30">
              <h3 className="text-lg font-semibold mb-4">Set Preferences</h3>
              <label className="block mb-2 text-sm font-medium">Gender</label>
              <select
                className="w-full p-2 border rounded mb-4"
                value={preferredGender}
                onChange={(e) => setPreferredGender(e.target.value)}
              >
                <option value="">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <label className="block mb-2 text-sm font-medium">Campus</label>
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

          <div className="flex flex-wrap justify-center gap-6 mt-20">
            {matches.map((matchUser) => (
              <MatchCard
                key={matchUser.id}
                user={matchUser}
                onActionDone={refreshMatches}
              />
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

    return (
      <>
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center w-96 relative">
          <div className="relative w-full h-96 mb-4 rounded-2xl overflow-hidden select-none">
            <button
              onClick={() => setShowInfo(true)}
              className="absolute top-3 right-3 z-10 bg-white/70 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white"
            >
              ℹ️
            </button>

            <AnimatePresence mode="wait">
              {photosArray.length > 0 ? (
                <motion.img
                  key={photoIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  src={`http://127.0.0.1:8000/storage/${photosArray[photoIndex]}`}
                  alt={`Photo ${photoIndex + 1}`}
                  className="w-full h-full object-cover rounded-2xl absolute inset-0"
                  draggable={false}
                />
              ) : (
                <img
                  src="https://via.placeholder.com/400x400?text=No+Image"
                  alt="No Image"
                  className="w-full h-full object-cover rounded-2xl"
                />
              )}
            </AnimatePresence>

            <button
              onClick={prevPhoto}
              disabled={photoIndex === 0}
              className={`absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-transform
              ${
                photoIndex === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-black/60 hover:scale-110 active:scale-95"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextPhoto}
              disabled={photoIndex === photosArray.length - 1}
              className={`absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-transform
              ${
                photoIndex === photosArray.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-black/60 hover:scale-110 active:scale-95"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xl font-semibold select-text">
            <span>
              {user.name}, {calculateAge(user.birthdate)}
            </span>
            {user.gender === "male" && (
              <Mars className="text-blue-500 w-5 h-5" title="Male" />
            )}
            {user.gender === "female" && (
              <Venus className="text-pink-500 w-5 h-5" title="Female" />
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4 select-text">
            {user.campus}
          </p>
          <div className="flex justify-around mt-4">
            <button
              onClick={handleDislike}
              className="bg-white border border-gray-300 p-3 rounded-full shadow hover:bg-red-100 transition"
            >
              ❌
            </button>
            <button
              onClick={onActionDone}
              className="bg-white border border-gray-300 p-3 rounded-full shadow hover:bg-yellow-100 transition"
              title="Refresh matches"
            >
              <RotateCw className="text-yellow-300 w-5 h-5" strokeWidth={3} />
            </button>
            <button
              onClick={handleLike}
              className="bg-white border border-gray-300 p-3 rounded-full shadow hover:bg-blue-100 transition"
            >
              ❤️
            </button>
          </div>
        </div>

        {showInfo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
              <button
                onClick={() => setShowInfo(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-black transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Image Slider */}
              <div className="relative w-full h-60 rounded-xl overflow-hidden mb-4">
                <AnimatePresence mode="wait">
                  {photosArray.length > 0 ? (
                    <motion.img
                      key={photoIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.4 }}
                      src={`http://127.0.0.1:8000/storage/${photosArray[photoIndex]}`}
                      alt={`Photo ${photoIndex + 1}`}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/400x400?text=No+Image"
                      alt="No Image"
                      className="w-full h-full object-cover"
                    />
                  )}
                </AnimatePresence>

                {/* Prev Button */}
                {photoIndex > 0 && (
                  <button
                    onClick={() => setPhotoIndex((prev) => prev - 1)}
                    className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 text-white w-8 h-8 flex items-center justify-center rounded-full"
                  >
                    ‹
                  </button>
                )}

                {/* Next Button */}
                {photoIndex < photosArray.length - 1 && (
                  <button
                    onClick={() => setPhotoIndex((prev) => prev + 1)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 text-white w-8 h-8 flex items-center justify-center rounded-full"
                  >
                    ›
                  </button>
                )}
              </div>

              <h2 className="text-2xl font-bold text-center mb-1">
                {user.name}, {calculateAge(user.birthdate)}
              </h2>
              <p className="text-center text-sm text-gray-500 mb-4 italic">
                {user.status}
              </p>
              <div className="space-y-2 text-sm text-gray-800">
                <InfoRow label="🏫 Campus" value={user.campus || "-"} />
                <InfoRow label="🎓 Faculty" value={user.faculty || "-"} />
                <InfoRow label="📘 Major" value={user.major || "-"} />
                <InfoRow label="📝 Bio" value={user.description || "No bio provided."} />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
