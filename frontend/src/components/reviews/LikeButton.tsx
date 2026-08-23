import { useCallback, useEffect, useState } from 'react'
import {
  getReviewLikeStatus,
  toggleReviewLike,
  type LikeStatus,
} from '../../services/commentService'

type LikeButtonProps = {
  reviewId: number
}

export default function LikeButton({ reviewId }: LikeButtonProps) {
  const [status, setStatus] = useState<LikeStatus>({
    reviewId,
    liked: false,
    likeCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadLikeStatus = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      setStatus(await getReviewLikeStatus(reviewId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load review likes')
    } finally {
      setLoading(false)
    }
  }, [reviewId])

  useEffect(() => {
    void loadLikeStatus()
  }, [loadLikeStatus])

  const handleToggle = async () => {
    setSubmitting(true)
    setError(null)

    try {
      setStatus(await toggleReviewLike(reviewId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update review like')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        aria-pressed={status.liked}
        aria-label={status.liked ? 'Unlike review' : 'Like review'}
        disabled={loading || submitting}
        onClick={() => void handleToggle()}
      >
        {status.liked ? '♥ Unlike' : '♡ Like'} ({status.likeCount})
      </button>

      {error && (
        <small role="alert">
          {error}{' '}
          <button type="button" onClick={() => void loadLikeStatus()}>
            Retry
          </button>
        </small>
      )}
    </div>
  )
}
