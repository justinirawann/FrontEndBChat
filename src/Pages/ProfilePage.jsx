import { AiOutlineUser, AiOutlineMail, AiOutlineCalendar, AiOutlineCamera, AiOutlineHome } from "react-icons/ai";
import { FaUniversity, FaBook, FaVenusMars, FaHeart, FaImage, FaPencilAlt, FaVenus, FaMars } from "react-icons/fa";
import { BiSolidCommentDetail } from "react-icons/bi";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // ganti sesuai routing kamu

export default function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const storedMajor = localStorage.getItem("major");
    const storedFaculty = localStorage.getItem("faculty");
    let userData = {};

    if (storedUser) {
      try {
        userData = JSON.parse(storedUser);
        userData.photos = Array.isArray(userData.photos)
          ? userData.photos
          : JSON.parse(userData.photos || "[]");
      } catch {
        console.warn("Failed to parse storedUser");
      }
    }

    return {
      ...userData,
      photos: userData.photos || [], 
      major: storedMajor ? JSON.parse(storedMajor) : userData.major || "",
      faculty: storedFaculty ? JSON.parse(storedFaculty) : userData.faculty || "",

    };
  });

  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacultiesAndMajors = async () => {
      Swal.fire({
        title: "Loading data...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const facultyRes = await fetch("http://127.0.0.1:8000/api/getfaculty");
        const majorRes = await fetch("http://127.0.0.1:8000/api/getmajor");

        const facultyData = await facultyRes.json();
        const majorData = await majorRes.json();

        setFaculties(facultyData);
        setMajors(majorData);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load faculty or major data.");
        Swal.fire("Error", "Failed to load faculty or major data", "error");
      } finally {
        Swal.close(); // Tutup swal loading setelah fetch selesai
        setLoading(false);
      }
    };

    fetchFacultiesAndMajors();
  }, []);

  const statusColors = {
    single: "bg-yellow-300 text-white",
    taken: "bg-red-400 text-white",
    complicated: "bg-yellow-600 text-white",
  };


  const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload-photo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        return data.path;
      } else {
        alert(data.errors?.photo?.[0] || "Upload failed");
        return null;
      }
    } catch (err) {
      console.error("Upload error", err);
      alert("Upload failed");
      return null;
    }
  };

  const hobbyOptions = [
    "reading", "traveling", "gaming", "cooking", "basketball", "futsal",
    "soccer", "volleyball", "movies", "fishing", "photography", "writing",
    "hiking", "swimming", "coding", "piano", "drum", "bass", "guitar", "music"
  ];


  const handlePhotoChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadedPath = await uploadPhoto(file);
    if (!uploadedPath) return;

    setProfile((prev) => {
      const newPhotos = [...prev.photos];
      newPhotos[index] = uploadedPath;
      return { ...prev, photos: newPhotos };
    });
  };

  const handleRemovePhoto = (index) => {
    setProfile((prev) => {
      const newPhotos = [...prev.photos];
      newPhotos.splice(index, 1);
      return { ...prev, photos: newPhotos };
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "faculty") {
      setProfile((prev) => ({
        ...prev,
        faculty_id: value,
        major_id: "", // reset major id di sini
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  const toggleHobby = (hobby) => {
    setProfile((prev) => {
      const hobbies = prev.hobbies || [];
      if (hobbies.includes(hobby)) {
        return { ...prev, hobbies: hobbies.filter((h) => h !== hobby) };
      } else {
        return { ...prev, hobbies: [...hobbies, hobby] };
      }
    });
  };

  const handleSave = async () => {
    if (
      !profile.name?.trim() ||
      !profile.birthdate?.trim() ||
      !profile.campus?.trim()
    ) {
      Swal.fire("Missing fields", "Please complete your profile", "warning");
      return;
    }

    if ((profile.photos || []).filter(Boolean).length < 1) {
      Swal.fire("Add Photos", "Please upload at least 1 profile photo", "warning");
      return;
    }

    Swal.fire({
      title: "Saving profile...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await fetch("http://127.0.0.1:8000/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          birthdate: profile.birthdate,
          gender: profile.gender,
          status: profile.status,
          faculty_id: profile.faculty_id ? parseInt(profile.faculty_id, 10) : null,
          major_id: profile.major_id ? parseInt(profile.major_id, 10) : null,
          campus: profile.campus,
          description: profile.description,
          photos: profile.photos,
          
        }),
      });

      const data = await res.json();
      Swal.close(); // Pastikan swal loading ditutup dulu

      if (res.ok) {
        // Simpan ke localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("major", JSON.stringify(data.user.major || ""));
        localStorage.setItem("faculty", JSON.stringify(data.user.faculty || ""));

        // Tampilkan sukses lalu reload halaman
        Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Your changes have been saved.",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire("Error", data.errors?.[0] || "Failed to update profile", "error");
      }
    } catch (err) {
      console.error("Update error", err);
      Swal.close();
      Swal.fire("Error", "Failed to update profile", "error");
    }
  };


  function isProfileComplete() {
    return (
      profile.name?.trim() &&
      profile.email?.trim() &&
      profile.birthdate?.trim() &&
      profile.gender &&
      profile.status &&
      profile.campus &&
      profile.faculty_id &&
      profile.major_id &&
      (profile.photos || []).filter(Boolean).length >= 1
    );
  }

  return (
    <div className="min-h-screen bg-[#e6efff] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            if (!isProfileComplete()) {
              Swal.fire("Incomplete Profile", "Please complete your profile before going back.", "warning");
              return;
            }
            navigate("/home");
          }}
          className="mb-6 text-gray-700 font-semibold relative cursor-pointer 
            before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] 
            before:bg-gray-700 before:transition-all before:duration-300 
            hover:before:w-full hover:text-gray-900 hover:translate-y-[-2px] 
            transition-all duration-300"
          style={{ outline: "none" }}
        >
          ← Back to Home
        </button>


        <h2 className="text-2xl font-semibold text-center mb-6 flex items-center justify-center gap-2">
          <FaPencilAlt className="text-blue-300"/>
          Edit Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium flex items-center gap-2"><AiOutlineUser />Name</label>

            <input
              type="text"
              name="name"
              value={profile.name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            />

            <label className="block mb-2 font-medium flex items-center gap-2"><AiOutlineMail />Email</label>
            <input
              type="email"
              name="email"
              value={profile.email || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            />

            <label className="block mb-2 font-medium flex items-center gap-2"><AiOutlineCalendar />Birthdate</label>
            <input
              type="date"
              name="birthdate"
              value={profile.birthdate ? profile.birthdate.split("T")[0] : ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            />
            <label className="block mb-2 font-medium">⭐Hobbies</label>
            <div className="flex flex-wrap gap-1 mb-4 justify-start">
              {hobbyOptions.map((hobby) => (
                <button
                  key={hobby}
                  type="button"
                  onClick={() => toggleHobby(hobby)}
                  className={`w-24 h-8 flex items-center justify-center rounded-full border border-gray-300 text-xs capitalize shadow-sm transition-colors duration-200
                    ${
                      profile.hobbies?.includes(hobby)
                        ? "bg-green-300 text-white font-semibold shadow-inner"
                        : "bg-white text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {hobby}
                </button>
              ))}
            </div>
            <label className="block mb-2 font-medium flex items-center gap-2">
              <FaMars className="text-blue-500" />
              |
              <FaVenus className="text-pink-500" />
              Gender
            </label> 
            <div className="flex space-x-2 mb-4">
              {["male", "female"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setProfile({ ...profile, gender: g })}
                  className={`flex-1 rounded-full border py-2 capitalize transition-all duration-200 ${
                    profile.gender === g
                      ? g === "male"
                        ? "bg-blue-300 text-white font-semibold"
                        : "bg-pink-300 text-white font-semibold"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <label className="block mb-2 font-medium flex items-center gap-2">
              <FaHeart className="text-red-400"/>
              Status
            </label>
            <div className="flex space-x-2 mb-4">
              {["single", "taken", "complicated"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setProfile({ ...profile, status: s })}
                  className={`flex-1 rounded-full border py-2 capitalize transition-all duration-200 ${
                    profile.status === s
                      ? statusColors[s]
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <label className="block mb-2 font-medium">📝Description</label>
            <textarea
              name="description"
              value={profile.description || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            />

            <label className="block mb-2 font-medium">📍Campus</label>
            <select
              name="campus"
              value={profile.campus || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            >
              <option value="">Choose Campus</option>
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

            <label className="block mb-2 font-medium">🎓Faculty</label>
            <select
              name="faculty"
              value={profile.faculty_id || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            >
              <option value="">Choose Faculty</option>
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>

            <label className="block mb-2 font-medium">📘Major</label>
            <select
              name="major_id"
              value={profile.major_id || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
              disabled={!profile.faculty_id}
            >
              <option value="">Choose Major</option>
              {majors
                .filter((major) => major.faculty_id === Number(profile.faculty_id))
                .map((major) => (
                  <option key={major.id} value={major.id}>
                    {major.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col items-center">
            <label className="block mb-2 font-medium flex items-center gap-2">
              <FaImage />
              Profile Photos
            </label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="relative w-full h-40 border border-dashed border-gray-400 rounded-md flex items-center justify-center group"
                >
                  {profile.photos && profile.photos[index] ? (
                    <>
                      <img
                        src={`http://127.0.0.1:8000/storage/${profile.photos[index]}`}
                        alt={`Profile photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-xs text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <label
                      htmlFor={`file-input-${index}`}
                      className="cursor-pointer w-40 h-40 flex items-center justify-center"
                    >
                      <div className="text-gray-400 text-xl font-bold">+</div>
                    </label>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    id={`file-input-${index}`}
                    onChange={(e) => handlePhotoChange(e, index)}
                    className="hidden"
                  />
                </div>
              ))}
            </div>

            <p className="text-gray-500 text-sm text-center">
              Upload 1 photos to start. And add more to make your profile stand out.
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

