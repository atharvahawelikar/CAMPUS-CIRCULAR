import { Home, Compass, HandCoins, MessageSquareText, Users } from 'lucide-react'

const navItems = [
  { label: 'Home', icon: Home },
  { label: 'Discover', icon: Compass },
  { label: 'Borrowings', icon: HandCoins },
  { label: 'Requests', icon: MessageSquareText },
  { label: 'Community', icon: Users },
]

export default function BottomNavigation({ activeItem = 'Discover' }) {
  return (
    <nav className="bottom-nav discover-bottom-nav" aria-label="Main navigation">
      {navItems.map(({ label, icon: Icon }) => {
        const isActive = label === activeItem

        return (
          <button
            type="button"
            key={label}
            className={`nav-item ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="nav-icon" aria-hidden="true">
              <Icon size={18} strokeWidth={1.8} />
            </span>
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
