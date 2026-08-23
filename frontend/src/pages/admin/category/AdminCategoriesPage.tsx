import { useState, useEffect } from "react";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  CategoryResponse,
  CategoryRequest,
} from "@/services/categoryService";
import {
  Tags,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [alert, setAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [formData, setFormData] = useState<CategoryRequest>({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    getAdminCategories()
      .then((data) => setCategories(data))
      .catch((err) => {
        console.error(err);
        showAlert("error", "Không thể tải danh sách danh mục từ server!");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showAlert = (type: "success" | "error", text: string) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 4000);
  };

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
      showAlert("error", "Tên danh mục không được để trống!");
      return;
    }

    setSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        showAlert("success", "Cập nhật danh mục thành công!");
      } else {
        await createCategory(formData);
        showAlert("success", "Tạo danh mục mới thành công!");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      showAlert("error", err?.response?.data?.message || "Có lỗi xảy ra khi lưu danh mục!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await deleteCategory(deletingId);
      showAlert("success", "Xóa danh mục thành công!");
      setDeletingId(null);
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      showAlert("error", err?.response?.data?.message || "Không thể xóa danh mục này!");
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
      {/* Alert Notification */}
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
            <Tags className="w-6 h-6 text-brand" />
            <span>Quản lý Danh mục Tour</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý và phân loại các chủ đề danh mục du lịch trên hệ thống.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-gradient-to-r from-brand to-brand-dark text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-brand/20 hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm danh mục mới</span>
        </button>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm danh mục theo tên hoặc mô tả..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
          />
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Không tìm thấy danh mục nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3 w-16">ID</th>
                  <th className="pb-3 px-3">Tên danh mục</th>
                  <th className="pb-3 px-3">Mô tả</th>
                  <th className="pb-3 px-3">Ngày tạo</th>
                  <th className="pb-3 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-mono text-xs text-slate-400 font-bold">
                      #{cat.id}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">{cat.name}</td>
                    <td className="py-3.5 px-3 text-slate-600 max-w-md">
                      {cat.description || <span className="text-slate-300 italic">Chưa có mô tả</span>}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 text-xs">
                      {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="p-2 text-slate-600 hover:text-brand hover:bg-brand/10 rounded-lg transition-colors"
                        title="Chỉnh sửa danh mục"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(cat.id)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Xóa danh mục"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog: Create / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl z-10 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {editingCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Biển & Đảo, Tour Núi..."
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Mô tả chi tiết
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập thông tin mô tả chi tiết về danh mục..."
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
                  <span>{editingCategory ? "Cập nhật" : "Tạo mới"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setDeletingId(null)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl z-10 border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Xác nhận xóa danh mục?</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác nếu danh mục đã chứa các tour liên quan.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Xóa danh mục</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
