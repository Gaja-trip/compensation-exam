import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";

const root = resolve(process.cwd());
const exported = resolve(root, "out");
const dist = resolve(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

// Sites expects a deployable dist directory with a Worker entrypoint. The
// app is fully static, so package the exported Next assets into a small
// self-contained Worker rather than requiring a Node server at runtime.
await cp(exported, resolve(dist, "client"), { recursive: true });
await cp(resolve(root, ".openai"), resolve(dist, ".openai"), { recursive: true });

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const assets = {};
async function collectAssets(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      await collectAssets(absolute);
      continue;
    }
    const key = `/${relative(exported, absolute).split(sep).join("/")}`;
    assets[key] = {
      body: (await readFile(absolute)).toString("base64"),
      type: contentTypes[extname(entry.name).toLowerCase()] ?? "application/octet-stream",
    };
  }
}
await collectAssets(exported);
if (assets["/index.html"]) assets["/"] = assets["/index.html"];

const workerSource = `const ASSETS = ${JSON.stringify(assets)};
function bytes(base64) {
  const raw = atob(base64);
  return Uint8Array.from(raw, (character) => character.charCodeAt(0));
}
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const asset = ASSETS[url.pathname] || (url.pathname.endsWith("/") ? ASSETS[url.pathname + "index.html"] : null);
    if (!asset) return new Response("Not found", { status: 404 });
    return new Response(bytes(asset.body), { headers: { "content-type": asset.type, "cache-control": url.pathname === "/" ? "no-cache" : "public, max-age=31536000, immutable" } });
  },
};
`;
await mkdir(resolve(dist, "server"), { recursive: true });
await writeFile(resolve(dist, "server", "index.js"), workerSource);
await writeFile(resolve(dist, "BUILD_METADATA.json"), JSON.stringify({ framework: "next", output: "static-worker", assetCount: Object.keys(assets).length }, null, 2));
console.log(`Prepared ${dist}`);
