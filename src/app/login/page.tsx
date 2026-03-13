"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("パスワードが違います");
      }
    } catch {
      setError("エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-rose-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur"
      >
        <div className="mb-6 text-center">
          <span className="text-4xl">🎀</span>
          <h1 className="mt-2 text-lg font-bold text-pink-600">
            わたしのシール帳
          </h1>
          <p className="mt-1 text-xs text-gray-400">
            パスワードを入力してください
          </p>
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          autoFocus
          className="w-full rounded-xl border border-pink-200 bg-pink-50/50 px-4 py-3 text-center text-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
        />

        {error && (
          <p className="mt-2 text-center text-xs text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 py-3 text-sm font-bold text-white shadow transition hover:from-pink-500 hover:to-rose-500 disabled:opacity-50"
        >
          {loading ? "確認中..." : "ログイン"}
        </button>
      </form>
    </main>
  );
}
