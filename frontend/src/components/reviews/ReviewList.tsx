import { useCallback, useEffect, useState } from 'react'
import { getReviews, type Review } from '../../services/reviewService'
import CommentThread from './CommentThread'

type ReviewListProps = {
  tourId?: number
  refreshKey?: number | string
}

export default function ReviewList({ tourId, refreshKey }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadReviews = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      setReviews(await getReviews(tourId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load reviews')
    } finally {
      setLoading(false)
    }
  }, [tourId])

  useEffect(() => {
    void loadReviews()
  }, [loadReviews, refreshKey])

  if (loading) {
    return <p>Loading reviews...</p>
  }

  if (error) {
    return (
      <div role="alert">
        <p>{error}</p>
        <button type="button" onClick={() => void loadReviews()}>
          Try again
        </button>
      </div>
    )
  }

  if (reviews.length === 0) {
    return <p>No reviews yet.</p>
  }

  return (
    <section aria-label="Reviews">
      {reviews.map((review) => (
        <article key={review.id}>
          <header>
            <strong>{review.reviewerName || 'User'}</strong>
            <span aria-label={`${review.rating} out of 5 stars`}>
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </span>
          </header>

          <p>{review.content}</p>

          {review.images.length > 0 && (
            <div>
              {review.images.map((image) => (
                <img
                  key={image.id}
                  src={image.imageUrl}
                  alt="Review attachment"
                  loading="lazy"
                  style={{ maxWidth: '240px', height: 'auto' }}
                />
              ))}
            </div>
          )}

          <small>{new Date(review.createdAt).toLocaleString()}</small>

          <CommentThread reviewId={review.id} />
        </article>
      ))}
    </section>
  )
}
