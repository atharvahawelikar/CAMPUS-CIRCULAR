export default function AvailabilityBadge({ available }) {
  return (
    <span className={`availability-badge ${available ? 'available' : 'unavailable'}`}>
      {available ? 'Available' : 'Unavailable'}
    </span>
  )
}
