import { AiOutlinePlus } from "react-icons/ai";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#e6efff] flex items-center justify-center px-4">
      {/* Scroll wrapper */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-center mb-6">Edit Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kiri */}
          <div>
            <label className="block mb-2 font-medium">First Name</label>
            <input
              type="text"
              placeholder="First Name"
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            />
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-md p-3 mb-4"
            />
            <label className="block mb-2 font-medium">Birthday</label>
            <div className="flex space-x-4 mb-4">
              <input
                type="text"
                placeholder="MM"
                className="w-1/3 border border-gray-300 rounded-md p-3"
              />
              <input
                type="text"
                placeholder="DD"
                className="w-1/3 border border-gray-300 rounded-md p-3"
              />
              <input
                type="text"
                placeholder="YYYY"
                className="w-1/3 border border-gray-300 rounded-md p-3"
              />
            </div>
            <label className="block mb-2 font-medium">Gender</label>
            <div className="flex space-x-4 mb-2">
              <button className="w-full border border-gray-300 rounded-full py-2 hover:bg-blue-100">
                Man
              </button>
              <button className="w-full border border-gray-300 rounded-full py-2 hover:bg-pink-100">
                Woman
              </button>
            </div>
            <div className="mb-4">
              <label className="inline-flex items-center">
                <input type="checkbox" className="mr-2" />
                Show my gender on my profile
              </label>
            </div>
            <label className="block mb-2 font-medium">Interested in</label>
            <div className="flex space-x-4 mb-4">
              <button className="w-full border border-gray-300 rounded-full py-2 hover:bg-gray-100">
                Men
              </button>
              <button className="w-full border border-gray-300 rounded-full py-2 hover:bg-gray-100">
                Women
              </button>
              <button className="w-full border border-gray-300 rounded-full py-2 hover:bg-gray-100">
                Everyone
              </button>
            </div>
            <label className="block mb-2 font-medium">Looking for</label>
            <button className="w-full border border-gray-300 rounded-full py-2 hover:bg-gray-100 mb-4">
              + Add Relationship Intent
            </button>
          </div>

          {/* Kanan */}
          <div>
            <label className="block mb-2 font-medium">Profile photos</label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="relative w-full h-40">
                  <div className="w-full h-full border border-dashed border-gray-400 rounded-md" />
                  <button
                    className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow-md"
                    aria-label="Add Photo"
                  >
                    <AiOutlinePlus className="text-white text-[12px]" />
                  </button>
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
          <button className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition whitespace-nowrap">
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
}
