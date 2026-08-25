// ─── Types ────────────────────────────────────────────────────────────────────
export type TourStatus = "AVAILABLE" | "FULL" | "CLOSED";
export type DepartureStatus = "OPEN" | "FULL" | "CLOSED" | "DEPARTED";

export interface Tour {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  description: string;
  basePrice: number;
  departure: string;
  destination: string;
  duration: string;
  status: TourStatus;
  images: { id: number; url: string }[];
  departures: TourDeparture[];
  averageRating: number;
  reviewCount: number;
  itinerary?: { dayNumber: number; title: string; activities: string }[];
  ratingBreakdown?: { star: number; percentage: number }[];
}

export interface TourDeparture {
  id: number;
  tourId: number;
  departureDate: string;
  returnDate: string;
  price: number;
  totalSlots: number;
  availableSlots: number;
  status: DepartureStatus;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export interface Review {
  id: number;
  tourId: number;
  userId: number;
  userName: string;
  avatar: string;
  rating: number;
  content: string;
  images: string[];
  createdAt: string;
  likes: number;
  commentCount: number;
  liked: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Biển & Đảo", description: "Nắng, cát và biển", active: true },
  { id: 2, name: "Núi & Trekking", description: "Phiêu lưu vùng cao", active: true },
  { id: 3, name: "Văn hóa & Di sản", description: "Di sản UNESCO", active: true },
  { id: 4, name: "Tour Thành phố", description: "Khám phá đô thị", active: true },
  { id: 5, name: "Sinh thái & Thiên nhiên", description: "Du lịch sinh thái", active: true },
  { id: 6, name: "Ẩm thực", description: "Khám phá ẩm thực địa phương", active: true },
];

export const DESTINATIONS_LIST = [
  "Vịnh Hạ Long", "Sapa", "Hội An", "Đà Nẵng", "Nha Trang",
  "Phú Quốc", "TP. Hồ Chí Minh", "Hà Nội", "Ninh Bình", "Đồng bằng sông Cửu Long",
];

export const DEPARTURES_LIST = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Huế", "Nha Trang"];

export const MOCK_TOURS: Tour[] = [
  {
    id: 1,
    name: "Du thuyền Hạ Long Cao Cấp & Chèo Kayak",
    categoryId: 1,
    categoryName: "Biển & Đảo",
    description: "Trải nghiệm vẻ đẹp ngoạn mục của Vịnh Hạ Long trên du thuyền sang trọng. Chèo kayak qua các núi đá vôi tuyệt đẹp, bơi trong làn nước xanh ngọc và khám phá hang động bí ẩn.",
    basePrice: 4500000,
    departure: "Hà Nội",
    destination: "Vịnh Hạ Long",
    duration: "3 Ngày 2 Đêm",
    status: "AVAILABLE",
    images: [
      { id: 1, url: "https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?w=800&h=500&fit=crop&auto=format" },
      { id: 2, url: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=500&fit=crop&auto=format" },
    ],
    departures: [
      { id: 1, tourId: 1, departureDate: "2026-09-15", returnDate: "2026-09-17", price: 4500000, totalSlots: 20, availableSlots: 8, status: "OPEN" },
      { id: 2, tourId: 1, departureDate: "2026-09-22", returnDate: "2026-09-24", price: 4800000, totalSlots: 20, availableSlots: 0, status: "FULL" },
    ],
    averageRating: 4.9,
    reviewCount: 248,
    itinerary: [
      { dayNumber: 1, title: "Hà Nội - Vịnh Hạ Long", activities: "Sáng: Xe đón quý khách tại điểm hẹn khởi hành đi Hạ Long. Trưa: Lên du thuyền, nhận phòng và thưởng thức bữa trưa hải sản. Chiều: Tham quan Hang Sửng Sốt, chèo Kayak tại hang Luồn. Tối: Ăn tối trên boong tàu, câu mực đêm." },
      { dayNumber: 2, title: "Khám phá Vịnh Lan Hạ - Đảo Cát Bà", activities: "Sáng: Tập Thái Cực Quyền đón bình minh. Chuyển sang tàu nhỏ đi sâu vào Vịnh Lan Hạ. Trưa: Ăn trưa BBQ trên bãi biển hoang sơ. Chiều: Đạp xe thăm làng chài Việt Hải trên Đảo Cát Bà. Tối: Trở lại du thuyền lớn ăn tối và nghỉ ngơi." },
      { dayNumber: 3, title: "Vịnh Hạ Long - Hà Nội", activities: "Sáng: Tham quan đảo Ti Tốp, leo núi ngắm toàn cảnh Vịnh. Trưa: Trả phòng, thưởng thức bữa trưa sớm khi tàu chạy về bờ. Chiều: Xe đưa quý khách về lại Hà Nội. Kết thúc hành trình." }
    ],
    ratingBreakdown: [
      { star: 5, percentage: 85 },
      { star: 4, percentage: 10 },
      { star: 3, percentage: 3 },
      { star: 2, percentage: 1 },
      { star: 1, percentage: 1 }
    ]
  },
  {
    id: 2,
    name: "Trải nghiệm Trekking Ruộng Bậc Thang Sapa",
    categoryId: 2,
    categoryName: "Núi & Trekking",
    description: "Đi bộ xuyên qua những thửa ruộng bậc thang tuyệt đẹp của Mù Cang Chải và Sapa. Lưu trú cùng gia đình người dân tộc thiểu số địa phương, tìm hiểu về văn hóa và truyền thống phong phú của họ.",
    basePrice: 3800000,
    departure: "Hà Nội",
    destination: "Sapa",
    duration: "4 Ngày 3 Đêm",
    status: "AVAILABLE",
    images: [
      { id: 4, url: "https://images.unsplash.com/photo-1609412058473-c199497c3c5d?w=800&h=500&fit=crop&auto=format" },
      { id: 5, url: "https://images.unsplash.com/photo-1531737212413-667205e1cda7?w=800&h=500&fit=crop&auto=format" },
    ],
    departures: [
      { id: 4, tourId: 2, departureDate: "2026-09-20", returnDate: "2026-09-23", price: 3800000, totalSlots: 16, availableSlots: 6, status: "OPEN" },
    ],
    averageRating: 4.8,
    reviewCount: 192,
  },
  {
    id: 3,
    name: "Phố Cổ Hội An & Thánh Địa Mỹ Sơn",
    categoryId: 3,
    categoryName: "Văn hóa & Di sản",
    description: "Dạo bước qua những con phố rực rỡ ánh đèn lồng của Phố Cổ Hội An và khám phá di tích Chăm huyền bí tại Thánh Địa Mỹ Sơn.",
    basePrice: 2200000,
    departure: "Đà Nẵng",
    destination: "Hội An",
    duration: "2 Ngày 1 Đêm",
    status: "AVAILABLE",
    images: [
      { id: 6, url: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=500&fit=crop&auto=format" },
    ],
    departures: [
      { id: 6, tourId: 3, departureDate: "2026-09-18", returnDate: "2026-09-19", price: 2200000, totalSlots: 25, availableSlots: 10, status: "OPEN" },
    ],
    averageRating: 4.7,
    reviewCount: 315,
  },
  {
    id: 4,
    name: "Thiên Đường Đảo Ngọc Phú Quốc",
    categoryId: 1,
    categoryName: "Biển & Đảo",
    description: "Trốn khỏi sự ồn ào đến với Phú Quốc, hòn đảo lớn nhất Việt Nam, cho một kỳ nghỉ biển khó quên cùng bãi cát trắng mịn.",
    basePrice: 6900000,
    departure: "TP. Hồ Chí Minh",
    destination: "Phú Quốc",
    duration: "5 Ngày 4 Đêm",
    status: "FULL",
    images: [
      { id: 8, url: "https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=800&h=500&fit=crop&auto=format" },
    ],
    departures: [],
    averageRating: 4.6,
    reviewCount: 178,
  },
  {
    id: 5,
    name: "Tour Ngồi Thuyền Tràng An - Ninh Bình",
    categoryId: 5,
    categoryName: "Sinh thái & Thiên nhiên",
    description: "Lướt nhẹ qua khung cảnh núi đá vôi tuyệt đẹp của Tràng An trên chiếc thuyền nan truyền thống.",
    basePrice: 890000,
    departure: "Hà Nội",
    destination: "Ninh Bình",
    duration: "1 Ngày",
    status: "AVAILABLE",
    images: [
      { id: 10, url: "https://images.unsplash.com/photo-1531737212413-667205e1cda7?w=800&h=500&fit=crop&auto=format" },
    ],
    departures: [
      { id: 7, tourId: 5, departureDate: "2026-09-14", returnDate: "2026-09-14", price: 890000, totalSlots: 30, availableSlots: 20, status: "OPEN" },
    ],
    averageRating: 4.5,
    reviewCount: 421,
  },
  {
    id: 6,
    name: "Khám phá Cuộc Sống Sông Nước Miền Tây",
    categoryId: 5,
    categoryName: "Sinh thái & Thiên nhiên",
    description: "Phiêu lưu vào mạng lưới đường thủy nhộn nhịp của Đồng bằng sông Cửu Long — vựa lúa của Việt Nam.",
    basePrice: 1950000,
    departure: "TP. Hồ Chí Minh",
    destination: "Đồng bằng sông Cửu Long",
    duration: "2 Ngày 1 Đêm",
    status: "AVAILABLE",
    images: [
      { id: 11, url: "https://images.unsplash.com/photo-1606801954050-be6b29588460?w=800&h=500&fit=crop&auto=format" },
    ],
    departures: [],
    averageRating: 4.4,
    reviewCount: 134,
  }
];

export const DEPARTURES: TourDeparture[] = [
  { id: 1, tourId: 1, departureDate: "2026-09-15", returnDate: "2026-09-17", price: 4500000, totalSlots: 20, availableSlots: 8, status: "OPEN" },
  { id: 2, tourId: 1, departureDate: "2026-09-22", returnDate: "2026-09-24", price: 4800000, totalSlots: 20, availableSlots: 0, status: "FULL" },
  { id: 3, tourId: 1, departureDate: "2026-10-05", returnDate: "2026-10-07", price: 4500000, totalSlots: 20, availableSlots: 15, status: "OPEN" },
  { id: 4, tourId: 2, departureDate: "2026-09-20", returnDate: "2026-09-23", price: 3800000, totalSlots: 16, availableSlots: 6, status: "OPEN" },
  { id: 5, tourId: 2, departureDate: "2026-10-10", returnDate: "2026-10-13", price: 3800000, totalSlots: 16, availableSlots: 12, status: "OPEN" },
  { id: 6, tourId: 3, departureDate: "2026-09-18", returnDate: "2026-09-19", price: 2200000, totalSlots: 25, availableSlots: 10, status: "OPEN" },
  { id: 7, tourId: 5, departureDate: "2026-09-14", returnDate: "2026-09-14", price: 890000, totalSlots: 30, availableSlots: 20, status: "OPEN" },
  { id: 8, tourId: 7, departureDate: "2026-09-16", returnDate: "2026-09-16", price: 750000, totalSlots: 30, availableSlots: 18, status: "OPEN" },
];

export const REVIEWS: Review[] = [
  { id: 1, tourId: 1, userId: 1, userName: "Nguyễn Thị Lan", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&auto=format", rating: 5, content: "Tuyệt vời! Du thuyền Vịnh Hạ Long đã vượt xa mọi mong đợi của chúng tôi.", images: [], createdAt: "2026-08-10", likes: 24, commentCount: 3, liked: false },
  { id: 2, tourId: 1, userId: 2, userName: "Trần Minh Tiến", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format", rating: 5, content: "Một trong những nơi đẹp nhất tôi từng đến. Những ngọn núi đá vôi nhô lên từ mặt nước sương mờ vào lúc bình minh thật sự ngoạn mục.", images: [], createdAt: "2026-08-05", likes: 18, commentCount: 2, liked: false },
  { id: 3, tourId: 1, userId: 3, userName: "Lê Ngọc Hân", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format", rating: 4, content: "Trải nghiệm tổng thể rất tuyệt. Hướng dẫn viên rất am hiểu và phong cảnh rất ấn tượng.", images: [], createdAt: "2026-07-28", likes: 12, commentCount: 1, liked: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function formatPrice(vnd: number): string {
  if (vnd >= 1_000_000) return `${(vnd / 1_000_000).toFixed(vnd % 1_000_000 === 0 ? 0 : 1)}Tr ₫`;
  return `${(vnd / 1000).toFixed(0)}K ₫`;
}

export function formatDate(str: string) {
  const d = new Date(str);
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}
