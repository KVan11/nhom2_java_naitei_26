import * as React from "react";
import { Link } from "react-router-dom";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  CategoryResponse,
  CategoryRequest,
} from "@/services/categoryService";
import {
  ArrowLeftIcon,
  PlusCircleIcon,
  SearchIcon,
  LayersIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
  AlertCircleIcon,
  Loader2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<CategoryResponse[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<CategoryResponse | null>(null);
  const [formData, setFormData] = React.useState<CategoryRequest>({ name: "", description: "" });
  const [submitting, setSubmitting] = React.useState(false);

  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const fetchCategories = React.useCallback(() => {
    setLoading(true);
    getAdminCategories()
      .then((data) => setCategories(data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load categories!", {
          description: "Please check backend API connection.",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoryResponse) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description || "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name cannot be empty!");
      return;
    }

    setSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success("Category updated successfully!");
      } else {
        await createCategory(formData);
        toast.success("New category created successfully!");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save category!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await deleteCategory(deletingId);
      toast.success("Category deleted successfully!");
      setDeletingId(null);
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Cannot delete this category!");
    } finally {
      setDeleting(false);
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Action Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-1"
          >
            <ArrowLeftIcon className="size-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Manage Tour Categories
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Organize, structure, and categorize travel themes across the platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={handleOpenCreateModal}
            className="text-xs gap-1.5 shadow-2xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <PlusCircleIcon className="size-3.5" />
            <span>Add Category</span>
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-xs border-border/80">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <LayersIcon className="size-4 text-primary" />
                <span>Categories List</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Manage, search, and update active category entries.
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs bg-background"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-center w-16">ID</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Category Name</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Description</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Created At</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <TableRow key={cat.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="font-mono text-xs font-semibold text-muted-foreground text-center">
                        #{cat.id}
                      </TableCell>
                      <TableCell className="font-bold text-xs text-foreground text-center">
                        {cat.name}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-md truncate text-center">
                        {cat.description || <span className="italic text-muted-foreground/60">No description available</span>}
                      </TableCell>
                      <TableCell className="text-xs text-center">
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono text-center">
                        {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString("en-US") : "N/A"}
                      </TableCell>
                      <TableCell className="text-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-primary"
                          onClick={() => handleOpenEditModal(cat)}
                          title="Edit Category"
                        >
                          <PencilIcon className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeletingId(cat.id)}
                          title="Delete Category"
                        >
                          <Trash2Icon className="size-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">
                      No matching categories found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {/* Table Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t text-xs text-muted-foreground">
            <div>
              Showing <span className="font-semibold text-foreground">{filteredCategories.length}</span> of{" "}
              <span className="font-semibold text-foreground">{categories.length}</span> categories
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal Dialog: Create / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <Card className="relative w-full max-w-lg shadow-xl border-border/80">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-lg font-bold">
                  {editingCategory ? `Edit Category #${editingCategory.id}` : "Create New Category"}
                </CardTitle>
                <CardDescription className="text-xs">
                  Enter category name and detailed description.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-full"
                onClick={() => setIsModalOpen(false)}
              >
                <XIcon className="size-4" />
              </Button>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Category Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Beach & Islands, Mountain Trekking..."
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed category description..."
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </CardContent>

              <div className="flex items-center justify-end gap-2 border-t p-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={submitting}
                  className="text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                >
                  {submitting && <Loader2Icon className="size-3.5 animate-spin" />}
                  <span>{editingCategory ? "Update" : "Create"}</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Modal Dialog: Delete Confirm */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <Card className="relative w-full max-w-md shadow-xl border-border/80 text-center">
            <CardHeader className="pb-2">
              <div className="size-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
                <AlertCircleIcon className="size-5" />
              </div>
              <CardTitle className="text-base font-bold">Confirm Delete Category #{deletingId}?</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                This action cannot be undone if the category contains active tours.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingId(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs gap-1.5"
              >
                {deleting && <Loader2Icon className="size-3.5 animate-spin" />}
                <span>Delete Category</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
