import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const standalone = resolve(root, ".next", "standalone");
const dist = resolve(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

// Sites expects a deployable dist directory. Next's standalone output is
// copied as-is so the runtime can boot the same production server locally
// and in a Sites build environment.
await cp(standalone, dist, { recursive: true });
await cp(resolve(root, ".next", "static"), resolve(dist, ".next", "static"), { recursive: true });
await cp(resolve(root, ".openai"), resolve(dist, ".openai"), { recursive: true });

await writeFile(resolve(dist, "BUILD_METADATA.json"), JSON.stringify({ framework: "next", output: "standalone" }, null, 2));
console.log(`Prepared ${dist}`);
