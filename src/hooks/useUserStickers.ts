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

  const upsertCount = useCallback(
    async (stickerId: string, newCount: number) => {
      setStickerMap((prev) => ({
        ...prev,
        [stickerId]: {
          ...(prev[stickerId] || {
            id: "",
            user_id: DEMO_USER_ID,
            sticker_id: stickerId,
            acquired_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
          count: newCount,
        },
      }));

      if (!supabase) return;

      if (debounceTimers.current[stickerId]) {
        clearTimeout(debounceTimers.current[stickerId]);
      }

      debounceTimers.current[stickerId] = setTimeout(async () => {
        if (!supabase) return;

        if (newCount <= 0) {
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
    []
  );

  const getCount = useCallback(
    (stickerId: string) => stickerMap[stickerId]?.count ?? 0,
    [stickerMap]
  );

  const totalOwned = Object.values(stickerMap).filter(
    (s) => s.count > 0
  ).length;

  return { stickerMap, loading, getCount, upsertCount, totalOwned, fetchAll };
}
