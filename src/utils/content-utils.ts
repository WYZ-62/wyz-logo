import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import {
	getPostVisibilityMode,
	getPrimaryTopicIdForPost,
	sortTopicPosts,
} from "../data/topics";
import { initPostIdMap } from "@utils/permalink-utils";
import { getCategoryUrl, getPostUrl } from "@utils/url-utils";
import { type CollectionEntry, getCollection } from "astro:content";

export interface GetSortedPostsOptions {
	visibility?: "public" | "accessible";
}

function sortPosts<T extends { data: { pinned?: boolean; priority?: number; published: Date } }>(
	posts: T[],
): T[] {
	return [...posts].sort((a, b) => {
		// 首先按置顶状态排序，置顶文章在前
		if (a.data.pinned && !b.data.pinned) {
			return -1;
		}
		if (!a.data.pinned && b.data.pinned) {
			return 1;
		}

		// 如果置顶状态相同，优先按 Priority 排序（数值越小越靠前）
		if (a.data.pinned && b.data.pinned) {
			const priorityA = a.data.priority;
			const priorityB = b.data.priority;
			if (priorityA !== undefined && priorityB !== undefined) {
				if (priorityA !== priorityB) {
					return priorityA - priorityB;
				}
			} else if (priorityA !== undefined) {
				return -1;
			} else if (priorityB !== undefined) {
				return 1;
			}
		}

		// 否则按发布日期排序
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
}

function matchesVisibility(
	post: CollectionEntry<"posts">,
	visibility: NonNullable<GetSortedPostsOptions["visibility"]>,
): boolean {
	const displayMode = getPostVisibilityMode(post);

	if (displayMode === "hidden") {
		return false;
	}

	if (visibility === "accessible") {
		return true;
	}

	return displayMode === "public";
}

function applyNavigationToSortedPosts(posts: CollectionEntry<"posts">[]) {
	for (const post of posts) {
		post.data.prevSlug = "";
		post.data.prevTitle = "";
		post.data.nextSlug = "";
		post.data.nextTitle = "";
	}

	for (let i = 1; i < posts.length; i++) {
		posts[i].data.nextSlug = posts[i - 1].id;
		posts[i].data.nextTitle = posts[i - 1].data.title;
	}
	for (let i = 0; i < posts.length - 1; i++) {
		posts[i].data.prevSlug = posts[i + 1].id;
		posts[i].data.prevTitle = posts[i + 1].data.title;
	}
}

function annotatePostNavigation(posts: CollectionEntry<"posts">[]) {
	const publicPosts = sortPosts(
		posts.filter((post) => getPostVisibilityMode(post) === "public"),
	);
	applyNavigationToSortedPosts(publicPosts);

	const topicGroups = new Map<string, CollectionEntry<"posts">[]>();

	for (const post of posts) {
		if (getPostVisibilityMode(post) !== "topic-only") {
			continue;
		}

		const topicId = getPrimaryTopicIdForPost(post) ?? "__topic_only__";
		const currentGroup = topicGroups.get(topicId) ?? [];
		currentGroup.push(post);
		topicGroups.set(topicId, currentGroup);
	}

	for (const [topicId, topicPosts] of topicGroups) {
		const sortedGroup =
			topicId === "__topic_only__"
				? sortPosts(topicPosts)
				: sortTopicPosts(topicId, topicPosts);
		applyNavigationToSortedPosts(sortedGroup);
	}
}

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts(options: GetSortedPostsOptions = {}) {
	const visibility = options.visibility ?? "public";
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	return sortPosts(
		allBlogPosts.filter((post) => matchesVisibility(post, visibility)),
	);
}

export async function getSortedPosts(options: GetSortedPostsOptions = {}) {
	const sorted = await getRawSortedPosts(options);
	annotatePostNavigation(sorted);

	return sorted;
}
export interface PostForList {
	id: string;
	data: CollectionEntry<"posts">["data"];
	url?: string; // 预计算的文章 URL
}
export async function getSortedPostsList(
	options: GetSortedPostsOptions = {},
): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts(options);

	// 初始化文章 ID 映射（用于 permalink 功能）
	initPostIdMap(sortedFullPosts);

	// delete post.body，并预计算 URL
	const sortedPostsList = sortedFullPosts.map((post) => ({
		id: post.id,
		data: post.data,
		url: getPostUrl(post),
	}));

	return sortedPostsList;
}
export interface Tag {
	name: string;
	count: number;
}

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const visiblePosts = allBlogPosts.filter((post) =>
		matchesVisibility(post, "public"),
	);

	const countMap: Record<string, number> = {};
	visiblePosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) {
				countMap[tag] = 0;
			}
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export interface Category {
	name: string;
	count: number;
	url: string;
}

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const visiblePosts = allBlogPosts.filter((post) =>
		matchesVisibility(post, "public"),
	);
	const count: Record<string, number> = {};
	visiblePosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}

/**
 * 对标题进行分词，支持中英文混合
 *
 * - 优先使用 Intl.Segmenter（在支持的运行时中效果更好）
 * - 在不支持 Segmenter 的环境（如部分 Node 运行时）下
 *   回退到基于正则的简单分词，以避免构建报错
 * - 过滤标点和空白，英文统一小写
 */
