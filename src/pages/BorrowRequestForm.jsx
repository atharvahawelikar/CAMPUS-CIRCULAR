import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Check, Camera, Info, ChevronRight, UserRound, BookOpenText, PencilLine } from 'lucide-react'
import BottomNavigation from '../components/BottomNavigation'
import { DEFAULT_BORROW_REQUEST, getStoredBorrowRequest, saveBorrowRequestDraft, validateBorrowRequest } from '../services/borrowRequestService'

const DAILY_RATE = 200
const PLATFORM_FEE = 10
const SECURITY_DEPOSIT = 500

const formatDate = (date) => {
  if (!date) return ''
  const formatted = new Date(date)
  return formatted.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

const getDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 1
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffMs = end.getTime() - start.getTime()
  return Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24))) + 1
}

export default function BorrowRequestForm() {
  const navigate = useNavigate()
  const location = useLocation()

  const resource = location.state?.resource || {
    title: 'Sony A6400',
    owner: 'Rahul Patil',
    price: '₹200/day',
    image: 'camera',
  }

  const existingRequest = useMemo(() => getStoredBorrowRequest(), [])

  const [formData, setFormData] = useState(() => ({
    ...DEFAULT_BORROW_REQUEST,
    ...existingRequest,
    itemName: resource.title || 'Sony A6400',
    ownerName: resource.owner || 'Rahul Patil',
    quantity: existingRequest?.quantity || 1,
    status: existingRequest?.status || DEFAULT_BORROW_REQUEST.status,
    agreed: existingRequest?.agreed || false,
    createdAt: existingRequest?.createdAt || new Date().toISOString(),
  }))

  const [errors, setErrors] = useState({})

  useEffect(() => {
    const nextDraft = {
      ...formData,
      itemName: resource.title || formData.itemName,
      ownerName: resource.owner || formData.ownerName,
      borrowingCharge: formData.borrowingCharge || DAILY_RATE * formData.dayCount,
      platformFee: PLATFORM_FEE,
      securityDeposit: SECURITY_DEPOSIT,
      totalAmount: (formData.borrowingCharge || DAILY_RATE * formData.dayCount) + PLATFORM_FEE + SECURITY_DEPOSIT,
    }

    setFormData((current) => ({ ...current, ...nextDraft }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource])

  const dayCount = useMemo(() => getDaysBetween(formData.startDate, formData.endDate), [formData.startDate, formData.endDate])
  const borrowingCharge = dayCount * DAILY_RATE
  const totalAmount = borrowingCharge + PLATFORM_FEE + SECURITY_DEPOSIT

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
    setErrors((current) => ({
      ...current,
      [field]: '',
    }))
  }

  const handleDateChange = (field, value) => {
    if (!value) return
    const nextState = { ...formData, [field]: value }

    if (field === 'startDate' && nextState.endDate) {
      const start = new Date(value)
      const end = new Date(nextState.endDate)
      if (end <= start) {
        nextState.endDate = new Date(start.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      }
    }

    setFormData(nextState)
    setErrors((current) => ({ ...current, startDate: '', endDate: '' }))
  }

  const handleContinue = () => {
    const nextForm = {
      ...formData,
      itemName: resource.title || formData.itemName,
      ownerName: resource.owner || formData.ownerName,
      quantity: Number(formData.quantity) || 1,
      dayCount,
      borrowingCharge,
      platformFee: PLATFORM_FEE,
      securityDeposit: SECURITY_DEPOSIT,
      totalAmount,
      status: DEFAULT_BORROW_REQUEST.status,
      agreed: Boolean(formData.agreed),
      createdAt: formData.createdAt || new Date().toISOString(),
    }

    const validationErrors = validateBorrowRequest(nextForm)
    const hasErrors = Object.keys(validationErrors).length > 0

    if (hasErrors) {
      setErrors(validationErrors)
      return
    }

    saveBorrowRequestDraft(nextForm)
    navigate('/agreement', {
      state: {
        request: nextForm,
        resource,
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

          <section className="mini-card borrow-form-card">
            <div className="section-header">
              <div className="section-title-wrap">
                <UserRound size={14} />
                <span>Borrower details</span>
              </div>
            </div>

            <div className="field-grid">
              <label className="field-block">
                <span>Borrower name</span>
                <input value={formData.borrowerName} onChange={(event) => updateField('borrowerName', event.target.value)} />
                {errors.borrowerName && <small>{errors.borrowerName}</small>}
              </label>

              <label className="field-block">
                <span>Borrower email</span>
                <input value={formData.borrowerEmail} onChange={(event) => updateField('borrowerEmail', event.target.value)} />
                {errors.borrowerEmail && <small>{errors.borrowerEmail}</small>}
              </label>

              <label className="field-block">
                <span>Purpose</span>
                <textarea value={formData.borrowPurpose} onChange={(event) => updateField('borrowPurpose', event.target.value)} rows="2" />
                {errors.borrowPurpose && <small>{errors.borrowPurpose}</small>}
              </label>
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
                <input type="date" value={formData.startDate} onChange={(event) => handleDateChange('startDate', event.target.value)} />
                <strong>{formatDate(formData.startDate)}</strong>
                {errors.startDate && <small>{errors.startDate}</small>}
              </label>

              <div className="day-pill">{dayCount} day</div>

              <label className="date-field">
                <span>End</span>
                <input type="date" value={formData.endDate} onChange={(event) => handleDateChange('endDate', event.target.value)} />
                <strong>{formatDate(formData.endDate)}</strong>
                {errors.endDate && <small>{errors.endDate}</small>}
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
              <div className="section-title-wrap">
                <BookOpenText size={14} />
                <span>Before you borrow</span>
              </div>
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
          <button type="button" className="primary-cta" onClick={handleContinue}>
            Continue to Agreement <ChevronRight size={16} />
          </button>
        </div>

        <BottomNavigation activeItem="Borrowings" />
      </div>
    </div>
  )
}
