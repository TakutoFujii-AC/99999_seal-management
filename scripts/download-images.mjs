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
  // --- 3D大人の図鑑シール 第二弾 ---
  "oz-164": "https://tshop.r10s.jp/cinemacollection/cabinet/r20260324/kmo-231212.jpg",
  "oz-165": "https://tshop.r10s.jp/cinemacollection/cabinet/r20260324/kmo-231213.jpg",
  "oz-166": "https://tshop.r10s.jp/cinemacollection/cabinet/r20260324/kmo-231214.jpg",
  "oz-167": "https://tshop.r10s.jp/cinemacollection/cabinet/r20260324/kmo-231216.jpg",
  "oz-168": "https://tshop.r10s.jp/cinemacollection/cabinet/r20260324/kmo-231217.jpg",
  "oz-169": "https://tshop.r10s.jp/cinemacollection/cabinet/r20260324/kmo-231215.jpg",
  // --- 4サイズステッカー サンリオキャラクターズ ---
  "4size-sanrio-001": "https://makeshop-multi-images.akamaized.net/kamiojapan/shopimages/23/15/1_000000001523.webp",
  "4size-sanrio-002": "https://makeshop-multi-images.akamaized.net/kamiojapan/shopimages/24/15/1_000000001524.webp",
  // --- ストーン付きジュエルプチドロップステッカー ---
  "jpds-stone-001": "https://shopping.c.yimg.jp/lib/cinemacollection/kmo-227464.jpg",
  "jpds-stone-002": "https://shopping.c.yimg.jp/lib/cinemacollection/kmo-227465.jpg",
  "jpds-stone-003": "https://shopping.c.yimg.jp/lib/cinemacollection/kmo-227466.jpg",
  "jpds-stone-004": "https://shopping.c.yimg.jp/lib/cinemacollection/kmo-227468.jpg",
  "jpds-stone-005": "https://shopping.c.yimg.jp/lib/cinemacollection/kmo-227688.jpg",
  "jpds-stone-006": "https://shopping.c.yimg.jp/lib/cinemacollection/kmo-227689.jpg",
  "jpds-stone-007": "https://shopping.c.yimg.jp/lib/cinemacollection/kmo-227690.jpg",
  "jpds-stone-008": "https://shopping.c.yimg.jp/lib/cinemacollection/kmo-227691.jpg",
  "jpds-stone-009": "https://shopping.c.yimg.jp/lib/cinemacollection/kmo-227693.jpg",
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
