import { useMemo, useState } from 'react'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import FilterChip from '../components/FilterChip'
import ResourceCard from '../components/ResourceCard'
import BottomNavigation from '../components/BottomNavigation'
import { filterLabels, resources, sortOptions } from '../data/resources'

export default function Discover() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [sortBy, setSortBy] = useState('recommended')

  const filteredResources = useMemo(() => {
    const text = search.trim().toLowerCase()

    const byCategory = resources.filter((resource) => {
      if (activeFilter === 'All') return true
      return resource.category === activeFilter
    })

    const byText = byCategory.filter((resource) => {
      if (!text) return true
      return (
        resource.title.toLowerCase().includes(text) ||
        resource.type.toLowerCase().includes(text) ||
        resource.owner.toLowerCase().includes(text) ||
        resource.tags.join(' ').toLowerCase().includes(text)
      )
    })

    return [...byText].sort((a, b) => {
      if (sortBy === 'nearby') return a.pickup.localeCompare(b.pickup)
      if (sortBy === 'newest') return b.id - a.id
      return b.match - a.match
    })
  }, [search, activeFilter, sortBy])

  return (
    <div className="app-shell">
      <div className="phone-frame discover-page">
        <Header />

        <main className="discover-content">
          <SearchBar value={search} onChange={setSearch} />

          <div className="filter-row" aria-label="Resource categories">
            {filterLabels.map((label) => (
              <FilterChip
                key={label}
                label={label}
                active={activeFilter === label}
                onClick={() => setActiveFilter(label)}
              />
            ))}
          </div>

          <div className="results-header">
            <div>
              <div className="results-label">Matching resources</div>
              <div className="results-count">{filteredResources.length} results</div>
            </div>

            <label className="sort-select-wrap">
              <span>Sort by</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                {Object.entries(sortOptions).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <section className="resource-list" aria-live="polite">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </section>
        </main>

        <BottomNavigation />
      </div>
    </div>
  )
}
