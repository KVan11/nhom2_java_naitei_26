import { useCallback, useEffect, useState } from 'react'
import { getComments, type Comment } from '../../services/commentService'
import ReplyInput from './ReplyInput'

type CommentThreadProps = {
  reviewId: number
}

type CommentItemProps = {
  comment: Comment
  reviewId: number
  onChanged: () => void
}

function formatCommentDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Unknown time' : date.toLocaleString()
}

function CommentItem({ comment, reviewId, onChanged }: CommentItemProps) {
  const [replying, setReplying] = useState(false)

  return (
    <li>
      <article>
        <header>
          <strong>{comment.userName || 'User'}</strong>
          <small>{formatCommentDate(comment.createdAt)}</small>
        </header>

        <p>{comment.content}</p>

        <button type="button" onClick={() => setReplying((current) => !current)}>
          Reply
        </button>

        {replying && (
          <ReplyInput
            reviewId={reviewId}
            parentCommentId={comment.id}
            onSubmitted={() => {
              setReplying(false)
              onChanged()
            }}
            onCancel={() => setReplying(false)}
          />
        )}
      </article>

      {comment.replies.length > 0 && (
        <ul aria-label={`Replies to ${comment.userName || 'comment'}`}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              reviewId={reviewId}
              onChanged={onChanged}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export default function CommentThread({ reviewId }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadComments = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      setComments(await getComments(reviewId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load comments')
    } finally {
      setLoading(false)
    }
  }, [reviewId])

  useEffect(() => {
    void loadComments()
  }, [loadComments])

  const handleCommentsChanged = useCallback(() => {
    void loadComments()
  }, [loadComments])

  return (
    <section aria-label="Comments">
      <h4>Comments</h4>

      <ReplyInput reviewId={reviewId} onSubmitted={handleCommentsChanged} />

      {loading && <p>Loading comments...</p>}

      {error && (
        <div role="alert">
          <p>{error}</p>
          <button type="button" onClick={handleCommentsChanged}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && comments.length === 0 && <p>No comments yet.</p>}

      {!loading && !error && comments.length > 0 && (
        <ul>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              reviewId={reviewId}
              onChanged={handleCommentsChanged}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
