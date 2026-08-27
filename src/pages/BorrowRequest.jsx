import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Check, Camera, ShieldCheck, Info, ChevronRight } from 'lucide-react'
import BottomNavigation from '../components/BottomNavigation'

const DAILY_RATE = 200
const PLATFORM_FEE = 10
const SECURITY_DEPOSIT = 500

const formatDate = (date) => {
  const formatted = new Date(date)
  return formatted.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

const getDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffMs = end.getTime() - start.getTime()
  return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24))) + 1
}

export default function BorrowRequest() {
  const navigate = useNavigate()
  const location = useLocation()
  const resource = location.state?.resource || {
    title: 'Sony A6400',
    owner: 'Rahul Patil',
    price: '₹200/day',
    image: 'camera',
  }

  const [startDate, setStartDate] = useState('2026-08-27')
  const [endDate, setEndDate] = useState('2026-08-28')

  const dayCount = useMemo(() => getDaysBetween(startDate, endDate), [startDate, endDate])
  const borrowingCharge = dayCount * DAILY_RATE
  const totalAmount = borrowingCharge + PLATFORM_FEE + SECURITY_DEPOSIT

  const handleStartChange = (value) => {
    if (!value) return
    const nextStart = new Date(value)
    const nextEnd = new Date(startDate)
    nextEnd.setDate(nextStart.getDate() + 1)
    setStartDate(value)
    setEndDate(nextEnd.toISOString().slice(0, 10))
  }

  const handleEndChange = (value) => {
    if (!value) return
    const nextEnd = new Date(value)
    const nextStart = new Date(startDate)
    if (nextEnd <= nextStart) {
      const minEnd = new Date(startDate)
      minEnd.setDate(minEnd.getDate() + 1)
      setEndDate(minEnd.toISOString().slice(0, 10))
      return
    }
    setEndDate(value)
  }

  const continueToAgreement = () => {
    navigate('/agreement', {
      state: {
        resource,
        startDate,
        endDate,
        dayCount,
        borrowingCharge,
        platformFee: PLATFORM_FEE,
        securityDeposit: SECURITY_DEPOSIT,
        totalAmount,
      },
    })
  }

  return (
    <div className="app-shell">
      <div className="phone-frame borrow-request-page">
        <header className="discover-header compact-header">
          <button type="button" className="icon-button ghost" aria-label="Go back" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <div className="discover-title">Request to Borrow</div>
          <div className="header-spacer" aria-hidden="true" />
        </header>

        <main className="borrow-request-content">
          <section className="mini-card resource-card-compact">
            <div className="camera-thumb" aria-label="Resource thumbnail">
              <Camera size={18} />
            </div>

            <div className="resource-compact-copy">
              <div className="resource-name">{resource.title}</div>
              <div className="owner-row">
                <span>Owner: {resource.owner}</span>
                <span className="mini-verified-badge" aria-label="Verified owner">
                  <Check size={10} />
                </span>
              </div>
            </div>
          </section>

          <section className="mini-card duration-card">
            <div className="section-header">
              <div className="section-title-wrap">
                <CalendarDays size={14} />
                <span>Borrowing Duration</span>
              </div>
            </div>

            <div className="date-grid">
              <label className="date-field">
                <span>Start</span>
                <input type="date" value={startDate} onChange={(event) => handleStartChange(event.target.value)} />
                <strong>{formatDate(startDate)}</strong>
              </label>

              <div className="day-pill">{dayCount} day</div>

              <label className="date-field">
                <span>End</span>
                <input type="date" value={endDate} onChange={(event) => handleEndChange(event.target.value)} />
                <strong>{formatDate(endDate)}</strong>
              </label>
            </div>
          </section>

          <section className="mini-card payment-card">
            <div className="section-header">
              <span>Payment Summary</span>
            </div>

            <div className="summary-row">
              <span>Borrowing charge</span>
              <strong>₹{borrowingCharge}</strong>
            </div>
            <div className="summary-row">
              <span>Platform fee</span>
              <strong>₹{PLATFORM_FEE}</strong>
            </div>
            <div className="summary-row">
              <span>Security deposit</span>
              <strong>₹{SECURITY_DEPOSIT}</strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total-row">
              <span>Total Amount</span>
              <strong>₹{totalAmount}</strong>
            </div>
          </section>

          <div className="security-note">
            <div className="info-icon">
              <Info size={12} />
            </div>
            <p>
              ₹500 security deposit is fully refundable upon return of the item in its original condition.
            </p>
          </div>

          <section className="mini-card checklist-card">
            <div className="section-header">
              <span>Before you borrow</span>
            </div>

            <ul className="checklist">
              <li><Check size={12} /> Verify the resource condition</li>
              <li><Check size={12} /> Review borrowing agreement</li>
              <li><Check size={12} /> Return the resource on time</li>
              <li><Check size={12} /> Report damage immediately</li>
            </ul>
          </section>
        </main>

        <div className="sticky-cta-bar">
          <button type="button" className="primary-cta" onClick={continueToAgreement}>
            Continue to Agreement <ChevronRight size={16} />
          </button>
        </div>

        <BottomNavigation activeItem="Borrowings" />
      </div>
    </div>
  )
}
