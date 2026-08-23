import AdminPlaceholderPage from "../shared/AdminPlaceholderPage"

export default function AdminManageCategoriesPage() {
  return (
    <AdminPlaceholderPage
      title="Manage Category"
      description="Placeholder to manage tour categories and taxonomy consistency."
      actionLabel="Add Category"
      metrics={[
        { label: "Total Categories", value: "38", trend: "+2 this month" },
        { label: "Active", value: "34", trend: "Used in public tours" },
        { label: "Hidden", value: "04", trend: "Internal or deprecated" },
        { label: "Mapped Tours", value: "186", trend: "100% coverage" },
      ]}
      rows={[
        { name: "Adventure", status: "Active", updatedAt: "10 mins ago" },
        { name: "Family Trip", status: "Active", updatedAt: "2 hours ago" },
        { name: "Luxury", status: "Inactive", updatedAt: "3 days ago" },
      ]}
    />
  )
}
