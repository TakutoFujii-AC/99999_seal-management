import StickerList from "@/components/StickerList";

export default function Home() {
  return (
    <main className="mx-auto max-w-lg min-h-screen">
      <header className="sticky top-0 z-40 bg-gradient-to-r from-pink-400 to-rose-300 px-4 py-3 text-white shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎀</span>
          <h1 className="text-lg font-bold tracking-tight">
            わたしのシール帳
          </h1>
        </div>
      </header>

      <StickerList />
    </main>
  );
}
