"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, UserSticker } from "@/lib/supabase";

type StickerMap = Record<string, UserSticker>;

const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export function useUserStickers() {
  const [stickerMap, setStickerMap] = useState<StickerMap>({});
  const [loading, setLoading] = useState(true);
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {}
  );

  const fetchAll = useCallback(async () => {
    setLoading(true);
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("user_stickers")
      .select("*")
      .eq("user_id", DEMO_USER_ID);

    if (error) {
      console.error("Failed to fetch user stickers:", error);
      setLoading(false);
      return;
    }

    const map: StickerMap = {};
    data?.forEach((row: UserSticker) => {
      map[row.sticker_id] = row;
    });
    setStickerMap(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const defaultRow = (stickerId: string): UserSticker => ({
    id: "",
    user_id: DEMO_USER_ID,
    sticker_id: stickerId,
    count: 0,
    favorite: false,
    want_next: false,
    memo_location: "",
    memo_note: "",
    acquired_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const upsertCount = useCallback(
    async (stickerId: string, newCount: number) => {
      setStickerMap((prev) => ({
        ...prev,
        [stickerId]: {
          ...(prev[stickerId] || defaultRow(stickerId)),
          count: newCount,
        },
      }));

      if (!supabase) return;

      if (debounceTimers.current[stickerId]) {
        clearTimeout(debounceTimers.current[stickerId]);
      }

      debounceTimers.current[stickerId] = setTimeout(async () => {
        if (!supabase) return;

        const existing = stickerMap[stickerId];
        const hasMeta = existing?.favorite || existing?.want_next;

        if (newCount <= 0 && !hasMeta) {
          await supabase
            .from("user_stickers")
            .delete()
            .eq("user_id", DEMO_USER_ID)
            .eq("sticker_id", stickerId);

          setStickerMap((prev) => {
            const next = { ...prev };
            delete next[stickerId];
            return next;
          });
        } else {
          const { error } = await supabase.from("user_stickers").upsert(
            {
              user_id: DEMO_USER_ID,
              sticker_id: stickerId,
              count: newCount,
              acquired_at: new Date().toISOString(),
            },
            { onConflict: "user_id,sticker_id" }
          );
          if (error) console.error("Failed to upsert:", error);
        }
      }, 400);
    },
    [stickerMap]
  );

  const toggleField = useCallback(
    async (stickerId: string, field: "favorite" | "want_next") => {
      const current = stickerMap[stickerId];
      const newValue = !(current?.[field] ?? false);

      setStickerMap((prev) => ({
        ...prev,
        [stickerId]: {
          ...(prev[stickerId] || defaultRow(stickerId)),
          [field]: newValue,
        },
      }));

      if (!supabase) return;

      const existing = stickerMap[stickerId];
      const { error } = await supabase.from("user_stickers").upsert(
        {
          user_id: DEMO_USER_ID,
          sticker_id: stickerId,
          count: existing?.count ?? 0,
          [field]: newValue,
        },
        { onConflict: "user_id,sticker_id" }
      );
      if (error) console.error(`Failed to toggle ${field}:`, error);
    },
    [stickerMap]
  );

  const toggleFavorite = useCallback(
    (stickerId: string) => toggleField(stickerId, "favorite"),
    [toggleField]
  );

  const toggleWantNext = useCallback(
    (stickerId: string) => toggleField(stickerId, "want_next"),
    [toggleField]
  );

  const getCount = useCallback(
    (stickerId: string) => stickerMap[stickerId]?.count ?? 0,
    [stickerMap]
  );

  const isFavorite = useCallback(
    (stickerId: string) => stickerMap[stickerId]?.favorite ?? false,
    [stickerMap]
  );

  const isWantNext = useCallback(
    (stickerId: string) => stickerMap[stickerId]?.want_next ?? false,
    [stickerMap]
  );

  const getMemo = useCallback(
    (stickerId: string) => ({
      location: stickerMap[stickerId]?.memo_location ?? "",
      note: stickerMap[stickerId]?.memo_note ?? "",
    }),
    [stickerMap]
  );

  const hasMemoData = useCallback(
    (stickerId: string) => {
      const s = stickerMap[stickerId];
      return !!(s?.memo_location || s?.memo_note);
    },
    [stickerMap]
  );

  const updateMemo = useCallback(
    async (stickerId: string, location: string, note: string) => {
      setStickerMap((prev) => ({
        ...prev,
        [stickerId]: {
          ...(prev[stickerId] || defaultRow(stickerId)),
          memo_location: location,
          memo_note: note,
        },
      }));

      if (!supabase) return;

      const existing = stickerMap[stickerId];
      const { error } = await supabase.from("user_stickers").upsert(
        {
          user_id: DEMO_USER_ID,
          sticker_id: stickerId,
          count: existing?.count ?? 0,
          memo_location: location,
          memo_note: note,
        },
        { onConflict: "user_id,sticker_id" }
      );
      if (error) console.error("Failed to update memo:", error);
    },
    [stickerMap]
  );

  const totalOwned = Object.values(stickerMap).filter(
    (s) => s.count > 0
  ).length;

  return {
    stickerMap,
    loading,
    getCount,
    upsertCount,
    isFavorite,
    isWantNext,
    toggleFavorite,
    toggleWantNext,
    getMemo,
    hasMemoData,
    updateMemo,
    totalOwned,
    fetchAll,
  };
}
