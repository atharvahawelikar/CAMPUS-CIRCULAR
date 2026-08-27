import { Search, SlidersHorizontal } from 'lucide-react'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-shell">
      <div className="search-input-wrap">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search resources"
          aria-label="Search resources"
        />
      </div>
      <button type="button" className="filter-button" aria-label="Filter resources">
        <SlidersHorizontal size={16} />
      </button>
    </div>
  )
}
