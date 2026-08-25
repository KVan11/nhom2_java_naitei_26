import * as React from "react"
import {
  EyeIcon,
  Loader2Icon,
  RefreshCwIcon,
  SearchIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { adminReviewService } from "@/services/adminReviewService"
import { getApiErrorMessage, type Review } from "@/services/reviewService"

export default function AdminManageReviewsPage() {
  const [reviews, setReviews] = React.useState<Review[]>([])
  const [loading, setLoading] = React.useState(true)
  const [keyword, setKeyword] = React.useState("")
  const [ratingFilter, setRatingFilter] = React.useState("ALL")
  const [selectedReview, setSelectedReview] = React.useState<Review | null>(null)
  const [reviewToDelete, setReviewToDelete] = React.useState<Review | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const loadReviews = React.useCallback(async () => {
    setLoading(true)
    try {
      setReviews(await adminReviewService.getReviews())
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to load reviews"))
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void loadReviews()
  }, [loadReviews])

  const filteredReviews = React.useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()
    return reviews.filter((review) => {
      const matchesKeyword = !normalizedKeyword || [
        review.reviewerName,
        review.tourName,
        review.content,
        String(review.id),
      ].some((value) => value?.toLowerCase().includes(normalizedKeyword))

      const matchesRating = ratingFilter === "ALL" || review.rating === Number(ratingFilter)
      return matchesKeyword && matchesRating
    })
  }, [keyword, ratingFilter, reviews])

  const averageRating = React.useMemo(() => {
    if (reviews.length === 0) return 0
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  }, [reviews])

  const handleDelete = async () => {
    if (!reviewToDelete) return
    setDeleting(true)
    try {
      await adminReviewService.deleteReview(reviewToDelete.id)
      setReviews((current) => current.filter((review) => review.id !== reviewToDelete.id))
      if (selectedReview?.id === reviewToDelete.id) {
        setSelectedReview(null)
      }
      setReviewToDelete(null)
      toast.success("Review deleted")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete review"))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage User Reviews</h1>
          <p className="mt-1 text-sm text-slate-500">
            View submitted tour reviews and remove reviews when administrative action is required.
          </p>
        </div>
        <Button variant="outline" onClick={() => void loadReviews()} disabled={loading}>
          <RefreshCwIcon className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total reviews</CardDescription>
            <CardTitle className="text-3xl">{reviews.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average rating</CardDescription>
            <CardTitle className="flex items-center gap-2 text-3xl">
              {averageRating.toFixed(1)}
              <StarIcon className="h-6 w-6 fill-amber-400 text-amber-400" />
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Low ratings (1–2 stars)</CardDescription>
            <CardTitle className="text-3xl">
              {reviews.filter((review) => review.rating <= 2).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>
            Data is loaded from the secured admin review API. No moderation status is shown because the current database schema does not define one.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                className="pl-9"
                placeholder="Search reviewer, tour, content, or review ID"
              />
            </div>
            <select
              value={ratingFilter}
              onChange={(event) => setRatingFilter(event.target.value)}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="ALL">All ratings</option>
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>{rating} stars</option>
              ))}
            </select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Review</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Tour</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="inline-flex items-center gap-2 text-slate-500">
                        <Loader2Icon className="h-4 w-4 animate-spin" /> Loading reviews...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredReviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                      No reviews match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="max-w-sm">
                          <div className="font-medium text-slate-900">#{review.id}</div>
                          <div className="mt-1 line-clamp-2 text-sm text-slate-500">{review.content}</div>
                        </div>
                      </TableCell>
                      <TableCell>{review.reviewerName || `User #${review.userId}`}</TableCell>
                      <TableCell>{review.tourName || `Tour #${review.tourId}`}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          {review.rating} <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {new Date(review.updatedAt || review.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedReview(review)}>
                            <EyeIcon className="mr-1 h-4 w-4" /> View
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => setReviewToDelete(review)}>
                            <Trash2Icon className="mr-1 h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={selectedReview !== null} onOpenChange={(open) => !open && setSelectedReview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review #{selectedReview?.id}</DialogTitle>
            <DialogDescription>
              {selectedReview?.reviewerName || `User #${selectedReview?.userId}`} · {selectedReview?.tourName || `Tour #${selectedReview?.tourId}`}
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }, (_, index) => (
                  <StarIcon
                    key={index}
                    className={`h-5 w-5 ${index < selectedReview.rating ? "fill-current" : "text-slate-300"}`}
                  />
                ))}
              </div>
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{selectedReview.content}</p>
              {selectedReview.images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {selectedReview.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.imageUrl}
                      alt="Review attachment"
                      className="aspect-square w-full rounded-lg border object-cover"
                    />
                  ))}
                </div>
              )}
              <div className="text-xs text-slate-400">
                Created {new Date(selectedReview.createdAt).toLocaleString()} · Updated {new Date(selectedReview.updatedAt || selectedReview.createdAt).toLocaleString()}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReview(null)}>Close</Button>
            {selectedReview && (
              <Button
                variant="destructive"
                onClick={() => {
                  setReviewToDelete(selectedReview)
                  setSelectedReview(null)
                }}
              >
                <Trash2Icon className="mr-2 h-4 w-4" /> Delete review
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reviewToDelete !== null} onOpenChange={(open) => !open && setReviewToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete review #{reviewToDelete?.id}?</DialogTitle>
            <DialogDescription>
              The review will be permanently removed. Its comments, replies, likes, and review images are also removed to satisfy the existing foreign-key schema.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewToDelete(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={() => void handleDelete()} disabled={deleting}>
              {deleting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />} Delete review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
