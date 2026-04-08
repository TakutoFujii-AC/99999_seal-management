/**
 * 新規追加分の画像ダウンロードスクリプト
 */
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images", "stickers");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const BASE_CC = "https://shopping.c.yimg.jp/lib/cinemacollection/";
const BASE_YS = "https://item-shopping.c.yimg.jp/i/n/";
const BASE_LOFT = "https://www.loft.co.jp/shop_assets/img/goods/L/";

const imageMap = {
  // --- 平成はっぴーふぉん サンリオ追加6件 ---
  "hhp-sanrio-005": BASE_LOFT + "4550451364429-L.jpg",  // グランジギャル
  "hhp-sanrio-006": BASE_LOFT + "4550451373551-L.jpg",  // レオパード
  "hhp-sanrio-007": BASE_LOFT + "4550451373568-L.jpg",  // サンリオキャラクターズ レオパード
  "hhp-sanrio-008": BASE_LOFT + "4550451373575-L.jpg",  // マイメロディ&クロミ レオパード
  "hhp-sanrio-009": BASE_LOFT + "4550451373582-L.jpg",  // ポムポムプリン
  "hhp-sanrio-010": BASE_LOFT + "4550451373599-L.jpg",  // ポチャッコ
  // --- プチドロディズニー 追加22件 ---
  "pds-disney-003": BASE_CC + "kmo-306590.jpg",  // ミニーマウス
  "pds-disney-004": BASE_CC + "kmo-306592.jpg",  // ヴィランズ
  "pds-disney-005": BASE_CC + "kmo-306593.jpg",  // ふしぎの国のアリス
  "pds-disney-006": BASE_CC + "kmo-306594.jpg",  // おしゃれキャット マリー
  "pds-disney-007": BASE_CC + "kmo-306596.jpg",  // トイ・ストーリー
  "pds-disney-008": BASE_CC + "kmo-306597.jpg",  // モンスターズ・ユニバーシティ
  "pds-disney-009": BASE_CC + "kmo-306598.jpg",  // ベイマックス
  "pds-disney-010": BASE_CC + "kmo-306919.jpg",  // ナイトメアー
  "pds-disney-011": BASE_CC + "kmo-307026.jpg",  // ディズニーベビー
  "pds-disney-012": BASE_CC + "kmo-307027.jpg",  // クラシック1
  "pds-disney-013": BASE_CC + "kmo-307028.jpg",  // クラシック2
  "pds-disney-014": BASE_CC + "kmo-307029.jpg",  // アリス2
  "pds-disney-015": BASE_CC + "kmo-307030.jpg",  // ロッツォ
  "pds-disney-016": BASE_CC + "kmo-307031.jpg",  // ピクサーMIX
  "pds-disney-017": BASE_CC + "kmo-307335.jpg",  // スティッチ
  "pds-disney-018": BASE_CC + "kmo-307633.jpg",  // くまのプーさん
  "pds-disney-019": BASE_CC + "kmo-307634.jpg",  // バンビ
  "pds-disney-020": BASE_CC + "kmo-307635.jpg",  // 101匹わんちゃん
  "pds-disney-021": BASE_CC + "kmo-307636.jpg",  // スティッチ2
  "pds-disney-022": BASE_CC + "kmo-307637.jpg",  // ミッキーマウス
  "pds-disney-023": BASE_CC + "kmo-307638.jpg",  // ズートピア
  "pds-disney-024": BASE_CC + "kmo-307639.jpg",  // ズートピア2
  // --- ピタプク新規3件 ---
  "pp-sanrio-005": BASE_YS + "trend-office_4550451373551",  // 日焼けキティ (平成ハピフォンと同画像の可能性)
  "pp-chara-003": BASE_YS + "flow-syouten_4550451349501",  // なっとうちゃん
  "pp-chara-004": BASE_YS + "flow-syouten_4550451349518",  // マジカルミューちゃん
  // --- うるちゅる モンチッチ追加2件 ---
  "ups-monchi-003": BASE_YS + "trend-office_4550451349600",  // ノーマル
  "ups-monchi-004": BASE_YS + "trend-office_4550451349617",  // オシャレ
  // --- うるちゅる その他追加 ---
  "ups-other-004": BASE_YS + "flow-syouten_4550451324300",  // エンジェルブルー2
  "ups-other-005": BASE_YS + "flow-syouten_4550451322245",  // パワパフ2
  "ups-other-006": BASE_YS + "flow-syouten_4550451322252",  // ブロッサム
  "ups-other-007": BASE_YS + "flow-syouten_4550451322269",  // バブルス
  "ups-other-008": BASE_YS + "flow-syouten_4550451322276",  // バターカップ
  "ups-other-009": BASE_YS + "flow-syouten_4550451350965",  // エスターバニー リボン
  "ups-other-010": BASE_YS + "flow-syouten_4550451350972",  // エスターバニー
  // --- うるちゅる おぱんちゅうさぎ ---
  "ups-opanchu-001": BASE_YS + "flow-syouten_4550451371200",  // おぱんちゅ1
  "ups-opanchu-002": BASE_YS + "flow-syouten_4550451371217",  // おぱんちゅ2
  // --- 大人図鑑キャラクター追加5件 ---
  "oz-170": BASE_CC + "kmo-228449.jpg",  // ムーミン
  "oz-171": BASE_CC + "kmo-207987.jpg",  // リトルミィ
  "oz-172": BASE_CC + "kmo-228450.jpg",  // ちびまる子ちゃん家族編
  "oz-173": BASE_CC + "kmo-231022.jpg",  // たまごっちおみせっち①
  "oz-174": BASE_CC + "kmo-231023.jpg",  // たまごっちおみせっち②
  // --- 4サイズステッカー ---
  "4size-sanrio-003": BASE_CC + "kmo-306852.jpg",  // ハローキティ
  "4size-sanrio-004": BASE_CC + "kmo-303179.jpg",  // MIX
  "4size-sanrio-005": BASE_CC + "kmo-303177.jpg",  // ポムポムプリン
  "4size-sanrio-006": BASE_CC + "kmo-303178.jpg",  // ポチャッコ
  "4size-sanrio-007": BASE_CC + "kmo-218124.jpg",  // もちもちぱんだ
  "4size-pokemon-001": BASE_CC + "kmo-300732.jpg",  // ピカチュウ ナンバー
  "4size-pokemon-002": BASE_CC + "kmo-300733.jpg",  // ピクセル
  "4size-pokemon-003": BASE_CC + "kmo-300723.jpg",  // イーブイ ピクセル
  "4size-pokemon-004": BASE_CC + "kmo-300734.jpg",  // イーブイフレンズ
  "4size-snoopy-001": BASE_CC + "kmo-304027.jpg",  // ファニーフェイス
  "4size-snoopy-002": BASE_CC + "kmo-304026.jpg",  // コスチューム
  "4size-disney-001": BASE_CC + "kmo-304021.jpg",  // プーさん
  "4size-disney-002": BASE_CC + "kmo-303173.jpg",  // チップ&デール
  "4size-disney-003": BASE_CC + "kmo-304022.jpg",  // リトルグリーンメン
  "4size-chiikawa-001": BASE_CC + "kmo-307700.jpg",  // ちいかわ
  "4size-chiikawa-002": BASE_CC + "kmo-307701.jpg",  // ハチワレ
  "4size-chiikawa-003": BASE_CC + "kmo-307702.jpg",  // うさぎ
  "4size-chiikawa-004": BASE_CC + "kmo-307703.jpg",  // モモンガ
  "4size-tama-001": BASE_CC + "kmo-218125.jpg",  // たまごっち
  "4size-tama-002": BASE_CC + "kmo-218126.jpg",  // ドット
  "4size-other-001": BASE_CC + "kmo-215317.jpg",  // おぱんちゅ1
  "4size-other-002": BASE_CC + "kmo-215318.jpg",  // おぱんちゅ2
  "4size-other-003": BASE_CC + "kmo-046622.jpg",  // カービィ&フレンズ
  "4size-other-004": BASE_CC + "kmo-046623.jpg",  // COPY ABILITY
  "4size-other-005": BASE_CC + "kmo-303983.jpg",  // ドラえもん
};

function download(url, dest) {
  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve);
      }
      if (res.statusCode !== 200) {
        resolve({ id: path.basename(dest), status: "skip", code: res.statusCode });
        res.resume();
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve({ id: path.basename(dest), status: "ok" }); });
    });
    req.on("error", (err) => resolve({ id: path.basename(dest), status: "error", msg: err.message }));
    req.setTimeout(15000, () => { req.destroy(); resolve({ id: path.basename(dest), status: "timeout" }); });
  });
}

async function main() {
  const entries = Object.entries(imageMap);
  console.log(`Downloading ${entries.length} images...`);
  let ok = 0, skip = 0, err = 0;
  for (const [id, url] of entries) {
    const ext = ".jpg";
    const dest = path.join(outDir, `${id}${ext}`);
    const result = await download(url, dest);
    if (result.status === "ok") ok++;
    else if (result.status === "skip") skip++;
    else err++;
    console.log(`  [${result.status}] ${id}${result.code ? ` (${result.code})` : ""}${result.msg ? ` ${result.msg}` : ""}`);
  }
  console.log(`\nDone! OK: ${ok}, Skip: ${skip}, Error: ${err}`);
}

main();
