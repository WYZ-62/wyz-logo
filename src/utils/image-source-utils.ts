import { readdir } from "node:fs/promises";
import path from "node:path";

const IMAGE_EXTENSIONS = new Set([
	".avif",
	".gif",
	".jpeg",
	".jpg",
	".png",
	".svg",
	".webp",
]);

type ResponsiveImageSourceConfig =
	| string
	| string[]
	| {
			desktop?: string | string[];
			mobile?: string | string[];
	  };

function isExternalUrl(src: string): boolean {
	return /^(?:https?:)?\/\//.test(src);
}

function hasFileExtension(src: string): boolean {
	const pathname = src.split(/[?#]/, 1)[0];
	return /\.[a-z0-9]+$/i.test(pathname);
}

function normalizePublicDirectory(src: string): string {
	return `/${src.replace(/^\/+|\/+$/g, "")}`;
}

async function expandPublicDirectory(src: string): Promise<string[]> {
	const normalizedDir = normalizePublicDirectory(src);
	const absoluteDir = path.join(
		process.cwd(),
		"public",
		...normalizedDir.slice(1).split("/"),
	);

	try {
		const entries = await readdir(absoluteDir, { withFileTypes: true });
		const files = entries
			.filter(
				(entry) =>
					entry.isFile() &&
					IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()),
			)
			.map((entry) => `${normalizedDir}/${entry.name}`)
			.sort((a, b) =>
				a.localeCompare(b, undefined, {
					numeric: true,
					sensitivity: "base",
				}),
			);

		if (files.length > 0) {
			return files;
		}
	} catch (error) {
		console.warn(`Failed to read image directory: ${normalizedDir}`, error);
	}

	return [src];
}

export async function resolveImageSourceList(
	src: string | string[] | undefined,
): Promise<string[]> {
	const items =
		typeof src === "string" ? [src] : Array.isArray(src) ? src : [];

	const resolved = await Promise.all(
		items
			.filter(Boolean)
			.map(async (item) => {
				if (
					isExternalUrl(item) ||
					hasFileExtension(item) ||
					!item.startsWith("/")
				) {
					return [item];
				}

				return expandPublicDirectory(item);
			}),
	);

	return resolved.flat().filter(Boolean);
}

export async function resolveResponsiveImageSources(
	srcConfig: ResponsiveImageSourceConfig,
): Promise<{ desktop: string[]; mobile: string[] }> {
	if (typeof srcConfig === "object" && srcConfig !== null && !Array.isArray(srcConfig)) {
		const desktop = await resolveImageSourceList(srcConfig.desktop);
		const mobile = await resolveImageSourceList(srcConfig.mobile);

		return {
			desktop: desktop.length > 0 ? desktop : mobile,
			mobile: mobile.length > 0 ? mobile : desktop,
		};
	}

	const allImages = await resolveImageSourceList(srcConfig);
	return { desktop: allImages, mobile: allImages };
}

export async function pickFirstResolvedImage(
	srcConfig: ResponsiveImageSourceConfig,
): Promise<string> {
	const { desktop, mobile } = await resolveResponsiveImageSources(srcConfig);
	return desktop[0] || mobile[0] || "";
}
