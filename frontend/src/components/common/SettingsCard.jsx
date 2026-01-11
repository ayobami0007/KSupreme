// components/SettingsCard.jsx
export default function SettingsCard({ title, description, onClick }) {
  return (
    <div
      className="bg-white shadow-md rounded-lg p-6 cursor-pointer hover:shadow-xl transition"
      onClick={onClick}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
