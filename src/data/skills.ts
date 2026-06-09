// Skill data configuration file
// Used to manage data for the skill display page

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string; // Iconify icon name
	category: "frontend" | "backend" | "database" | "tools" | "other";
	level: "beginner" | "intermediate" | "advanced" | "expert";
	experience: {
		years: number;
		months: number;
	};
	projects?: string[];
	certifications?: string[];
	color?: string; // Skill card theme color
}

export const skillsData: Skill[] = [
	// Backend
	{
		id: "java",
		name: "Java",
		description:
			"当前主要技术方向，围绕 Java 后端完成接口开发、业务逻辑实现、服务端功能拆分和常见问题排查。",
		icon: "logos:java",
		category: "backend",
		level: "advanced",
		experience: { years: 2, months: 0 },
		color: "#F97316",
	},
	{
		id: "spring-boot",
		name: "Spring Boot",
		description:
			"熟悉常见 Spring Boot 项目开发流程，能够完成接口设计、业务分层、基础配置和项目结构组织。",
		icon: "logos:spring-icon",
		category: "backend",
		level: "advanced",
		experience: { years: 1, months: 8 },
		color: "#22C55E",
	},
	{
		id: "ai-agent",
		name: "AI Agent",
		description:
			"当前重点探索方向，关注工具调用、工作流编排、提示词设计，以及与后端服务协同落地的实现方式。",
		icon: "carbon:ai",
		category: "backend",
		level: "intermediate",
		experience: { years: 0, months: 8 },
		color: "#8B5CF6",
	},
	{
		id: "nodejs",
		name: "Node.js",
		description:
			"用于接口调试、小型服务和工具脚本开发，适合快速补齐前后端协作中的辅助型后端能力。",
		icon: "logos:nodejs-icon",
		category: "backend",
		level: "intermediate",
		experience: { years: 1, months: 0 },
		color: "#16A34A",
	},

	// Database
	{
		id: "mysql",
		name: "MySQL",
		description:
			"熟悉常见表结构设计、基础 SQL 编写和项目中的数据持久化处理，能够配合接口完成数据层开发。",
		icon: "logos:mysql-icon",
		category: "database",
		level: "advanced",
		experience: { years: 1, months: 10 },
		color: "#0EA5E9",
	},
	{
		id: "redis",
		name: "Redis",
		description:
			"了解缓存、临时数据和高频访问场景中的基础使用方式，能够完成项目中的简单接入与调试。",
		icon: "logos:redis",
		category: "database",
		level: "intermediate",
		experience: { years: 0, months: 10 },
		color: "#DC2626",
	},

	// Tools
	{
		id: "git",
		name: "Git",
		description:
			"日常开发中的基础工具，能够完成版本管理、分支协作、代码回滚和常见项目协同流程。",
		icon: "logos:git-icon",
		category: "tools",
		level: "advanced",
		experience: { years: 2, months: 6 },
		color: "#F97316",
	},
	{
		id: "intellij-idea",
		name: "IntelliJ IDEA",
		description:
			"Java 后端开发主力 IDE，能够完成 Spring Boot 项目开发、断点调试、依赖管理和问题排查。",
		icon: "logos:intellij-idea",
		category: "tools",
		level: "advanced",
		experience: { years: 1, months: 8 },
		color: "#7C3AED",
	},
	{
		id: "linux",
		name: "Linux",
		description:
			"具备基础服务端操作能力，能够处理常见部署、运行、日志查看、环境配置和异常排查。",
		icon: "logos:linux-tux",
		category: "tools",
		level: "intermediate",
		experience: { years: 1, months: 4 },
		color: "#EAB308",
	},
	{
		id: "docker",
		name: "Docker",
		description:
			"能够在开发和部署中使用 Docker 做环境统一、服务运行和项目基础配置，适合常见后端场景。",
		icon: "logos:docker-icon",
		category: "tools",
		level: "intermediate",
		experience: { years: 0, months: 10 },
		color: "#0EA5E9",
	},

	// Frontend
	{
		id: "javascript",
		name: "JavaScript",
		description:
			"熟悉基础页面交互、异步请求和接口联调，能够配合后端完成常见业务页面功能。",
		icon: "logos:javascript",
		category: "frontend",
		level: "intermediate",
		experience: { years: 1, months: 8 },
		color: "#EAB308",
	},
	{
		id: "vue",
		name: "Vue.js",
		description:
			"能够使用 Vue 完成常见页面、后台界面和组件开发，配合后端接口完成实际业务功能。",
		icon: "logos:vue",
		category: "frontend",
		level: "intermediate",
		experience: { years: 1, months: 6 },
		color: "#22C55E",
	},
	{
		id: "astro",
		name: "Astro",
		description:
			"用于当前博客与内容站点搭建，熟悉基于主题进行页面定制、内容结构调整和展示优化。",
		icon: "logos:astro-icon",
		category: "frontend",
		level: "intermediate",
		experience: { years: 0, months: 10 },
		color: "#F97316",
	},

	// Other
	{
		id: "ai-coding",
		name: "AI Coding",
		description:
			"结合 AI 编程工具辅助完成页面、内容和功能迭代，注重把想法快速整理并落到可运行项目中。",
		icon: "mingcute:ai-line",
		category: "other",
		level: "advanced",
		experience: { years: 0, months: 10 },
		color: "#EC4899",
	},
];
