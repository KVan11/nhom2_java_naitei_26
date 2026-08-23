import AdminPlaceholderPage from "../shared/AdminPlaceholderPage"

export default function AdminManageToursPage() {
  return (
    <AdminPlaceholderPage
      title="Manage Tour"
      description="Placeholder to manage tour content, pricing, and publish status."
      actionLabel="Create Tour"
      metrics={[
        { label: "Total Tours", value: "186", trend: "+6 this month" },
        { label: "Published", value: "154", trend: "82.8% currently visible" },
        { label: "Draft Tours", value: "21", trend: "Awaiting content checks" },
        { label: "Sold Out", value: "11", trend: "Peak demand routes" },
      ]}
      rows={[
        { name: "Ha Long Weekend", status: "Published", updatedAt: "5 mins ago" },
        { name: "Da Nang Summer", status: "Draft", updatedAt: "44 mins ago" },
        { name: "Sapa Trek", status: "Published", updatedAt: "3 hours ago" },
      ]}
    />
  )
}
