export type PageHeaderVariant =
	| "default"
	| "seal"
	| "water"
	| "calligraphy"
	| "mist"
	| "polaroid"
	| "bronze"
	| "timeline"
	| "catalog";

export interface PageHeaderProps {
	title: string;
	subtitle?: string;
	class?: string;
	variant?: PageHeaderVariant;
}
