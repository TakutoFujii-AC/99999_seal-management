"use client";

import { useState, useMemo } from "react";
import { stickers } from "@/data/stickers";
import { useUserStickers } from "@/hooks/useUserStickers";
import StickerCard from "./StickerCard";
import FilterBar, { FilterState } from "./FilterBar";

const initialFilter: FilterState = {
  search: "",
  brand: "",
  series: "",
  category: "",
  genre: "",
  subGenre: "",
  ownership: "all",
  marking: "all",
};

export default function StickerList() {
  const {
    getCount,
    upsertCount,
    isFavorite,
    isWantNext,
    toggleFavorite,
    toggleWantNext,
    totalOwned,
    loading,
  } = useUserStickers();
  const [filter, setFilter] = useState<FilterState>(initialFilter);

  const filtered = useMemo(() => {
    return stickers.filter((s) => {
      if (filter.search && !s.name.includes(filter.search)) return false;
      if (filter.brand && s.brand !== filter.brand) return false;
      if (filter.series && s.series !== filter.series) return false;
      if (filter.category && !s.categories.includes(filter.category))
        return false;
      if (filter.genre && s.genre !== filter.genre) return false;
      if (filter.subGenre && s.subGenre !== filter.subGenre) return false;

      const count = getCount(s.id);
      if (filter.ownership === "owned" && count <= 0) return false;
      if (filter.ownership === "unowned" && count > 0) return false;
      if (filter.ownership === "duplicate" && count < 2) return false;

      if (filter.marking === "favorite" && !isFavorite(s.id)) return false;
      if (filter.marking === "want_next" && !isWantNext(s.id)) return false;

      return true;
    });
  }, [filter, getCount, isFavorite, isWantNext]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500" />
          <p className="text-sm text-pink-400">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#fef7f8" }}>
      <FilterBar
        filter={filter}
        onChange={setFilter}
        totalCount={stickers.length}
        ownedCount={totalOwned}
      />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-pink-300">
          <span className="text-5xl mb-3">🔍</span>
          <p className="text-sm">該当するシールがないよ</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 p-3 sm:grid-cols-3">
          {filtered.map((sticker) => {
            const count = getCount(sticker.id);
            return (
              <StickerCard
                key={sticker.id}
                sticker={sticker}
                count={count}
                favorite={isFavorite(sticker.id)}
                wantNext={isWantNext(sticker.id)}
                onIncrement={() => upsertCount(sticker.id, count + 1)}
                onDecrement={() =>
                  upsertCount(sticker.id, Math.max(0, count - 1))
                }
                onToggleFavorite={() => toggleFavorite(sticker.id)}
                onToggleWantNext={() => toggleWantNext(sticker.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
