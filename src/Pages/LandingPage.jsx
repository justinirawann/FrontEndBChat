import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

import AboutUs from "./AboutUs";

export default function LandingPage() {
  const navigate = useNavigate();
  const contactRef = useRef(null); 
  const aboutRef = useRef(null); 
  const homeRef = useRef(null);


  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleCreateAccountClick = () => {
    navigate("/register");
  };
  const team = [
    {
      name: "Justin Irawan",
      role: "CEO & Founder + Developer",
      image: "/ving.jpg",
      description: "Justin adalah pendiri B-Chat dan penggerak utama visi sosial aplikasi ini, sekaligus mengawasi pengembangan produk secara keseluruhan.",
    },
    {
      name: "Teuku Danish Zahwan",
      role: "Co-Founder + Developer",
      image: "/danish.jpeg",
      description: "Danish bertanggung jawab atas strategi pengembangan teknologi dan membangun kemitraan jangka panjang.",
    },
    {
      name: "Arthur Nelson Kings Pranoto",
      role: "Developer",
      image: "/cadell.jpg",
      description: "Arthur fokus mengembangkan fitur-fitur utama aplikasi, memastikan kualitas kode tetap tinggi, serta bertanggung jawab pada pengembangan frontend",
    },
    {
      name: "Ahmad Nur Zulfikar",
      role: "Developer",
      image: "/fikar.jpg",
      description: "Fikar menangani integrasi backend dan optimasi performa aplikasi untuk pengalaman pengguna yang lebih baik.",
    },
    {
      name: "Samuel William Holy",
      role: "Developer",
      image: "/bagogo.jpg",
      description: "Samuel bertanggung jawab memastikan UI/UX aplikasi berjalan mulus.",
    },
  ];

const [selectedMember, setSelectedMember] = useState(null);

const scrollToHome = () => {
  if (!homeRef.current) return;
  const target = homeRef.current.getBoundingClientRect().top + window.pageYOffset;
  const start = window.pageYOffset;
  const distance = target - start;
  const duration = 1000;
  let startTime = null;

  const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  const animate = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + distance * ease(progress));
    if (elapsed < duration) requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
};

const scrollToAbout = () => {
    if (!aboutRef.current) return;
    const targetPosition = aboutRef.current.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000;
    let startTime = null;

    const ease = (t) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = ease(progress);

      window.scrollTo(0, startPosition + distance * easeProgress);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const scrollToContact = () => {
    if (!contactRef.current) return;

    const targetPosition = contactRef.current.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1500; // durasi scroll dalam ms, bisa kamu atur lebih besar = scroll lebih pelan
    let startTime = null;

    const ease = (t) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t; // easeInOutQuad easing function

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = ease(progress);

      window.scrollTo(0, startPosition + distance * easeProgress);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };


  return (
    <div className="text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Hero Section with Background */}
      <div
        ref={homeRef}
        className="relative min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('/landingpage3.png')",
          backgroundPosition: "center 80%",
        }}
      >
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-4 bg-black/30">
          <div className="text-xl font-bold flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-11" />
            <span className="font-semibold">B-Chat</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <button onClick={scrollToAbout} className="hover:underline">About Us</button>

            <button onClick={scrollToContact} className="hover:underline">Contact Us</button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLoginClick}
              className="px-4 py-1 text-sm font-semibold bg-white text-black rounded-full hover:bg-gray-400 transition"
            >
              Log in
            </button>
          </div>
        </nav>

        {/* Hero Content */}
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
        <div ref={aboutRef}>
          <AboutUs team={team} onCardClick={setSelectedMember} />
        </div>
        {selectedMember && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedMember(null)}
          >
            <div
              className="bg-white text-black rounded-lg shadow-lg max-w-md p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
                onClick={() => setSelectedMember(null)}
              >
                ✕
              </button>
              <img src={selectedMember.image} alt={selectedMember.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-center">{selectedMember.name}</h3>
              <p className="text-center text-sm text-gray-600">{selectedMember.role}</p>
              <p className="mt-4 text-center">{selectedMember.description}</p>
            </div>
          </div>
        )}

      {/* Contact Us Section */}
      <footer ref={contactRef} className="bg-yellow-100 text-black px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <img src="/logo.png" alt="Logo" className="w-10 mb-2" />
            <div className="mt-4 text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Indonesia, Jakarta</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>0878-1308-3139</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span>justinirawan15@gmail.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={scrollToHome} className="hover:underline">Home</button></li>
              <li><button onClick={scrollToAbout} className="hover:underline">About Us</button></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Quick Link</h3>
            <ul className="space-y-2 text-sm">
              <li>Contact Us</li>
              <li>FAQs</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>Home</li>
              <li>Contact</li>
              <li>Blog</li>
            </ul>
          </div>
        </div>

        <div className="text-center text-sm mt-10 border-t border-gray-400 pt-4">
          © 2025 B-Chat • All Rights Reserved
        </div>
      </footer>
    </div>
  );
}
