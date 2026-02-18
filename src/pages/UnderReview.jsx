import './UnderReview.css'

export default function UnderReview() {
  return (
    <div className="under-review-container">
      <div className="under-review-content">
        <div className="under-review-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <h1 className="under-review-title">Page is Under Review</h1>
        <p className="under-review-message">
          This page is currently being developed and will be available soon.
        </p>
      </div>
    </div>
  )
}
