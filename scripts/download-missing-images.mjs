/**
 * 不足画像一括ダウンロードスクリプト
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
const BASE_YS = "https://item-shopping.c.yimg.jp/i/j/";

const imageMap = {
  // =====================================================
  // クーリア ボンボンドロップシール オリジナル 第1弾 (14)
  // =====================================================
  "qlia-bd-001": BASE_CC + "qla-91120.jpg",
  "qlia-bd-002": BASE_CC + "qla-91121.jpg",
  "qlia-bd-003": BASE_CC + "qla-91122.jpg",
  "qlia-bd-004": BASE_CC + "qla-91123.jpg",
  "qlia-bd-005": BASE_CC + "qla-91124.jpg",
  "qlia-bd-006": BASE_CC + "qla-91125.jpg",
  "qlia-bd-007": BASE_CC + "qla-91126.jpg",
  "qlia-bd-008": BASE_CC + "qla-91127.jpg",
  "qlia-bd-009": BASE_CC + "qla-91128.jpg",
  "qlia-bd-010": BASE_CC + "qla-91129.jpg",
  "qlia-bd-011": BASE_CC + "qla-91130.jpg",
  "qlia-bd-012": BASE_CC + "qla-91131.jpg",
  "qlia-bd-013": BASE_CC + "qla-91132.jpg",
  "qlia-bd-014": BASE_CC + "qla-91133.jpg",
  // =====================================================
  // クーリア ボンボンドロップシール オリジナル 第2弾 (4)
  // =====================================================
  "qlia-bd2-001": BASE_CC + "qla-91136.jpg",
  "qlia-bd2-002": BASE_CC + "qla-91137.jpg",
  "qlia-bd2-003": BASE_CC + "qla-91138.jpg",
  "qlia-bd2-004": BASE_CC + "qla-91139.jpg",
  // =====================================================
  // クーリア ボンボンドロップシール オリジナル 第3弾 (8)
  // =====================================================
  "qlia-bd3-001": BASE_CC + "qla-91141.jpg",
  "qlia-bd3-002": BASE_CC + "qla-91142.jpg",
  "qlia-bd3-003": BASE_CC + "qla-91143.jpg",
  "qlia-bd3-004": BASE_CC + "qla-91144.jpg",
  "qlia-bd3-005": BASE_CC + "qla-91145.jpg",
  "qlia-bd3-006": BASE_CC + "qla-91146.jpg",
  "qlia-bd3-007": BASE_CC + "qla-91147.jpg",
  "qlia-bd3-008": BASE_CC + "qla-91148.jpg",
  // =====================================================
  // クーリア ボンボンドロップシール シャーベット/フローズン (4)
  // =====================================================
  "qlia-bds-001": BASE_CC + "qla-91249.jpg",
  "qlia-bds-002": BASE_CC + "qla-91250.jpg",
  "qlia-bds-003": BASE_CC + "qla-91251.jpg",
  "qlia-bds-004": BASE_CC + "qla-91252.jpg",
  // =====================================================
  // クーリア ボンボンドロップシール churukira/オーロラ (4)
  // =====================================================
  "qlia-bdc-001": BASE_CC + "qla-91259.jpg",
  "qlia-bdc-002": BASE_CC + "qla-91260.jpg",
  "qlia-bdc-003": BASE_CC + "qla-91261.jpg",
  "qlia-bdc-004": BASE_CC + "qla-91262.jpg",
  // =====================================================
  // クーリア ボンボンドロップシール マジカル (4)
  // =====================================================
  "qlia-bdmg-001": BASE_CC + "qla-91263.jpg",
  "qlia-bdmg-002": BASE_CC + "qla-91264.jpg",
  "qlia-bdmg-003": BASE_CC + "qla-91265.jpg",
  "qlia-bdmg-004": BASE_CC + "qla-91266.jpg",
  // =====================================================
  // クーリア ボンボンドロップシール ミニ (4)
  // =====================================================
  "qlia-bdmn-001": BASE_CC + "qla-91253.jpg",
  "qlia-bdmn-002": BASE_CC + "qla-91254.jpg",
  "qlia-bdmn-003": BASE_CC + "qla-91255.jpg",
  "qlia-bdmn-004": BASE_CC + "qla-91256.jpg",
  // =====================================================
  // クーリア ボンボンドロップシール 文字シール もじもじ (10)
  // =====================================================
  "qlia-bdmj-001": BASE_CC + "qla-91281.jpg",
  "qlia-bdmj-002": BASE_CC + "qla-91282.jpg",
  "qlia-bdmj-003": BASE_CC + "qla-91283.jpg",
  "qlia-bdmj-004": BASE_CC + "qla-91284.jpg",
  "qlia-bdmj-005": BASE_CC + "qla-91285.jpg",
  "qlia-bdmj-006": BASE_CC + "qla-91286.jpg",
  "qlia-bdmj-007": BASE_CC + "qla-91287.jpg",
  "qlia-bdmj-008": BASE_CC + "qla-91288.jpg",
  "qlia-bdmj-009": BASE_CC + "qla-91289.jpg",
  "qlia-bdmj-010": BASE_CC + "qla-91290.jpg",
  // =====================================================
  // クーリア ボンボンドロップシール 動物 (8)
  // =====================================================
  "qlia-bda-001": BASE_CC + "qla-91269.jpg",
  "qlia-bda-002": BASE_CC + "qla-91270.jpg",
  "qlia-bda-003": BASE_CC + "qla-91271.jpg",
  "qlia-bda-004": BASE_CC + "qla-91272.jpg",
  "qlia-bda-005": BASE_CC + "qla-91273.jpg",
  "qlia-bda-006": BASE_CC + "qla-91274.jpg",
  "qlia-bda-007": BASE_CC + "qla-91275.jpg",
  "qlia-bda-008": BASE_CC + "qla-91276.jpg",
  // =====================================================
  // クーリア ボンボンドロップシール 海の生き物 (6)
  // =====================================================
  "qlia-bdas-001": BASE_CC + "qla-91277.jpg",
  "qlia-bdas-002": BASE_CC + "qla-91278.jpg",
  "qlia-bdas-003": BASE_CC + "qla-91279.jpg",
  "qlia-bdas-004": BASE_CC + "qla-91280.jpg",
  "qlia-bdas-005": BASE_CC + "qla-91267.jpg",
  "qlia-bdas-006": BASE_CC + "qla-91268.jpg",
  // =====================================================
  // ディズニー ボンボンドロップシール 第1弾 (8) - JAN code based
  // =====================================================
  "disney-bd1-001": BASE_CC + "ssb-s8542716.jpg",  // くまのプーさん
  "disney-bd1-002": BASE_CC + "ssb-s8542717.jpg",  // ヤングオイスター
  "disney-bd1-003": BASE_CC + "ssb-s8542718.jpg",  // 101匹わんちゃん
  "disney-bd1-004": BASE_CC + "ssb-s8542719.jpg",  // スティッチ
  "disney-bd1-005": BASE_CC + "ssb-s8542720.jpg",  // ベイマックス A
  "disney-bd1-006": BASE_CC + "ssb-s8542721.jpg",  // ベイマックス B
  "disney-bd1-007": BASE_CC + "ssb-s8542722.jpg",  // ズートピア
  "disney-bd1-008": BASE_CC + "ssb-s8542723.jpg",  // エイリアン
  // =====================================================
  // ディズニー ボンボンドロップシール 第2弾 (8)
  // =====================================================
  "disney-bd2-001": BASE_CC + "ssb-s8542732.jpg",  // くまのプーさん
  "disney-bd2-002": BASE_CC + "ssb-s8542733.jpg",  // ディズニープリンセス
  "disney-bd2-003": BASE_CC + "ssb-s8542734.jpg",  // クラシック
  "disney-bd2-004": BASE_CC + "ssb-s8542735.jpg",  // スティッチ らくがき
  "disney-bd2-005": BASE_CC + "ssb-s8542736.jpg",  // スティッチ＆エンジェル
  "disney-bd2-006": BASE_CC + "ssb-s8542737.jpg",  // ベイマックス
  "disney-bd2-007": BASE_CC + "ssb-s8542738.jpg",  // ズートピア
  "disney-bd2-008": BASE_CC + "ssb-s8542739.jpg",  // モンスターズ・インク
  // =====================================================
  // ディズニー ボンボンドロップシール ミニ (8)
  // =====================================================
  "disney-bdm-001": BASE_CC + "ssb-s8542748.jpg",  // くまのプーさん
  "disney-bdm-002": BASE_CC + "ssb-s8542749.jpg",  // ヤングオイスター
  "disney-bdm-003": BASE_CC + "ssb-s8542750.jpg",  // 101匹わんちゃん
  "disney-bdm-004": BASE_CC + "ssb-s8542751.jpg",  // スティッチ
  "disney-bdm-005": BASE_CC + "ssb-s8542752.jpg",  // ベイマックス ハート
  "disney-bdm-006": BASE_CC + "ssb-s8542753.jpg",  // ベイマックス パワードスーツ
  "disney-bdm-007": BASE_CC + "ssb-s8542754.jpg",  // ズートピア
  "disney-bdm-008": BASE_CC + "ssb-s8542755.jpg",  // エイリアン
  // =====================================================
  // サンリオ ボンボンドロップシール関連 (ピーナッツ、ちいかわ等もssb系)
  // =====================================================
  "peanuts-bd-001": BASE_CC + "ssb-s8542776.jpg",
  "peanuts-bd-002": BASE_CC + "ssb-s8542777.jpg",
  "peanuts-bd-003": BASE_CC + "ssb-s8542778.jpg",
  "peanuts-bd-004": BASE_CC + "ssb-s8542779.jpg",
  "peanuts-bdm-001": BASE_CC + "ssb-s8542804.jpg",
  "peanuts-bdm-002": BASE_CC + "ssb-s8542805.jpg",
  "peanuts-bdm-003": BASE_CC + "ssb-s8542806.jpg",
  "peanuts-bdm-004": BASE_CC + "ssb-s8542807.jpg",
  "chiikawa-bd1-001": BASE_CC + "ssb-s8542792.jpg",
  "chiikawa-bd1-002": BASE_CC + "ssb-s8542793.jpg",
  "chiikawa-bd1-003": BASE_CC + "ssb-s8542794.jpg",
  "chiikawa-bd1-004": BASE_CC + "ssb-s8542795.jpg",
  "chiikawa-bd2-001": BASE_CC + "ssb-s8542840.jpg",
  "chiikawa-bd2-002": BASE_CC + "ssb-s8542841.jpg",
  "chiikawa-bd2-003": BASE_CC + "ssb-s8542842.jpg",
  "chiikawa-bd2-004": BASE_CC + "ssb-s8542843.jpg",
  "tamagotchi-bd-001": BASE_CC + "ssb-s8542808.jpg",
  "tamagotchi-bd-002": BASE_CC + "ssb-s8542809.jpg",
  "tamagotchi-bd-003": BASE_CC + "ssb-s8542810.jpg",
  "tamagotchi-bd-004": BASE_CC + "ssb-s8542811.jpg",
  "sumikko-bd-001": BASE_CC + "ssb-s8542812.jpg",
  "sumikko-bd-002": BASE_CC + "ssb-s8542813.jpg",
  "koupen-bd-001": BASE_CC + "ssb-s8542814.jpg",
  "koupen-bd-002": BASE_CC + "ssb-s8542815.jpg",
  // =====================================================
  // しずくちゃん ボンボンドロップシール
  // =====================================================
  "shizuku-bd1-001": BASE_CC + "qla-94738.jpg",
  "shizuku-bd1-002": BASE_CC + "qla-94739.jpg",
  "shizuku-bd2-001": BASE_CC + "qla-94740.jpg",
  "shizuku-bd2-002": BASE_CC + "qla-94741.jpg",
  "shizuku-bd2-003": BASE_CC + "qla-94742.jpg",
  "shizuku-bd2-004": BASE_CC + "qla-94743.jpg",
  "shizuku-bdm-001": BASE_CC + "qla-94744.jpg",
  "shizuku-bdm-002": BASE_CC + "qla-94745.jpg",
  "shizuku-bdm-003": BASE_CC + "qla-94746.jpg",
  "shizuku-bdm-004": BASE_CC + "qla-94747.jpg",
  // =====================================================
  // 和柄 ボンボンドロップシール (20)
  // =====================================================
  "wagara-bd1-001": BASE_CC + "qla-91291.jpg",
  "wagara-bd1-002": BASE_CC + "qla-91292.jpg",
  "wagara-bd1-003": BASE_CC + "qla-91293.jpg",
  "wagara-bd1-004": BASE_CC + "qla-91294.jpg",
  "wagara-bd1-005": BASE_CC + "qla-91295.jpg",
  "wagara-bd1-006": BASE_CC + "qla-91296.jpg",
  "wagara-bd1-007": BASE_CC + "qla-91297.jpg",
  "wagara-bd1-008": BASE_CC + "qla-91298.jpg",
  "wagara-bd1-009": BASE_CC + "qla-91299.jpg",
  "wagara-bd1-010": BASE_CC + "qla-91300.jpg",
  "wagara-bd1-011": BASE_CC + "qla-91301.jpg",
  "wagara-bd1-012": BASE_CC + "qla-91302.jpg",
  "wagara-bd2-001": BASE_CC + "qla-91303.jpg",
  "wagara-bd2-002": BASE_CC + "qla-91304.jpg",
  "wagara-bd2-003": BASE_CC + "qla-91305.jpg",
  "wagara-bd2-004": BASE_CC + "qla-91306.jpg",
  "wagara-bd2-005": BASE_CC + "qla-91307.jpg",
  "wagara-bd2-006": BASE_CC + "qla-91308.jpg",
  "wagara-bd2-007": BASE_CC + "qla-91309.jpg",
  "wagara-bd2-008": BASE_CC + "qla-91310.jpg",
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
    if (fs.existsSync(dest)) { console.log(`  [exists] ${id}`); ok++; continue; }
    const result = await download(url, dest);
    if (result.status === "ok") ok++;
    else if (result.status === "skip") skip++;
    else err++;
    console.log(`  [${result.status}] ${id}${result.code ? ` (${result.code})` : ""}${result.msg ? ` ${result.msg}` : ""}`);
  }
  console.log(`\nDone! OK: ${ok}, Skip: ${skip}, Error: ${err}`);
}

main();
