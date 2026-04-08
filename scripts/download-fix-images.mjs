/**
 * 画像修正ダウンロードスクリプト
 * - おはじきシール（間違い画像の差し替え）
 * - うるちゅるサンリオ（不足画像の追加）
 */
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images", "stickers");

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const imageMap = {
  // --- おはじきシール（間違い画像を正しいものに差し替え） ---
  "sanrio-ohj-002": "https://item-shopping.c.yimg.jp/i/j/happy-pandashop_4901770033778",
  "sanrio-ohj-003": "https://item-shopping.c.yimg.jp/i/j/trend-office_4901770033761",
  "sanrio-ohj-004": "https://item-shopping.c.yimg.jp/i/j/happy-pandashop_4901770033785",
  "sanrio-ohj-005": "https://item-shopping.c.yimg.jp/i/j/happy-pandashop_4901770033815",
  // --- うるちゅるサンリオ（不足画像） ---
  "ups-sanrio-004": "https://item-shopping.c.yimg.jp/i/n/flow-syouten_4550451259176",
  "ups-sanrio-007": "https://item-shopping.c.yimg.jp/i/n/trend-office_4550451317852",
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(
      url,
      { headers: { "User-Agent": "Mozilla/5.0" } },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return download(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          resolve({ id: path.basename(dest), status: "skip", code: res.statusCode });
          res.resume();
          return;
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on("finish", () => { file.close(); resolve({ id: path.basename(dest), status: "ok" }); });
      }
    );
    req.on("error", (err) => resolve({ id: path.basename(dest), status: "error", msg: err.message }));
    req.setTimeout(15000, () => { req.destroy(); resolve({ id: path.basename(dest), status: "timeout" }); });
  });
}

async function main() {
  const entries = Object.entries(imageMap);
  console.log(`Downloading ${entries.length} images (overwriting existing)...`);

  for (const [id, url] of entries) {
    const ext = ".jpg";
    const dest = path.join(outDir, `${id}${ext}`);
    // 既存ファイルがあっても上書き（間違い画像の修正のため）
    const result = await download(url, dest);
    console.log(`  [${result.status}] ${id}${result.code ? ` (${result.code})` : ""}${result.msg ? ` ${result.msg}` : ""}`);
  }
  console.log("Done!");
}

main();
