import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react'
import BottomNavigation from '../components/BottomNavigation'
import { clearBorrowRequestDraft, submitBorrowingRequest } from '../services/borrowRequestService'

export default function Agreement() {
  const navigate = useNavigate()
  const location = useLocation()
  const safeRequest = location.state?.request || {
    itemName: 'Sony A6400',
    ownerName: 'Rahul Patil',
    startDate: '2026-08-27',
    endDate: '2026-08-28',
    dayCount: 1,
    borrowingCharge: 200,
    platformFee: 10,
    securityDeposit: 500,
    totalAmount: 710,
    borrowerName: 'Aarav Sharma',
    borrowPurpose: 'Photography project and weekend assignment work.',
  }
  const resource = location.state?.resource || { title: safeRequest.itemName, owner: safeRequest.ownerName }

  const [agreed, setAgreed] = useState(Boolean(safeRequest.agreed))
  const [submitError, setSubmitError] = useState('')

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  }

  const handleSubmit = () => {
    if (!agreed) {
      setSubmitError('Please accept the agreement before continuing.')
      return
    }

    try {
      const finalRequest = {
        ...safeRequest,
        itemName: resource.title || safeRequest.itemName,
        ownerName: resource.owner || safeRequest.ownerName,
        agreed: true,
      }

      const submittedRequest = submitBorrowingRequest(finalRequest)
      clearBorrowRequestDraft()
      navigate('/confirmation', { state: { request: submittedRequest } })
    } catch (error) {
      setSubmitError(error?.message || 'Unable to submit the borrowing request right now.')
    }
  }

  return (
    <div className="app-shell">
      <div className="phone-frame agreement-page">
        <header className="discover-header compact-header">
          <button type="button" className="icon-button ghost" aria-label="Go back" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <div className="discover-title">Borrowing Agreement</div>
          <div className="header-spacer" aria-hidden="true" />
        </header>

        <main className="agreement-content">
          <section className="mini-card agreement-summary">
            <div className="agreement-icon">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="agreement-heading">{resource.title || safeRequest.itemName}</div>
              <div className="agreement-subtext">Borrowed from {resource.owner || safeRequest.ownerName}</div>
            </div>
          </section>

          <section className="mini-card agreement-card">
            <div className="agreement-line">
              <span>Borrower</span>
              <strong>{safeRequest.borrowerName}</strong>
            </div>
            <div className="agreement-line">
              <span>Borrowing period</span>
              <strong>
                {formatDate(safeRequest.startDate)} - {formatDate(safeRequest.endDate)}
              </strong>
            </div>
            <div className="agreement-line">
              <span>Rental duration</span>
              <strong>{safeRequest.dayCount} day</strong>
            </div>
            <div className="agreement-line">
              <span>Purpose</span>
              <strong>{safeRequest.borrowPurpose}</strong>
            </div>
            <div className="agreement-line">
              <span>Security deposit</span>
              <strong>₹{safeRequest.securityDeposit}</strong>
            </div>
            <div className="agreement-line">
              <span>Total</span>
              <strong className="agreement-total">₹{safeRequest.totalAmount}</strong>
            </div>
          </section>

          <section className="mini-card terms-card">
            <div className="terms-label">Agreement terms</div>
            <ul>
              <li><CheckCircle2 size={13} /> Return the item in the same condition</li>
              <li><CheckCircle2 size={13} /> Notify the owner if damaged or delayed</li>
              <li><CheckCircle2 size={13} /> Security deposit refunded on successful return</li>
            </ul>

            <label className="agreement-checkbox">
              <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
              <span>I agree to the borrowing terms and conditions.</span>
            </label>
            {submitError && <div className="error-banner">{submitError}</div>}
          </section>
        </main>

        <div className="sticky-cta-bar">
          <button type="button" className="primary-cta" onClick={handleSubmit}>
            Confirm Borrow <ChevronRight size={16} />
          </button>
        </div>

        <BottomNavigation activeItem="Borrowings" />
      </div>
    </div>
  )
}
