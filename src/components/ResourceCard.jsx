import { MapPin, Star, Clock3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MatchBadge from './MatchBadge'
import AvailabilityBadge from './AvailabilityBadge'

export default function ResourceCard({ resource }) {
  const navigate = useNavigate()
  const priceLabel = resource.price || 'Free'

  const goToBorrowRequest = () => {
    navigate('/borrow-request', { state: { resource } })
  }

  return (
    <article className={`resource-card ${resource.available ? '' : 'disabled'}`}>
      <div className="resource-topline">
        <div className={`resource-icon accent-${resource.accent}`}>
          <span>{resource.title.slice(0, 1)}</span>
        </div>
        <div className="resource-summary">
          <div className="resource-row">
            <h3>{resource.title}</h3>
            <MatchBadge value={resource.match} />
          </div>
          <div className="resource-meta-row">
            <span>{resource.type}</span>
            <span className="meta-dot" />
            <span>{resource.category}</span>
          </div>
        </div>
      </div>

      <div className="resource-info-row">
        <AvailabilityBadge available={resource.available} />
        <div className="rating-row">
          <Star size={12} fill="currentColor" strokeWidth={0} />
          <span>{resource.rating}</span>
        </div>
      </div>

      <div className="pickup-row">
        <MapPin size={12} />
        <span>{resource.pickup}</span>
      </div>

      <div className="resource-details">{resource.details}</div>

      <div className="resource-tags">
        {resource.tags.map((tag) => (
          <span key={tag} className="tag-pill">{tag}</span>
        ))}
      </div>

      <div className="resource-footer">
        <div className="owner-block">
          <div className="owner-avatar">{resource.owner.charAt(0)}</div>
          <div>
            <div className="owner-label">Owner</div>
            <div className="owner-name">{resource.owner}</div>
          </div>
        </div>

        <div className="resource-price-wrap">
          <div className="price-label">Price</div>
          <div className="price-value">{priceLabel}</div>
        </div>
      </div>

      <div className="resource-actions">
        <button type="button" className="secondary-button">
          View details
        </button>
        <button
          type="button"
          className="primary-button"
          disabled={!resource.available}
          onClick={goToBorrowRequest}
        >
          {resource.available ? 'Request' : 'Unavailable'}
        </button>
      </div>

      <div className="availability-inline">
        <Clock3 size={11} />
        <span>{resource.availability}</span>
      </div>
    </article>
  )
}
