import * as React from "react";
import { Link } from "react-router-dom";
import {
  getAdminTours,
  getAdminTourById,
  createAdminTour,
  updateAdminTour,
  deleteAdminTour,
  PageResponse,
  TourRequest,
  TourDepartureRequest,
} from "@/services/adminTourService";
import { getAdminCategories, CategoryResponse } from "@/services/categoryService";
import type { BackendTourResponse } from "@/features/tour/services/tour.service";
import { formatPrice } from "@/constants/mockData";
import {
  ArrowLeftIcon,
  PlusCircleIcon,
  SearchIcon,
  CompassIcon,
  PencilIcon,
  ArchiveIcon,
  XIcon,
  Loader2Icon,
  EyeIcon,
  CalendarIcon,
  ImageIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
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

export default function AdminToursPage() {
  const [toursData, setToursData] = React.useState<PageResponse<BackendTourResponse>>({
    content: [],
    totalPages: 1,
    totalElements: 0,
    number: 0,
    size: 8,
  });
  const [categories, setCategories] = React.useState<CategoryResponse[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Filters
  const [keyword, setKeyword] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<number | undefined>();
  const [page, setPage] = React.useState(0);

  // View Detail Modal
  const [previewTour, setPreviewTour] = React.useState<BackendTourResponse | null>(null);

  // Soft Delete Confirm Modal
  const [softDeletingId, setSoftDeletingId] = React.useState<number | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [activeTab, setActiveTab] = React.useState<"general" | "images" | "departures">("general");
  const [submitting, setSubmitting] = React.useState(false);

  // Form State
  const [formData, setFormData] = React.useState<{
    name: string;
    description: string;
    basePrice: number;
    departure: string;
    destination: string;
    duration: string;
    status: "PUBLISHED" | "DRAFT" | "INACTIVE" | "ARCHIVED";
    startDate: string;
    endDate: string;
    categoryId: number;
    images: { imageUrl: string }[];
    departures: TourDepartureRequest[];
  }>({
    name: "",
    description: "",
    basePrice: 1000000,
    departure: "Hà Nội",
    destination: "",
    duration: "3 Days 2 Nights",
    status: "PUBLISHED",
    startDate: "2026-09-01T00:00:00",
    endDate: "2026-12-31T23:59:59",
    categoryId: 0,
    images: [{ imageUrl: "" }],
    departures: [],
  });

  const fetchTours = React.useCallback(() => {
    setLoading(true);
    getAdminTours({
      keyword,
      categoryId: selectedCategory,
      page,
      size: 8,
    })
      .then((data) => setToursData(data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load tours list!");
      })
      .finally(() => setLoading(false));
  }, [keyword, selectedCategory, page]);

  React.useEffect(() => {
    getAdminCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: cats[0].id }));
      }
    });
  }, []);

  React.useEffect(() => {
    fetchTours();
  }, [fetchTours]);

