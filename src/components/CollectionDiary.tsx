"use client";

import { useState, useEffect, useMemo } from "react";
import { stickers } from "@/data/stickers";
import type { UserSticker } from "@/lib/supabase";

type StickerMap = Record<string, UserSticker>;

type Props = {
  stickerMap: StickerMap;
  onClose: () => void;
};

const DAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

export default function CollectionDiary({ stickerMap, onClose }: Props) {
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Close on Escape & lock body scroll
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

  // Group acquired stickers by date string (YYYY-MM-DD)
  const acquisitionsByDate = useMemo(() => {
    const map: Record<string, string[]> = {};
    Object.entries(stickerMap).forEach(([stickerId, userSticker]) => {
      if (userSticker.count > 0 && userSticker.acquired_at) {
        const dateStr = userSticker.acquired_at.slice(0, 10); // YYYY-MM-DD
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push(stickerId);
      }
    });
    return map;
  }, [stickerMap]);

  // Calendar grid computation
  const { year, month } = currentDate;
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);
  // Pad to fill last row
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const goToPrevMonth = () => {
    setSelectedDay(null);
    setCurrentDate((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const goToNextMonth = () => {
    setSelectedDay(null);
    setCurrentDate((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  const getDateKey = (day: number) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const getAcquisitionsForDay = (day: number): string[] => {
    return acquisitionsByDate[getDateKey(day)] ?? [];
  };

  // Stickers for the selected day
  const selectedStickers = useMemo(() => {
    if (selectedDay === null) return [];
    const ids = getAcquisitionsForDay(selectedDay);
    return ids
      .map((id) => stickers.find((s) => s.id === id))
      .filter(Boolean);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay, acquisitionsByDate]);

  // Total acquisitions this month
  const monthTotal = useMemo(() => {
    let count = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      count += getAcquisitionsForDay(d).length;
    }
    return count;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daysInMonth, acquisitionsByDate]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-pink-400 to-rose-300 px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-1.5">
              <span className="text-xl">📅</span>
              コレクション日記
            </h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white text-lg font-bold hover:bg-white/30 transition"
            >
              ×
            </button>
          </div>
          <p className="text-xs mt-1 text-white/80">
            今月のゲット: {monthTotal} 種類
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Month navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={goToPrevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-pink-500 hover:bg-pink-50 transition text-lg font-bold"
            >
              &lt;
            </button>
            <span className="text-sm font-bold text-gray-700">
              {year}年{month + 1}月
            </span>
            <button
              onClick={goToNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-pink-500 hover:bg-pink-50 transition text-lg font-bold"
            >
              &gt;
            </button>
          </div>

          {/* Day-of-week header */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400">
            {DAY_LABELS.map((label, i) => (
              <div
                key={label}
                className={
                  i === 0
                    ? "text-red-400"
                    : i === 6
                    ? "text-blue-400"
                    : ""
                }
              >
                {label}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const acqs = getAcquisitionsForDay(day);
              const hasAcquisitions = acqs.length > 0;
              const isSelected = selectedDay === day;
              const dayOfWeek = idx % 7;

              return (
                <button
                  key={`day-${day}`}
                  onClick={() =>
                    setSelectedDay(isSelected ? null : day)
                  }
                  className={`
                    aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all text-xs font-medium
                    ${
                      isSelected
                        ? "bg-pink-400 text-white shadow-md scale-105"
                        : hasAcquisitions
                        ? "bg-pink-50 text-gray-700 hover:bg-pink-100"
                        : "text-gray-400 hover:bg-gray-50"
                    }
                    ${!isSelected && dayOfWeek === 0 ? "text-red-400" : ""}
                    ${!isSelected && dayOfWeek === 6 ? "text-blue-400" : ""}
                  `}
                >
                  <span className="leading-none">{day}</span>
                  {hasAcquisitions && (
                    <span
                      className={`text-[8px] font-bold mt-0.5 leading-none ${
                        isSelected ? "text-white/80" : "text-pink-400"
                      }`}
                    >
                      +{acqs.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected day detail */}
          {selectedDay !== null && (
            <div className="border-t border-pink-100 pt-4">
              <h3 className="text-xs font-bold text-gray-500 mb-3">
                {month + 1}月{selectedDay}日にゲットしたシール
              </h3>
              {selectedStickers.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  この日にゲットしたシールはありません
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {selectedStickers.map((sticker) =>
                    sticker ? (
                      <div
                        key={sticker.id}
                        className="flex flex-col items-center gap-1 rounded-xl bg-pink-50 p-2"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sticker.imagePath}
                          alt={sticker.name}
                          className="w-12 h-12 object-contain"
                        />
                        <span className="text-[9px] text-gray-600 font-medium text-center leading-tight line-clamp-2">
                          {sticker.name}
                        </span>
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
