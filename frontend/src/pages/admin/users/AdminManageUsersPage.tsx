import AdminPlaceholderPage from "../shared/AdminPlaceholderPage"

export default function AdminManageUsersPage() {
  return (
    <AdminPlaceholderPage
      title="Manage User"
      description="Placeholder to manage user accounts, roles, and account status."
      actionLabel="Add User"
      metrics={[
        { label: "Total Users", value: "2,468", trend: "+8.4% from last month" },
        { label: "New This Week", value: "124", trend: "+17 in 7 days" },
        { label: "Locked Accounts", value: "09", trend: "Need review by support" },
        { label: "Verified", value: "1,982", trend: "80.3% verification rate" },
      ]}
      rows={[
        { name: "Nguyen Van A", status: "Active", updatedAt: "2 mins ago" },
        { name: "Tran Minh B", status: "Pending", updatedAt: "18 mins ago" },
        { name: "Le Thi C", status: "Inactive", updatedAt: "1 hour ago" },
      ]}
    />
  )
}
