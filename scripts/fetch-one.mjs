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

async function fetchProductImage(pageUrl, stickerIds) {
  console.log(`\nFetching page: ${pageUrl}`);
  try {
    const { status, body } = await get(pageUrl);
    if (status !== 200) {
      console.log(`  Page returned ${status}`);
      return;
    }
    const html = body.toString();
    const imgs = extractImageUrls(html);
    console.log(`  Found ${imgs.length} candidate images`);
    imgs.slice(0, 5).forEach((u) => console.log(`    ${u.substring(0, 120)}`));

    if (imgs.length > 0 && stickerIds.length > 0) {
      const imgUrl = imgs[0].startsWith("//") ? "https:" + imgs[0] : imgs[0].startsWith("/") ? new URL(imgs[0], pageUrl).href : imgs[0];
      for (const id of stickerIds) {
        const dest = path.join(outDir, `${id}.jpg`);
        if (fs.existsSync(dest)) {
          console.log(`  [skip] ${id} (exists)`);
          continue;
        }
        console.log(`  Downloading for ${id}: ${imgUrl.substring(0, 100)}`);
        const r = await saveBinary(imgUrl, dest);
        console.log(`  [${r.status}] ${id} ${r.size ? `(${Math.round(r.size / 1024)}KB)` : `(${r.code})`}`);
      }
    }
  } catch (e) {
    console.log(`  Error: ${e.message}`);
  }
}

async function main() {
  // ボンボンドロップシール第1弾 - anime-store.jp から
  const bd1Products = [
    { url: "https://anime-store.jp/products/4901770776996-202507", ids: ["sanrio-bd1-001"] },
    { url: "https://anime-store.jp/products/4901770777009", ids: ["sanrio-bd1-002"] },
    { url: "https://anime-store.jp/products/4901770777016", ids: ["sanrio-bd1-003"] },
    { url: "https://anime-store.jp/products/4901770777054", ids: ["sanrio-bd1-004"] },
    { url: "https://anime-store.jp/products/4901770777047", ids: ["sanrio-bd1-005"] },
    { url: "https://anime-store.jp/products/4901770777030", ids: ["sanrio-bd1-006"] },
    { url: "https://anime-store.jp/products/4901770777023", ids: ["sanrio-bd1-007"] },
    { url: "https://anime-store.jp/products/4901770777061", ids: ["sanrio-bd1-008"] },
  ];

  // ボンボンドロップシール第2弾
  const bd2Products = [
    { url: "https://anime-store.jp/products/4901770798042", ids: ["sanrio-bd2-001"] },
    { url: "https://anime-store.jp/products/4901770798059", ids: ["sanrio-bd2-002"] },
    { url: "https://anime-store.jp/products/4901770798066", ids: ["sanrio-bd2-003"] },
    { url: "https://anime-store.jp/products/4901770798110", ids: ["sanrio-bd2-004"] },
    { url: "https://anime-store.jp/products/4901770798103", ids: ["sanrio-bd2-005"] },
    { url: "https://anime-store.jp/products/4901770798097", ids: ["sanrio-bd2-006"] },
    { url: "https://anime-store.jp/products/4901770798073", ids: ["sanrio-bd2-007"] },
    { url: "https://anime-store.jp/products/4901770798080", ids: ["sanrio-bd2-008"] },
  ];

  // ボンボンドロップシールmini
  const bdmProducts = [
    { url: "https://anime-store.jp/products/4901770938332", ids: ["sanrio-bdm-001"] },
    { url: "https://anime-store.jp/products/4901770938349", ids: ["sanrio-bdm-002"] },
    { url: "https://anime-store.jp/products/4901770938356", ids: ["sanrio-bdm-003"] },
    { url: "https://anime-store.jp/products/4901770938905", ids: ["sanrio-bdm-004"] },
    { url: "https://anime-store.jp/products/4901770938479", ids: ["sanrio-bdm-005"] },
    { url: "https://anime-store.jp/products/4901770938400", ids: ["sanrio-bdm-006"] },
    { url: "https://anime-store.jp/products/4901770938387", ids: ["sanrio-bdm-007"] },
    { url: "https://anime-store.jp/products/4901770938912", ids: ["sanrio-bdm-008"] },
  ];

  const allProducts = [...bd1Products, ...bd2Products, ...bdmProducts];

  for (const p of allProducts) {
    await fetchProductImage(p.url, p.ids);
  }

  console.log("\n=== Done ===");
  const files = fs.readdirSync(outDir).filter(f => f.endsWith(".jpg") || f.endsWith(".png") || f.endsWith(".webp"));
  console.log(`Total images in folder: ${files.length}`);
}

main();
