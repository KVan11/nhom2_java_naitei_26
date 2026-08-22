import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TourPaginationProps {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export default function TourPagination({ page, totalPages, setPage }: TourPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="pt-8">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text="Trang trước"
              onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }).map((_, i) => {
            const isCurrent = page === i + 1;
            return (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage(i + 1); }}
                  isActive={isCurrent}
                  className={isCurrent ? "bg-brand hover:bg-brand-dark text-white border-transparent" : ""}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              text="Trang sau"
              onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }}
              className={page === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
