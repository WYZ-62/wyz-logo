export type NamingStyle = "default" | "poetic";
export type PoeticLabelVariant =
	| "mountain"
	| "water"
	| "seal"
	| "ink"
	| "mist"
	| "warm"
	| "forest"
	| "polaroid"
	| "bronze"
	| "timeline"
	| "catalog"
	| "default";

export const NAMING_STYLE_STORAGE_KEY = "mizuki:naming-style";
export const DEFAULT_NAMING_STYLE: NamingStyle = "default";

const poeticNameMap: Record<string, string> = {
	主页: "山扉迎客至",
	归档: "旧稿叠层云",
	链接: "云径通幽处",
	我的: "拾忆深山里",
	关于: "故人此间逢",
	关于本站: "故人此间逢",
	其他: "余兴亦成章",
	标签: "墨痕记卷帙",
	分类: "卷帙列次第",
	专题: "集萃成专论",
	随笔: "云深不知处",
	随记: "云深不知处",
	日记: "云深不知处",
	相册: "留影画中游",
	友链: "结友遍云林",
	项目展示: "匠作展琳琅",
	技能展示: "百工试锋芒",
	时间线: "流光记岁华",
};

const poeticVariantMap: Record<string, PoeticLabelVariant> = {
	主页: "mountain",
	归档: "water",
	链接: "water",
	我的: "seal",
	关于: "warm",
	关于本站: "warm",
	其他: "bronze",
	标签: "ink",
	分类: "catalog",
	专题: "ink",
	随笔: "mist",
	随记: "mist",
	日记: "mist",
	相册: "polaroid",
	友链: "forest",
	项目展示: "bronze",
	技能展示: "bronze",
	时间线: "timeline",
};

export function getPoeticName(name: string): string {
	return poeticNameMap[name] ?? name;
}

export function getPoeticVariant(name: string): PoeticLabelVariant {
	return poeticVariantMap[name] ?? "default";
}
