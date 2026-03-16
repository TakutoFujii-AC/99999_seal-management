"use client";

import { useState } from "react";
import { stickers, genreMaster } from "@/data/stickers";

type Props = {
  getCount: (id: string) => number;
};

type Badge = {
  id: string;
  icon: string;
  title: string;
  description: string;
  check: (owned: number, total: number) => boolean;
};

export default function AchievementBadges({ getCount }: Props) {
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const totalAll = stickers.length;
  const totalOwned = stickers.filter((s) => getCount(s.id) > 0).length;

  const baseBadges: Badge[] = [
    {
      id: "first-sticker",
      icon: "🌱",
      title: "はじめの一歩",
      description: "初めてシールを登録",
      check: (owned) => owned >= 1,
    },
    {
      id: "collector-10",
      icon: "⭐",
      title: "かけだしコレクター",
      description: "10種類のシールを集めた",
      check: (owned) => owned >= 10,
    },
    {
      id: "collector-50",
      icon: "💫",
      title: "シールファン",
      description: "50種類のシールを集めた",
      check: (owned) => owned >= 50,
    },
    {
      id: "collector-100",
      icon: "🌟",
      title: "シールマニア",
      description: "100種類のシールを集めた",
      check: (owned) => owned >= 100,
    },
    {
      id: "half-complete",
      icon: "🎯",
      title: "ハーフウェイ",
      description: "全体の50%を達成",
      check: (owned, total) => owned >= total / 2,
    },
    {
      id: "full-complete",
      icon: "👑",
      title: "コンプリートマスター",
      description: "全シールをコンプリート",
      check: (owned, total) => owned === total && total > 0,
    },
  ];

  const genreBadges: Badge[] = genreMaster.map((genre) => {
    const genreStickers = stickers.filter((s) => s.genre === genre.id);
    const genreTotal = genreStickers.length;
    return {
      id: `genre-${genre.id}`,
      icon: "🏆",
      title: `${genre.label}マスター`,
      description: `${genre.label}を全種コンプリート`,
      check: () => {
        if (genreTotal === 0) return false;
        const genreOwned = genreStickers.filter(
          (s) => getCount(s.id) > 0
        ).length;
        return genreOwned === genreTotal;
      },
    };
  });

  const allBadges = [...baseBadges, ...genreBadges];

  const badgeStates = allBadges.map((badge) => ({
    ...badge,
    unlocked: badge.check(totalOwned, totalAll),
  }));

  const unlockedCount = badgeStates.filter((b) => b.unlocked).length;

  return (
    <section>
      <h3 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-1.5">
        <span className="text-base">🏆</span> 実績バッジ
      </h3>
      <p className="text-[11px] text-gray-400 mb-3">
        {unlockedCount} / {badgeStates.length} 解除済み
      </p>

      {/* Horizontal scrollable row */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {badgeStates.map((badge) => (
          <div
            key={badge.id}
            className="flex flex-col items-center shrink-0 cursor-pointer relative"
            onClick={() =>
              setSelectedBadge(selectedBadge === badge.id ? null : badge.id)
            }
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                badge.unlocked
                  ? "bg-pink-100 shadow-md"
                  : "bg-gray-100 grayscale"
              }`}
            >
              <span style={{ opacity: badge.unlocked ? 1 : 0.3 }}>
                {badge.icon}
              </span>
            </div>
            <span
              className={`text-[10px] mt-1 text-center w-14 leading-tight truncate ${
                badge.unlocked
                  ? "text-gray-700 font-medium"
                  : "text-gray-400"
              }`}
            >
              {badge.title}
            </span>

            {/* Tooltip */}
            {selectedBadge === badge.id && (
              <div className="absolute top-full mt-1 z-10 bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 text-center min-w-[140px] max-w-[160px]">
                <p className="text-xs font-bold text-gray-700">
                  {badge.title}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {badge.description}
                </p>
                <p
                  className={`text-[10px] font-bold mt-1 ${
                    badge.unlocked ? "text-pink-500" : "text-gray-400"
                  }`}
                >
                  {badge.unlocked ? "✅ 解除済み" : "🔒 未解除"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
