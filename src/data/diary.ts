// 日记数据配置
// 用于管理日记页面的数据

export interface DiaryItem {
	id: number;
	title?: string;
	content: string;
	date: string;
	images?: string[];
	location?: string;
	mood?: string;
	tags?: string[];
}

// 示例日记数据
const diaryData: DiaryItem[] = [
	{
		id: 2,
		title: "Serendipity",
		content: [
			"朝花等一场暮雨",
			"我在等一场相遇",
			"阳光穿透云层",
			"仿佛引领我前行",
			"",
			"背起行囊走四方",
			"不为天宽，不为地广",
			"只为见见风吹草低见牛羊",
			"",
			"或许在某个瞬间",
			"玫瑰可以在荒野盛开",
			"深海也可以拥有星光",
			"地平线同宇宙窃窃私语",
			"它正注视着苍天",
			"",
			"The morning flowers await a drizzle,",
			"I'm waiting for a serendipity to begin.",
			"Sunlight penetrates the clouds,",
			"As if guiding me forward, step by step.",
			"",
			"With a bag on my back,",
			"I'll roam far and wide,",
			"Not for the vast sky or the broad land,",
			"But to witness the scene where the wind blows and the grass sways,",
			"Lowly cattle grazing in the meadow.",
			"",
			"Perhaps in a momentary blink,",
			"Roses can bloom in the wilderness,",
			"The deep sea can have starlight,",
			"The horizon whispers with the universe,",
			"It is gazing at the vast sky.",
		].join("\n"),
		date: "2026-06-14T21:00:00+08:00",
		images: ["/images/diary/poem-journey.png"],
		mood: "远行",
		tags: ["随记", "诗歌", "风景"],
	},
	{
		id: 1,
		title: "此番美景，我虽求而不得，却邀诸位共赏",
		content:
			"春有樱，夏有藤，秋有银杏。那些没能留住的时刻，最终都被光影轻轻收进了相册里。既然美景不可常得，便把一路所见的温柔与斑斓，借这一篇随记，与你们同看。",
		date: "2026-06-14T10:00:00+08:00",
		images: [
			"/images/diary/scenery-ground.jpg",
			"/images/diary/scenery-ginkgo-up.jpg",
			"/images/diary/scenery-cherry-tree.jpg",
			"/images/diary/scenery-cherry-grove.jpg",
			"/images/diary/scenery-ginkgo-courtyard.jpg",
			"/images/diary/scenery-wisteria-walk.jpg",
			"/images/diary/scenery-wisteria-pergola.jpg",
		],
		location: "校园一隅",
		mood: "共赏",
		tags: ["风景", "樱花", "银杏", "紫藤"],
	},
];

// 获取日记列表（按时间倒序）
export const getDiaryList = (limit?: number) => {
	const sortedData = [...diaryData].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

// 获取所有标签
export const getAllTags = () => {
	const tags = new Set<string>();
	diaryData.forEach((item) => {
		if (item.tags) {
			item.tags.forEach((tag) => tags.add(tag));
		}
	});
	return Array.from(tags).sort();
};
