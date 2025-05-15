import { AiOutlinePlus } from "react-icons/ai";
import { useState } from "react";

const BINUS_CAMPUSES = [
  "BINUS @Kemanggisan",
  "BINUS @Alam Sutera",
  "BINUS @Senayan",
  "BINUS @Bekasi",
  "BINUS @Bandung",
  "BINUS @Malang",
  "BINUS @Semarang",
];

const FACULTY_MAJORS = {
  "School of Computer Science": [
    "Data Science",
    "Cyber Security",
    "Computer Science",
    "Artificial Intelligence",
    "Game Application and Technology",
    "Computer Science and Statistics",
    "Computer Science and Mathematics",
    "Master of Information Technology",
    "Computer Science - Global Class",
    "Computer Science - Software Engineering",
  ],
  "School of Information Systems": [
    "Information Systems",
    "Business Analytics",
    "Master of Information Systems Management",
    "Business Information Technology",
  ],
  "School of Design": [
    "DKV Creative Advertising",
    "DKV Animation",
    "DKV New Media",
    "Interior Design",
    "Design Communication Visual",
    "Interactive Design and Technology",
    "Fashion",
    "Film",
    "Visual Communication Design",
  ],
  "Binus Business School": [
    "Digital Business Inovation",
    "Creativepreneurship",
    "Global Business Marketing",
    "Management",
    "International Business Management",
    "Business Creation",
    "Master of Management",
    "International Business Management - Global Class",
    "Entrepreneurship - Business Creation",
    "Digital Business",
  ],
  "School of Accounting": [
    "Accounting",
    "Taxation",
    "Finance",
  ],
  "Faculty of Digital Communication And Hotel & Tourism": [
    "Marketing Communication",
    "Hotel Management",
    "Tourism",
    "Mass Communication",
    "Business Hotel Management",
    "Creative Communication",
    "Public Relations",
    "Communication",
  ],
  "Faculty of Engineering": [
    "Architecture",
    "Computer Engineering",
    "Civil Engineering",
    "Industrial Engineering",
    "Smart Industrial Engineering",
    "Biotechnology",
    "Food Technology",
  ],
  "Faculty of Humanities": [
    "Business Law",
    "Psychology",
    "International Relations",
    "Primary Teacher Education",
    "English - Creative Digital English",
    "Chinese - Global Business Chinese",
    "Japanese Popular Culture",
    "Digital Psychology",
    "International Relations - Global Class",
  ],
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(() => {
    const storedProfile = localStorage.getItem("profile");
    const storedUser = localStorage.getItem("user");

    let profileData = {};
    if (storedProfile) {
      try {
        profileData = JSON.parse(storedProfile);
      } catch {
        console.warn("Failed to parse storedProfile");
      }
    }

    let userData = {};
    if (storedUser) {
      try {
        userData = JSON.parse(storedUser);
      } catch {
        console.warn("Failed to parse storedUser");
      }
    }

    return {
      name: profileData.name || userData.name || "",
      email: profileData.email || userData.email || "",
      birthdate: profileData.birthdate || userData.birthdate || "",
      gender: profileData.gender || userData.gender || "",
      status: profileData.status || userData.status || "",
      description: profileData.description || userData.description || "",
      photos:
        profileData.photos && profileData.photos.length > 0
          ? profileData.photos
          : userData.photos || [],
      campus: profileData.campus || userData.campus || "",
      faculty: profileData.faculty || userData.faculty || "",
      major: profileData.major || userData.major || "",
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoAdd = (index) => {
    const fileInput = document.getElementById(`file-input-${index}`);
    fileInput.click();
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar dengan ekstensi yang valid!");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...profile.photos];
        newPhotos[index] = reader.result;
        setProfile((prev) => ({
          ...prev,
          photos: newPhotos,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem("profile", JSON.stringify(profile));
      alert("Profile saved locally");
    } catch (err) {
      console.error("Failed to save profile", err);
      alert("Failed to save profile");
    }
  };

  const majorOptions = FACULTY_MAJORS[profile.faculty] || [];

  return (
    <div className="min-h-screen bg-[#e6efff] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            />

            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            />

            <label className="block mb-2 font-medium">Birthday</label>
            <input
              type="text"
              name="birthdate"
              value={profile.birthdate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            />

            <label className="block mb-2 font-medium">Gender</label>
            <div className="flex space-x-4 mb-4">
              {["male", "female"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: g })}
                  className={`w-full border border-gray-300 rounded-full py-2 capitalize ${
                    profile.gender === g ? (g === "male" ? "bg-blue-100" : "bg-pink-100") : ""
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <label className="block mb-2 font-medium">Status</label>
            <div className="flex space-x-2 mb-4">
              {["single", "taken", "complicated"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setProfile({ ...profile, status: s })}
                  className={`flex-1 border border-gray-300 rounded-full py-2 capitalize ${
                    profile.status === s ? "bg-yellow-100" : ""
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <label className="block mb-2 font-medium">Description</label>
            <textarea
              name="description"
              value={profile.description}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            />

            <label className="block mb-2 font-medium">Campus</label>
            <select
              name="campus"
              value={profile.campus}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            >
              <option value="">Choose Campus</option>
              {BINUS_CAMPUSES.map((campus) => (
                <option key={campus} value={campus}>{campus}</option>
              ))}
            </select>

            <label className="block mb-2 font-medium">Faculty</label>
            <select
              name="faculty"
              value={profile.faculty}
              onChange={(e) => {
                handleChange(e); // Pakai handler utama
                setProfile((prev) => ({ ...prev, major: "" })); // Reset major
              }}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            >

              <option value="">Choose Faculty</option>
              {Object.keys(FACULTY_MAJORS).map((faculty) => (
                <option key={faculty} value={faculty}>{faculty}</option>
              ))}
            </select>

            <label className="block mb-2 font-medium">Major</label>
            <select
              name="major"
              value={profile.major}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
              disabled={!profile.faculty}
            >
              <option value="">Choose Major</option>
              {majorOptions.map((major) => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Profile photos</label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="relative w-full h-40">
                  {profile.photos && profile.photos[index] ? (
                    <img
                      src={profile.photos[index]}
                      alt={`Profile photo ${index + 1}`}
                      className="w-full h-full border border-gray-300 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-full h-full border border-dashed border-gray-400 rounded-md" />
                  )}
                  <button
                    type="button"
                    onClick={() => handlePhotoAdd(index)}
                    className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center shadow-md"
                  >
                    <AiOutlinePlus className="text-white text-[12px]" />
                  </button>
                  <input
                    type="file"
                    id={`file-input-${index}`}
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, index)}
                    className="hidden"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mb-1">
              Hold, drag and drop or press Space bar and Arrow keys to reorder your photos
            </p>
            <p className="text-sm text-gray-500">
              Upload 2 photos to start. Add 4 or more to make your profile stand out.
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-10">
          <button
            type="button"
            onClick={handleSave}
            className="bg-gradient-to-r from-pink-400 to-yellow-400 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition whitespace-nowrap"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}