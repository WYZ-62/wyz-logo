import type { PostForList } from "@/utils/content-utils";

interface TopicMatchCandidate {
	id: string;
	data: {
		tags: string[];
		category?: string | null;
	};
}

export type TopicVisibilityMode = "public" | "topic-only" | "hidden";

export interface TopicDefinition {
	id: string;
	title: string;
	description: string;
	cover: string;
	visibility?: TopicVisibilityMode;
	postMatchers: Array<{
		tags?: string[];
		categories?: string[];
		slugs?: string[];
		pathPrefixes?: string[];
	}>;
}

export interface TopicWithPosts extends TopicDefinition {
	posts: PostForList[];
}

function getQuizSequence(slug: string): number | null {
	const normalizedSlug = normalizeSlug(slug);
	const basename = normalizedSlug.split("/").pop() ?? normalizedSlug;
	const match = basename.match(/^java-backend-foundation-quiz-(\d+)$/i);
	if (!match) {
		return null;
	}

	return Number.parseInt(match[1], 10);
}

export function sortTopicPosts<
	T extends { id: string; data: { published: Date } },
>(topicId: string, posts: T[]): T[] {
	if (topicId !== "practice-exercises") {
		return posts;
	}

	return [...posts].sort((a, b) => {
		const quizOrderA = getQuizSequence(a.id);
		const quizOrderB = getQuizSequence(b.id);

		if (quizOrderA !== null && quizOrderB !== null && quizOrderA !== quizOrderB) {
			return quizOrderA - quizOrderB;
		}

		return b.data.published.getTime() - a.data.published.getTime();
	});
}

export const topicDefinitions: TopicDefinition[] = [
	{
		id: "blog-building",
		title: "博客搭建记录",
		description: "整理这个博客从配置、部署到使用过程中的相关文章。",
		cover: "/assets/desktop-banner/2.webp",
		visibility: "public",
		postMatchers: [
			{
				tags: ["Mizuki", "Astro", "EdgeOne"],
				categories: ["部署", "指南"],
				slugs: ["mizuki-guide", "edgeone-pages-deploy"],
			},
		],
	},
	{
		id: "engineering-foundation",
		title: "工程筑基",
		description: "整理后端职责、研发流程、质量控制与工程基本功相关内容。",
		cover: "/assets/desktop-banner/6.webp",
		visibility: "topic-only",
		postMatchers: [
			{
				pathPrefixes: ["engineering-foundation"],
			},
		],
	},
	{
		id: "ai-empowerment",
		title: "AI赋能",
		description: "整理大模型、Prompt、RAG、Agent 与 AI 工程化实践相关内容。",
		cover: "/assets/desktop-banner/7.webp",
		visibility: "topic-only",
		postMatchers: [
			{
				pathPrefixes: ["ai-empowerment"],
			},
		],
	},
	{
		id: "fullstack-development",
		title: "全栈开发",
		description: "整理前端基础、移动端开发、测试分析与软件质量等全栈学习内容。",
		cover: "/assets/desktop-banner/8.webp",
		visibility: "topic-only",
		postMatchers: [
			{
				pathPrefixes: ["fullstack-development"],
			},
		],
	},
	{
		id: "personal-notes",
		title: "个人表达与随笔",
		description: "收集和整理头像设计、生活感受与个人表达相关文字。",
		cover: "/assets/desktop-banner/4.webp",
		visibility: "public",
		postMatchers: [
			{
				tags: ["LOGO", "Sakura"],
				categories: ["随笔"],
				slugs: ["logo-story", "Somthing for nothing"],
			},
		],
	},
	{
		id: "practice-exercises",
		title: "习题专题",
		description: "收录 Java、Spring Boot、SQL 与研发流程相关的基础练习题。",
		cover: "/assets/desktop-banner/5.webp",
		visibility: "topic-only",
		postMatchers: [
			{
				pathPrefixes: ["practice-exercises"],
			},
		],
	},
	{
		id: "bitstream-summer",
		title: "比特流夏日",
		description: "整理 Git、协作流程与工程实践中的高频基础操作，沉淀成适合复习和快速查阅的专题。",
		cover: "/assets/desktop-banner/10.webp",
		visibility: "public",
		postMatchers: [
			{
				pathPrefixes: ["bitstream-summer"],
			},
		],
	},
];

