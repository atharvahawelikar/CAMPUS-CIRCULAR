import { ArrowLeft, Bell } from 'lucide-react'

export default function Header() {
  return (
    <header className="discover-header">
      <button type="button" className="icon-button ghost" aria-label="Go back">
        <ArrowLeft size={18} />
      </button>
      <div className="discover-title">Discover Resources</div>
      <button type="button" className="icon-button ghost" aria-label="Notifications">
        <Bell size={18} />
      </button>
    </header>
  )
}
