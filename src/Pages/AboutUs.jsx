import TeamMemberCard from "./TeamMemberCard";

export default function AboutUs({ team, onCardClick }, ref) {
  return (
    <div ref={ref} className="py-12 px-4 md:px-12 bg-gray-100 text-black">
      {/* Section Penjelasan B-Chat */}
      <div className="mb-20 max-w-3xl mx-auto bg-white border border-gray-300 rounded-xl shadow-md p-6 text-center">
        <h2 className="text-2xl font-semibold text-black-600 mb-4">Apa itu B-Chat?</h2>
        <p className="text-gray-700 mb-3">
          <strong>B-Chat</strong> adalah aplikasi sosial berbasis web yang bertujuan mempertemukan
          mahasiswa Bina Nusantara dari berbagai jurusan, angkatan, dan kampus.
          Dibuat dengan semangat inklusivitas, B-Chat akan membantu kamu dalam mencari teman baru.
        </p>
        <p className="text-gray-700">
          Aplikasi ini dikembangkan oleh tim mahasiswa sebagai proyek awal kami dalam dunia
          pengembangan software. Kami percaya bahwa koneksi positif bisa dibangun dari rasa ingin tahu,
          kolaborasi, dan keberanian untuk membuka percakapan baru. Selamat menjelajah!
        </p>
      </div>

      {/* Meet the Team */}
      <h1 className="text-3xl font-bold text-center mb-10">Meet the Team</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
        {team.map((member, index) => (
          <div key={index}>
            <TeamMemberCard {...member} onClick={() => onCardClick(member)} />
          </div>
        ))}
      </div>
    </div>
  );
}
