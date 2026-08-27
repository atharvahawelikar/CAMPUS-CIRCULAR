const STORAGE_KEY = 'campusCircularBorrowRequest'

export const BORROW_REQUEST_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
}

export const DEFAULT_BORROW_REQUEST = {
  requestId: '',
  borrowerName: 'Aarav Sharma',
  borrowerEmail: 'aarav@campus.edu',
  itemName: 'Sony A6400',
  ownerName: 'Rahul Patil',
  quantity: 1,
  borrowPurpose: 'Photography project and weekend assignment work.',
  startDate: '2026-08-27',
  endDate: '2026-08-28',
  dayCount: 1,
  borrowingCharge: 200,
  platformFee: 10,
  securityDeposit: 500,
  totalAmount: 710,
  status: BORROW_REQUEST_STATUS.DRAFT,
  agreed: false,
  createdAt: '',
  submittedAt: '',
}

export function getStoredBorrowRequest() {
  try {
    const rawValue = localStorage.getItem(STORAGE_KEY)
    if (!rawValue) return null
    return JSON.parse(rawValue)
  } catch {
    return null
  }
}

export function saveBorrowRequestDraft(requestData) {
  const safeData = {
    ...DEFAULT_BORROW_REQUEST,
    ...requestData,
    status: BORROW_REQUEST_STATUS.DRAFT,
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData))
  return safeData
}

export function clearBorrowRequestDraft() {
  localStorage.removeItem(STORAGE_KEY)
}

export function validateBorrowRequest(requestData) {
  const errors = {}

  if (!requestData.borrowerName?.trim()) {
    errors.borrowerName = 'Borrower name is required.'
  }

  if (!requestData.borrowerEmail?.trim()) {
    errors.borrowerEmail = 'Borrower email is required.'
  } else if (!/\S+@\S+\.\S+/.test(requestData.borrowerEmail)) {
    errors.borrowerEmail = 'Enter a valid email address.'
  }

  if (!requestData.itemName?.trim()) {
    errors.itemName = 'Item name is required.'
  }

  if (!requestData.ownerName?.trim()) {
    errors.ownerName = 'Owner name is required.'
  }

  if (!requestData.startDate) {
    errors.startDate = 'Start date is required.'
  }

  if (!requestData.endDate) {
    errors.endDate = 'End date is required.'
  }

  if (requestData.startDate && requestData.endDate) {
    const start = new Date(requestData.startDate)
    const end = new Date(requestData.endDate)
    const diffInDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)))

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      errors.dates = 'Dates are invalid.'
    } else if (end <= start) {
      errors.endDate = 'End date must be after the start date.'
    } else if (diffInDays < 1) {
      errors.endDate = 'Minimum borrowing duration is 1 day.'
    }
  }

  const quantity = Number(requestData.quantity)
  if (!Number.isFinite(quantity) || quantity < 1) {
    errors.quantity = 'Borrow quantity must be at least 1.'
  }

  if (!requestData.borrowPurpose?.trim()) {
    errors.borrowPurpose = 'Please provide a borrowing purpose.'
  }

  return errors
}

export function submitBorrowingRequest(requestData) {
  const normalizedRequest = {
    ...DEFAULT_BORROW_REQUEST,
    ...requestData,
    quantity: Number(requestData.quantity || 1),
    dayCount: Number(requestData.dayCount || 1),
    borrowingCharge: Number(requestData.borrowingCharge || 0),
    platformFee: Number(requestData.platformFee || 0),
    securityDeposit: Number(requestData.securityDeposit || 0),
    totalAmount: Number(requestData.totalAmount || 0),
    status: BORROW_REQUEST_STATUS.PENDING,
    agreed: Boolean(requestData.agreed),
    submittedAt: new Date().toISOString(),
    createdAt: requestData.createdAt || new Date().toISOString(),
    requestId: requestData.requestId || `BR-${Date.now()}`,
  }

  const errors = validateBorrowRequest(normalizedRequest)

  if (Object.keys(errors).length > 0) {
    const error = new Error('Please complete the required borrowing details before submitting.')
    error.validationErrors = errors
    throw error
  }

  const existingRequest = getStoredBorrowRequest()
  if (existingRequest?.status === BORROW_REQUEST_STATUS.PENDING && existingRequest.requestId === normalizedRequest.requestId) {
    const duplicateError = new Error('This borrowing request has already been submitted.')
    duplicateError.duplicate = true
    throw duplicateError
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedRequest))
  return normalizedRequest
}
