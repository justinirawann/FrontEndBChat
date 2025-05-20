export default function TeamMemberCard({ name, role, image, description, onClick }) {
  return (
    <div
      className="bg-white text-black rounded-xl shadow-md p-4 cursor-pointer hover:bg-yellow-100 hover:scale-120 transition-transform duration-300 h-full flex flex-col justify-between"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center">
        <img
          src={image}
          alt={name}
          className="w-24 h-24 object-cover rounded-full mb-4"
        />
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
  );
}
