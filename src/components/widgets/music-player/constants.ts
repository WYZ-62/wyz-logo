import type { Song } from "./types";

export const STORAGE_KEY_VOLUME = "music-player-volume";

export const DEFAULT_VOLUME = 0.7;

export const LOCAL_PLAYLIST: Song[] = [
	{
		id: 1,
		title: "Call of Silence",
		artist: "泽野弘之",
		cover: "assets/music/cover/call-of-silence.png",
		url: "assets/music/url/CallofSilence.mp3",
		duration: 178,
	},
	{
		id: 2,
		title: "Do Better&Neon Rainbow",
		artist: "Mushup",
		cover: "assets/music/cover/do-better.png",
		url: "assets/music/url/DoBetter.mp3",
		duration: 185,
	},
	{
		id: 3,
		title: "打上花火",
		artist: "DAOKO / 米津玄師",
		cover: "assets/music/cover/firework.png",
		url: "assets/music/url/Firework.mp3",
		duration: 289,
	},
	{
		id: 4,
		title: "願い〜あの頃のキミへ〜",
		artist: "当山美玲",
		cover: "assets/music/cover/memory.png",
		url: "assets/music/url/Memory.mp3",
		duration: 340,
	},
	{
		id: 5,
		title: "武家坡2021",
		artist: "萧敬腾 / 张淇",
		cover: "assets/music/cover/wojiapo.png",
		url: "assets/music/url/WoJiaPo.mp3",
		duration: 360,
	},
	{
		id: 6,
		title: "错位时空",
		artist: "艾辰",
		cover: "assets/music/cover/wrong-time.png",
		url: "assets/music/url/WrongTime.mp3",
		duration: 204,
	},
];

export const DEFAULT_SONG: Song = {
	title: "Sample Song",
	artist: "Sample Artist",
	cover: "/favicon/favicon.ico",
	url: "",
	duration: 0,
	id: 0,
};

export const DEFAULT_METING_API =
	"https://www.bilibili.uno/api?server=:server&type=:type&id=:id&auth=:auth&r=:r";
export const DEFAULT_METING_ID = "14164869977";
export const DEFAULT_METING_SERVER = "netease";
export const DEFAULT_METING_TYPE = "playlist";

export const ERROR_DISPLAY_DURATION = 3000;
export const SKIP_ERROR_DELAY = 1000;
