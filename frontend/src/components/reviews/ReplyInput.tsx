import { useState } from 'react'
import type { FormEvent } from 'react'
import { createComment, type Comment } from '../../services/commentService'

type ReplyInputProps = {
  reviewId: number
  parentCommentId?: number | null
  submitLabel?: string
  placeholder?: string
  onSubmitted?: (comment: Comment) => void
  onCancel?: () => void
}

export default function ReplyInput({
  reviewId,
  parentCommentId = null,
  submitLabel = parentCommentId == null ? 'Comment' : 'Reply',
  placeholder = parentCommentId == null ? 'Write a comment...' : 'Write a reply...',
  onSubmitted,
  onCancel,
}: ReplyInputProps) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedContent = content.trim()

    if (!trimmedContent) {
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const comment = await createComment(reviewId, {
        content: trimmedContent,
        parentCommentId,
      })
      setContent('')
      onSubmitted?.(comment)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit comment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={placeholder}
        rows={parentCommentId == null ? 3 : 2}
        disabled={submitting}
        required
      />

      {error && <p role="alert">{error}</p>}

      <div>
        <button type="submit" disabled={submitting || content.trim().length === 0}>
          {submitting ? 'Submitting...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
