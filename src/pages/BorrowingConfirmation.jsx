import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import BottomNavigation from '../components/BottomNavigation'

export default function BorrowingConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const request = location.state?.request || null

  return (
    <div className="app-shell">
      <div className="phone-frame agreement-page">
        <main className="confirmation-content">
          <div className="confirmation-card">
            <div className="success-badge">
              <CheckCircle2 size={28} />
            </div>
            <h2>Request Submitted</h2>
            <p>
              Your borrowing request for <strong>{request?.itemName || 'this item'}</strong> has been sent successfully.
            </p>

            <div className="confirmation-meta">
              <div>
                <span>Status</span>
                <strong>Pending</strong>
              </div>
              <div>
                <span>Request ID</span>
                <strong>{request?.requestId || 'BR-NEW'}</strong>
              </div>
            </div>
          </div>

          <button type="button" className="primary-cta" onClick={() => navigate('/discover')}>
            Continue browsing <ArrowRight size={16} />
          </button>
        </main>

        <BottomNavigation activeItem="Borrowings" />
      </div>
    </div>
  )
}