function tokenizeTitle(title: string): Set<string> {
	const tokens = new Set<string>();

	// 运行时可能不支持 Intl.Segmenter（例如部分 Node 环境）
	// 为了避免 SSR/构建时报错，这里做兼容处理
	const hasSegmenter =
		typeof Intl !== "undefined" &&
		"Segmenter" in Intl &&
		typeof (Intl as any).Segmenter === "function";

	if (!hasSegmenter) {
		// 简单回退方案：按照空白和标点拆分
		const basicTokens = title
			.toLowerCase()
			.split(/[\s\p{P}]+/gu)
			.filter(Boolean);
		for (const t of basicTokens) {
			tokens.add(t);
		}
		return tokens;
	}

	// 使用 Intl.Segmenter 进行更精细的中英文混合分词
	const segmenter = new (Intl as any).Segmenter("zh", {
		granularity: "word",
	});
	for (const { segment, isWordLike } of segmenter.segment(title)) {
		if (!isWordLike) {
			continue;
		}
		tokens.add((segment as string).toLowerCase());
	}
	return tokens;
}

/**
 * 计算两个集合的 Jaccard 相似度
 */
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
	if (a.size === 0 && b.size === 0) {
		return 0;
	}
	let intersection = 0;
	for (const item of a) {
		if (b.has(item)) {
			intersection++;
		}
	}
	const union = a.size + b.size - intersection;
	return union === 0 ? 0 : intersection / union;
}

/**
 * 获取相关文章推荐
 * 评分公式: totalScore = tagMatchScore + titleSimilarityScore + timeFreshnessScore + categoryBonus
 * - tagMatchScore (0-100): 标签 Jaccard 相似度 × 100
 * - titleSimilarityScore (0-100): 标题分词 Jaccard 相似度 × 100
 * - timeFreshnessScore (0-30): 6 个月半衰期指数衰减
 * - categoryBonus (0 or 10): 同分类加 10 分
 */
export async function getRelatedPosts(
	currentPost: CollectionEntry<"posts">,
	maxCount = 5,
): Promise<PostForList[]> {
	const allPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const currentVisibility = getPostVisibilityMode(currentPost);

	// 排除自身和加密文章
	const candidates = allPosts.filter(
		(p) => {
			if (p.id === currentPost.id || p.data.password) {
				return false;
			}

			const candidateVisibility = getPostVisibilityMode(p);
			if (candidateVisibility === "hidden") {
				return false;
			}

			if (currentVisibility === "public") {
				return candidateVisibility === "public";
			}

			return true;
		},
	);

	const currentTags = new Set(currentPost.data.tags || []);
	const currentTokens = tokenizeTitle(currentPost.data.title);
	const currentCategory = currentPost.data.category || "";
	const now = Date.now();

	const scored = candidates.map((post) => {
		const postTags = new Set(post.data.tags || []);

		// tagMatchScore (0-100)
		const tagMatchScore = jaccardSimilarity(currentTags, postTags) * 100;

		// titleSimilarityScore (0-100)
		const postTokens = tokenizeTitle(post.data.title);
		const titleSimilarityScore =
			jaccardSimilarity(currentTokens, postTokens) * 100;

		// timeFreshnessScore (0-30): 6 个月半衰期
		const daysSincePublished =
			(now - new Date(post.data.published).getTime()) /
			(1000 * 60 * 60 * 24);
		const timeFreshnessScore =
			30 * Math.exp((-Math.LN2 * daysSincePublished) / 180);

		// categoryBonus (0 or 10)
		const postCategory = post.data.category || "";
		const categoryBonus =
			currentCategory && postCategory && currentCategory === postCategory
				? 10
				: 0;

		const totalScore =
			tagMatchScore +
			titleSimilarityScore +
			timeFreshnessScore +
			categoryBonus;

		return {
			post,
			totalScore,
			tagMatchScore,
			timeFreshnessScore,
			categoryBonus,
		};
	});

	// 按总分降序排列
	scored.sort((a, b) => b.totalScore - a.totalScore);

	// 优先取有标签匹配的
	const withTagMatch = scored.filter((s) => s.tagMatchScore > 0);
	const withoutTagMatch = scored.filter((s) => s.tagMatchScore === 0);

	const result: PostForList[] = [];

	for (const s of withTagMatch) {
		if (result.length >= maxCount) {
			break;
		}
		result.push({ id: s.post.id, data: s.post.data });
	}

	// 不足时从剩余候选中按 timeFreshnessScore + categoryBonus 降序补充
	if (result.length < maxCount) {
		withoutTagMatch.sort(
			(a, b) =>
				b.timeFreshnessScore +
				b.categoryBonus -
				(a.timeFreshnessScore + a.categoryBonus),
		);
		for (const s of withoutTagMatch) {
			if (result.length >= maxCount) {
				break;
			}
			result.push({ id: s.post.id, data: s.post.data });
		}
	}

	return result;
}
