<script lang="ts">
	import Icon from "@iconify/svelte";

	import Key from "@i18n/i18nKey";
	import { i18n } from "@i18n/translation";

	import type { Song } from "../types";

	interface Props {
		song: Song;
		size?: "mini" | "expanded" | "sidebar";
		onSwitch?: () => void;
	}

	const { song, size = "expanded", onSwitch }: Props = $props();

	const activeVariant = $derived(song.variants?.[song.variantIndex ?? 0]);
	const switchLabel = $derived(i18n(Key.musicPlayerSwitchVariant));
</script>

{#if activeVariant && (song.variants?.length ?? 0) > 1}
	<button
		type="button"
		class="variant-switch"
		class:variant-switch--mini={size === "mini"}
		class:variant-switch--sidebar={size === "sidebar"}
		onclick={(event) => {
			event.stopPropagation();
			onSwitch?.();
		}}
		aria-label={`${switchLabel}: ${activeVariant.label}`}
		title={`${switchLabel}: ${activeVariant.label}`}
	>
		<Icon
			icon="material-symbols:swap-horiz-rounded"
			class="text-[0.82rem] shrink-0"
		/>
		<span class="variant-label">{activeVariant.label}</span>
	</button>
{/if}

<style>
	.variant-switch {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		flex-shrink: 0;
		max-width: 5.5rem;
		padding: 0.2rem 0.45rem;
		border-radius: 9999px;
		border: 1px solid
			color-mix(in srgb, var(--line-color) 78%, var(--primary) 22%);
		background: color-mix(
			in srgb,
			var(--card-bg, white) 84%,
			var(--primary) 16%
		);
		color: var(--content-meta);
		font-size: 0.7rem;
		line-height: 1;
		transition:
			transform 160ms ease,
			color 160ms ease,
			border-color 160ms ease,
			background 160ms ease;
	}

	.variant-switch:hover {
		color: var(--primary);
		border-color: color-mix(
			in srgb,
			var(--primary) 58%,
			var(--line-color) 42%
		);
		transform: translateY(-1px);
	}

	.variant-switch:focus-visible {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}

	.variant-switch--mini {
		padding: 0.18rem 0.4rem;
		max-width: 4.5rem;
		font-size: 0.65rem;
	}

	.variant-switch--sidebar {
		padding-inline: 0.42rem;
	}

	.variant-label {
		display: block;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media (max-width: 480px) {
		.variant-switch {
			max-width: 4.6rem;
		}

		.variant-switch--mini {
			max-width: 4rem;
			padding-inline: 0.35rem;
		}
	}
</style>
