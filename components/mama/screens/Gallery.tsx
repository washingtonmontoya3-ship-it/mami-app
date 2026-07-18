"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import type { Memory } from "@/lib/types";
import BackButton from "../BackButton";
import PaginatedGrid from "../PaginatedGrid";
import PhotoViewer from "../PhotoViewer";
import VideoViewer from "../VideoViewer";

type GalleryProps = {
  items: Memory[];
  page: number;
  onPageChange: (page: number) => void;
  onBack?: () => void;
};

export default function Gallery({ items, page, onPageChange, onBack }: GalleryProps) {
  const [viewing, setViewing] = useState<Memory | null>(null);

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-8 px-6 pt-28">
      {onBack ? (
        <div className="flex w-full max-w-2xl items-center">
          <BackButton onBack={onBack} />
        </div>
      ) : null}

      <h1 className="text-4xl font-bold text-white">📷 Fotos y Videos</h1>

      {items.length === 0 ? (
        <p className="text-2xl text-white/70">Todavía no hay fotos ni videos cargados acá.</p>
      ) : (
        <PaginatedGrid
          items={items}
          page={page}
          onPageChange={onPageChange}
          getKey={(item) => item.id}
          renderItem={(item) => <MemoryThumbnail item={item} onTap={() => setViewing(item)} />}
        />
      )}

      {viewing?.media_type === "photo" ? (
        <PhotoViewer photoUrl={viewing.media_url} onClose={() => setViewing(null)} />
      ) : null}

      {viewing?.media_type === "video" ? (
        <VideoViewer videoUrl={viewing.media_url} onClose={() => setViewing(null)} />
      ) : null}
    </div>
  );
}

function MemoryThumbnail({ item, onTap }: { item: Memory; onTap: () => void }) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onTap();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onTap}
      onKeyDown={handleKeyDown}
      className="flex min-h-[220px] w-full cursor-pointer flex-col items-center justify-center rounded-3xl bg-blue-950 p-2 shadow-lg active:scale-[0.98]"
    >
      <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-black">
        {item.media_type === "video" ? (
          <video
            src={item.media_url}
            muted
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.media_url} alt="" className="h-full w-full object-cover" />
        )}
        {item.media_type === "video" ? (
          <span
            className="absolute inset-0 flex items-center justify-center text-6xl drop-shadow-lg"
            aria-hidden
          >
            ▶️
          </span>
        ) : null}
      </div>
      {item.caption ? (
        <p className="mt-2 line-clamp-2 text-xl font-semibold text-white">{item.caption}</p>
      ) : null}
    </div>
  );
}
