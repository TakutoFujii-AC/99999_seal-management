"use client";

import { useState } from "react";
import { stickers, genreMaster, categoryMaster } from "@/data/stickers";

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
      id: "collector-200",
      icon: "🎖️",
      title: "シールハンター",
      description: "200種類のシールを集めた",
      check: (owned) => owned >= 200,
    },
    {
      id: "collector-300",
      icon: "🥇",
      title: "シールマエストロ",
      description: "300種類のシールを集めた",
      check: (owned) => owned >= 300,
    },
    {
      id: "collector-400",
      icon: "🏵️",
      title: "シール伝説",
      description: "400種類のシールを集めた",
      check: (owned) => owned >= 400,
    },
    {
      id: "collector-450",
      icon: "💎",
      title: "シール覇王",
      description: "450種類のシールを集めた",
      check: (owned) => owned >= 450,
    },
    {
      id: "quarter-complete",
      icon: "🎯",
      title: "クォーター",
      description: "全体の25%を達成",
      check: (owned, total) => total > 0 && owned >= total / 4,
    },
    {
      id: "half-complete",
      icon: "🎯",
      title: "ハーフウェイ",
      description: "全体の50%を達成",
      check: (owned, total) => total > 0 && owned >= total / 2,
    },
    {
      id: "three-quarter-complete",
      icon: "🎯",
      title: "スリークォーター",
      description: "全体の75%を達成",
      check: (owned, total) => total > 0 && owned >= (total * 3) / 4,
    },
    {
      id: "full-complete",
      icon: "👑",
      title: "コンプリートマスター",
      description: "全シールをコンプリート",
      check: (owned, total) => owned === total && total > 0,
    },
  ];

  const genreIcons: Record<string, string> = {
    "heisei-happy-phone": "📱",
    "petit-doro-sticker": "💧",
    "cotton-puffy": "☁️",
    "pitapuku-sticker": "🫧",
    "uruchuru-pop-seal": "🍬",
    "ichigoichie": "🌸",
    "otona-zukan": "📖",
  };

  const genreBadges: Badge[] = genreMaster.map((genre) => {
    const genreStickers = stickers.filter((s) => s.genre === genre.id);
    const genreTotal = genreStickers.length;
    return {
      id: `genre-${genre.id}`,
      icon: genreIcons[genre.id] ?? "🏆",
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

  const categoryBadges: Badge[] = categoryMaster.map((cat) => {
    const catStickers = stickers.filter((s) => s.categories.includes(cat.id));
    const catTotal = catStickers.length;
    return {
      id: `cat-${cat.id}`,
      icon: cat.emoji,
      title: `${cat.label}マスター`,
      description: `${cat.label}を全種コンプリート`,
      check: () => {
        if (catTotal === 0) return false;
        const catOwned = catStickers.filter(
          (s) => getCount(s.id) > 0
        ).length;
        return catOwned === catTotal;
      },
    };
  });

  const brandIcons: Record<string, string> = {
    サンリオ: "🎀",
    カミオジャパン: "📖",
    クーリア: "💧",
    クラックス: "🍬",
    ディズニー: "🏰",
    ピーナッツ: "🐶",
    ちいかわ: "🌸",
    たまごっち: "🥚",
    しずくちゃん: "💦",
    すみっコぐらし: "🐧",
    コウペンちゃん: "🐤",
  };

  const brandList = Array.from(new Set(stickers.map((s) => s.brand)));
  const brandBadges: Badge[] = brandList.map((brand) => {
    const brandStickers = stickers.filter((s) => s.brand === brand);
    const brandTotal = brandStickers.length;
    return {
      id: `brand-${brand}`,
      icon: brandIcons[brand] ?? "🏷️",
      title: `${brand}マスター`,
      description: `${brand}のシールを全種コンプリート`,
      check: () => {
        if (brandTotal === 0) return false;
        const brandOwned = brandStickers.filter(
          (s) => getCount(s.id) > 0
        ).length;
        return brandOwned === brandTotal;
      },
    };
  });

  const seriesList = Array.from(new Set(stickers.map((s) => s.series)));
  const completedSeriesCount = seriesList.filter((series) => {
    const seriesStickers = stickers.filter((s) => s.series === series);
    return (
      seriesStickers.length > 0 &&
      seriesStickers.every((s) => getCount(s.id) > 0)
    );
  }).length;

  const seriesAchievementBadges: Badge[] = [
    {
      id: "series-1",
      icon: "🎉",
      title: "初めてのコンプリート",
      description: "1シリーズをコンプリート",
      check: () => completedSeriesCount >= 1,
    },
    {
      id: "series-5",
      icon: "🏅",
      title: "シリーズコレクター",
      description: "5シリーズをコンプリート",
      check: () => completedSeriesCount >= 5,
    },
    {
      id: "series-10",
      icon: "🏆",
      title: "シリーズマスター",
      description: "10シリーズをコンプリート",
      check: () => completedSeriesCount >= 10,
    },
    {
      id: "series-20",
      icon: "🎊",
      title: "シリーズ達人",
      description: "20シリーズをコンプリート",
      check: () => completedSeriesCount >= 20,
    },
    {
      id: "series-all",
      icon: "⚜️",
      title: "全シリーズ制覇",
      description: `全${seriesList.length}シリーズをコンプリート`,
      check: () =>
        seriesList.length > 0 && completedSeriesCount === seriesList.length,
    },
  ];

  const allBadges = [
    ...baseBadges,
    ...genreBadges,
    ...categoryBadges,
    ...brandBadges,
    ...seriesAchievementBadges,
  ];

  const badgeStates = allBadges.map((badge) => ({
    ...badge,
    unlocked: badge.check(totalOwned, totalAll),
  }));

  const unlockedCount = badgeStates.filter((b) => b.unlocked).length;
  const selected = badgeStates.find((b) => b.id === selectedBadge);

  return (
    <section>
      <h3 className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-1.5">
        <span className="text-base">🏆</span> 実績バッジ
      </h3>
      <p className="text-[11px] text-gray-400 mb-3">
        {unlockedCount} / {badgeStates.length} 解除済み
      </p>

      {/* Badge grid */}
      <div className="grid grid-cols-5 gap-2">
        {badgeStates.map((badge) => (
          <button
            key={badge.id}
            onClick={() =>
              setSelectedBadge(selectedBadge === badge.id ? null : badge.id)
            }
            className={`flex flex-col items-center gap-1 rounded-2xl p-2 transition-all ${
              selectedBadge === badge.id
                ? "bg-pink-100 ring-2 ring-pink-300 scale-105"
                : badge.unlocked
                ? "bg-pink-50 hover:bg-pink-100"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                badge.unlocked
                  ? "bg-gradient-to-br from-pink-200 to-rose-200 shadow-sm"
                  : "bg-gray-200 grayscale"
              }`}
            >
              <span style={{ opacity: badge.unlocked ? 1 : 0.25 }}>
                {badge.icon}
              </span>
            </div>
            <span
              className={`text-[9px] text-center leading-tight line-clamp-2 ${
                badge.unlocked ? "text-gray-700 font-medium" : "text-gray-400"
              }`}
            >
              {badge.title}
            </span>
          </button>
        ))}
      </div>

      {/* Detail card */}
      {selected && (
        <div
          className={`mt-3 rounded-2xl p-4 border transition-all ${
            selected.unlocked
              ? "bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                selected.unlocked
                  ? "bg-gradient-to-br from-pink-200 to-rose-300 shadow-md"
                  : "bg-gray-200 grayscale"
              }`}
            >
              <span style={{ opacity: selected.unlocked ? 1 : 0.3 }}>
                {selected.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-bold ${
                  selected.unlocked ? "text-gray-800" : "text-gray-500"
                }`}
              >
                {selected.title}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {selected.description}
              </p>
              <div className="mt-1.5">
                {selected.unlocked ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-pink-200/60 px-2.5 py-0.5 text-[10px] font-bold text-pink-600">
                    <span className="text-xs">✨</span> 解除済み
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-200/60 px-2.5 py-0.5 text-[10px] font-bold text-gray-500">
                    <span className="text-xs">🔒</span> 未解除
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
