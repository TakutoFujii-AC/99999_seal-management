"use client";

import {
  brands,
  seriesList,
  categoryMaster,
  genreMaster,
  getSubGenresByGenreId,
} from "@/data/stickers";

export type FilterState = {
  search: string;
  brand: string;
  series: string;
  category: string;
  genre: string;
  subGenre: string;
  ownership: "all" | "owned" | "unowned";
  marking: "all" | "favorite" | "want_next";
};

type Props = {
  filter: FilterState;
  onChange: (f: FilterState) => void;
  totalCount: number;
  ownedCount: number;
};

export default function FilterBar({
  filter,
  onChange,
  totalCount,
  ownedCount,
}: Props) {
  const set = (key: keyof FilterState, value: string) =>
    onChange({ ...filter, [key]: value });

  const subGenres = filter.genre
    ? getSubGenresByGenreId(filter.genre)
    : [];

  const hasFilter =
    filter.search ||
    filter.brand ||
    filter.series ||
    filter.category ||
    filter.genre ||
    filter.subGenre ||
    filter.ownership !== "all" ||
    filter.marking !== "all";

  return (
    <div className="sticky top-[44px] z-30 bg-white/90 backdrop-blur-md border-b border-pink-100 px-4 pb-3 pt-3 space-y-2.5">
      {/* 検索 */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="シール名で検索..."
          value={filter.search}
          onChange={(e) => set("search", e.target.value)}
          className="w-full rounded-full border border-pink-200 bg-pink-50/50 py-2 pl-10 pr-4 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition placeholder:text-pink-300"
        />
      </div>

      {/* フィルタチップ */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <select
          value={filter.marking}
          onChange={(e) => set("marking", e.target.value)}
          className="w-[7.5rem] shrink-0 rounded-full border border-pink-200 bg-white px-3 py-1.5 text-xs text-gray-600 focus:border-pink-400"
        >
          <option value="all">マーク</option>
          <option value="favorite">♡ お気に入り</option>
          <option value="want_next">★ 次にほしい</option>
        </select>

        <select
          value={filter.ownership}
          onChange={(e) => set("ownership", e.target.value)}
          className="w-[7.5rem] shrink-0 rounded-full border border-pink-200 bg-white px-3 py-1.5 text-xs text-gray-600 focus:border-pink-400"
        >
          <option value="all">すべて</option>
          <option value="owned">✅ 持ってる</option>
          <option value="unowned">🔲 持ってない</option>
        </select>

        <select
          value={filter.brand}
          onChange={(e) => set("brand", e.target.value)}
          className="w-[7.5rem] shrink-0 rounded-full border border-pink-200 bg-white px-3 py-1.5 text-xs text-gray-600 focus:border-pink-400"
        >
          <option value="">🏷️ ブランド</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <select
          value={filter.series}
          onChange={(e) => set("series", e.target.value)}
          className="w-[7.5rem] shrink-0 rounded-full border border-pink-200 bg-white px-3 py-1.5 text-xs text-gray-600 focus:border-pink-400"
        >
          <option value="">📚 シリーズ</option>
          {seriesList.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={filter.category}
          onChange={(e) => set("category", e.target.value)}
          className="w-[7.5rem] shrink-0 rounded-full border border-pink-200 bg-white px-3 py-1.5 text-xs text-gray-600 focus:border-pink-400"
        >
          <option value="">🎀 カテゴリ</option>
          {categoryMaster.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>

        <select
          value={filter.genre}
          onChange={(e) => {
            onChange({ ...filter, genre: e.target.value, subGenre: "" });
          }}
          className="w-[7.5rem] shrink-0 rounded-full border border-pink-200 bg-white px-3 py-1.5 text-xs text-gray-600 focus:border-pink-400"
        >
          <option value="">🏷️ ジャンル</option>
          {genreMaster.map((g) => (
            <option key={g.id} value={g.id}>
              {g.label}
            </option>
          ))}
        </select>

        {subGenres.length > 0 && (
          <select
            value={filter.subGenre}
            onChange={(e) => set("subGenre", e.target.value)}
            className="w-[7.5rem] shrink-0 rounded-full border border-pink-200 bg-white px-3 py-1.5 text-xs text-gray-600 focus:border-pink-400"
          >
            <option value="">📂 サブジャンル</option>
            {subGenres.map((sg) => (
              <option key={sg.id} value={sg.id}>
                {sg.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 統計 & リセット */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">
          持ってる:{" "}
          <b className="text-pink-500">{ownedCount}</b> / {totalCount}枚
          <span className="ml-2 text-pink-300">
            ({totalCount > 0 ? Math.round((ownedCount / totalCount) * 100) : 0}
            %)
          </span>
        </span>
        {hasFilter && (
          <button
            onClick={() =>
              onChange({
                search: "",
                brand: "",
                series: "",
                category: "",
                genre: "",
                subGenre: "",
                ownership: "all",
                marking: "all",
              })
            }
            className="text-pink-400 underline underline-offset-2"
          >
            リセット
          </button>
        )}
      </div>
    </div>
  );
}
