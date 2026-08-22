import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import type { Place } from "@/constants/mockData";

export default function PlaceGallery({ place }: { place: Place }) {
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
              <BreadcrumbLink render={<Link to="/places" />}>Điểm đến</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-brand font-medium">{place.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="relative h-[300px] md:h-[460px] rounded-2xl overflow-hidden">
        <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/5" />
      </div>
    </div>
  );
}
