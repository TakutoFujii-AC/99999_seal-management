"use client";

import { useState } from "react";
import StickerList from "@/components/StickerList";
import ProgressDashboard from "@/components/ProgressDashboard";
import CollectionDiary from "@/components/CollectionDiary";
import { useUserStickers } from "@/hooks/useUserStickers";

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showDiary, setShowDiary] = useState(false);
  const { getCount, stickerMap } = useUserStickers();

  return (
    <main className="mx-auto max-w-lg min-h-screen">
      <header className="sticky top-0 z-40 bg-gradient-to-r from-pink-400 to-rose-300 px-4 py-3 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎀</span>
            <h1 className="text-lg font-bold tracking-tight">
              わたしのシール帳
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiary(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm hover:bg-white/30 transition"
              title="コレクション日記"
            >
              📅
            </button>
            <button
              onClick={() => setShowDashboard(true)}
              className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/30 transition"
            >
              進捗を見る
              <span className="text-sm">›</span>
            </button>
          </div>
        </div>
      </header>

      <StickerList />

      {showDashboard && (
        <ProgressDashboard
          getCount={getCount}
          onClose={() => setShowDashboard(false)}
        />
      )}

      {showDiary && (
        <CollectionDiary
          stickerMap={stickerMap}
          onClose={() => setShowDiary(false)}
        />
      )}
    </main>
  );
}
