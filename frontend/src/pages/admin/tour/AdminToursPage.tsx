import { useState, useEffect } from "react";
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
  Compass,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  Calendar,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Archive,
} from "lucide-react";

export default function AdminToursPage() {
  const [toursData, setToursData] = useState<PageResponse<BackendTourResponse>>({
    content: [],
    totalPages: 1,
    totalElements: 0,
    number: 0,
    size: 10,
  });
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [page, setPage] = useState(0);

  // Toast / Alert
  const [alert, setAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // View Detail Modal
  const [previewTour, setPreviewTour] = useState<BackendTourResponse | null>(null);

  // Soft Delete Confirm Modal
  const [softDeletingId, setSoftDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Create / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "images" | "departures">("general");
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
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
    duration: "3 Ngày 2 Đêm",
    status: "PUBLISHED",
    startDate: "2026-09-01T00:00:00",
    endDate: "2026-12-31T23:59:59",
    categoryId: 0,
    images: [{ imageUrl: "" }],
    departures: [],
  });

  const fetchTours = () => {
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
        showAlert("error", "Không thể tải danh sách tour!");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getAdminCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: cats[0].id }));
      }
    });
  }, []);

  useEffect(() => {
    fetchTours();
  }, [keyword, selectedCategory, page]);

  const showAlert = (type: "success" | "error", text: string) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setActiveTab("general");
    setFormData({
      name: "",
      description: "",
      basePrice: 1000000,
      departure: "Hà Nội",
      destination: "",
      duration: "3 Ngày 2 Đêm",
      status: "PUBLISHED",
      startDate: new Date().toISOString().slice(0, 19),
      endDate: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().slice(0, 19),
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
      setFormData({
        name: fullTour.name || "",
        description: fullTour.description || "",
        basePrice: fullTour.basePrice || 0,
        departure: fullTour.departure || "",
        destination: fullTour.destination || "",
        duration: fullTour.duration || "",
        status: (fullTour.status as any) || "PUBLISHED",
        startDate: fullTour.startDate ? fullTour.startDate.slice(0, 19) : new Date().toISOString().slice(0, 19),
        endDate: fullTour.endDate ? fullTour.endDate.slice(0, 19) : new Date().toISOString().slice(0, 19),
        categoryId: fullTour.category?.id || categories[0]?.id || 1,
        images: fullTour.images && fullTour.images.length > 0
          ? fullTour.images.map((img) => ({ imageUrl: img.imageUrl || img.url || "" }))
          : [{ imageUrl: "" }],
        departures: fullTour.departures && fullTour.departures.length > 0
          ? fullTour.departures.map((d) => ({
              id: d.id,
              departureDate: d.departureDate,
              returnDate: d.returnDate || d.departureDate,
              price: d.price || fullTour.basePrice,
              totalSlot: d.totalSlot ?? d.totalSlots ?? 20,
              availableSlot: d.availableSlot ?? d.availableSlots ?? 20,
              status: (d.status as any) || "UPCOMING",
            }))
          : [],
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      showAlert("error", "Không thể tải thông tin chi tiết tour!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showAlert("error", "Vui lòng nhập tên Tour!");
      return;
    }
    if (!formData.categoryId) {
      showAlert("error", "Vui lòng chọn danh mục cho Tour!");
      return;
    }

    const payload: TourRequest = {
      name: formData.name,
      description: formData.description,
      basePrice: Number(formData.basePrice),
      departure: formData.departure,
      destination: formData.destination,
      duration: formData.duration,
      status: formData.status,
      startDate: formData.startDate.includes("T") ? formData.startDate : `${formData.startDate}T00:00:00`,
      endDate: formData.endDate.includes("T") ? formData.endDate : `${formData.endDate}T23:59:59`,
      categoryId: Number(formData.categoryId),
      images: formData.images.filter((img) => img.imageUrl.trim() !== ""),
      departures: formData.departures,
    };

    setSubmitting(true);
    try {
      if (editingId) {
        await updateAdminTour(editingId, payload);
        showAlert("success", "Cập nhật Tour thành công!");
      } else {
        await createAdminTour(payload);
        showAlert("success", "Tạo Tour mới thành công!");
      }
      setIsModalOpen(false);
      fetchTours();
    } catch (err: any) {
      console.error(err);
      showAlert("error", err?.response?.data?.message || "Có lỗi xảy ra khi lưu Tour!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSoftDelete = async () => {
    if (!softDeletingId) return;
    setDeleting(true);
    try {
      await deleteAdminTour(softDeletingId);
      showAlert("success", `Đã chuyển Tour #${softDeletingId} sang trạng thái Ngừng hoạt động (Xóa mềm)!`);
      setSoftDeletingId(null);
      fetchTours();
    } catch (err: any) {
      console.error(err);
      showAlert("error", err?.response?.data?.message || "Không thể thực hiện xóa mềm Tour này!");
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
      {/* Alert Banner */}
      {alert && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg transition-all ${
            alert.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {alert.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span className="text-sm font-semibold">{alert.text}</span>
          </div>
          <button onClick={() => setAlert(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Compass className="w-6 h-6 text-brand" />
            <span>Quản lý Tour Du Lịch</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý thông tin các gói Tour, hình ảnh và lịch khởi hành cho khách đặt.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-gradient-to-r from-brand to-brand-dark text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-brand/20 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Tour mới</span>
        </button>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        {/* Search and Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(0);
              }}
              placeholder="Tìm kiếm tour theo tên, địa danh..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedCategory || ""}
                onChange={(e) => {
                  setSelectedCategory(e.target.value ? Number(e.target.value) : undefined);
                  setPage(0);
                }}
                className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : toursData.content.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Không tìm thấy tour nào phù hợp với bộ lọc.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3 w-16">ID</th>
                  <th className="pb-3 px-3">Tour</th>
                  <th className="pb-3 px-3">Danh mục</th>
                  <th className="pb-3 px-3">Khởi hành ➔ Điểm đến</th>
                  <th className="pb-3 px-3">Giá gốc</th>
                  <th className="pb-3 px-3">Lịch mở</th>
                  <th className="pb-3 px-3">Trạng thái</th>
                  <th className="pb-3 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {toursData.content.map((tour) => {
                  const statusUpper = String(tour.status || "").toUpperCase();
                  const isAvailable = statusUpper === "PUBLISHED" || statusUpper === "AVAILABLE";
                  return (
                    <tr key={tour.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-mono text-xs text-slate-400 font-bold">
                        #{tour.id}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900 max-w-[240px]">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              tour.images?.[0]?.imageUrl ||
                              tour.images?.[0]?.url ||
                              "https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?w=100&h=100&fit=crop"
                            }
                            alt={tour.name}
                            className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{tour.name}</div>
                            <div className="text-xs text-slate-400 font-normal">{tour.duration}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-600">
                        {tour.category?.name || "N/A"}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 text-xs">
                        <div><strong className="text-slate-900">{tour.departure || "N/A"}</strong> ➔ {tour.destination || "N/A"}</div>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-brand">
                        {formatPrice(tour.basePrice)}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {tour.departures?.length || 0} lịch
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isAvailable
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : statusUpper === "FULL"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {isAvailable ? "Còn chỗ" : statusUpper === "FULL" ? "Đã đầy" : "Đã đóng"}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right space-x-1">
                        <button
                          onClick={() => setPreviewTour(tour)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem thông tin chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(tour)}
                          className="p-2 text-slate-600 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                          title="Chỉnh sửa tour"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSoftDeletingId(tour.id)}
                          className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Xóa mềm (Ngừng hoạt động)"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {toursData.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <span className="text-slate-500">
              Trang <strong>{page + 1}</strong> / {toursData.totalPages} ({toursData.totalElements} tour)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page + 1 >= toursData.totalPages}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Dialog: Create / Edit Tour */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl z-10 border border-slate-100">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingId ? `Chỉnh sửa Tour #${editingId}` : "Tạo mới Tour Du Lịch"}
                </h2>
                <p className="text-xs text-slate-500">
                  Điền đầy đủ thông tin chung, danh sách ảnh và các lịch khởi hành.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 mb-6 gap-6">
              <button
                onClick={() => setActiveTab("general")}
                className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === "general"
                    ? "border-brand text-brand"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                1. Thông tin chung
              </button>
              <button
                onClick={() => setActiveTab("images")}
                className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "images"
                    ? "border-brand text-brand"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>2. Hình ảnh ({formData.images.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("departures")}
                className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "departures"
                    ? "border-brand text-brand"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>3. Lịch khởi hành ({formData.departures.length})</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* TAB 1: GENERAL INFO */}
              {activeTab === "general" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Tên Tour <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ví dụ: Tour Du Thuyền Vịnh Hạ Long 5 Sao..."
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand cursor-pointer font-semibold"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Giá khởi điểm (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand font-bold text-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Điểm khởi hành
                    </label>
                    <input
                      type="text"
                      value={formData.departure}
                      onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                      placeholder="Hà Nội, TP.HCM, Đà Nẵng..."
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Điểm đến
                    </label>
                    <input
                      type="text"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="Vịnh Hạ Long, Sapa, Phú Quốc..."
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Thời lượng tour
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="3 Ngày 2 Đêm, 1 Ngày..."
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Trạng thái Tour
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand cursor-pointer font-bold"
                    >
                      <option value="PUBLISHED">PUBLISHED (Đã xuất bản - Mở bán)</option>
                      <option value="DRAFT">DRAFT (Bản nháp)</option>
                      <option value="INACTIVE">INACTIVE (Ngừng hoạt động)</option>
                      <option value="ARCHIVED">ARCHIVED (Lưu trữ)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Mô tả Tour
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Nhập mô tả hành trình, trải nghiệm điểm đến..."
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: IMAGES */}
              {activeTab === "images" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Danh sách đường dẫn ảnh (URL)
                    </span>
                    <button
                      type="button"
                      onClick={addImageField}
                      className="text-xs font-bold text-brand hover:text-brand-dark flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm ảnh</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {img.imageUrl ? (
                          <img
                            src={img.imageUrl}
                            alt="preview"
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                            onError={(e) => {
                              (e.target as any).src = "https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?w=100&h=100&fit=crop";
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                        <input
                          type="url"
                          value={img.imageUrl}
                          onChange={(e) => updateImageField(idx, e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand"
                        />
                        {formData.images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageField(idx)}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: DEPARTURES */}
              {activeTab === "departures" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Lịch khởi hành cụ thể
                    </span>
                    <button
                      type="button"
                      onClick={addDepartureField}
                      className="text-xs font-bold text-brand hover:text-brand-dark flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm ngày khởi hành</span>
                    </button>
                  </div>

                  {formData.departures.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      Chưa có lịch khởi hành nào. Nhấn "Thêm ngày khởi hành" để thiết lập.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.departures.map((dep, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative"
                        >
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                              Ngày đi
                            </label>
                            <input
                              type="date"
                              required
                              value={dep.departureDate}
                              onChange={(e) => updateDepartureField(idx, "departureDate", e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                              Ngày về
                            </label>
                            <input
                              type="date"
                              required
                              value={dep.returnDate}
                              onChange={(e) => updateDepartureField(idx, "returnDate", e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                              Giá vé (VNĐ)
                            </label>
                            <input
                              type="number"
                              required
                              min={0}
                              value={dep.price}
                              onChange={(e) => updateDepartureField(idx, "price", Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold text-brand"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                              Tổng chỗ
                            </label>
                            <input
                              type="number"
                              required
                              min={1}
                              value={dep.totalSlot}
                              onChange={(e) => updateDepartureField(idx, "totalSlot", Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                              Còn trống
                            </label>
                            <input
                              type="number"
                              required
                              min={0}
                              value={dep.availableSlot}
                              onChange={(e) => updateDepartureField(idx, "availableSlot", Number(e.target.value))}
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                            />
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1">
                              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                                Trạng thái
                              </label>
                              <select
                                value={dep.status}
                                onChange={(e) => updateDepartureField(idx, "status", e.target.value)}
                                className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-semibold"
                              >
                                <option value="UPCOMING">UPCOMING</option>
                                <option value="FULL">FULL</option>
                                <option value="CANCELLED">CANCELLED</option>
                                <option value="COMPLETED">COMPLETED</option>
                              </select>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeDepartureField(idx)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg mt-5"
                              title="Xóa lịch"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-400">
                  {activeTab === "general" && "Bước 1/3: Nhập thông tin Tour"}
                  {activeTab === "images" && "Bước 2/3: Thêm các hình ảnh minh họa"}
                  {activeTab === "departures" && "Bước 3/3: Cấu hình ngày giờ khởi hành"}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-brand to-brand-dark text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-brand/20 hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{editingId ? "Cập nhật Tour" : "Tạo mới Tour"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setPreviewTour(null)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl z-10 border border-slate-100 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="bg-brand/10 text-brand rounded-full text-xs font-semibold px-2.5 py-0.5 mb-2 inline-block">
                  {previewTour.category?.name || "Tour"}
                </span>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">{previewTour.name}</h2>
              </div>
              <button
                onClick={() => setPreviewTour(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Images */}
            {previewTour.images && previewTour.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {previewTour.images.slice(0, 3).map((img, i) => (
                  <img
                    key={i}
                    src={img.imageUrl || img.url}
                    alt="preview"
                    className="w-full h-28 rounded-xl object-cover bg-slate-100 border border-slate-200"
                  />
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl">
              <div>
                <span className="text-slate-400 block uppercase font-bold">Giá khởi điểm:</span>
                <span className="text-base font-extrabold text-brand">{formatPrice(previewTour.basePrice)}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold">Thời lượng:</span>
                <span className="font-semibold text-slate-800">{previewTour.duration || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold">Khởi hành từ:</span>
                <span className="font-semibold text-slate-800">{previewTour.departure || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold">Điểm đến:</span>
                <span className="font-semibold text-slate-800">{previewTour.destination || "N/A"}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Mô tả:</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-100 p-3 rounded-xl">
                {previewTour.description || "Chưa có thông tin mô tả."}
              </p>
            </div>

            {/* Departures List */}
            {previewTour.departures && previewTour.departures.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Lịch khởi hành ({previewTour.departures.length}):</h4>
                <div className="space-y-2">
                  {previewTour.departures.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <strong>{d.departureDate}</strong> ➔ {d.returnDate || d.departureDate}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-brand">{formatPrice(d.price)}</span>
                        <span className="text-slate-500">Còn {d.availableSlot ?? d.availableSlots ?? 0} chỗ</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Soft Delete Confirm Modal */}
      {softDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSoftDeletingId(null)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl z-10 border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Archive className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Xác nhận xóa mềm Tour #{softDeletingId}?</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Tour sẽ chuyển sang trạng thái <strong>INACTIVE (Ngừng hoạt động)</strong>. Thông tin Tour vẫn được lưu giữ trong cơ sở dữ liệu và bạn có thể khôi phục lại bất kỳ lúc nào.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setSoftDeletingId(null)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSoftDelete}
                disabled={deleting}
                className="bg-amber-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 hover:bg-amber-700 transition-colors flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Chuyển Ngừng hoạt động</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
