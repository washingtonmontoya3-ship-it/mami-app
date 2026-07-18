"use client";

import type { ReactNode } from "react";

type PaginatedGridProps<T> = {
  items: T[];
  page: number;
  onPageChange: (page: number) => void;
  renderItem: (item: T) => ReactNode;
  getKey: (item: T) => string;
  pageSize?: number;
};

// Grilla 2x2 de maximo 4 tarjetas por pantalla. Si hay mas elementos,
// aparecen flechas grandes y puntos indicadores. Un toque = una pagina,
// nunca swipe.
export default function PaginatedGrid<T>({
  items,
  page,
  onPageChange,
  renderItem,
  getKey,
  pageSize = 4,
}: PaginatedGridProps<T>) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const start = currentPage * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="grid w-full max-w-2xl grid-cols-2 gap-6">
        {pageItems.map((item) => (
          <div key={getKey(item)}>{renderItem(item)}</div>
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center gap-6">
          <button
            type="button"
            aria-label="Pagina anterior"
            disabled={currentPage === 0}
            onClick={() => onPageChange(currentPage - 1)}
            className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-blue-950 text-4xl text-white shadow-md disabled:opacity-30 active:scale-95"
          >
            ◀
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <span
                key={i}
                aria-hidden
                className={`h-4 w-4 rounded-full ${
                  i === currentPage ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Pagina siguiente"
            disabled={currentPage === totalPages - 1}
            onClick={() => onPageChange(currentPage + 1)}
            className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-blue-950 text-4xl text-white shadow-md disabled:opacity-30 active:scale-95"
          >
            ▶
          </button>
        </div>
      ) : null}
    </div>
  );
}
