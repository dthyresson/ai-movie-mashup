"use server";

import { link } from "@/app/shared/links";
import { MASHUPS_PER_PAGE } from "../functions";

interface PaginationProps {
  page: number;
  currentPage: number;
  totalPages: number;
  startItem: number;
  endItem: number;
  total: number;
}

export function PaginationInfo({
  page,
  total,
}: Pick<PaginationProps, "page" | "total">) {
  const startItem = (page - 1) * MASHUPS_PER_PAGE + 1;
  const endItem = Math.min(startItem + MASHUPS_PER_PAGE - 1, total);

  return (
    <div className="mb-6">
      <p className="text-sm text-gray-600">
        Showing <span className="font-medium text-purple-600">{startItem}</span>{" "}
        to <span className="font-medium text-purple-600">{endItem}</span> (
        <span className="font-medium text-purple-600">{total}</span> total)
      </p>
    </div>
  );
}

export function PaginationControls({
  currentPage,
  totalPages,
}: Pick<PaginationProps, "currentPage" | "totalPages">) {
  if (totalPages <= 1) return null;

  // Function to generate page numbers to display
  const getPageNumbers = () => {
    const middleCount = 4; // Show exactly 4 pages in the middle
    const range = [];

    // Calculate range with boundaries
    let left = Math.max(2, currentPage - Math.floor((middleCount - 1) / 2));
    let right = Math.min(totalPages - 1, left + middleCount - 1);

    // Adjust left if right is at the boundary
    if (right === totalPages - 1) {
      left = Math.max(2, right - middleCount + 1);
    }

    // Adjust right if left is at the boundary
    if (left === 2) {
      right = Math.min(totalPages - 1, left + middleCount - 1);
    }

    // Always include page 1
    range.push(1);

    // Add left ellipsis if needed
    if (left > 2) {
      range.push("...");
    }

    // Add middle range
    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    // Add right ellipsis if needed
    if (right < totalPages - 1) {
      range.push("...");
    }

    // Always include last page if not already included
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="mt-8 flex flex-col items-center space-y-4">
      <div className="flex items-center space-x-2">
        {currentPage > 1 && (
          <a
            href={
              currentPage - 1 === 1
                ? link("/mashups")
                : link("/mashups/page/:page", {
                    page: (currentPage - 1).toString(),
                  })
            }
            className="px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-300 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Previous
          </a>
        )}

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((pageNum, index) =>
            pageNum === "..." ? (
              <span
                key={`dots-${index}`}
                className="px-4 py-2 text-sm text-gray-500"
              >
                {pageNum}
              </span>
            ) : (
              <a
                key={`page-${pageNum}`}
                href={
                  pageNum === 1
                    ? link("/mashups")
                    : link("/mashups/page/:page", { page: pageNum.toString() })
                }
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  pageNum === currentPage
                    ? "bg-purple-600 text-white"
                    : "text-purple-600 bg-white border border-purple-300 hover:bg-purple-50"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
              >
                {pageNum}
              </a>
            ),
          )}
        </div>

        {currentPage < totalPages && (
          <a
            href={link("/mashups/page/:page", {
              page: (currentPage + 1).toString(),
            })}
            className="px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-300 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center gap-2"
          >
            Next
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
