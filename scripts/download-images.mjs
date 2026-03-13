/**
 * シール画像ダウンロードスクリプト
 *
 * 使い方:
 *   1. imageMap に { シールID: 画像URL } を追加
 *   2. node scripts/download-images.mjs を実行
 *
 * 画像は public/images/stickers/ に保存されます。
 * stickers.ts の imagePath と同じファイル名にしてください。
 *
 * 手動で追加する場合:
 *   public/images/stickers/sanrio-bd1-001.jpg のように配置するだけでOK
 */
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images", "stickers");

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// ここに画像URLを追加してください
// キー = stickers.ts の id, 値 = 画像のURL
const imageMap = {
  // 例:
  // "sanrio-bd1-001": "https://example.com/kitty-a.jpg",
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(
      url,
      { headers: { "User-Agent": "Mozilla/5.0" } },
      (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          return download(res.headers.location, dest)
            .then(resolve)
            .catch(reject);
        }
        if (res.statusCode !== 200) {
          resolve({
            id: path.basename(dest),
            status: "skip",
            code: res.statusCode,
          });
          res.resume();
          return;
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve({ id: path.basename(dest), status: "ok" });
        });
      }
    );
    req.on("error", (err) =>
      resolve({ id: path.basename(dest), status: "error", msg: err.message })
    );
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ id: path.basename(dest), status: "timeout" });
    });
  });
}

async function main() {
  const entries = Object.entries(imageMap);
  if (entries.length === 0) {
    console.log("imageMap が空です。ダウンロードする画像URLを追加してください。");
    console.log("手動で画像を追加する場合: public/images/stickers/ にファイルを配置");
    return;
  }

  console.log(`Downloading ${entries.length} images...`);

  for (const [id, url] of entries) {
    const ext = path.extname(new URL(url).pathname) || ".jpg";
    const dest = path.join(outDir, `${id}${ext}`);
    if (fs.existsSync(dest)) {
      console.log(`  [skip] ${id} (already exists)`);
      continue;
    }
    const result = await download(url, dest);
    console.log(
      `  [${result.status}] ${id}${result.code ? ` (${result.code})` : ""}${result.msg ? ` ${result.msg}` : ""}`
    );
  }

  console.log("Done!");
}

main();
