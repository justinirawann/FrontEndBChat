import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleCreateAccountClick = () => {
    navigate("/register");
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/landingpage.jpeg')", // path gambar kamu
        fontFamily: "'Poppins', sans-serif", // Menambahkan font Poppins
      }}
    >
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-black/30">
        <div className="text-xl font-bold flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-11" />
          <span className="font-semibold">B-Chat</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <a href="#" className="hover:underline">Learn</a>
          <a href="#" className="hover:underline">Safety</a>
          <a href="#" className="hover:underline">Support</a>
          <a href="#" className="hover:underline">Download</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm hover:underline">🌐 Language</button>
          <button
            onClick={handleLoginClick}
            className="px-4 py-1 text-sm font-semibold bg-white text-black rounded-full hover:bg-gray-200 transition"
          >
            Log in
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-4xl md:text-6xl font-semibold text-white mb-6 drop-shadow-lg">
          Make a Friends
        </h1>
        <button
          onClick={handleCreateAccountClick}
          className="bg-yellow-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-yellow-700 transition"
        >
          Create account
        </button>
      </div>
    </div>
  );
}
