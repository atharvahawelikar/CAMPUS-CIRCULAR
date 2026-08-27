export default function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      className={`filter-chip ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  )
}
