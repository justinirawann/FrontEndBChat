import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [preferredGender, setPreferredGender] = useState("");
  const [preferredCampus, setPreferredCampus] = useState("");
  const [showPreferences, setShowPreferences] = useState(false);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setPreferredGender(userData.preferred_gender || "");
      setPreferredCampus(userData.preferred_campus || "");
    } else {
      console.error("Tidak ada user di localStorage");
    }
    if (loading) {
    Swal.fire({
      title: "Loading matches...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  } else {
    Swal.close();
  }
    async function fetchMatches() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) return;

      try {
        const res = await fetch("http://127.0.0.1:8000/api/show-matches", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: user.id }),
        });

        if (!res.ok) throw new Error("Failed to fetch matches");

        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, [loading]);

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
          showConfirmButton: true,
        });
        localStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user);
        setShowPreferences(false);
      } else {
        if (response.status === 422) {
          alert("Validation errors: " + JSON.stringify(result.errors));
        } else {
          alert(result.message || "Failed to update preferences");
        }
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Error connecting to server");
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className="relative min-h-screen p-6"
      style={{
        backgroundImage: 'url("/homepage.png")',
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay transparan */}
      <div className="absolute inset-0 bg-white/60 z-0"></div>

      {/* Semua konten dibungkus z-10 agar di atas overlay */}
      <div className="relative z-10">
        {/* Tombol Preferences */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-xl shadow hover:bg-orange-600 transition"
          >
            Preferences
          </button>
        </div>

        {/* Form Preferences */}
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

        {/* List Matches */}
        <div className="flex flex-wrap justify-center gap-6 mt-20">
          {!loading && matches && !Array.isArray(matches) ? (
            <MatchCard user={matches} />
          ) : (
            matches.map((matchUser) => <MatchCard key={matchUser.id} user={matchUser} />)
          )}
        </div>
      </div>
    </div>
  );
}

function MatchCard({ user }) {
  const photosArray = user.photos ? JSON.parse(user.photos) : [];
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center w-80">
      <img
        src={
          photosArray.length > 0
            ? `http://127.0.0.1:8000/storage/${photosArray[0]}`
            : "https://via.placeholder.com/400x400?text=No+Image"
        }
        alt="Profile"
        className="rounded-2xl w-full h-96 object-cover mb-4"
      />
      <h2 className="text-xl font-semibold">
        {user.name} {user.age || 24}
      </h2>
      <p className="text-sm text-gray-500 mb-4">18 kilometers away</p>
      <div className="flex justify-around mt-4">
        <button className="bg-white border border-gray-300 p-3 rounded-full shadow hover:bg-red-100">
          ❌
        </button>

        <button className="bg-white border border-gray-300 p-3 rounded-full shadow hover:bg-blue-100">
          ❤️
        </button>
      </div>
    </div>
  );
}
