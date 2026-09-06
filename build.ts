import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Building @abydahana/iconpicker...");

// 1. Run tsc
console.log("Compiling TypeScript...");
execSync("npx tsc", { cwd: __dirname, stdio: "inherit" });

// 2. Prepare dist/css
const distDir = path.resolve(__dirname, "dist");
const distThemesDir = path.join(distDir, "themes");
fs.mkdirSync(distThemesDir, { recursive: true });

const srcThemesDir = path.resolve(__dirname, "src/themes");

// Read themes
const baseCss = fs.readFileSync(path.join(srcThemesDir, "base.css"), "utf8");
const defaultCss = fs.readFileSync(path.join(srcThemesDir, "default.css"), "utf8");
const aksaraCss = fs.readFileSync(path.join(srcThemesDir, "aksara.css"), "utf8");
const bootstrapCss = fs.readFileSync(path.join(srcThemesDir, "bootstrap.css"), "utf8");
const tailwindCss = fs.readFileSync(path.join(srcThemesDir, "tailwind.css"), "utf8");

// Copy individual theme files to dist/themes/
fs.copyFileSync(path.join(srcThemesDir, "base.css"), path.join(distThemesDir, "base.css"));
fs.copyFileSync(path.join(srcThemesDir, "default.css"), path.join(distThemesDir, "default.css"));
fs.copyFileSync(path.join(srcThemesDir, "aksara.css"), path.join(distThemesDir, "aksara.css"));
fs.copyFileSync(path.join(srcThemesDir, "bootstrap.css"), path.join(distThemesDir, "bootstrap.css"));
fs.copyFileSync(path.join(srcThemesDir, "tailwind.css"), path.join(distThemesDir, "tailwind.css"));

// Combined bundle
const combinedCss = [
  "/*! @abydahana/iconpicker v1.0.0 | MIT License | Aby Dahana */",
  baseCss,
  defaultCss,
  aksaraCss,
  bootstrapCss,
  tailwindCss
].join("\n\n");

fs.writeFileSync(path.join(distDir, "iconpicker.css"), combinedCss);
console.log("CSS bundled to dist/iconpicker.css and dist/themes/");
console.log("Build completed successfully!");
