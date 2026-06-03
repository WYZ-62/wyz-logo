import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const root = process.cwd();
const inputPath = path.join(root, "src", "assets", "images", "avatar-wyz.svg");
const outputPath = path.join(root, "src", "assets", "images", "avatar-wyz.png");

const svgBuffer = await fs.readFile(inputPath);

await sharp(svgBuffer, { density: 288 })
	.resize(1024, 1024, {
		fit: "contain",
		background: "#ffffff",
	})
	.png({
		compressionLevel: 9,
		quality: 100,
	})
	.toFile(outputPath);

console.log(`Generated ${path.relative(root, outputPath)}`);
