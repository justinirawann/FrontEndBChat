import { AiOutlinePlus } from "react-icons/ai";
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
    if (loading) {
      Swal.fire({
        title: "Loading data...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    } else {
      Swal.close();
    }
    const fetchFacultiesAndMajors = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchFacultiesAndMajors();
  }, [loading]);

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

  function handleChange(e) {
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

  const handleSave = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: profile.id,
          name: profile.name,
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

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Saving changes...",
          confirmButtonText: "Ok",
          showConfirmButton: true
        });
        setProfile(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("major", JSON.stringify(data.user.major || ""));
        localStorage.setItem("faculty", JSON.stringify(data.user.faculty || ""));
      } else {
        alert(data.errors?.[0] || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update error", err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-[#e6efff] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => navigate("/home")}
          className="mb-6 text-gray-700 font-semibold relative cursor-pointer 
            before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] 
            before:bg-gray-700 before:transition-all before:duration-300 
            hover:before:w-full hover:text-gray-900 hover:translate-y-[-2px] 
            transition-all duration-300"
          style={{ outline: "none" }}
        >
          ← Back to Home
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            />

            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            />

            <label className="block mb-2 font-medium">Birthdate</label>
            <input
              type="date"
              name="birthdate"
              value={profile.birthdate ? profile.birthdate.split("T")[0] : ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            />
            <label className="block mb-2 font-medium">Gender</label>
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
                      : "hover:bg-gray-100"
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
                  className={`flex-1 rounded-full border py-2 capitalize transition-all duration-200 ${
                    profile.status === s
                      ? "bg-yellow-300 text-white font-semibold"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <label className="block mb-2 font-medium">Description</label>
            <textarea
              name="description"
              value={profile.description || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            />

            <label className="block mb-2 font-medium">Campus</label>
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

            <label className="block mb-2 font-medium">Faculty</label>
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

            <label className="block mb-2 font-medium">Major</label>
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
            <label className="block mb-2 font-medium">Profile photos</label>
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
