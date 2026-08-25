import * as React from "react"
import { Edit3Icon, Loader2Icon, StarIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  deleteMyReview,
  getApiErrorMessage,
  getMyReviews,
  type Review,
  updateMyReview,
} from "@/services/reviewService"

export default function MyReviewsSection() {
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [loading, setLoading] = React.useState(true)
  const [editing, setEditing] = React.useState<Review | null>(null)
  const [deleting, setDeleting] = React.useState<Review | null>(null)
  const [content, setContent] = React.useState("")
  const [rating, setRating] = React.useState(5)
  const [imageUrls, setImageUrls] = React.useState("")
  const [saving, setSaving] = React.useState(false)

  const loadReviews = React.useCallback(async () => {
    setLoading(true)
    try {
      setReviews(await getMyReviews())
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load your reviews"))
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void loadReviews()
  }, [loadReviews])

  const openEdit = (review: Review) => {
    setEditing(review)
    setContent(review.content)
    setRating(review.rating)
    setImageUrls(review.images.map((image) => image.imageUrl).join("\n"))
  }

  const handleSave = async () => {
    if (!editing) return
    if (!content.trim()) {
      toast.error("Review content is required")
      return
    }

    setSaving(true)
    try {
      const updated = await updateMyReview(editing.id, {
        content: content.trim(),
        rating,
        imageUrls: imageUrls
          .split("\n")
          .map((value) => value.trim())
          .filter(Boolean),
      })
      setReviews((current) => current.map((review) => (review.id === updated.id ? updated : review)))
      setEditing(null)
      toast.success("Review updated")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to update review"))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setSaving(true)
    try {
      await deleteMyReview(deleting.id)
      setReviews((current) => current.filter((review) => review.id !== deleting.id))
      setDeleting(null)
      toast.success("Review deleted")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete review"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My reviews</CardTitle>
        <CardDescription>View, edit, or delete reviews you submitted for completed tours.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
            <Loader2Icon className="h-4 w-4 animate-spin" /> Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <p className="py-8 text-sm text-slate-500">You have not submitted any reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{review.tourName || `Tour #${review.tourId}`}</h3>
                    <div className="mt-1 flex items-center gap-1 text-amber-500" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <StarIcon
                          key={index}
                          className={`h-4 w-4 ${index < review.rating ? "fill-current" : "text-slate-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(review)}>
                      <Edit3Icon className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleting(review)}>
                      <Trash2Icon className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{review.content}</p>
                {review.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {review.images.map((image) => (
                      <img
                        key={image.id}
                        src={image.imageUrl}
                        alt="Review attachment"
                        className="h-20 w-20 rounded-lg border object-cover"
                      />
                    ))}
                  </div>
                )}
                <p className="mt-3 text-xs text-slate-400">
                  Updated {new Date(review.updatedAt || review.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit review</DialogTitle>
            <DialogDescription>Update the rating, review text, and optional image URLs.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Rating</label>
              <select
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>{value} star{value > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Review</label>
              <textarea
                className="min-h-28 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Image URLs</label>
              <Input
                value={imageUrls}
                onChange={(event) => setImageUrls(event.target.value)}
                placeholder="One URL per line"
              />
              <p className="mt-1 text-xs text-slate-400">For multiple images, paste one URL per line.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>Cancel</Button>
            <Button onClick={() => void handleSave()} disabled={saving}>
              {saving && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />} Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleting !== null} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete review?</DialogTitle>
            <DialogDescription>
              This also removes comments, replies, likes, and review images associated with this review.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)} disabled={saving}>Cancel</Button>
            <Button variant="destructive" onClick={() => void handleDelete()} disabled={saving}>
              {saving && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />} Delete review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
