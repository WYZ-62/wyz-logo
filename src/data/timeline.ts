import type { TimelineItem } from "../components/features/timeline/types";

export const timelineData: TimelineItem[] = [
	{
		id: "content-pages-system",
		title: "内容页体系逐步补全",
		description:
			"除了文章本身，也开始补齐整个网站的内容承载能力，包括关于页、项目页、设备页、友链页、相册页、日记页和时间线页，让博客不再只是单向发文，而是慢慢变成一个能持续沉淀个人表达与记录的网站空间。",
		type: "project",
		startDate: "2026-05-09",
		endDate: "2026-05-13",
		organization: "页面与数据体系建设",
		position: "内容体系",
		skills: ["Markdown", "Astro Pages", "Data Modeling", "Component Composition"],
		achievements: [
			"补齐多种内容页与展示页，增强网站表达维度",
			"建立日记、项目、时间线等结构化数据入口",
			"让网站逐渐具备长期更新和归档的能力",
		],
		icon: "material-symbols:article-outline",
		color: "#F97316",
		featured: true,
	},
	{
		id: "homepage-visual-rebuild",
		title: "首页视觉与全站风格重构",
		description:
			"开始围绕首页 Banner、壁纸模式、导航栏透明方案、卡片样式、字体系统和页面细节留白，对整个网站的视觉体验做统一整理。很多看起来不起眼的调整，其实正是让网站读起来更顺眼、更像自己的关键。",
		type: "project",
		startDate: "2026-05-08",
		endDate: "2026-05-11",
		organization: "首页与全站界面层",
		position: "视觉重构",
		skills: ["UI Polish", "Responsive Design", "CSS Variables", "Motion Design"],
		achievements: [
			"整理横幅模式、全屏模式、隐藏背景等布局方案",
			"统一站点字体与视觉气质，让页面风格更贴近个人审美",
			"持续修正移动端与桌面端在留白、切换和动效上的割裂感",
		],
		icon: "material-symbols:design-services-outline",
		color: "#F97316",
		featured: true,
	},
	{
		id: "shiyilu-blog-setup",
		title: "搭建「拾忆录」",
		description:
			"以 Astro 为核心搭建个人博客「拾忆录」，用来记录学习、项目与生活中的细碎片段。希望每一次回看，都像重新拾起一段被认真保存的回忆。",
		type: "project",
		startDate: "2026-05-01",
		endDate: "2026-05-31",
		location: "湖南湘潭",
		organization: "湖南科技大学",
		position: "个人博客项目",
		skills: ["Astro", "TypeScript", "Tailwind CSS", "Content Collections"],
		achievements: [
			"完成博客基础框架与页面结构的初步搭建",
			"设计个人 Logo 与「拾忆录」的站点视觉主题",
			"建立后续持续记录、更新与迭代的内容计划",
		],
		icon: "material-symbols:code",
		color: "#0EA5E9",
		featured: true,
	},
];
