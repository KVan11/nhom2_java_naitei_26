import AdminPlaceholderPage from "../shared/AdminPlaceholderPage"

export default function AdminRevenuePage() {
  return (
    <AdminPlaceholderPage
      title="Manage Revenue"
      description="Placeholder to monitor turnover, refunds, and payment performance."
      actionLabel="Export Report"
      metrics={[
        { label: "Monthly Revenue", value: "1.26B VND", trend: "+14.2% from July" },
        { label: "Successful Payments", value: "3,421", trend: "98.1% success rate" },
        { label: "Refund Total", value: "42.5M VND", trend: "-6.3% from last month" },
        { label: "Net Margin", value: "31.7%", trend: "After operating costs" },
      ]}
      rows={[
        { name: "August Week 4", status: "Stable", updatedAt: "Just now" },
        { name: "August Week 3", status: "Closed", updatedAt: "1 day ago" },
        { name: "August Week 2", status: "Closed", updatedAt: "8 days ago" },
      ]}
    />
  )
}
