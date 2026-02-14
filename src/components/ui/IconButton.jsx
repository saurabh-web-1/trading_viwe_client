export default function IconButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-lg text-xs font-semibold
      ${active ? "bg-purple-600 text-white" : "bg-white/10"}
      hover:bg-purple-500 transition`}
    >
      {children}
    </button>
  );
}
