"use client";

import { useState, useEffect } from "react";
import { Sticker, categoryMaster } from "@/data/stickers";
import ImageModal from "./ImageModal";

type Props = {
  sticker: Sticker;
  count: number;
  favorite: boolean;
  wantNext: boolean;
  memoLocation: string;
  memoNote: string;
  hasMemo: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onToggleFavorite: () => void;
  onToggleWantNext: () => void;
  onSaveMemo: (location: string, note: string) => void;
};

const brandStyle: Record<string, { bg: string; accent: string }> = {
  サンリオ: { bg: "#fce4ef", accent: "#ec4899" },
  マインドウェイブ: { bg: "#dbeafe", accent: "#3b82f6" },
  GAIA: { bg: "#dcfce7", accent: "#22c55e" },
  amifa: { bg: "#fef3c7", accent: "#f59e0b" },
};

const seriesEmoji: Record<string, string> = {
  "ボンボンドロップシール 第1弾": "💧",
  "ボンボンドロップシール 第2弾": "💧",
  "ボンボンドロップシール mini": "✨",
  おはじきシール: "🔮",
  エンジョイアイドルシリーズ: "🎤",
  ヒダマリライフステッカー: "☀️",
  グランジュールステッカー: "🌿",
  "アミ ステッカー": "👧",
  ヨリドリステッカー: "🎨",
  キャラクターフレークシール: "🐾",
  クリアリーステッカー: "💎",
  クリアフレークシール: "💎",
  "GAIA フレークシール": "🍂",
  "Sticker Selection": "🖼️",
  "amifa フレークシール": "🌷",
  "amifa クリアシール": "💎",
  "amifa キラキラシール": "✨",
};

