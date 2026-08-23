import AdminPlaceholderPage from "../shared/AdminPlaceholderPage"

export default function AdminManageReviewsPage() {
  return (
    <AdminPlaceholderPage
      title="Manage User Reviews"
      description="Placeholder to moderate tour reviews and handle policy violations."
      actionLabel="Filter Reviews"
      metrics={[
        { label: "Total Reviews", value: "9,104", trend: "+152 this week" },
        { label: "Flagged", value: "13", trend: "Auto-detected for moderation" },
        { label: "Resolved", value: "49", trend: "Last 7 days" },
        { label: "Avg Rating", value: "4.7/5", trend: "Across all completed tours" },
      ]}
      rows={[
        { name: "Review #RV-4431", status: "Pending", updatedAt: "7 mins ago" },
        { name: "Review #RV-4424", status: "Published", updatedAt: "35 mins ago" },
        { name: "Review #RV-4398", status: "Inactive", updatedAt: "5 hours ago" },
      ]}
    />
  )
}
