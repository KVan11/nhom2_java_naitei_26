import AdminPlaceholderPage from "../shared/AdminPlaceholderPage"

export default function AdminManageBookingRequestsPage() {
  return (
    <AdminPlaceholderPage
      title="Manage Booking Requests"
      description="Placeholder to process pending booking requests and follow-up status."
      actionLabel="Create Request"
      metrics={[
        { label: "Pending Requests", value: "47", trend: "+12 since yesterday" },
        { label: "Approved Today", value: "33", trend: "Avg response 14 mins" },
        { label: "Need Contact", value: "08", trend: "Missing payment proofs" },
        { label: "Rejected", value: "05", trend: "Policy mismatch reasons" },
      ]}
      rows={[
        { name: "BK-2026-0812", status: "Pending", updatedAt: "1 min ago" },
        { name: "BK-2026-0810", status: "Approved", updatedAt: "27 mins ago" },
        { name: "BK-2026-0809", status: "Pending", updatedAt: "2 hours ago" },
      ]}
    />
  )
}