function normalizeText(value: string | undefined | null): string {
	return (value ?? "").trim().toLowerCase();
}

function normalizeSlug(slug: string): string {
	return normalizeText(slug.replace(/\.(md|mdx|markdown)$/i, ""));
}

function hasPathPrefixMatch(postId: string, pathPrefix: string): boolean {
	const normalizedPostId = normalizeSlug(postId);
	const normalizedPathPrefix = normalizeSlug(pathPrefix).replace(
		/^\/+|\/+$/g,
		"",
	);

	return (
		normalizedPostId === normalizedPathPrefix ||
		normalizedPostId.startsWith(`${normalizedPathPrefix}/`)
	);
}

function getTopicVisibility(topic: TopicDefinition): TopicVisibilityMode {
	return topic.visibility ?? "public";
}

function matchesTopic(
	topic: TopicDefinition,
	post: TopicMatchCandidate | PostForList,
): boolean {
	const postTags = new Set(post.data.tags.map((tag) => normalizeText(tag)));
	const postCategory = normalizeText(post.data.category);
	const postSlug = normalizeSlug(post.id);
	const postBasename = postSlug.split("/").pop() ?? postSlug;

	return topic.postMatchers.some((matcher) => {
		const hasPathMatch =
			matcher.pathPrefixes?.some((pathPrefix) =>
				hasPathPrefixMatch(post.id, pathPrefix),
			) ?? false;
		const hasSlugMatch =
			matcher.slugs?.some((slug) => {
				const normalizedSlug = normalizeSlug(slug);
				return (
					normalizedSlug === postSlug || normalizedSlug === postBasename
				);
			}) ?? false;
		const hasTagMatch =
			matcher.tags?.some((tag) => postTags.has(normalizeText(tag))) ??
			false;
		const hasCategoryMatch =
			matcher.categories?.some(
				(category) => normalizeText(category) === postCategory,
			) ?? false;

		return hasPathMatch || hasSlugMatch || hasTagMatch || hasCategoryMatch;
	});
}

export function getMatchedTopicsForPost(
	post: TopicMatchCandidate | PostForList,
	options?: { includeHidden?: boolean },
): TopicDefinition[] {
	const includeHidden = options?.includeHidden ?? false;

	return topicDefinitions.filter((topic) => {
		if (!includeHidden && getTopicVisibility(topic) === "hidden") {
			return false;
		}
		return matchesTopic(topic, post);
	});
}

export function getPostVisibilityMode(
	post: TopicMatchCandidate | PostForList,
): TopicVisibilityMode {
	const matchedTopics = getMatchedTopicsForPost(post, { includeHidden: true });

	if (matchedTopics.some((topic) => getTopicVisibility(topic) === "hidden")) {
		return "hidden";
	}

	if (
		matchedTopics.some(
			(topic) => getTopicVisibility(topic) === "topic-only",
		)
	) {
		return "topic-only";
	}

	return "public";
}

export function getPrimaryTopicIdForPost(
	post: TopicMatchCandidate | PostForList,
): string | null {
	const matchedTopics = getMatchedTopicsForPost(post, { includeHidden: true });
	const restrictedTopic = matchedTopics.find((topic) => {
		const visibility = getTopicVisibility(topic);
		return visibility === "topic-only" || visibility === "hidden";
	});

	return restrictedTopic?.id ?? matchedTopics[0]?.id ?? null;
}

export function buildTopics(posts: PostForList[]): TopicWithPosts[] {
	return topicDefinitions
		.filter((topic) => getTopicVisibility(topic) !== "hidden")
		.map((topic) => {
			const matchedPosts = posts.filter((post) =>
				matchesTopic(topic, post),
			);

			return {
				...topic,
				posts: sortTopicPosts(topic.id, matchedPosts),
			};
		})
		.filter((topic) => topic.posts.length > 0);
}

export function getTopicIdsForPost(
	post: TopicMatchCandidate | PostForList,
): string[] {
	return getMatchedTopicsForPost(post).map((topic) => topic.id);
}
