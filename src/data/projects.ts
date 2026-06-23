// Project data configuration file
// Used to manage data for the project display page

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	visitUrl?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	showImage?: boolean;
}

export const projectsData: Project[] = [
	{
		id: "mr-trip",
		title: "旅游规划大师",
		description:
			"一个面向真实出行场景的智能旅游规划应用，结合 AI 对话、路线编排与行程管理，帮助用户更快生成可执行的旅行方案。",
		image: "/assets/projects/travel-planner.svg",
		category: "web",
		techStack: [
			"Vue 3",
			"Vite",
			"Spring Boot",
			"SpringAI",
			"Java",
			"MySQL",
		],
		status: "completed",
		sourceCode: "https://github.com/WYZ-62/wyz-Mr.trip",
		visitUrl: "http://lyra.sakura-v.cn/",
		startDate: "2026-06-01",
		endDate: "2026-06-23",
		featured: true,
		tags: ["AI 行程规划", "旅游助手", "SpringAI", "智能体"],
	},
];

// Get project statistics
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter(
		(p) => p.status === "completed",
	).length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// Get featured projects
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// Get all tech stacks
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => {
			techSet.add(tech);
		});
	});
	return Array.from(techSet).sort();
};
