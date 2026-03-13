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
    const req = client.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (loc.startsWith("/")) loc = new URL(loc, url).href;
        res.resume();
        return get(loc).then(resolve).catch(reject);
      }
      let chunks = [];
      res.on("data", (d) => chunks.push(d));
      res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
    });
    req.setTimeout(15000, () => { req.destroy(); reject(new Error("timeout")); });
    req.on("error", reject);
  });
}

function extractImageUrls(html, pageUrl) {
  const urls = [];
  const re = /(?:src|data-src|content)=["']([^"']+\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    let u = m[1];
    if (u.includes("logo") || u.includes("icon") || u.includes("banner") || u.includes("sprite") || u.includes("svg") || u.length < 30) continue;
    if (u.startsWith("//")) u = "https:" + u;
    else if (u.startsWith("/")) u = new URL(u, pageUrl).href;
    urls.push(u);
  }
  return [...new Set(urls)];
}

async function fetchAndSave(pageUrl, stickerId) {
  const dest = path.join(outDir, `${stickerId}.jpg`);
  if (fs.existsSync(dest)) { console.log(`  [skip] ${stickerId}`); return true; }
  try {
    const { status, body } = await get(pageUrl);
    if (status !== 200) { console.log(`  [${status}] ${stickerId}`); return false; }
    const imgs = extractImageUrls(body.toString(), pageUrl);
    if (imgs.length === 0) { console.log(`  [no-img] ${stickerId}`); return false; }
    const r = await get(imgs[0]);
    if (r.status !== 200) { console.log(`  [img-${r.status}] ${stickerId}`); return false; }
    fs.writeFileSync(dest, r.body);
    console.log(`  [ok] ${stickerId} (${Math.round(r.body.length / 1024)}KB)`);
    return true;
  } catch (e) { console.log(`  [error] ${stickerId}: ${e.message}`); return false; }
}

async function directDownload(imgUrl, stickerId) {
  const dest = path.join(outDir, `${stickerId}.jpg`);
  if (fs.existsSync(dest)) { console.log(`  [skip] ${stickerId}`); return true; }
  try {
    const r = await get(imgUrl);
    if (r.status !== 200) { console.log(`  [${r.status}] ${stickerId}`); return false; }
    fs.writeFileSync(dest, r.body);
    console.log(`  [ok] ${stickerId} (${Math.round(r.body.length / 1024)}KB)`);
    return true;
  } catch (e) { console.log(`  [error] ${stickerId}: ${e.message}`); return false; }
}

const batchFile = process.argv[2] || "";
let batch = [];
if (batchFile && fs.existsSync(batchFile)) {
  batch = JSON.parse(fs.readFileSync(batchFile, "utf-8"));
}
async function main() {
  for (const item of batch) {
    if (item.direct) {
      await directDownload(item.url, item.id);
    } else {
      await fetchAndSave(item.url, item.id);
    }
  }
  const files = fs.readdirSync(outDir).filter((f) => /\.(jpg|png|webp)$/.test(f));
  console.log(`\nTotal: ${files.length} images`);
}
main();