export default function StickerCard({
  sticker,
  count,
  favorite,
  wantNext,
  memoLocation,
  memoNote,
  hasMemo,
  onIncrement,
  onDecrement,
  onToggleFavorite,
  onToggleWantNext,
  onSaveMemo,
}: Props) {
  const [imgError, setImgError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMemo, setShowMemo] = useState(false);
  const [editLocation, setEditLocation] = useState(memoLocation);
  const [editNote, setEditNote] = useState(memoNote);
  const owned = count > 0;
  const style = brandStyle[sticker.brand] ?? { bg: "#f3f4f6", accent: "#6b7280" };
  const emoji = seriesEmoji[sticker.series] ?? "🏷️";

  useEffect(() => {
    setEditLocation(memoLocation);
    setEditNote(memoNote);
  }, [memoLocation, memoNote]);

  const handleSaveMemo = () => {
    onSaveMemo(editLocation, editNote);
    setShowMemo(false);
  };

  const handleDeleteMemo = () => {
    onSaveMemo("", "");
    setEditLocation("");
    setEditNote("");
    setShowMemo(false);
  };

  return (
    <>
      <div
        className={`relative rounded-2xl border-2 transition-all duration-200 ${
          owned
            ? "border-pink-300 bg-white shadow-lg shadow-pink-100/50"
            : "border-gray-100 bg-white/60 opacity-50"
        }`}
      >
        <div className="p-2.5">
          <div
            className="relative aspect-square w-full overflow-hidden rounded-xl mb-2 flex items-center justify-center"
            style={{ backgroundColor: style.bg }}
          >
            {!imgError ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={sticker.imagePath}
                alt={sticker.name}
                className="h-full w-full object-contain"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 px-2">
                <span className="text-4xl select-none">{emoji}</span>
                <span
                  className="text-[10px] font-bold text-center leading-tight line-clamp-2"
                  style={{ color: style.accent }}
                >
                  {sticker.name}
                </span>
              </div>
            )}

            {/* 虫眼鏡ボタン */}
            {!imgError && (
              <button
                onClick={() => setShowModal(true)}
                className="absolute top-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-gray-500 shadow-sm hover:bg-white transition"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </button>
            )}

            {owned && (
              <div className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-[11px] font-bold text-white shadow-md">
                {count}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-[13px] font-bold text-gray-800 leading-tight line-clamp-1">
              {sticker.name}
            </p>
            <p className="text-[10px] text-gray-400 leading-tight line-clamp-1">
              {sticker.series}
            </p>

            <div className="flex flex-wrap gap-0.5">
              {sticker.categories.slice(0, 2).map((catId) => {
                const cat = categoryMaster.find((c) => c.id === catId);
                return (
                  <span
                    key={catId}
                    className="inline-block rounded-full bg-rose-50 px-1.5 py-0.5 text-[9px] font-medium text-rose-400"
                  >
                    {cat?.emoji} {cat?.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mt-1.5 flex items-center justify-center gap-3">
            <button
              onClick={onToggleFavorite}
              className={`text-lg transition-transform active:scale-125 ${
                favorite ? "text-red-400 drop-shadow-sm" : "text-gray-300"
              }`}
            >
              {favorite ? "♥" : "♡"}
            </button>
            <button
              onClick={onToggleWantNext}
              className={`text-lg transition-transform active:scale-125 ${
                wantNext ? "text-amber-400 drop-shadow-sm" : "text-gray-300"
              }`}
            >
              {wantNext ? "★" : "☆"}
            </button>
            <button
              onClick={() => setShowMemo(!showMemo)}
              className={`text-base transition-transform active:scale-125 ${
                hasMemo ? "text-blue-400 drop-shadow-sm" : "text-gray-300"
              }`}
            >
              📝
            </button>
          </div>

          {/* メモ展開エリア */}
          {showMemo && (
            <div className="mt-2 rounded-xl bg-blue-50/70 border border-blue-100 p-2.5 space-y-2">
              <div>
                <label className="text-[10px] font-bold text-blue-400 flex items-center gap-1 mb-0.5">
                  📍 場所
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="渋谷109 1F"
                  className="w-full rounded-lg border border-blue-200 bg-white px-2 py-1.5 text-[11px] outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-blue-400 flex items-center gap-1 mb-0.5">
                  💬 メモ
                </label>
                <textarea
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="在庫多めだった"
                  rows={2}
                  className="w-full rounded-lg border border-blue-200 bg-white px-2 py-1.5 text-[11px] outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 resize-none placeholder:text-gray-300"
                />
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={handleSaveMemo}
                  className="flex-1 rounded-lg bg-blue-400 py-1.5 text-[11px] font-bold text-white active:bg-blue-500 transition"
                >
                  保存
                </button>
                {hasMemo && (
                  <button
                    onClick={handleDeleteMemo}
                    className="rounded-lg bg-gray-200 px-3 py-1.5 text-[11px] font-bold text-gray-500 active:bg-gray-300 transition"
                  >
                    削除
                  </button>
                )}
              </div>
            </div>
          )}

          {/* メモプレビュー（閉じている時） */}
          {!showMemo && hasMemo && (
            <button
              onClick={() => setShowMemo(true)}
              className="mt-1.5 w-full rounded-lg bg-blue-50 px-2 py-1 text-left"
            >
              {memoLocation && (
                <p className="text-[10px] text-blue-500 font-medium truncate">
                  📍 {memoLocation}
                </p>
              )}
              {memoNote && (
                <p className="text-[10px] text-blue-400 truncate">
                  💬 {memoNote}
                </p>
              )}
            </button>
          )}

          <div className="mt-1.5 flex items-center justify-between">
            <button
              onClick={onDecrement}
              disabled={count <= 0}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-50 text-base font-bold text-pink-300 transition-colors active:bg-pink-100 disabled:opacity-30"
            >
              −
            </button>
            <span className="text-sm font-bold text-gray-700 tabular-nums">
              {count}
            </span>
            <button
              onClick={onIncrement}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-400 text-base font-bold text-white transition-colors active:bg-pink-500 shadow-sm"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <ImageModal
          src={sticker.imagePath}
          alt={sticker.name}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
