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

  return (
    <div className="mt-8 flex flex-col items-center space-y-4">
      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <a
            key={pageNum}
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
        ))}
      </div>

      {/* Previous/Next Buttons */}
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
            className="px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-300 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Previous
          </a>
        )}

        {currentPage < totalPages && (
          <a
            href={link("/mashups/page/:page", {
              page: (currentPage + 1).toString(),
            })}
            className="px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-300 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
}
