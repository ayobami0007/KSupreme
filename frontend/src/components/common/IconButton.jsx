export default function IconButton({ icon: Icon, onClick, title, color, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-1 text-${color}-500 hover:text-${color}-700 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      title={title}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}