import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "images", "stickers");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function get(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let loc = res.headers.location;
          if (loc.startsWith("/")) loc = new URL(loc, url).href;
          res.resume();
          return get(loc).then(resolve).catch(reject);
        }
        let chunks = [];
        res.on("data", (d) => chunks.push(d));
        res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks), headers: res.headers }));
      })
      .on("error", reject);
  });
}

function saveBinary(url, dest) {
  return get(url).then(({ status, body }) => {
    if (status !== 200) return { status: "skip", code: status };
    fs.writeFileSync(dest, body);
    return { status: "ok", size: body.length };
  });
}

function extractImageUrls(html) {
  const urls = [];
  const re = /(?:src|data-src|content)=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const u = m[1];
    if (u.includes("logo") || u.includes("icon") || u.includes("banner") || u.includes("sprite") || u.length < 30) continue;
    urls.push(u);
  }
  return [...new Set(urls)];
}

async function fetchAndSave(pageUrl, stickerId) {
  const dest = path.join(outDir, `${stickerId}.jpg`);
  if (fs.existsSync(dest)) {
    console.log(`  [skip] ${stickerId} (exists)`);
    return true;
  }
  console.log(`\n  Fetching: ${pageUrl}`);
  try {
    const { status, body } = await get(pageUrl);
    if (status !== 200) {
      console.log(`  [${status}] ${stickerId}`);
      return false;
    }
    const html = body.toString();
    const imgs = extractImageUrls(html);
    if (imgs.length === 0) {
      console.log(`  [no-img] ${stickerId}`);
      return false;
    }
    const imgUrl = imgs[0].startsWith("//") ? "https:" + imgs[0] : imgs[0].startsWith("/") ? new URL(imgs[0], pageUrl).href : imgs[0];
    console.log(`  Downloading: ${imgUrl.substring(0, 100)}`);
    const r = await saveBinary(imgUrl, dest);
    console.log(`  [${r.status}] ${stickerId} ${r.size ? `(${Math.round(r.size / 1024)}KB)` : `(${r.code})`}`);
    return r.status === "ok";
  } catch (e) {
    console.log(`  [error] ${stickerId}: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log("=== Round 2: Remaining images ===\n");

  // しまむらからボンボンドロップシール第1弾
  console.log("--- ボンボンドロップシール 第1弾 (しまむら) ---");
  const shimamura1 = [
    { url: "https://www.shop-shimamura.com/item/0482100002579/", id: "sanrio-bd1-001" },
    { url: "https://www.shop-shimamura.com/item/0482100002586/", id: "sanrio-bd1-002" },
    { url: "https://www.shop-shimamura.com/item/0482100002593/", id: "sanrio-bd1-003" },
    { url: "https://www.shop-shimamura.com/item/0482100002609/", id: "sanrio-bd1-004" },
    { url: "https://www.shop-shimamura.com/item/0482100002616/", id: "sanrio-bd1-005" },
    { url: "https://www.shop-shimamura.com/item/0482100002623/", id: "sanrio-bd1-006" },
    { url: "https://www.shop-shimamura.com/item/0482100002630/", id: "sanrio-bd1-007" },
    { url: "https://www.shop-shimamura.com/item/0482100002647/", id: "sanrio-bd1-008" },
  ];
  for (const p of shimamura1) await fetchAndSave(p.url, p.id);

  // マインドウェイブ公式ストア
  console.log("\n--- マインドウェイブ ---");
  const mwPages = [
    { url: "https://www.mindwave-store.com/c/all/82408", id: "mw-hdm-001" },
    { url: "https://www.mindwave-store.com/c/all/82409", id: "mw-hdm-002" },
    { url: "https://www.mindwave-store.com/c/all/82410", id: "mw-hdm-003" },
    { url: "https://www.mindwave-store.com/c/all/82411", id: "mw-hdm-004" },
    { url: "https://www.mindwave-store.com/c/all/82412", id: "mw-hdm-005" },
    { url: "https://www.mindwave-store.com/c/all/82413", id: "mw-hdm-006" },
    { url: "https://www.mindwave-store.com/c/all/82398", id: "mw-grj-001" },
    { url: "https://www.mindwave-store.com/c/all/82399", id: "mw-grj-002" },
    { url: "https://www.mindwave-store.com/c/all/82400", id: "mw-grj-003" },
    { url: "https://www.mindwave-store.com/c/all/82401", id: "mw-grj-004" },
    { url: "https://www.mindwave-store.com/c/all/82402", id: "mw-grj-005" },
    { url: "https://www.mindwave-store.com/c/all/82403", id: "mw-grj-006" },
    { url: "https://www.mindwave-store.com/c/all/82393", id: "mw-ami-001" },
    { url: "https://www.mindwave-store.com/c/all/82394", id: "mw-ami-002" },
    { url: "https://www.mindwave-store.com/c/all/82395", id: "mw-ami-003" },
    { url: "https://www.mindwave-store.com/c/all/82631", id: "mw-ami-004" },
    { url: "https://www.mindwave-store.com/c/all/82632", id: "mw-ami-005" },
    { url: "https://www.mindwave-store.com/c/all/82633", id: "mw-ami-006" },
    { url: "https://www.mindwave-store.com/c/all/82414", id: "mw-yrd-001" },
    { url: "https://www.mindwave-store.com/c/all/82415", id: "mw-yrd-002" },
    { url: "https://www.mindwave-store.com/c/all/82416", id: "mw-yrd-003" },
    { url: "https://www.mindwave-store.com/c/all/82568", id: "mw-clr-001" },
    { url: "https://www.mindwave-store.com/c/all/82569", id: "mw-clr-002" },
    { url: "https://www.mindwave-store.com/c/all/82570", id: "mw-clr-003" },
    { url: "https://www.mindwave-store.com/c/all/82571", id: "mw-clr-004" },
    { url: "https://www.mindwave-store.com/c/all/82572", id: "mw-clr-005" },
    { url: "https://www.mindwave-store.com/c/all/82573", id: "mw-clr-006" },
  ];
  for (const p of mwPages) await fetchAndSave(p.url, p.id);

  console.log("\n=== Done ===");
  const files = fs.readdirSync(outDir).filter((f) => f.endsWith(".jpg") || f.endsWith(".png") || f.endsWith(".webp"));
  console.log(`Total images in folder: ${files.length}`);
  files.forEach((f) => console.log(`  ${f} (${Math.round(fs.statSync(path.join(outDir, f)).size / 1024)}KB)`));
}

main();
