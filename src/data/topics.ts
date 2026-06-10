import type { PostForList } from "@/utils/content-utils";

interface TopicMatchCandidate {
	id: string;
	data: {
		tags: string[];
		category?: string | null;
	};
}

export interface TopicDefinition {
	id: string;
	title: string;
	description: string;
	cover: string;
	postMatchers: Array<{
		tags?: string[];
		categories?: string[];
		slugs?: string[];
	}>;
}

export interface TopicWithPosts extends TopicDefinition {
	posts: PostForList[];
}

export const topicDefinitions: TopicDefinition[] = [
	{
		id: "blog-building",
		title: "博客搭建记录",
		description: "整理这个博客从配置、部署到使用过程中的相关文章。",
		cover: "/assets/desktop-banner/2.webp",
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
		postMatchers: [
			{
				slugs: [
					"java-backend-work-responsibilities-and-rd-process",
					"ai-rd-process",
					"claude-code-coding-practice",
				],
				tags: ["Java", "工程实践", "研发流程", "Claude Code", "AI"],
				categories: ["后端"],
			},
		],
	},
	{
		id: "personal-notes",
		title: "个人表达与随笔",
		description: "收集和整理头像设计、生活感受与个人表达相关文字。",
		cover: "/assets/desktop-banner/4.webp",
		postMatchers: [
			{
				tags: ["LOGO", "Sakura"],
				categories: ["随笔"],
				slugs: ["logo-story", "Somthing for nothing"],
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

function matchesTopic(
	topic: TopicDefinition,
	post: TopicMatchCandidate | PostForList,
): boolean {
	const postTags = new Set(post.data.tags.map((tag) => normalizeText(tag)));
	const postCategory = normalizeText(post.data.category);
	const postSlug = normalizeSlug(post.id);

	return topic.postMatchers.some((matcher) => {
		const hasSlugMatch =
			matcher.slugs?.some((slug) => normalizeSlug(slug) === postSlug) ??
			false;
		const hasTagMatch =
			matcher.tags?.some((tag) => postTags.has(normalizeText(tag))) ??
			false;
		const hasCategoryMatch =
			matcher.categories?.some(
				(category) => normalizeText(category) === postCategory,
			) ?? false;

		return hasSlugMatch || hasTagMatch || hasCategoryMatch;
	});
}

export function buildTopics(posts: PostForList[]): TopicWithPosts[] {
	return topicDefinitions
		.map((topic) => {
			const matchedPosts = posts.filter((post) =>
				matchesTopic(topic, post),
			);

			return {
				...topic,
				posts: matchedPosts,
			};
		})
		.filter((topic) => topic.posts.length > 0);
}

export function getTopicIdsForPost(
	post: TopicMatchCandidate | PostForList,
): string[] {
	return topicDefinitions
		.filter((topic) => matchesTopic(topic, post))
		.map((topic) => topic.id);
}
