"use client";

import { useEffect } from "react";
import { stickers, genreMaster, seriesList } from "@/data/stickers";

type Props = {
  getCount: (id: string) => number;
  onClose: () => void;
};

type StatRow = {
  label: string;
  owned: number;
  total: number;
};

export default function ProgressDashboard({ getCount, onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const totalOwned = stickers.filter((s) => getCount(s.id) > 0).length;
  const totalAll = stickers.length;

  // ジャンル別
  const genreStats: StatRow[] = genreMaster.map((g) => {
    const items = stickers.filter((s) => s.genre === g.id);
    const owned = items.filter((s) => getCount(s.id) > 0).length;
    return { label: g.label, owned, total: items.length };
  });

  // ジャンルなし
  const noGenreItems = stickers.filter((s) => !s.genre);
  if (noGenreItems.length > 0) {
    const owned = noGenreItems.filter((s) => getCount(s.id) > 0).length;
    genreStats.push({ label: "その他", owned, total: noGenreItems.length });
  }

  // シリーズ別
  const seriesStats: StatRow[] = seriesList.map((series) => {
    const items = stickers.filter((s) => s.series === series);
    const owned = items.filter((s) => getCount(s.id) > 0).length;
    return { label: series, owned, total: items.length };
  });

  const pct = (owned: number, total: number) =>
    total > 0 ? Math.round((owned / total) * 100) : 0;

  const ProgressBar = ({ owned, total }: { owned: number; total: number }) => {
    const p = pct(owned, total);
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2.5 rounded-full bg-pink-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${p}%`,
              background:
                p === 100
                  ? "linear-gradient(90deg, #f472b6, #ec4899)"
                  : "linear-gradient(90deg, #fda4af, #fb7185)",
            }}
          />
        </div>
        <span className="text-xs font-bold text-gray-500 tabular-nums w-16 text-right">
          {owned}/{total}
          <span className="text-pink-400 ml-0.5">{p}%</span>
        </span>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-400 to-rose-300 px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">コレクション進捗</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white text-lg font-bold hover:bg-white/30 transition"
            >
              ×
            </button>
          </div>
          {/* 全体 */}
          <div className="mt-3">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm font-medium">全体</span>
              <span className="text-2xl font-bold">
                {pct(totalOwned, totalAll)}
                <span className="text-sm font-normal ml-0.5">%</span>
              </span>
            </div>
            <div className="h-3 rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${pct(totalOwned, totalAll)}%` }}
              />
            </div>
            <p className="text-xs mt-1 text-white/80">
              {totalOwned} / {totalAll} 種類
            </p>
          </div>
        </div>

        {/* スクロール領域 */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* ジャンル別 */}
          <section>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
              <span className="text-base">🏷️</span> ジャンル別
            </h3>
            <div className="space-y-3">
              {genreStats.map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600 truncate max-w-[60%]">
                      {row.label}
                    </span>
                    {row.owned === row.total && row.total > 0 && (
                      <span className="text-[10px] bg-pink-100 text-pink-500 font-bold px-1.5 py-0.5 rounded-full">
                        COMPLETE
                      </span>
                    )}
                  </div>
                  <ProgressBar owned={row.owned} total={row.total} />
                </div>
              ))}
            </div>
          </section>

          {/* シリーズ別 */}
          <section>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1.5">
              <span className="text-base">📚</span> シリーズ別
            </h3>
            <div className="space-y-3">
              {seriesStats.map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600 truncate max-w-[60%]">
                      {row.label}
                    </span>
                    {row.owned === row.total && row.total > 0 && (
                      <span className="text-[10px] bg-pink-100 text-pink-500 font-bold px-1.5 py-0.5 rounded-full">
                        COMPLETE
                      </span>
                    )}
                  </div>
                  <ProgressBar owned={row.owned} total={row.total} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