function formatDateInput(val: any): string {
  if (!val) return new Date().toISOString().slice(0, 10);
  if (Array.isArray(val)) {
    const [y, m, d] = val;
    const year = String(y).padStart(4, "0");
    const month = String(m).padStart(2, "0");
    const day = String(d).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const str = String(val);
  if (str.includes(",")) {
    const parts = str.split(",");
    if (parts.length >= 3) {
      const year = parts[0].trim().padStart(4, "0");
      const month = parts[1].trim().padStart(2, "0");
      const day = parts[2].trim().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  }
  return str.slice(0, 10);
}

function normalizeTourStatus(status?: string): "PUBLISHED" | "DRAFT" | "INACTIVE" | "ARCHIVED" {
  const upper = String(status || "").toUpperCase();
  if (upper === "PUBLISHED" || upper === "AVAILABLE") return "PUBLISHED";
  if (upper === "DRAFT") return "DRAFT";
  if (upper === "INACTIVE" || upper === "CLOSED") return "INACTIVE";
  if (upper === "ARCHIVED") return "ARCHIVED";
  return "PUBLISHED";
}

function normalizeDepartureStatus(status?: string): "UPCOMING" | "FULL" | "CANCELLED" | "COMPLETED" {
  const upper = String(status || "").toUpperCase();
  if (upper === "UPCOMING" || upper === "OPEN" || upper === "AVAILABLE") return "UPCOMING";
  if (upper === "FULL") return "FULL";
  if (upper === "CANCELLED") return "CANCELLED";
  if (upper === "COMPLETED") return "COMPLETED";
  return "UPCOMING";
}

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setActiveTab("general");
    const today = new Date().toISOString().slice(0, 10);
    const ninetyDaysLater = new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().slice(0, 10);
    setFormData({
      name: "",
      description: "",
      basePrice: 1000000,
      departure: "Hà Nội",
      destination: "",
      duration: "3 Days 2 Nights",
      status: "PUBLISHED",
      startDate: today,
      endDate: ninetyDaysLater,
      categoryId: categories[0]?.id || 1,
      images: [{ imageUrl: "https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?w=800&h=500&fit=crop" }],
      departures: [
        {
          departureDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10),
          returnDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().slice(0, 10),
          price: 1000000,
          totalSlot: 20,
          availableSlot: 20,
          status: "UPCOMING",
        },
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (tour: BackendTourResponse) => {
    setEditingId(tour.id);
    setActiveTab("general");
    try {
      const fullTour = await getAdminTourById(tour.id);
      const todayStr = new Date().toISOString().slice(0, 10);
      const futureStr = new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().slice(0, 10);
      setFormData({
        name: fullTour.name || "",
        description: fullTour.description || "",
        basePrice: fullTour.basePrice || 0,
        departure: fullTour.departure || "",
        destination: fullTour.destination || "",
        duration: fullTour.duration || "",
        status: normalizeTourStatus(fullTour.status),
        startDate: formatDateInput(fullTour.startDate),
        endDate: formatDateInput(fullTour.endDate) || futureStr,
        categoryId: fullTour.category?.id || categories[0]?.id || 1,
        images: fullTour.images && fullTour.images.length > 0
          ? fullTour.images.map((img) => ({ imageUrl: img.imageUrl || img.url || "" }))
          : [{ imageUrl: "" }],
        departures: fullTour.departures && fullTour.departures.length > 0
          ? fullTour.departures.map((d) => ({
              id: d.id,
              departureDate: formatDateInput(d.departureDate),
              returnDate: formatDateInput(d.returnDate || d.departureDate),
              price: d.price || fullTour.basePrice,
              totalSlot: d.totalSlot ?? d.totalSlots ?? 20,
              availableSlot: d.availableSlot ?? d.availableSlots ?? 20,
              status: normalizeDepartureStatus(d.status),
            }))
          : [],
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tour details!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter Tour Name!");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Please select a Category!");
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const startDateIso = formatDateInput(formData.startDate);
    const endDateIso = formatDateInput(formData.endDate);

    if (startDateIso < todayStr) {
      toast.error("Start Date must be from today onwards!");
      return;
    }
    if (endDateIso < startDateIso) {
      toast.error("End Date must be on or after Start Date!");
      return;
    }
    if (Number(formData.basePrice) < 0) {
      toast.error("Base price cannot be negative!");
      return;
    }

    for (let i = 0; i < formData.departures.length; i++) {
      const dep = formData.departures[i];
      const depDate = formatDateInput(dep.departureDate);
      const retDate = formatDateInput(dep.returnDate || dep.departureDate);
      const totalSlot = Number(dep.totalSlot);
      const availableSlot = Number(dep.availableSlot);
      const price = Number(dep.price);

      if (depDate < todayStr) {
        toast.error(`Departure #${i + 1}: Departure Date must be from today onwards!`);
        return;
      }
      if (retDate < depDate) {
        toast.error(`Departure #${i + 1}: Return Date must be on or after Departure Date!`);
        return;
      }
      if (totalSlot <= 0) {
        toast.error(`Departure #${i + 1}: Total Slots must be greater than 0!`);
        return;
      }
      if (availableSlot < 0) {
        toast.error(`Departure #${i + 1}: Available Slots cannot be negative!`);
        return;
      }
      if (availableSlot > totalSlot) {
        toast.error(`Departure #${i + 1}: Available Slots cannot exceed Total Slots!`);
        return;
      }
      if (price < 0) {
        toast.error(`Departure #${i + 1}: Price cannot be negative!`);
        return;
      }
    }

    const payload: TourRequest = {
      name: formData.name.trim(),
      description: formData.description,
      basePrice: Number(formData.basePrice) || 0,
      departure: formData.departure,
      destination: formData.destination,
      duration: formData.duration,
      status: normalizeTourStatus(formData.status),
      startDate: `${startDateIso}T00:00:00`,
      endDate: `${endDateIso}T23:59:59`,
      categoryId: Number(formData.categoryId),
      images: formData.images.filter((img) => img.imageUrl.trim() !== ""),
      departures: formData.departures.map((d) => ({
        ...(d.id ? { id: Number(d.id) } : {}),
        departureDate: formatDateInput(d.departureDate),
        returnDate: formatDateInput(d.returnDate || d.departureDate),
        price: Number(d.price) || 0,
        totalSlot: Number(d.totalSlot) || 20,
        availableSlot: Number(d.availableSlot) || 20,
        status: normalizeDepartureStatus(d.status),
      })),
    };

    setSubmitting(true);
    try {
      if (editingId) {
        await updateAdminTour(editingId, payload);
        toast.success("Tour updated successfully!");
      } else {
        await createAdminTour(payload);
        toast.success("New Tour created successfully!");
      }
      setIsModalOpen(false);
      fetchTours();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save Tour!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!softDeletingId) return;
    setDeleting(true);
    try {
      await deleteAdminTour(softDeletingId);
      toast.success(`Tour #${softDeletingId} status changed to INACTIVE (Soft Delete)!`);
      setSoftDeletingId(null);
      fetchTours();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to soft delete this Tour!");
    } finally {
      setDeleting(false);
    }
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, { imageUrl: "" }] });
  };
  const removeImageField = (index: number) => {
    const newImgs = [...formData.images];
    newImgs.splice(index, 1);
    setFormData({ ...formData, images: newImgs });
  };
  const updateImageField = (index: number, val: string) => {
    const newImgs = [...formData.images];
    newImgs[index].imageUrl = val;
    setFormData({ ...formData, images: newImgs });
  };

  const addDepartureField = () => {
    const today = new Date().toISOString().slice(0, 10);
    setFormData({
      ...formData,
      departures: [
        ...formData.departures,
        {
          departureDate: today,
          returnDate: today,
          price: formData.basePrice,
          totalSlot: 20,
          availableSlot: 20,
          status: "UPCOMING",
        },
      ],
    });
  };
  const removeDepartureField = (index: number) => {
    const newDeps = [...formData.departures];
    newDeps.splice(index, 1);
    setFormData({ ...formData, departures: newDeps });
  };
  const updateDepartureField = (index: number, field: keyof TourDepartureRequest, val: any) => {
    const newDeps = [...formData.departures];
    newDeps[index] = { ...newDeps[index], [field]: val };
    setFormData({ ...formData, departures: newDeps });
  };

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
            Manage Tour Packages
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage tour packages, itinerary images, and departure schedules for customer reservations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={handleOpenCreateModal}
            className="text-xs gap-1.5 shadow-2xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <PlusCircleIcon className="size-3.5" />
            <span>Create Tour</span>
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-xs border-border/80">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <CompassIcon className="size-4 text-primary" />
                <span>Tours Directory</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Manage, search, review details, and update tour package schedules.
              </CardDescription>
            </div>

            {/* Search and Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-60">
                <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search tours..."
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    setPage(0);
                  }}
                  className="h-8 pl-8 text-xs bg-background"
                />
              </div>

              <div className="flex items-center gap-1.5 h-8 px-2.5 text-xs rounded-md border border-border bg-background hover:bg-muted text-muted-foreground">
                <FilterIcon className="size-3.5" />
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value ? Number(e.target.value) : undefined);
                    setPage(0);
                  }}
                  className="bg-transparent text-foreground font-medium focus:outline-none cursor-pointer text-xs"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
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
                  <TableHead className="text-xs font-semibold text-center">Tour</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Duration</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Category</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Route</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Base Price</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Departures</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {toursData.content.length > 0 ? (
                  toursData.content.map((tour) => {
                    const statusUpper = String(tour.status || "").toUpperCase();
                    const isAvailable = statusUpper === "PUBLISHED" || statusUpper === "AVAILABLE";

                    return (
                      <TableRow key={tour.id} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="font-mono text-xs font-semibold text-muted-foreground text-center">
                          #{tour.id}
                        </TableCell>
                        <TableCell className="font-bold text-xs text-foreground max-w-[200px] text-center">
                          <div className="flex items-center justify-center gap-3">
                            <img
                              src={
                                tour.images?.[0]?.imageUrl ||
                                tour.images?.[0]?.url ||
                                "https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?w=100&h=100&fit=crop"
                              }
                              alt={tour.name}
                              className="size-10 rounded-lg object-cover bg-muted shrink-0 border border-border"
                            />
                            <div className="min-w-0 font-bold text-foreground truncate text-left">{tour.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-medium text-center">
                          {tour.duration || "N/A"}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-muted-foreground text-center">
                          {tour.category?.name || "N/A"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground text-center">
                          <strong className="text-foreground">{tour.departure || "N/A"}</strong> ➔ {tour.destination || "N/A"}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-primary font-mono text-center">
                          {formatPrice(tour.basePrice)}
                        </TableCell>
                        <TableCell className="text-xs text-center">
                          <Badge variant="outline" className="gap-1 font-semibold">
                            <CalendarIcon className="size-3 text-muted-foreground" />
                            {tour.departures?.length || 0} dates
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-center">
                          {isAvailable ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                              PUBLISHED
                            </Badge>
                          ) : statusUpper === "FULL" ? (
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                              FULL
                            </Badge>
                          ) : statusUpper === "DRAFT" ? (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                              DRAFT
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="bg-rose-50 text-rose-700 border-rose-200">
                              INACTIVE
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-foreground"
                            onClick={() => setPreviewTour(tour)}
                            title="View Detail"
                          >
                            <EyeIcon className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-primary"
                            onClick={() => handleOpenEditModal(tour)}
                            title="Edit Tour"
                          >
                            <PencilIcon className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-amber-600"
                            onClick={() => setSoftDeletingId(tour.id)}
                            title="Soft Delete (Set Inactive)"
                          >
                            <ArchiveIcon className="size-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-xs text-muted-foreground">
                      No matching tours found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {/* Table Footer / Pagination */}
          <div className="flex items-center justify-between px-6 py-3 border-t text-xs text-muted-foreground">
            <div>
              Page <span className="font-semibold text-foreground">{page + 1}</span> of {toursData.totalPages} ({toursData.totalElements} tours)
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeftIcon className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                disabled={page + 1 >= toursData.totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRightIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal Dialog: Create / Edit Tour */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <Card className="relative w-full max-w-3xl shadow-xl border-border/80 max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-lg font-bold">
                  {editingId ? `Edit Tour #${editingId}` : "Create New Tour"}
                </CardTitle>
                <CardDescription className="text-xs">
                  Fill in general information, itinerary images, and departure dates.
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

            {/* Navigation Tabs inside Modal */}
            <div className="flex border-b px-6 gap-6 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === "general"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                1. General Information
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("images")}
                className={`pb-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === "images"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <ImageIcon className="size-3.5" />
                <span>2. Images ({formData.images.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("departures")}
                className={`pb-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === "departures"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <CalendarIcon className="size-3.5" />
                <span>3. Departures ({formData.departures.length})</span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-4">
                {/* TAB 1: GENERAL INFO */}
                {activeTab === "general" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        Tour Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ha Long Bay Luxury Cruise 5 Stars..."
                        className="text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        Category <span className="text-destructive">*</span>
                      </label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-medium"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        Base Price (VND) <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="number"
                        required
                        min={0}
                        value={formData.basePrice}
                        onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                        className="text-xs h-9 font-bold text-primary font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        Departure Location
                      </label>
                      <Input
                        value={formData.departure}
                        onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                        placeholder="Hanoi, Ho Chi Minh, Da Nang..."
                        className="text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        Destination
                      </label>
                      <Input
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        placeholder="Ha Long Bay, Sapa, Phu Quoc..."
                        className="text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        Duration
                      </label>
                      <Input
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="3 Days 2 Nights, 1 Day..."
                        className="text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        Tour Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-semibold"
                      >
                        <option value="PUBLISHED">PUBLISHED (Visible - For Sale)</option>
                        <option value="DRAFT">DRAFT (Draft copy)</option>
                        <option value="INACTIVE">INACTIVE (Hidden / Disabled)</option>
                        <option value="ARCHIVED">ARCHIVED (Archived)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        Start Date <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="date"
                        min={new Date().toISOString().slice(0, 10)}
                        value={formData.startDate.slice(0, 10)}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="text-xs h-9"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        End Date <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="date"
                        min={formData.startDate ? formData.startDate.slice(0, 10) : new Date().toISOString().slice(0, 10)}
                        value={formData.endDate.slice(0, 10)}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="text-xs h-9"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        Tour Description
                      </label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed itinerary and tour package details..."
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 2: IMAGES */}
                {activeTab === "images" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        Image URLs List
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={addImageField}
                        className="text-xs text-primary gap-1"
                      >
                        <PlusCircleIcon className="size-3.5" />
                        <span>Add Image</span>
                      </Button>
                    </div>

                    {formData.images.map((img, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input
                          type="url"
                          value={img.imageUrl}
                          onChange={(e) => updateImageField(idx, e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="text-xs h-9 flex-1"
                        />
                        {formData.images.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeImageField(idx)}
                          >
                            <XIcon className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 3: DEPARTURES */}
                {activeTab === "departures" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                        Departure Dates & Pricing
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={addDepartureField}
                        className="text-xs text-primary gap-1"
                      >
                        <PlusCircleIcon className="size-3.5" />
                        <span>Add Departure Date</span>
                      </Button>
                    </div>

                    {formData.departures.map((dep, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-muted/30 border border-border grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2"
                      >
                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground uppercase">Departure</label>
                          <Input
                            type="date"
                            min={new Date().toISOString().slice(0, 10)}
                            value={dep.departureDate}
                            onChange={(e) => updateDepartureField(idx, "departureDate", e.target.value)}
                            className="text-xs h-8 bg-background"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground uppercase">Return Date</label>
                          <Input
                            type="date"
                            min={dep.departureDate.slice(0, 10)}
                            value={dep.returnDate}
                            onChange={(e) => updateDepartureField(idx, "returnDate", e.target.value)}
                            className="text-xs h-8 bg-background"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground uppercase">Price (VND)</label>
                          <Input
                            type="number"
                            min={0}
                            value={dep.price}
                            onChange={(e) => updateDepartureField(idx, "price", Number(e.target.value))}
                            className="text-xs h-8 bg-background font-mono font-bold text-primary"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground uppercase">Total Slots</label>
                          <Input
                            type="number"
                            min={1}
                            value={dep.totalSlot}
                            onChange={(e) => updateDepartureField(idx, "totalSlot", Number(e.target.value))}
                            className="text-xs h-8 bg-background"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-muted-foreground uppercase">Available</label>
                          <Input
                            type="number"
                            min={0}
                            max={dep.totalSlot}
                            value={dep.availableSlot}
                            onChange={(e) => updateDepartureField(idx, "availableSlot", Number(e.target.value))}
                            className="text-xs h-8 bg-background"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex-1">
                            <label className="text-[10px] font-semibold text-muted-foreground uppercase">Status</label>
                            <select
                              value={dep.status}
                              onChange={(e) => updateDepartureField(idx, "status", e.target.value)}
                              className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs font-semibold"
                            >
                              <option value="UPCOMING">UPCOMING</option>
                              <option value="FULL">FULL</option>
                              <option value="CANCELLED">CANCELLED</option>
                              <option value="COMPLETED">COMPLETED</option>
                            </select>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground hover:text-destructive mt-3"
                            onClick={() => removeDepartureField(idx)}
                          >
                            <XIcon className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  <span>{editingId ? "Update Tour" : "Create Tour"}</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Preview Modal */}
      {previewTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <Card className="relative w-full max-w-xl shadow-xl border-border/80 space-y-4 p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="mb-1 text-[11px] font-semibold text-primary border-primary/30">
                  {previewTour.category?.name || "Tour"}
                </Badge>
                <h2 className="text-lg font-bold text-foreground">{previewTour.name}</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-full"
                onClick={() => setPreviewTour(null)}
              >
                <XIcon className="size-4" />
              </Button>
            </div>

            {previewTour.images && previewTour.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {previewTour.images.slice(0, 3).map((img, i) => (
                  <img
                    key={i}
                    src={img.imageUrl || img.url}
                    alt="preview"
                    className="w-full h-24 rounded-lg object-cover bg-muted border border-border"
                  />
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs bg-muted/40 p-3 rounded-lg">
              <div>
                <span className="text-muted-foreground block font-semibold uppercase text-[10px]">Base Price:</span>
                <span className="font-bold text-primary text-sm font-mono">{formatPrice(previewTour.basePrice)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-semibold uppercase text-[10px]">Duration:</span>
                <span className="font-medium text-foreground">{previewTour.duration || "N/A"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-semibold uppercase text-[10px]">Departure:</span>
                <span className="font-medium text-foreground">{previewTour.departure || "N/A"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block font-semibold uppercase text-[10px]">Destination:</span>
                <span className="font-medium text-foreground">{previewTour.destination || "N/A"}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Description:</h4>
              <p className="text-xs text-foreground leading-relaxed bg-background p-3 rounded-lg border">
                {previewTour.description || "No description provided."}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Dialog: Soft Delete Confirm */}
      {softDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <Card className="relative w-full max-w-md shadow-xl border-border/80 text-center">
            <CardHeader className="pb-2">
              <div className="size-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
                <ArchiveIcon className="size-5" />
              </div>
              <CardTitle className="text-base font-bold">Confirm Soft Delete Tour #{softDeletingId}?</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                The tour status will be changed to <strong>INACTIVE</strong>. Tour data will remain preserved in the database and can be reactivated anytime.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoftDeletingId(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSoftDelete}
                disabled={deleting}
                className="text-xs bg-amber-600 text-white hover:bg-amber-700 gap-1.5"
              >
                {deleting && <Loader2Icon className="size-3.5 animate-spin" />}
                <span>Set Inactive</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
