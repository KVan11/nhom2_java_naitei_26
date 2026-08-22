import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import type { Tour } from "@/constants/mockData";

interface TourGalleryProps {
  tour: Tour;
}

export default function TourGallery({ tour }: TourGalleryProps) {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="container-wrapper pt-6 pb-6">
      <div className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/" />}>Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/tours" />}>Tour</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-brand font-medium">{tour.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="relative">
        <div className={`grid gap-2 overflow-hidden rounded-2xl h-[300px] md:h-[460px] ${tour.images.length === 1 ? 'grid-cols-1' : tour.images.length === 2 ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-4 md:grid-rows-2'}`}>
          {/* Main image */}
          <div className={`relative cursor-pointer group ${tour.images.length >= 3 ? 'col-span-1 md:col-span-2 md:row-span-2' : 'col-span-1'}`} onClick={() => setActiveImg(0)}>
            <img src={tour.images[0]?.url} alt={tour.name} className="w-full h-full object-cover hover:opacity-95 transition-opacity" />
          </div>

          {/* Additional images */}
          {tour.images.slice(1, 5).map((img, i) => (
            <div key={img.id} className={`relative cursor-pointer group ${tour.images.length >= 3 ? 'hidden md:block' : ''}`} onClick={() => setActiveImg(i + 1)}>
              <img src={img.url} alt="" className="w-full h-full object-cover hover:opacity-95 transition-opacity" />
              {i === 3 && tour.images.length > 5 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-medium text-lg">
                  +{tour.images.length - 5} ảnh
                </div>
              )}
            </div>
          ))}
        </div>
        
        <Button variant="secondary" className="absolute bottom-4 right-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold shadow-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          Hiển thị tất cả ảnh
        </Button>
      </div>
    </div>
  );
}
