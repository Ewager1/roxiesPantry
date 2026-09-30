import { useSearchParams } from "react-router-dom";
import type { PaginationInfo } from "../types";

type ProductPaginationProps = {
  pagination: PaginationInfo;
};

type PaginationItem = number | "ellipsis";

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  const pageNumbers = new Set<number>();

  // Always keep the first and last page visible.
  pageNumbers.add(1);
  pageNumbers.add(totalPages);

  // Show a small window around the current page.
  for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
    if (page > 1 && page < totalPages) {
      pageNumbers.add(page);
    }
  }

  // Fill out the beginning of the range when near page 1.
  if (currentPage <= 4) {
    for (let page = 2; page <= Math.min(5, totalPages - 1); page += 1) {
      pageNumbers.add(page);
    }
  }

  // Fill out the end of the range when near the final page.
  if (currentPage >= totalPages - 3) {
    for (let page = Math.max(2, totalPages - 4); page < totalPages; page += 1) {
      pageNumbers.add(page);
    }
  }

  const sortedPages = [...pageNumbers].sort((a, b) => a - b);

  const items: PaginationItem[] = [];

  // Insert ellipses anywhere there is a gap between visible pages.
  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];

    if (previousPage !== undefined && page - previousPage > 1) {
      items.push("ellipsis");
    }

    items.push(page);
  });

  return items;
}

export function ProductPagination({ pagination }: ProductPaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  function goToPage(page: number) {
    const nextParams = new URLSearchParams(searchParams);

    // Page 1 is the default, so keep the URL clean.
    if (page === 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(page));
    }

    setSearchParams(nextParams);
  }

  const paginationItems = getPaginationItems(
    pagination.page,
    pagination.totalPages,
  );

  return (
    <nav aria-label="Product pagination">
      <button
        type="button"
        disabled={!pagination.hasPreviousPage}
        onClick={() => goToPage(pagination.page - 1)}
      >
        Previous
      </button>

      {paginationItems.map((item, index) => {
        if (item === "ellipsis") {
          return (
            <span key={`ellipsis-${index}`} aria-hidden="true">
              ...
            </span>
          );
        }

        const isCurrentPage = item === pagination.page;

        return (
          <button
            key={item}
            type="button"
            disabled={isCurrentPage}
            aria-current={isCurrentPage ? "page" : undefined}
            onClick={() => goToPage(item)}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        disabled={!pagination.hasNextPage}
        onClick={() => goToPage(pagination.page + 1)}
      >
        Next
      </button>
    </nav>
  );
}
